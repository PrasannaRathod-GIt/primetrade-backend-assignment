// src/pages/Profile.tsx
import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

export default function Profile() {
  const { user, setUser } = useContext<any>(AuthContext);
  const [fullName, setFullName] = useState<string>("");
  const nav = useNavigate();

  useEffect(() => {
    if (user) setFullName(user.full_name || "");
    else {
      (async () => {
        const r = await apiRequest("/api/v1/profile/");
        if (r.ok) {
          setFullName((r.data as any).full_name || "");
        }
      })();
    }
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await apiRequest("/api/v1/profile/", {
      method: "PUT",
      body: JSON.stringify({ full_name: fullName }),
    });
    if (r.ok) {
      // update context user
      if (setUser) setUser({ ...user, full_name: fullName });
      nav("/dashboard");
    } else {
      alert(r.error || "Could not save profile");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: "auto" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={save}>
        <label>Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 12 }} />
        <button>Save</button>
      </form>
    </div>
  );
}
