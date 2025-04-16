"use client";

import type React from "react";

import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { RouterOutputs } from "~/trpc/react";

interface ItemGridProps {
  items: RouterOutputs["item"]["getUserItems"] | undefined;
  isLoading: boolean;
  emptyMessage: string;
  emptyActionButton?: React.ReactNode;
}

export default function ItemGrid({
  items,
  isLoading,
  emptyMessage,
  emptyActionButton,
}: ItemGridProps) {
  const router = useRouter();

  const handleItemClick = (itemId: string) => {
    router.push(`/item/${itemId}`);
  };

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a]">
          <Heart className="h-6 w-6 text-[#c1ff72]" />
        </div>
        <h3 className="mb-2 font-semibold text-foreground">No items yet</h3>
        <p className="mb-4 text-sm text-muted">{emptyMessage}</p>
        {emptyActionButton}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          onClick={() => handleItemClick(item.id)}
          key={item.id}
          className="cursor-pointer overflow-hidden rounded-lg bg-secondary shadow-lg transition-transform hover:scale-[1.02]"
        >
          <div className="relative">
            <Image
              src={
                item.images[0] ?? "/item-placeholder.svg?height=150&width=150"
              }
              alt={item.title ?? "Item"}
              width={150}
              height={150}
              className="h-32 w-full object-cover"
              draggable={false}
            />
            <div className="absolute right-2 top-2 flex items-center rounded-full bg-black/50 px-2 py-0.5">
              <Heart className="mr-1 h-3 w-3 text-[#c1ff72]" />
              <span className="text-xs text-white">
                {item._count?.swipes || 0}
              </span>
            </div>
          </div>
          <div className="p-2">
            <div className="truncate text-sm font-semibold text-foreground">
              {item.title ?? "No title"}
            </div>
            <div className="text-xs text-muted">{item.category}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
