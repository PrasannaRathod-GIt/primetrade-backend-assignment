import React, { useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";
import AppLayout from "../components/layout/AppLayout";

export default function Profile() {
  const { user, setUser } = useContext<any>(AuthContext);
  const [fullName, setFullName] = useState<string>("");
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      return;
    }
    (async () => {
      try {
        const res = await api.get("/profile/");
        setFullName(res.data.full_name || "");
      } catch {}
    })();
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.put("/profile/", { full_name: fullName });
      if (setUser) setUser(res.data);
      nav("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Could not save profile";
      alert(msg);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={save} className="bg-white p-6 rounded-lg shadow">
          <label className="block mb-2 text-sm">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded border p-2 mb-4"
          />

          <div className="flex justify-end">
            <button className="rounded-lg bg-slate-900 text-white px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
