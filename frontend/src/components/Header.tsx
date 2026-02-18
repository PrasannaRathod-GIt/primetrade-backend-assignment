import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

export default function Header() {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false); // Mobile menu state
  const [showConfirm, setShowConfirm] = useState(false); // Logout popup state
  const navigate = useNavigate();

  if (!auth) return null;
  const { user, logout } = auth;

  // This runs only when "Yes, Logout" is clicked in the popup
  const confirmLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
    }
    setShowConfirm(false);
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen((p) => !p)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link to="/" className="text-lg font-semibold text-blue-600">
            Primetrade
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-2 text-sm font-medium">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-50 text-gray-600">Dashboard</Link>
            <Link to="/items" className="px-3 py-2 rounded hover:bg-gray-50 text-gray-600">Items</Link>
            <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-50 text-gray-600">Profile</Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                onClick={() => navigate("/items/new")}
              >
                New Item
              </button>
              <button
                className="px-3 py-2 border rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowConfirm(true)} // Open Popup
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 border rounded text-sm font-medium">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 text-gray-700">Dashboard</Link>
            <Link to="/items" onClick={() => setOpen(false)} className="py-2 text-gray-700">Items</Link>
            <Link to="/profile" onClick={() => setOpen(false)} className="py-2 text-gray-700">Profile</Link>
            {user ? (
              <button
                className="text-left py-2 text-red-600 font-medium"
                onClick={() => setShowConfirm(true)} // Open Popup from Mobile
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="py-2" onClick={() => setOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}

      {/* --- LOGOUT CONFIRMATION POPUP (MODAL) --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of Primetrade?</p>
            
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all shadow-md shadow-red-200"
                onClick={confirmLogout} // Final Logout
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}