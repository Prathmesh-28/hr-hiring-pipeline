import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface Job {
  id: string;
  title: string;
  location: string;
}

const initialForm = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  source: "Website",
  currentCompany: "",
  currentTitle: "",
  location: "",
  jobId: "",
  answers: "",
};

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase
      .from("jobs")
      .select("id,title,location")
      .then(({ data, error }) => {
        if (!error && data) setJobs(data as Job[]);
      });
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resume) {
      setStatus("Resume is required.");
      return;
    }
    if (!form.jobId) {
      setStatus("Please select a job role.");
      return;
    }

    setStatus("Submitting application...");

    const resumePath = `candidate-${Date.now()}-${resume.name}`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(resumePath, resume, { upsert: false });
    if (uploadError) {
      setStatus(`Resume upload failed: ${uploadError.message}`);
      return;
    }

    const { data: uploadData, error: publicError } = await supabase.storage
      .from("resumes")
      .getPublicUrl(resumePath);

    if (publicError || !uploadData?.publicUrl) {
      setStatus("Unable to generate resume URL.");
      return;
    }

    const { data: candidate, error: candidateError } = await supabase.from("candidates").insert([
      {
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        source: form.source,
        current_company: form.currentCompany,
        current_title: form.currentTitle,
        location: form.location,
        resume_url: uploadData.publicUrl,
        application_status: "APPLIED",
      },
    ]).select("id").single();

    if (candidateError || !candidate) {
      setStatus(`Could not save candidate: ${candidateError?.message}`);
      return;
    }

    const { error: applicationError } = await supabase.from("applications").insert([
      {
        candidate_id: candidate.id,
        job_id: form.jobId,
        stage: "APPLIED",
        status: "PENDING",
        source: form.source,
        answers: form.answers,
      },
    ]);

    if (applicationError) {
      setStatus(`Could not save application: ${applicationError.message}`);
      return;
    }

    setStatus("Application submitted successfully. Expect a confirmation email soon.");
    setForm(initialForm);
    setResume(null);
  };

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Apply for a Role</h1>
      <p>Upload your resume and answer a few quick questions to help the hiring team evaluate your fit.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label>
            First name
            <input required value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </label>
          <label>
            Last name
            <input required value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </label>
        </div>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </label>
        <label>
          Role
          <select required value={form.jobId} onChange={(e) => handleChange("jobId", e.target.value)}>
            <option value="">Select role</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title} — {job.location}</option>
            ))}
          </select>
        </label>
        <label>
          Current company
          <input value={form.currentCompany} onChange={(e) => handleChange("currentCompany", e.target.value)} />
        </label>
        <label>
          Current title
          <input value={form.currentTitle} onChange={(e) => handleChange("currentTitle", e.target.value)} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
        </label>
        <label>
          Resume upload
          <input type="file" accept="application/pdf,application/msword" onChange={(e) => setResume(e.target.files?.[0] ?? null)} required />
        </label>
        <label>
          Answer
          <textarea value={form.answers} onChange={(e) => handleChange("answers", e.target.value)} rows={5} placeholder="Why do you want this role? What makes you a top fit?" />
        </label>
        <button style={buttonStyle} type="submit">Submit application</button>
      </form>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}

const buttonStyle = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "12px 18px",
  cursor: "pointer",
};
