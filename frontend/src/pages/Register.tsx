// src/pages/Register.tsx
import React, { useState } from "react";
import { registerApi } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerApi({ email, password, full_name: fullName });
      nav("/login");
    } catch (err: any) {
      alert(err?.message || "Register failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16 }}>
      <h2>Register</h2>
      <input placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
