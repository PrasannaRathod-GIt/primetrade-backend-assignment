import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { AuthContext } from "../../lib/AuthContext";

type NewItemPayload = {
  title: string;
  description?: string;
  price?: number;
};

function getErrorMessage(err: unknown, fallback = "Failed to create item"): string {
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

export default function ItemNew() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Create Item</h2>
        <p className="mt-2 text-gray-600">You must be logged in to create items.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: NewItemPayload = { title, description: description || undefined };
      if (price !== "") payload.price = Number(price);

      await api.post("/items", payload);
      // Back to items list; ItemsList should re-fetch via invalidation or staleTime
      navigate("/items");
    } catch (err: unknown) {
      console.error("Create item error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Item</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Item title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Item description"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price (optional)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border rounded p-2"
            placeholder="Price in INR"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create"}
          </button>

          <button type="button" onClick={() => navigate("/items")} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
