// src/lib/types.ts

export type User = {
  id: number;
  email: string;
  full_name?: string | null;
  role?: "user" | "admin" | string;
  is_active?: boolean;
};

export type Owner =
  | string
  | {
      id?: number;
      email?: string;
      full_name?: string;
    }
  | null;

export type Item = {
  id?: number;
  title: string;
  description?: string | null;
  price?: number | null;
  status?: string;
  owner?: Owner;
  owner_id?: number | null;
  image_url?: string | null;
  created_at?: string | null;
};

export type ApiError = {
  message?: string;
  detail?: string;
  status?: number;
  [k: string]: unknown;
};
