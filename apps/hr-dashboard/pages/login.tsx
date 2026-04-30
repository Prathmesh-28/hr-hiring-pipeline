import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      window.localStorage.setItem("hr_token", response.data.token);
      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 30, border: "1px solid #d1d5db", borderRadius: 16, background: "white" }}>
        <h1>HR Login</h1>
        <label style={{ display: "block", marginTop: 16 }}>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, marginTop: 8 }} />
        </label>
        <label style={{ display: "block", marginTop: 16 }}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, marginTop: 8 }} />
        </label>
        <button type="submit" style={{ marginTop: 24, width: "100%", padding: 12, background: "#111827", color: "white", border: "none", borderRadius: 8 }}>
          Sign in
        </button>
        {error && <p style={{ color: "#b91c1c", marginTop: 16 }}>{error}</p>}
      </form>
    </main>
  );
}
