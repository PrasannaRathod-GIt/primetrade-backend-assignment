import React, { useContext, useEffect, useState } from "react";
// ✅ Import the Type
import { AuthContext, type AuthContextType } from "../lib/AuthContext";
import { apiRequest } from "../lib/api";
import { logout as authLogout } from "../lib/auth";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title?: string;
  name?: string;
}

export default function Dashboard() {
  // ✅ Explicit typing and null fallback
  const auth = useContext(AuthContext) as AuthContextType | null;
  const user = auth?.user ?? null;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      setLoadingTasks(true);
      try {
        const t = await apiRequest<Task[] | { data: Task[] }>("/api/v1/tasks/");
        if (mounted && t && t.ok && t.data) {
          if (Array.isArray(t.data)) {
            setTasks(t.data);
          } else if (typeof t.data === 'object' && 'data' in t.data) {
            setTasks((t.data as { data: Task[] }).data);
          }
        }
      } catch {
        if (mounted) setTasks([]);
      } finally {
        if (mounted) setLoadingTasks(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  function confirmLogout() {
    authLogout();
    nav("/login");
  }

  // ✅ Keep returns AFTER all hooks (useEffect, useState)
  if (!user) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <section className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-2 text-gray-700">Profile</h3>
        <div className="text-gray-600">{user.full_name ?? user.email}</div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-2 text-gray-700">Your Tasks</h3>
        {loadingTasks ? (
          <div className="text-gray-500 italic">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-500">No tasks found.</div>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {tasks.map((t) => (
              <li key={t.id} className="text-gray-600">{t.title ?? t.name}</li>
            ))}
          </ul>
        )}
      </section>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}