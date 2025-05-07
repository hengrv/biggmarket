"use client";

import type React from "react";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import { X, Camera, Loader2, Upload, Check, Send } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { ItemImageUploader } from "@/components/item/item-image-uploader";

export default function SwapItemScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [condition, setCondition] = useState("New");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddImage = (urls: string[]) => {
    setImages((prevImages) => [...prevImages, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // API Hooks
  const createItem = api.item.createItem.useMutation({
    onSuccess: () => {
      console.log("Item created successfully");
    },
  });

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createItem.mutateAsync({
        images: images,
        title: itemName,
        description,
        category,
      });

      setItemName("");
      setImages([]);
      setDescription("");
      setCategory("");
      setCondition("");
      setIsLoading(false);
      setActiveSubScreen(null);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  return (
    <AppShell
      title="Swap an Item"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="swap"
    >
      <div className="p-4">
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div className="space-y-2">
            <label className="mb-1 block text-xs text-muted">
              Item Photos (required)
            </label>

            <ItemImageUploader onImagesUploaded={handleAddImage} />

            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg bg-secondary"
                >
                  <Image
                    src={image || "/item-placeholder.svg"}
                    alt={`Item photo ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <p className="text-xs text-red-400">
                At least one photo is required
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              Item Name (required)
            </label>
            <input
              type="text"
              placeholder="e.g. Vintage Chair"
              className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Description</label>
            <textarea
              placeholder="Describe your item..."
              className="h-24 w-full resize-none rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Category</label>
              <select
                className="w-full appearance-none rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Home & Living</option>
                <option>Fashion & Apparel</option>
                <option>Electronics</option>
                <option>Books & Entertainment</option>
                <option>Pet Supplies</option>
                <option>Health & Beauty</option>
                <option>Sports & Outdoors</option>
                <option>Kids & Baby</option>
                <option>Automative & Tools</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted">Condition</label>
              <select
                className="w-full appearance-none rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-black"
            disabled={isLoading || images.length === 0 || !itemName}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Upload className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Listing..." : "List Item"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
