const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

export async function apiRequest<T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const parsed = await parseResponse(res);

  if (!res.ok) {
    const err =
      (parsed as any)?.detail ||
      (parsed as any)?.error ||
      res.statusText;

    return { ok: false, status: res.status, error: String(err) };
  }

  return { ok: true, status: res.status, data: parsed as T };
}

export { API_URL };
