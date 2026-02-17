import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { useNavigate } from "react-router-dom";

type Profile = {
  full_name?: string;
  email?: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load(): Promise<void> {
    const r = await apiRequest<Profile>("/api/v1/profile");
    if (r.ok && r.data) {
      setProfile(r.data);
      setFullName(r.data.full_name || "");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const r = await apiRequest("/api/v1/profile", {
      method: "PUT",
      body: JSON.stringify({ full_name: fullName }),
    });

    if (r.ok) nav("/dashboard");
    else alert(r.error || "Could not save profile");
  }

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: "auto" }}>
      <h2>Edit Profile</h2>

      <form onSubmit={save}>
        <label>Full name</label>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <button>Save</button>
      </form>
    </div>
  );
}
