// src/components/ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

type Props = {
  children: React.ReactNode;
  roles?: string[]; // optional: ['admin']
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!user) {
    // redirect to login and save where we came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // optional role check (if you use roles on user object)
  if (roles && roles.length > 0) {
    const userRole = (user as any).role ?? (user as any).roles ?? null;
    if (!userRole || (Array.isArray(userRole) ? !roles.some(r => userRole.includes(r)) : !roles.includes(userRole))) {
      // unauthorized - you can redirect to 403 page or dashboard
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
