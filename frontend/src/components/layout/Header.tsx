import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// ✅ Import the Type along with the Context
import { AuthContext, type AuthContextType } from "../../lib/AuthContext";

export default function Header() {
  // ✅ Explicitly tell TS: "Treat this as AuthContextType"
  const auth = useContext(AuthContext) as AuthContextType | null;
  const navigate = useNavigate();

  // Guard clause: if context is missing, don't render
  if (!auth) return null;

  const { user, setUser } = auth;

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-lg">
          Primetrade
        </Link>

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-slate-900 text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}