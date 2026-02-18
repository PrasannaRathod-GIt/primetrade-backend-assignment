import React, { useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { AuthContext, User } from "../lib/AuthContext";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext) as any;
  const [fullName, setFullName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const nav = useNavigate();

  // Load the name into the input field when the component loads
  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      /**
       * Note: Since your axios baseURL is "http://localhost:8000/api/v1",
       * we only need to provide the remaining path: "/auth/me"
       */
      const res = await api.put<User>("/auth/me", { 
        full_name: fullName 
      });

      if (setUser) {
        // res.data contains the updated user object from the backend
        setUser({
          ...user,
          ...res.data
        });
      }

      alert("Profile updated successfully!");
      nav("/dashboard");
    } catch (err: any) {
      console.error("Save error:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Could not save profile";
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <form onSubmit={save} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
          <input
            value={user.email || ""}
            disabled
            className="w-full rounded-lg border bg-gray-50 p-2.5 text-gray-400 cursor-not-allowed"
            title="Email cannot be changed"
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={() => nav("/dashboard")}
            className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold transition-all shadow-md ${
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}