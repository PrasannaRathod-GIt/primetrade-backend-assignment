import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import api from "../api/client";
import { AxiosError } from "axios"; // Added for proper error typing

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
    } catch (err) {
      // ✅ Removed 'any' and added safe error parsing
      const error = err as AxiosError<{ detail?: string }>;
      const msg = error.response?.data?.detail || error.message || "Register failed";
      alert(msg);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Register</h2>

          <label className="block mb-2 text-sm font-medium">Full name</label>
          <input
            className="mb-3 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            className="mb-3 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            className="mb-4 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button 
            type="submit" 
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition-colors"
          >
            Create account
          </button>
        </form>

        {/* --- LOGIN LINK SECTION --- */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}