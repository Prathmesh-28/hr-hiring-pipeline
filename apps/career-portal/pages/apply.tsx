import { FormEvent, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
    axios.get(`${API_BASE}/applications/jobs`).then((res) => setJobs(res.data));
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resume) {
      setStatus("Resume is required.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append("resume", resume);

    setStatus("Submitting...");
    try {
      await axios.post(`${API_BASE}/applications/submit`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Application submitted successfully.");
      setForm(initialForm);
      setResume(null);
    } catch (error) {
      setStatus("Submission failed. Please try again.");
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>Candidate Application</h1>
      <p>Complete your application in one go or save a draft outside the portal.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <label>
            First Name
            <input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
          </label>
          <label>
            Last Name
            <input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
          </label>
        </div>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </label>
        <label>
          Job Role
          <select value={form.jobId} onChange={(e) => handleChange("jobId", e.target.value)} required>
            <option value="">Select a role</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.location}
              </option>
            ))}
          </select>
        </label>
        <label>
          Current Company
          <input value={form.currentCompany} onChange={(e) => handleChange("currentCompany", e.target.value)} />
        </label>
        <label>
          Current Title
          <input value={form.currentTitle} onChange={(e) => handleChange("currentTitle", e.target.value)} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
        </label>
        <label>
          Resume Upload
          <input type="file" accept="application/pdf,application/msword" onChange={(e) => setResume(e.target.files?.[0] ?? null)} required />
        </label>
        <label>
          Additional information
          <textarea value={form.answers} onChange={(e) => handleChange("answers", e.target.value)} rows={5} placeholder="Tell us about your experience, availability, or why you are a great fit." />
        </label>
        <button type="submit" style={{ padding: "12px 20px", background: "#111827", color: "white", border: "none", borderRadius: 8 }}>
          Submit Application
        </button>
        {status && <p>{status}</p>}
      </form>
    </main>
  );
}
