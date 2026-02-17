// src/lib/api.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export type ApiResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

async function parseResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function apiRequest<T = unknown>(path: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");

  // If body is JSON string, keep Content-Type; if FormData, don't set it
  const baseHeaders: Record<string,string> = {};
  if (!(opts.body instanceof FormData)) baseHeaders["Content-Type"] = "application/json";
  if (token) baseHeaders["Authorization"] = `Bearer ${token}`;

  // merge headers but ensure Authorization isn't overwritten by consumer
  const headers = { ...baseHeaders, ...(opts.headers as Record<string,string> || {}) };

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers, credentials: "omit" });
  const parsed = await parseResponse(res);

  if (!res.ok) {
    const err = (parsed && ((parsed as any).detail || (parsed as any).error || (parsed as any).message)) || res.statusText;
    return { ok: false, status: res.status, error: String(err) };
  }
  return { ok: true, status: res.status, data: parsed as T };
}
