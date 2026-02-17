// src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/AuthContext";
import { apiRequest } from "../lib/api";
import { logout } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return; // wait for user
    let mounted = true;
    (async () => {
      setLoadingTasks(true);
      const t = await apiRequest("/api/v1/tasks/"); // trailing slash
      if (mounted && t.ok) {
        if (Array.isArray(t.data)) setTasks(t.data);
        else if (t.data && Array.isArray((t.data as any).data)) setTasks((t.data as any).data);
        else setTasks([]);
      } else {
        if (mounted) setTasks([]);
      }
      if (mounted) setLoadingTasks(false);
    })();
    return () => { mounted = false; };
  }, [user]);

  function doLogout() {
    logout();
    nav("/login");
  }

  if (!user) return <div>Loading profile...</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <div>
          <Link to="/profile" style={{ marginRight: 12 }}>Profile</Link>
          <button onClick={doLogout}>Logout</button>
        </div>
      </div>

      <section style={{ marginTop: 16 }}>
        <h3>Profile</h3>
        <div>{user.full_name ?? user.email}</div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Tasks</h3>
        {loadingTasks ? <div>Loading tasks...</div> : (
          tasks.length === 0 ? <div>No tasks found.</div> :
          <ul>{tasks.map((t:any) => <li key={t.id}>{t.title ?? t.name}</li>)}</ul>
        )}
      </section>
    </div>
  );
}
