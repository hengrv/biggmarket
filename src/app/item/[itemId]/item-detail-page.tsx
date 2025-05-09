"use client";

import { useState } from "react";
import { MapPin, MessageSquare, Send } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function ItemDetailPage({ itemId }: { itemId: string }) {
  const router = useRouter();

  // Fetch the item details
  const { data: item, isLoading } = api.item.getItemById.useQuery(
    { id: itemId },
    {
      refetchOnWindowFocus: false,
    },
  );

  // Get current user ID for sending messages
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  // Fetch the item distance
  const { data: distance } = api.item.getItemDistance.useQuery(
    { itemId },
    {
      enabled: !!itemId,
      refetchOnWindowFocus: false,
    },
  );

  // Fetch user rating
  const { data: userRating } = api.user.getAverageRating.useQuery(
    { userId: item?.user.id ?? "" },
    { enabled: !!item?.user.id },
  );

  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState(false);

  // First, let's add a state for tracking delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add the delete item mutation
  const deleteItemMutation = api.item.deleteItem.useMutation({
    onSuccess: () => {
      router.push("/profile"); // Redirect to profile after deletion
    },
    onError: (error) => {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    },
  });

  // Check if the current user is the owner of the item
  const isOwner = item?.userId === currentUserId;

  // Add this function to handle item deletion
  const handleDeleteItem = () => {
    if (!item) return;

    deleteItemMutation.mutate({ id: item.id });
  };

  // Set up the send message mutation
  const sendMessageMutation = api.message.sendMessage.useMutation({
    onSuccess: () => {
      setSentMessage(true);
      setMessage("");

      // Reset the success message after a delay
      setTimeout(() => {
        setSentMessage(false);
        setShowMessageInput(false);
      }, 3000);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <AppShell
        title="Item Details"
        showBackButton={true}
        onBack={() => router.back()}
      >
        <div className="flex h-full items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c1ff72] border-t-transparent"></div>
        </div>
      </AppShell>
    );
  }

  if (!item) {
    return (
      <AppShell
        title="Item Details"
        showBackButton={true}
        onBack={() => router.back()}
      >
        <div className="p-4 text-center">
          <p className="text-muted">Item not found</p>
          <button
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-black"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim() || !currentUserId || !item.user.id) return;

    // Call the sendMessage mutation
    sendMessageMutation.mutate({
      senderId: currentUserId,
      receiverId: item.user.id,
      message: message,
    });
  };

  return (
    <AppShell
      title="Item Details"
      showBackButton={true}
      onBack={() => router.back()}
    >
      <div className="p-4">
        <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg">
          <Image
            src={item.images[0] ?? "/item-placeholder.svg"}
            alt={item.title}
            width={300}
            height={400}
            className="h-56 w-full object-cover"
            draggable={false}
          />

          <div className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {item.title}
              </h3>
              {distance ? (
                <div className="flex items-center rounded-full bg-background px-3 py-1">
                  <MapPin className="mr-1 h-3 w-3 text-primary" />
                  <span className="text-xs text-foreground">
                    {(distance / 1000).toFixed(1)} km
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <h4 className="mb-1 text-sm text-muted">Description</h4>
              <p className="text-sm text-foreground">{item.description}</p>
            </div>

            <div
              className="mb-4 flex cursor-pointer items-center justify-between rounded-lg bg-background p-3 transition-colors hover:bg-[#2a2a2a]"
              onClick={() => {
                router.push(`/profile/${item.user.id}`);
              }}
            >
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={item.user.image ?? "/profile-placeholder.svg"}
                    alt={item.user.name ?? ""}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <div className="font-semibold text-bm-white">
                    {item.user.name}
                  </div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < Math.floor(userRating?.averageRating ?? 0)
                              ? "text-bm-green"
                              : "text-[#3a3a3a]"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    <span className="ml-1 text-xs text-[#a9a9a9]">
                      {userRating?.averageRating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="mr-1 text-xs text-[#a9a9a9]">
                  View profile
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#c1ff72"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {isOwner ? (
              <div className="mb-4">
                {showDeleteConfirm ? (
                  <div className="rounded-lg bg-background p-4">
                    <p className="mb-4 text-center text-sm text-foreground">
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </p>
                    <div className="flex justify-between gap-2">
                      <button
                        className="flex-1 rounded-lg bg-secondary py-3 font-semibold text-foreground"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 rounded-lg bg-error py-3 font-semibold text-bm-black"
                        onClick={handleDeleteItem}
                        disabled={deleteItemMutation.isPending}
                      >
                        {deleteItemMutation.isPending
                          ? "Deleting..."
                          : "Delete Item"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="flex w-full items-center justify-center rounded-lg bg-error py-3 font-semibold text-bm-black"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Item
                  </button>
                )}
              </div>
            ) : (
              <>
                {showMessageInput ? (
                  <div className="mb-4">
                    <div className="flex items-center rounded-lg bg-background p-2">
                      <input
                        type="text"
                        placeholder={`Message to ${item.user.name}...`}
                        className="flex-1 border-none bg-transparent text-sm text-bm-white outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        autoFocus
                      />
                      <button
                        className={`rounded-full p-2 ${message.trim() ? "bg-[#c1ff72]" : "bg-[#3a3a3a]"}`}
                        onClick={handleSendMessage}
                        disabled={
                          !message.trim() || sendMessageMutation.isPending
                        }
                      >
                        <Send
                          className={`h-4 w-4 ${message.trim() ? "text-black" : "text-[#a9a9a9]"}`}
                        />
                      </button>
                    </div>
                    {sentMessage && (
                      <div className="mt-2 text-center text-xs text-[#c1ff72]">
                        Message sent to {item.user.name}!
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="flex w-full items-center justify-center rounded-lg bg-[#c1ff72] py-3 font-semibold text-black"
                    onClick={() => setShowMessageInput(true)}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Message {item.user.name}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
