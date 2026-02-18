// src/pages/Login.tsx
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import { AuthContext } from "../lib/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext) as any;
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // OAuth2 password form expected by FastAPI
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const res = await api.post("/auth/token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);

      // load current user into context
      const me = await api.get("/auth/me");
      setUser(me.data);

      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Login failed";
      alert(msg);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Login</h2>

        <label className="block mb-2 text-sm">Email</label>
        <input
          className="mb-3 w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm">Password</label>
        <input
          className="mb-4 w-full rounded border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full rounded-lg bg-brand text-white py-2">
          Sign in
        </button>
      </form>
    </div>
  );
}
