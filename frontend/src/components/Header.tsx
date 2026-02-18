// src/components/Header.tsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext) as any;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(p => !p)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/" className="text-lg font-semibold">Primetrade</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-2">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-50">Dashboard</Link>
            <Link to="/items" className="px-3 py-2 rounded hover:bg-gray-50">Items</Link>
            <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-50">Profile</Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <button className="btn-primary" onClick={() => navigate('/items')}>New Item</button>
              <button className="px-3 py-2 border rounded" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 border rounded">Login</Link>
          )}
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">Dashboard</Link>
            <Link to="/items" onClick={() => setOpen(false)} className="py-2">Items</Link>
            <Link to="/profile" onClick={() => setOpen(false)} className="py-2">Profile</Link>
            {user ? (
              <button className="text-left py-2" onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login" className="py-2" onClick={() => setOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
