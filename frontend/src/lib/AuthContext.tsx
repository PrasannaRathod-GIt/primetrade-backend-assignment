import { createContext } from "react";

/**
 * Shared User type for the app.
 */
// src/lib/AuthContext.tsx
export interface User {
  id: number;
  email: string;
  role: string; // The primary role
  roles?: string[]; // ✅ Add this to the base interface permanently
  full_name?: string | null;
  is_active?: boolean;
}

/**
 * Shape of the AuthContext value.
 * The context file intentionally does NOT export any components,
 * to keep Fast Refresh happy.
 */
export interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  logout: () => void;
}

/**
 * The context value. Default is `null` to force runtime checking by consumers.
 */
export const AuthContext = createContext<AuthContextType | null>(null);