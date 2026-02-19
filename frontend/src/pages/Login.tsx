import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/client";
import { AuthContext, User } from "../lib/AuthContext";

/** Narrow unknown error to string */
function getErrorMessage(err: unknown, fallback = "Login failed"): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    const maybe = err as { response?: { data?: { detail?: string } }; message?: string };
    return maybe.response?.data?.detail ?? maybe.message ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const auth = useContext(AuthContext);
  const setUser = auth?.setUser ?? null;

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      // If your "api" is an axios instance, typing <{ access_token: string }>
      const res = await api.post<{ access_token: string }>("/auth/token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);

      // fetch current user
      const me = await api.get<User>("/auth/me");
      if (typeof setUser === "function") {
        setUser(me.data);
      }

      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error("Login error:", err);
      alert(getErrorMessage(err));
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm">Password</label>
          <input
            className="mb-4 w-full rounded border p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New user?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
