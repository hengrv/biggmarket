"use client";

import type React from "react";

import { useState } from "react";
import { Camera, Trash2, Upload, Loader2, Info } from "lucide-react";
import Image from "next/image";

export default function UploadItemScreen({
  handleItemUpload,
}: {
  handleItemUpload: () => void;
}) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [condition, setCondition] = useState("New");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddImage = () => {
    const newImage = `/generic-placeholder.svg?height=${200 + Math.floor(Math.random() * 100)}&width=${200 + Math.floor(Math.random() * 100)}`;
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      handleItemUpload();
    }, 1500);
  };

  return (
    <div className="h-full overflow-auto pb-16">
      <div className="p-4">
        <div className="mb-6 flex items-center">
          <h2 className="flex-1 text-xl font-bold text-foreground">
            Upload Your First Item
          </h2>
        </div>

        <div className="mb-6 rounded-lg bg-secondary p-4">
          <p className="mb-4 text-sm text-foreground">
            <span className="font-semibold text-[#c1ff72]">
              Welcome to BiggMarket!
            </span>{" "}
            To start swapping, you need to upload at least one item. This helps
            create a community of sharers.
          </p>

          <div className="flex items-center text-xs text-muted">
            <Info className="mr-1 h-4 w-4 text-[#c1ff72]" />
            <span>You&apos;ll be able to browse and swap after uploading.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs text-muted">
              Item Photos (required)
            </label>
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
                    draggable={false}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3a3a3a] bg-secondary"
                  onClick={handleAddImage}
                >
                  <Camera className="mb-1 h-6 w-6 text-primary" />
                  <span className="text-xs text-muted">Add Photo</span>
                </button>
              )}
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
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#c1ff72] py-3 font-semibold text-black shadow-lg transition-colors hover:bg-[#b4f55e]"
            disabled={isLoading || images.length === 0 || !itemName}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Upload className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Uploading..." : "Upload Item & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
