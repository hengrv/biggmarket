"use client";

import { useState } from "react";
import {
  Clock,
  Heart,
  ChevronRight,
  Plus,
  Loader2,
  Check,
  Send,
  AlertTriangle,
  X,
} from "lucide-react";
import SwapItemScreen from "./swap-screen";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function SwapPage() {
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const router = useRouter();

  const { data: userId } = api.user.getCurrentlyAuthenticatedUser.useQuery();

  const { data: matchedItems, isLoading: loadingSwaps } =
    api.item.getMatches.useQuery();

  const pendingItems = matchedItems?.filter(
    (item) => item.status === "PENDING",
  );

  // Fetch user's swipe stats to get count of right swipes
  const { data: swipeStats } = api.item.getSwipeStats.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Get the count of right swipes
  const rightSwipes =
    swipeStats?.find((stat) => stat.direction === "RIGHT")?._count ?? 0;

  // Fetch items the user has swiped right on (liked items)
  const { data: likedItems, isLoading: loadingLiked } =
    api.item.getUserLikedItems.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const utils = api.useUtils();

  const unlikeMutation = api.item.unlikeItem.useMutation({
    onSuccess: () => {
      // Invalidate liked items query to refresh the list
      void utils.item.getUserLikedItems.invalidate();
      void utils.item.getSwipeStats.invalidate();
    },
  });

  const handleUnlike = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the item click
    await unlikeMutation.mutateAsync({ itemId });
  };

  if (activeSubScreen === "past-orders") {
    router.push(`/swaphistory/${userId}`);
    return null;
  }

  if (activeSubScreen === "sell") {
    return <SwapItemScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  return (
    <AppShell activeScreen="swap" title="Your Swap Space">
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#1a1a1a] p-4">
        {/* Add a green accent at the top */}
        <div className="absolute left-0 right-0 top-0 h-1 bg-[#c1ff72]"></div>

        <div className="mb-4 flex justify-end">
          <button
            className="flex items-center rounded-lg bg-[#c1ff72] px-3 py-1 text-xs font-bold text-black shadow-lg transition-colors hover:bg-[#b4f55e]"
            onClick={() => setActiveSubScreen("sell")}
          >
            SWAP
            <Plus className="ml-1 h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center font-semibold text-foreground">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Pending Swaps
            </h3>
            <button
              className="flex items-center text-xs text-primary"
              onClick={() => setActiveSubScreen("past-orders")}
            >
              Past Swaps
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {loadingSwaps ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : pendingItems && pendingItems.length > 0 ? (
            <div className="scrollbar-hide flex space-x-3 overflow-x-auto pb-2">
              {pendingItems.slice(0, 4).map((match) => (
                <div
                  key={match.id}
                  className="w-32 flex-shrink-0 overflow-hidden rounded-lg bg-background shadow-md"
                >
                  <button
                    onClick={() => router.push(`/swap-details/${match.id}`)}
                  >
                    <Image
                      src={
                        match.useritem1.images[0] ??
                        "/item-placeholder.svg?height=100&width=80"
                      }
                      alt={match.useritem1.title ?? "Swapped item"}
                      width={80}
                      height={100}
                      className="h-24 w-full object-cover"
                      draggable={false}
                    />
                    <div className="p-2">
                      <div className="truncate text-xs font-semibold text-foreground">
                        {match.useritem1.title ??
                          match.useritem1.description?.substring(0, 20) ??
                          "Item"}
                      </div>
                      <div className="text-xs text-muted">
                        {new Date(
                          match.useritem1.updatedAt,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 flex-col items-center justify-center text-center">
              <p className="text-sm text-muted">No pending swaps</p>
              <p className="text-xs text-muted">
                {"Items you've swapped will appear here"}
              </p>
            </div>
          )}
        </div>

        {/* Wishlist Items Section */}
        <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center font-semibold text-foreground">
              <Heart className="mr-2 h-4 w-4 text-primary" />
              Your Wishlist
            </h3>
            {rightSwipes > 0 && (
              <div className="rounded-full bg-background px-2 py-1 text-xs text-primary">
                {rightSwipes} liked
              </div>
            )}
          </div>

          {loadingLiked ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : likedItems && likedItems.length > 0 ? (
            <div className="scrollbar-hide flex space-x-3 overflow-x-auto pb-2">
              {likedItems.map((item) => (
                <div
                  key={item.id}
                  className="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-background shadow-md"
                  onClick={() => {
                    router.push(`/item/${item.id}`);
                  }}
                >
                  <div className="relative">
                    <Image
                      src={
                        item.images[0] ??
                        "/item-placeholder.svg?height=120&width=160"
                      }
                      alt={item.title ?? "Item"}
                      width={160}
                      height={120}
                      className="h-32 w-full object-cover"
                      draggable={false}
                    />
                    <button
                      onClick={(e) => handleUnlike(item.id, e)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:scale-110 hover:bg-red-500/80"
                      title="Remove from wishlist"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-2">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {item.title ??
                        item.description?.substring(0, 20) ??
                        "Item"}
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="mr-1 h-4 w-4 overflow-hidden rounded-full">
                        <Image
                          src={
                            item.user.image ??
                            "/profile-placeholder.svg?height=16&width=16"
                          }
                          alt={item.user.name ?? "Owner"}
                          width={16}
                          height={16}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                      <span className="text-xs text-muted">
                        {item.user.name ?? "User"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <Heart className="mb-2 h-8 w-8 text-primary" />
              <p className="text-sm text-muted">Your wishlist is empty</p>
              <p className="text-xs text-muted">
                Swipe right on items you like to add them to your wishlist
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
