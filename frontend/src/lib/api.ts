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
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function asRecord(obj: unknown): Record<string, unknown> | null {
  return obj && typeof obj === "object" && !Array.isArray(obj) ? (obj as Record<string, unknown>) : null;
}

export async function apiRequest<T = unknown>(path: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");

  const baseHeaders: Record<string, string> = {};
  if (!(opts.body instanceof FormData)) baseHeaders["Content-Type"] = "application/json";
  if (token) baseHeaders["Authorization"] = `Bearer ${token}`;

  const headers = { ...baseHeaders, ...(opts.headers as Record<string, string> || {}) };

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers, credentials: "omit" });
  const parsed = await parseResponse(res);

  if (!res.ok) {
    let errorMessage = res.statusText;
    const rec = asRecord(parsed);
    if (rec) {
      if (typeof rec.detail === "string") errorMessage = rec.detail;
      else if (typeof rec.error === "string") errorMessage = rec.error;
      else if (typeof rec.message === "string") errorMessage = rec.message;
    }
    return { ok: false, status: res.status, error: String(errorMessage) };
  }

  return { ok: true, status: res.status, data: parsed as T };
}
