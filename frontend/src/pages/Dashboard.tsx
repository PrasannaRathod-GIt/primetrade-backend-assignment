import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/AuthContext";
import { apiRequest } from "../lib/api";
import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      setLoadingTasks(true);
      const t = await apiRequest("/api/v1/tasks/");
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
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Profile</h3>
        <div>{user.full_name ?? user.email}</div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Tasks</h3>
        {loadingTasks ? (
          <div>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <ul className="list-disc pl-6">
            {tasks.map((t: any) => (
              <li key={t.id}>{t.title ?? t.name}</li>
            ))}
          </ul>
        )}
      </section>
    </AppLayout>
  );
}
