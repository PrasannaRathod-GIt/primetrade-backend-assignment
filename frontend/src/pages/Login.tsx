// src/pages/Login.tsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../lib/auth";
import { AuthContext } from "../lib/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext<any>(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await loginApi(email, password);
      // fetch current user once and set context (AuthProvider will also fetch, but we can also set here)
      const token = localStorage.getItem("token");
      if (token) {
        const r = await fetch(`${(window as any).__env?.API_URL || "http://localhost:8000"}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (r.ok) {
          const u = await r.json();
          if (setUser) setUser(u);
        }
      }
      navigate("/dashboard");
    } catch (err: any) {
      alert(err?.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
