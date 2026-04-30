import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebaseClient";

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
    const loadJobs = async () => {
      const jobsQuery = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(jobsQuery);
      setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })));
    };
    loadJobs();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resume) {
      setStatus("Please upload your resume.");
      return;
    }
    if (!form.jobId) {
      setStatus("Please choose a role.");
      return;
    }

    setStatus("Submitting application...");

    const resumePath = `resumes/${Date.now()}-${resume.name}`;
    const storageRef = ref(storage, resumePath);
    await uploadBytes(storageRef, resume);
    const resumeUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "applications"), {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      source: form.source,
      currentCompany: form.currentCompany,
      currentTitle: form.currentTitle,
      location: form.location,
      resumeUrl,
      jobId: form.jobId,
      answers: form.answers,
      stage: "APPLIED",
      status: "PENDING",
      createdAt: serverTimestamp(),
    });

    setStatus("Application submitted successfully.");
    setForm(initialForm);
    setResume(null);
  };

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Apply for a Role</h1>
      <p>Submit your details and resume to join our hiring pipeline.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label>
            First name
            <input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required style={inputStyle} />
          </label>
          <label>
            Last name
            <input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required style={inputStyle} />
          </label>
        </div>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required style={inputStyle} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} style={inputStyle} />
        </label>
        <label>
          Role
          <select value={form.jobId} onChange={(e) => handleChange("jobId", e.target.value)} required style={inputStyle}>
            <option value="">Select a role</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title} — {job.location}</option>
            ))}
          </select>
        </label>
        <label>
          Current company
          <input value={form.currentCompany} onChange={(e) => handleChange("currentCompany", e.target.value)} style={inputStyle} />
        </label>
        <label>
          Current title
          <input value={form.currentTitle} onChange={(e) => handleChange("currentTitle", e.target.value)} style={inputStyle} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => handleChange("location", e.target.value)} style={inputStyle} />
        </label>
        <label>
          Resume upload
          <input type="file" accept="application/pdf,application/msword" onChange={(e) => setResume(e.target.files?.[0] ?? null)} required />
        </label>
        <label>
          Why are you a good fit?
          <textarea value={form.answers} onChange={(e) => handleChange("answers", e.target.value)} rows={5} style={inputStyle}></textarea>
        </label>
        <button type="submit" style={buttonStyle}>Submit application</button>
      </form>
      {status && <p style={{ marginTop: 18 }}>{status}</p>}
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  marginTop: 8,
};

const buttonStyle = {
  padding: "12px 16px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};
