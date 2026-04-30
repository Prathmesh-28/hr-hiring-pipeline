import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 840, margin: "0 auto" }}>
      <h1>Firebase Hiring MVP</h1>
      <p>Candidate application portal and HR dashboard built on Firebase Auth, Firestore, and Storage.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        <Link href="/apply"><a style={buttonPrimary}>Apply for a job</a></Link>
        <Link href="/login"><a style={buttonSecondary}>HR login</a></Link>
      </div>
    </main>
  );
}

const buttonPrimary = {
  background: "#2563eb",
  color: "white",
  padding: "14px 20px",
  borderRadius: 10,
  textDecoration: "none",
};

const buttonSecondary = {
  background: "#f3f4f6",
  color: "#111827",
  padding: "14px 20px",
  borderRadius: 10,
  textDecoration: "none",
};
