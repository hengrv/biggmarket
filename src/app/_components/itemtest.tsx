"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

export default function ItemTester() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemData, setNewItemData] = useState({
    image: "",
    description: "",
    category: "",
  });

  // API Hooks
  const { data: userItems, refetch: refetchItems } =
    api.item.getUserItems.useQuery({});
  const createItem = api.item.createItem.useMutation({
    onSuccess: () => refetchItems(),
  });
  const updateItem = api.item.updateItem.useMutation({
    onSuccess: () => refetchItems(),
  });
  const deleteItem = api.item.deleteItem.useMutation({
    onSuccess: () => refetchItems(),
  });
  const toggleVisibility = api.item.toggleItemVisibility.useMutation({
    onSuccess: () => refetchItems(),
  });

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await createItem.mutateAsync(newItemData);
      setNewItemData({ image: "", description: "", category: "" });
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const handleUpdateItem = async (itemId) => {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        data: {
          description: `Updated at ${new Date().toISOString()}`,
        },
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem.mutateAsync({ id: itemId });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleToggleVisibility = async (itemId) => {
    try {
      await toggleVisibility.mutateAsync({ id: itemId });
    } catch (error) {
      console.error("Toggle visibility error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Item API Tester</h1>

      {/* Create Item Form */}
      <div className="mb-8 rounded border p-4">
        <h2 className="mb-4 text-xl font-semibold">Create New Item</h2>
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div>
            <label className="mb-1 block">Image URL:</label>
            <input
              type="text"
              value={newItemData.image}
              onChange={(e) =>
                setNewItemData((prev) => ({ ...prev, image: e.target.value }))
              }
              className="w-full rounded border p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="mb-1 block">Category:</label>
            <input
              type="text"
              value={newItemData.category}
              onChange={(e) =>
                setNewItemData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full rounded border p-2"
              placeholder="Electronics"
            />
          </div>
          <div>
            <label className="mb-1 block">Description:</label>
            <textarea
              value={newItemData.description}
              onChange={(e) =>
                setNewItemData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded border p-2"
              placeholder="Item description"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={createItem.isLoading}
          >
            {createItem.isLoading ? "Creating..." : "Create Item"}
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Items</h2>
        {userItems?.map((item) => (
          <div key={item.id} className="rounded border p-4">
            <div className="mb-2">
              <strong>ID:</strong> {item.id}
            </div>
            <div className="mb-2">
              <strong>Image:</strong> {item.image}
            </div>
            <div className="mb-2">
              <strong>Category:</strong> {item.category}
            </div>
            <div className="mb-2">
              <strong>Description:</strong> {item.description}
            </div>
            <div className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`rounded px-2 py-1 text-sm ${item.status === "AVAILABLE"
                    ? "bg-green-100 text-green-800"
                    : item.status === "HIDDEN"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
              >
                {item.status}
              </span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleUpdateItem(item.id)}
                className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                disabled={updateItem.isLoading}
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                disabled={deleteItem.isLoading}
              >
                Delete
              </button>
              <button
                onClick={() => handleToggleVisibility(item.id)}
                className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                disabled={toggleVisibility.isLoading}
              >
                Toggle Visibility
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
