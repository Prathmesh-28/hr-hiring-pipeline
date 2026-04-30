import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApplicationCard {
  id: string;
  stage: string;
  score?: number;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    location?: string;
  };
}

interface ScheduleForm {
  topic: string;
  startTime: string;
  durationMinutes: number;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<ApplicationCard[]>([]);
  const [status, setStatus] = useState("Loading...");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({ topic: "", startTime: "", durationMinutes: 30 });
  const [scheduleStatus, setScheduleStatus] = useState<string>("");

  const token = typeof window !== "undefined" ? window.localStorage.getItem("hr_token") : null;

  useEffect(() => {
    axios
      .get<ApplicationCard[]>(`${API_BASE}/admin/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setApplications(res.data);
        setStatus("");
      })
      .catch(() => setStatus("Unable to load data."));
  }, [token]);

  const selectedApplication = applications.find((app) => app.id === selectedApplicationId);

  const openScheduleForm = (applicationId: string, name: string) => {
    setSelectedApplicationId(applicationId);
    setScheduleForm({
      topic: `Interview with ${name}`,
      startTime: "",
      durationMinutes: 30,
    });
    setScheduleStatus("");
  };

  const handleScheduleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedApplicationId) return;

    setScheduleStatus("Scheduling interview...");

    try {
      const response = await axios.post(
        `${API_BASE}/admin/interviews/schedule`,
        {
          applicationId: selectedApplicationId,
          topic: scheduleForm.topic,
          startTime: scheduleForm.startTime,
          durationMinutes: scheduleForm.durationMinutes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setScheduleStatus("Interview scheduled successfully.");
      setSelectedApplicationId(null);
      setApplications((prev: ApplicationCard[]) =>
        prev.map((app) => app.id === selectedApplicationId ? { ...app, stage: "INTERVIEW" } : app)
      );
      console.log(response.data);
    } catch (error) {
      setScheduleStatus("Failed to schedule interview. Check the request and try again.");
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 1080, margin: "0 auto" }}>
      <h1>HR Dashboard</h1>
      <p>Pipeline and candidate status overview.</p>
      {status && <p>{status}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginTop: 24 }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {applications.map((application: ApplicationCard) => (
              <div key={application.id} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, background: "white" }}>
                <p style={{ fontWeight: 700 }}>{application.candidate.firstName} {application.candidate.lastName}</p>
                <p>{application.candidate.email}</p>
                <p>{application.candidate.location}</p>
                <p><strong>Stage:</strong> {application.stage}</p>
                <p><strong>Score:</strong> {application.score ?? "N/A"}</p>
                <button
                  type="button"
                  onClick={() => openScheduleForm(application.id, `${application.candidate.firstName} ${application.candidate.lastName}`)}
                  style={{ marginTop: 12, width: "100%", padding: "10px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}
                >
                  Schedule interview
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "#f8fafc" }}>
          <h2>Interview Scheduler</h2>
          {selectedApplication ? (
            <form onSubmit={handleScheduleSubmit} style={{ display: "grid", gap: 14 }}>
              <p style={{ margin: 0 }}><strong>Candidate:</strong> {selectedApplication.candidate.firstName} {selectedApplication.candidate.lastName}</p>
              <p style={{ margin: 0 }}><strong>Email:</strong> {selectedApplication.candidate.email}</p>
              <label>
                Topic
                <input
                  value={scheduleForm.topic}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Start time
                <input
                  type="datetime-local"
                  value={scheduleForm.startTime}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  required
                  style={inputStyle}
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  type="number"
                  min="15"
                  value={scheduleForm.durationMinutes}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setScheduleForm({ ...scheduleForm, durationMinutes: Number(e.target.value) })}
                  required
                  style={inputStyle}
                />
              </label>
              <button type="submit" style={buttonStyle}>Send invite</button>
              {scheduleStatus && <p>{scheduleStatus}</p>}
            </form>
          ) : (
            <p>Select a candidate card to start scheduling an interview.</p>
          )}
        </aside>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  marginTop: 8,
};

const buttonStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};
