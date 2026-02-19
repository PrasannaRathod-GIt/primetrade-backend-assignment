import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
// ✅ Fixed casing: Capital "B" in Button
import { Button } from "../../components/Button"; 

type Item = {
  title: string;
  description?: string;
  price?: number;
  status?: string;
};

export default function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [item, setItem] = useState<Item>({
    title: "",
    description: "",
    price: 0,
    status: "active",
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/items/${id}`)
        .then((res) => setItem(res.data))
        .catch((err) => {
          console.error("Failed to fetch item:", err);
          alert("Failed to fetch item");
          navigate("/items");
        });
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await api.put(`/items/${id}`, item);
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/items");
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Failed to update item");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Item</h2>

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Title"
        value={item.title}
        onChange={(e) => setItem({ ...item, title: e.target.value })}
        required
      />

      <textarea
        className="w-full mb-3 p-2 border rounded"
        placeholder="Description"
        value={item.description}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        type="number"
        placeholder="Price"
        value={item.price}
        onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
      />

      <Button type="submit">Update Item</Button>
    </form>
  );
}