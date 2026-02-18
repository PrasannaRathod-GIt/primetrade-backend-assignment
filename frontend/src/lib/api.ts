// src/lib/api.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export type ApiResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

async function parseResponse(res: Response): Promise<any> {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
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
    // Fixed: safer way to access error properties without using 'any'
    let errorMessage = res.statusText;
    if (parsed && typeof parsed === 'object') {
      errorMessage = (parsed as Record<string, any>).detail || 
                     (parsed as Record<string, any>).error || 
                     (parsed as Record<string, any>).message || 
                     res.statusText;
    }
    
    return { ok: false, status: res.status, error: String(errorMessage) };
  }
  return { ok: true, status: res.status, data: parsed as T };
}