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

  // Fetch user's items that have been swapped
  const { data: swappedItems, isLoading: loadingSwapped } =
    api.item.getUserItems.useQuery(
      { status: "SWAPPED" },
      { refetchOnWindowFocus: false },
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

  if (activeSubScreen === "wishlist-item" && selectedItem) {
    return (
      <WishlistItemScreen
        itemId={selectedItem}
        setActiveSubScreen={setActiveSubScreen}
      />
    );
  }

  if (activeSubScreen === "past-orders") {
    router.push(`/swaphistory/${userId}`);
    return null;
  }

  if (activeSubScreen === "sell") {
    return <SwapItemScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  console.log(likedItems);

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

        {/* Past Swaps Section */}
        <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center font-semibold text-foreground">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Past Swaps
            </h3>
            <button
              className="flex items-center text-xs text-primary"
              onClick={() => setActiveSubScreen("past-orders")}
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {loadingSwapped ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : swappedItems && swappedItems.length > 0 ? (
            <div className="scrollbar-hide flex space-x-3 overflow-x-auto pb-2">
              {swappedItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="w-32 flex-shrink-0 overflow-hidden rounded-lg bg-background shadow-md"
                >
                  <Image
                    src={
                      item.images[0] ??
                      "/item-placeholder.svg?height=100&width=80"
                    }
                    alt={item.title ?? "Swapped item"}
                    width={80}
                    height={100}
                    className="h-24 w-full object-cover"
                    draggable={false}
                  />
                  <div className="p-2">
                    <div className="truncate text-xs font-semibold text-foreground">
                      {item.title ??
                        item.description?.substring(0, 20) ??
                        "Item"}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 flex-col items-center justify-center text-center">
              <p className="text-sm text-muted">No past swaps yet</p>
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
                    setSelectedItem(item.id);
                    setActiveSubScreen("wishlist-item");
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

function WishlistItemScreen({
  itemId,
  setActiveSubScreen,
}: {
  itemId: string;
  setActiveSubScreen: (screen: string | null) => void;
}) {
  // Fetch the item details
  const { data: item, isLoading } = api.item.getItemById.useQuery(
    { id: itemId },
    { refetchOnWindowFocus: false },
  );

  // Add state to track swap status
  const [swapStatus, setSwapStatus] = useState<
    "ready" | "pending" | "completed"
  >("ready");
  const [isSwapping, setIsSwapping] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  // Add a rating query at the top of the WishlistItemScreen component:
  const { data: ratingData } = api.user.getAverageRating.useQuery(
    { userId: item?.user.id ?? "" },
    {
      enabled: !!item?.user.id,
      refetchOnWindowFocus: false,
    },
  );

  // Swipe mutation
  const swipeMutation = api.item.swipeItem.useMutation({
    onSuccess: () => {
      setSwapStatus("pending");

      // Simulate other user accepting after some time
      setTimeout(() => {
        setSwapStatus("completed");

        // Navigate to past swaps after completion
        setTimeout(() => {
          setActiveSubScreen("past-orders");
        }, 1500);
      }, 3000);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setIsSending(true);

    // Simulate sending a message
    setTimeout(() => {
      setIsSending(false);
      setSentMessage(true);
      setMessage("");

      // Reset the success message after a delay
      setTimeout(() => {
        setSentMessage(false);
        setShowMessageInput(false);
      }, 3000);
    }, 1000);
  };

  // Handle swap button click
  const handleSwapClick = async () => {
    if (swapStatus === "ready" && item) {
      setIsSwapping(true);

      try {
        await swipeMutation.mutateAsync({
          itemId: item.id,
          direction: "RIGHT",
        });
      } catch (error) {
        console.error("Error swiping item:", error);
        setIsSwapping(false);
        setSwapStatus("ready");
      }
    }
  };

  const getButtonStyles = () => {
    switch (swapStatus) {
      case "ready":
        return "bg-[#c1ff72] text-black";
      case "pending":
        return "bg-[#3a3a3a] text-[#a9a9a9]";
      case "completed":
        return "bg-[#4c9bb0] text-white";
    }
  };

  // Get button text based on status
  const getButtonText = () => {
    if (isSwapping) return "Processing...";

    switch (swapStatus) {
      case "ready":
        return "Swap Now";
      case "pending":
        return "Swap Pending";
      case "completed":
        return "Swapped!";
    }
  };

  // Get button icon based on status
  const getButtonIcon = () => {
    if (isSwapping) return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;

    switch (swapStatus) {
      case "completed":
        return <Check className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AppShell
        title="Item Details"
        showBackButton={true}
        onBack={() => setActiveSubScreen(null)}
        activeScreen="swap"
      >
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!item) {
    return (
      <AppShell
        title="Item Details"
        showBackButton={true}
        onBack={() => setActiveSubScreen(null)}
        activeScreen="swap"
      >
        <div className="p-4 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Item Not Found</h3>
          <p className="text-sm text-muted">
            This item may have been removed or is no longer available.
          </p>
          <button
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-black"
            onClick={() => setActiveSubScreen(null)}
          >
            Go Back
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Item Details"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="swap"
    >
      <div className="p-4">
        <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg">
          <Image
            src={item.images[0] ?? "/item-placeholder.svg?height=300&width=400"}
            alt={item.title ?? "Item"}
            width={400}
            height={300}
            className="h-56 w-full object-cover"
            draggable={false}
          />

          <div className="p-4">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              {item.title ?? "Item"}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-foreground">
                {item.description ?? "No description available"}
              </p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-lg bg-background p-3">
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={
                      item.user.image ??
                      "/profile-placeholder.svg?height=40&width=40"
                    }
                    alt={item.user.name ?? "User"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {item.user.name ?? "User"}
                  </div>
                  {/* Then update the rating display to use the fetched rating data: */}
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < Math.floor(ratingData?.averageRating ?? 0) ? "text-primary" : "text-[#3a3a3a]"}`}
                        >
                          ★
                        </span>
                      ))}
                    <span className="ml-1 text-xs text-muted">
                      {ratingData
                        ? `${ratingData.averageRating.toFixed(1)} (${ratingData.reviewCount})`
                        : "No ratings"}
                    </span>
                  </div>
                </div>
              </div>

              {showMessageInput ? (
                <div className="w-full">
                  <div className="flex items-center rounded-lg bg-background p-2">
                    <input
                      type="text"
                      placeholder={`Message to ${item.user.name ?? "user"}...`}
                      className="flex-1 border-none bg-transparent text-xs text-foreground outline-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      autoFocus
                    />
                    <button
                      className={`rounded-full p-2 ${message.trim() ? "bg-primary" : "bg-[#3a3a3a]"}`}
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send
                        className={`h-3 w-3 ${message.trim() ? "text-black" : "text-muted"}`}
                      />
                    </button>
                  </div>
                  {sentMessage && (
                    <div className="mt-2 text-center text-xs text-primary">
                      Message sent to {item.user.name ?? "user"}!
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="flex items-center rounded-full bg-secondary px-3 py-1 text-xs text-foreground"
                  onClick={() => setShowMessageInput(true)}
                >
                  Message
                </button>
              )}
            </div>

            <button
              className={`w-full ${getButtonStyles()} flex items-center justify-center rounded-lg py-2 font-semibold transition-all duration-300`}
              onClick={handleSwapClick}
              disabled={swapStatus !== "ready"}
            >
              {getButtonIcon()}
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
