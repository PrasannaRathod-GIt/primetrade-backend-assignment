import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Added Link
import api from "../api/client";
import { AuthContext, User } from "../lib/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext); // Removed 'as any'
  const navigate = useNavigate();
  const location = useLocation();

  // Safely cast location state to handle the redirect path
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // OAuth2 password form expected by FastAPI
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const res = await api.post<{ access_token: string }>("/auth/token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);

      // Load current user into context with proper typing
      const me = await api.get<User>("/auth/me");
      setUser(me.data);

      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Login failed";
      alert(msg);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Login</h2>

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

          <button type="submit" className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition-colors">
            Sign in
          </button>
        </form>

        {/* --- NEW REGISTER SECTION --- */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New user?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        {/* ---------------------------- */}
      </div>
    </div>
  );
}