// src/lib/auth.ts
import { apiRequest, API_URL } from "./api";


export async function loginApi(email: string, password: string) {
  // OAuth2 password grant: form-urlencoded to /api/v1/auth/token
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch(`${API_URL}/api/v1/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  let parsed: any;
  try { parsed = JSON.parse(text); } catch { parsed = text; }

  if (!res.ok) {
    const err = parsed?.detail || parsed?.error || res.statusText;
    throw new Error(String(err));
  }

  const token = parsed?.access_token;
  if (!token) throw new Error("No access_token in response");
  localStorage.setItem("token", token);
  return token;
}

export async function registerApi(payload: { email: string; password: string; full_name: string; }) {
  const r = await apiRequest("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(r.error || "Registration failed");
  return r.data;
}

export function logout() {
  localStorage.removeItem("token");
}
