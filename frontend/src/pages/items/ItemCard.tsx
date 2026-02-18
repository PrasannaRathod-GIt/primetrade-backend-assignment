// src/pages/items/ItemCard.tsx
import React from "react";

type Item = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  status?: string;
  owner?: string;
  image_url?: string;
  created_at?: string;
};

type Props = {
  item: Item;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ItemCard({ item, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg border p-4 flex flex-col h-full">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={item.title} className="object-cover w-full h-full" />
          ) : (
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-lg">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {item.description ?? "No description"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            {typeof item.price !== "undefined" && (
              <span className="px-2 py-1 rounded text-sm bg-gray-50 border">
                ₹{item.price}
              </span>
            )}
            {item.status && (
              <span
                className={`px-2 py-1 rounded text-sm ${
                  item.status === "active" ? "bg-green-50 border" : "bg-yellow-50 border"
                }`}
              >
                {item.status}
              </span>
            )}
            {item.owner && <span className="text-gray-400">by {item.owner}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 mt-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-md border text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <div className="text-xs text-gray-400">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : null}
        </div>
      </div>
    </div>
  );
}
