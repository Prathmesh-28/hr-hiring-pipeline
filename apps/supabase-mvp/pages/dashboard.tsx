import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

interface Application {
  id: string;
  stage: string;
  status: string;
  created_at: string;
  candidate: {
    first_name: string;
    last_name: string;
    email: string;
    location: string;
    resume_url: string;
  };
  job: {
    title: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
    });

    supabase
      .from("applications")
      .select(`*, candidate(*), job(title)`)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setApplications(data as Application[]);
        setLoading(false);
      });
  }, [router]);

  return (
    <main style={{ padding: 24, maxWidth: 1120, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>HR Pipeline</h1>
      <p>Review candidate applications, resumes, and pipeline stages.</p>
      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {applications.map((app) => (
            <div key={app.id} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{app.candidate.first_name} {app.candidate.last_name}</p>
                  <p style={{ margin: 0 }}>{app.candidate.email}</p>
                  <p style={{ margin: 0 }}>{app.job?.title}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={badgeStyle}>{app.stage}</span>
                  <p style={{ margin: 0, color: "#6b7280" }}>{new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <a href={app.candidate.resume_url} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>View resume</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const badgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 9999,
  background: "#e0f2fe",
  color: "#0369a1",
  fontWeight: 700,
};
