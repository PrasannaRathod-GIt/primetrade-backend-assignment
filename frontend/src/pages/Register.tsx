// src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        email,
        password,
        full_name: fullName
      });
      nav("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Register failed";
      alert(msg);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Register</h2>

        <label className="block mb-2 text-sm">Full name</label>
        <input
          className="mb-3 w-full rounded border p-2"
          placeholder="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm">Email</label>
        <input
          className="mb-3 w-full rounded border p-2"
          type="email"
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
          Create account
        </button>
      </form>
    </div>
  );
}
