import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1>Supabase Hiring MVP</h1>
      <p>Public careers page for candidates and a lightweight HR dashboard powered by Supabase.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 28 }}>
        <Link href="/apply"><a style={buttonStyle}>Apply Now</a></Link>
        <Link href="/login"><a style={buttonStyleSecondary}>HR Login</a></Link>
      </div>
    </main>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "14px 20px",
  borderRadius: 10,
  textDecoration: "none",
  display: "inline-block",
};

const buttonStyleSecondary = {
  background: "#f3f4f6",
  color: "#111827",
  padding: "14px 20px",
  borderRadius: 10,
  textDecoration: "none",
  display: "inline-block",
};
