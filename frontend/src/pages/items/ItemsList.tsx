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
  owner?: any;
  owner_id?: number;
  image_url?: string;
  created_at?: string;
};

async function fetchItems(): Promise<Item[]> {
  const res = await api.get("/items");
  return res.data;
}

export default function ItemsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const { data: items, isLoading, isError, error } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || "Failed to delete item";
      alert(msg);
    },
  });

  const handleDelete = (id: number) => {
    const ok = window.confirm("Delete this item? This action cannot be undone.");
    if (!ok) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <p className="text-red-600 mb-4">
            Failed to load items: {error?.message}
          </p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["items"] })
            }
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Items</h1>

        {user && (
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            onClick={() => navigate("/items/new")}
          >
            New Item
          </button>
        )}
      </div>

      {/* Items Grid */}
      {items && items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isOwner = user && item.owner_id === user.id;

            return (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={
                  isOwner ? () => navigate(`/items/${item.id}/edit`) : undefined
                }
                onDelete={isOwner ? () => handleDelete(item.id) : undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="mb-4">No items found.</p>

          {user ? (
            <button
              className="btn-primary"
              onClick={() => navigate("/items/new")}
            >
              Create your first item
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Log in to create items.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
