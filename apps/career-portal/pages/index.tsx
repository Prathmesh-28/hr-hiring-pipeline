import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <section style={{ maxWidth: 920, margin: "0 auto" }}>
        <h1>Careers</h1>
        <p>Apply for open positions, upload your resume, and receive automated status updates.</p>
        <div style={{ marginTop: 24 }}>
          <Link href="/apply">
            <a style={{ padding: "14px 24px", background: "#2563eb", color: "white", borderRadius: 8, textDecoration: "none" }}>
              Start Application
            </a>
          </Link>
        </div>
      </section>
    </main>
  );
}
