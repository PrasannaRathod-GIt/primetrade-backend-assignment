import React, { useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
// ✅ Import AuthContextType to assist with safety
import { AuthContext, type User, type AuthContextType } from "../lib/AuthContext";

function getErrorMessage(err: unknown, fallback = "Could not save profile"): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    const maybe = err as { response?: { data?: { detail?: string; message?: string } }; message?: string };
    return maybe.response?.data?.detail ?? maybe.response?.data?.message ?? maybe.message ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Profile() {
  const auth = useContext(AuthContext) as AuthContextType | null;
  const nav = useNavigate();

  // ✅ RULES OF HOOKS: All hooks must go FIRST, before any 'if' returns
  const [fullName, setFullName] = useState<string>(""); 
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // We use optional chaining (auth?.user) because we haven't checked if it's null yet
  useEffect(() => {
    if (auth?.user?.full_name) {
      setFullName(auth.user.full_name);
    }
  }, [auth?.user]);

  // ✅ Now that all hooks are declared, we can safely return early
  if (!auth) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-medium">
          Auth provider not found. Make sure the app is wrapped with AuthProvider.
        </p>
      </div>
    );
  }

  const { user, setUser } = auth;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await api.put<User>("/auth/me", { full_name: fullName });
      if (typeof setUser === "function") {
        setUser(res.data);
      }
      alert("Profile updated successfully!");
      nav("/dashboard");
    } catch (err: unknown) {
      console.error("Save error:", err);
      alert(getErrorMessage(err));
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
            value={fullName ?? ""}
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