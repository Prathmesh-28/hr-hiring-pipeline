import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../lib/firebaseClient";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  jobTitle?: string;
  stage: string;
  status: string;
  createdAt: string;
  resumeUrl?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      loadApplications();
    });

    return () => unsubscribe();
  }, [router]);

  const loadApplications = async () => {
    const appsQuery = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(appsQuery);
    setApplications(
      snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          location: data.location,
          jobTitle: data.jobTitle || data.jobId,
          stage: data.stage,
          status: data.status,
          createdAt: data.createdAt ? data.createdAt.toDate?.().toISOString() ?? data.createdAt : new Date().toISOString(),
          resumeUrl: data.resumeUrl,
        };
      })
    );
    setLoading(false);
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 1080, margin: "0 auto" }}>
      <h1>Firebase HR Dashboard</h1>
      <p>Review candidate applications submitted through Firebase.</p>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {applications.map((application) => (
            <div key={application.id} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, background: "white" }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{application.firstName} {application.lastName}</p>
              <p style={{ margin: 0 }}>{application.email}</p>
              <p style={{ margin: 0 }}>{application.jobTitle}</p>
              <p style={{ margin: 0 }}>Stage: {application.stage}</p>
              <p style={{ margin: 0 }}>Status: {application.status}</p>
              {application.resumeUrl && (
                <p style={{ margin: 0 }}><a href={application.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>View resume</a></p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
