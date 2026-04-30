import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      setError(err.message);
    });
    if (result) {
      router.push("/dashboard");
    }
  };

  return (
    <main style={{ padding: 24, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 28, border: "1px solid #e5e7eb", borderRadius: 18, display: "grid", gap: 16 }}>
        <h1>HR Login</h1>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        </label>
        <button type="submit" style={buttonStyle}>Sign in</button>
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      </form>
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
