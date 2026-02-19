import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) return null;
  const { user, loading } = auth;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 text-center animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // With the updated User interface, user.role and user.roles are now native!
  if (roles && roles.length > 0) {
    const hasRole = roles.includes(user.role) || 
                   (user.roles && roles.some(r => user.roles!.includes(r)));

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}