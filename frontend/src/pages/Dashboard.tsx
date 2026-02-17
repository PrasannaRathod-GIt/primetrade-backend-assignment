import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { logout } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

type Task = {
  id: number;
  title?: string;
  name?: string;
};

type Profile = {
  full_name?: string;
  email?: string;
  username?: string;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load(): Promise<void> {
    setErr(null);

    const p = await apiRequest<Profile>("/api/v1/profile");
    if (p.ok && p.data) setProfile(p.data);

    const t = await apiRequest<Task[]>("/api/v1/tasks");
    if (t.ok && t.data) setTasks(Array.isArray(t.data) ? t.data : []);
  }

  function doLogout(): void {
    logout();
    nav("/login");
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <div>
          <Link to="/profile" style={{ marginRight: 12 }}>
            Profile
          </Link>
          <button onClick={doLogout}>Logout</button>
        </div>
      </div>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <section style={{ marginTop: 16 }}>
        <h3>Profile</h3>
        {profile ? (
          <div>{profile.full_name || profile.email || profile.username}</div>
        ) : (
          <div>Loading profile...</div>
        )}
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.title || t.name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
