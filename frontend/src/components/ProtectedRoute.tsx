// src/components/ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../lib/AuthContext";

// Define what your user looks like
interface User {
  role?: string;
  roles?: string[];
  [key: string]: any; 
}

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) return null;
  const { user, loading } = auth;

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    // Cast user to our Interface instead of 'any'
    const currentUser = user as User;
    const userRole = currentUser.role ?? currentUser.roles ?? null;
    
    const hasRole = Array.isArray(userRole) 
      ? roles.some(r => userRole.includes(r)) 
      : userRole && roles.includes(userRole);

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}