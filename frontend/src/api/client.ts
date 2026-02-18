// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  return cfg;
});

// global 401 handler: optional but handy
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      // clear auth and reload to force login (or use AuthContext.logout if you prefer)
      localStorage.removeItem("token");
      // optionally redirect:
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
