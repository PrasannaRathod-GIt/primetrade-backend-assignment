import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../lib/AuthContext";

export default function Header() {
  const { user, setUser } = useContext<any>(AuthContext);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    if (setUser) setUser(null);
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
              onClick={logout}
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
