import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import ItemCard from "./ItemCard";
import { AuthContext } from "../../lib/AuthContext";

type Item = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  status?: string;
  owner_id?: number;
  image_url?: string;
  created_at?: string;
};

async function fetchItems(): Promise<Item[]> {
  const res = await api.get<Item[]>("/items");
  return res.data;
}

/** safe message extractor */
function getErrorMessage(err: unknown, fallback = "Failed to delete item"): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    const maybe = err as { response?: { data?: { detail?: string } }; message?: string };
    return maybe.response?.data?.detail ?? maybe.message ?? fallback;
  } catch {
    return fallback;
  }
}

export default function ItemsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const { data: items, isLoading, isError, error } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err: unknown) => {
      const msg = getErrorMessage(err);
      alert(msg);
    },
  });

  const handleDelete = (id: number) => {
    const ok = window.confirm("Delete this item? This action cannot be undone.");
    if (!ok) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="text-center py-8">Loading items...</div>;

  if (isError)
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <p className="text-red-600 mb-4">Failed to load items: {String(error?.message)}</p>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ["items"] })} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Items</h1>

        {user && (
          <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => navigate("/items/new")}>
            New Item
          </button>
        )}
      </div>

      {items && items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={() => navigate(`/items/${item.id}/edit`)} onDelete={() => handleDelete(item.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="mb-4">No items found.</p>
          {user ? (
            <button className="btn-primary" onClick={() => navigate("/items/new")}>
              Create your first item
            </button>
          ) : (
            <p className="text-sm text-gray-500">Log in to create items.</p>
          )}
        </div>
      )}
    </div>
  );
}
