"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2, Check, Send } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";

export default function WishlistItemScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
  const item = {
    id: 1,
    name: "Vintage Leather Jacket",
    image: "/item-placeholder.svg?height=300&width=400",
    distance: "3 miles away",
    description:
      "Genuine leather jacket from the 1980s. Some wear but in great condition overall. Size M, dark brown color.",
    owner: {
      name: "Alex",
      rating: 4.8,
      image: "/item-placeholder.svg?height=48&width=48",
    },
  };

  // Add state to track swap status
  const [swapStatus, setSwapStatus] = useState<
    "ready" | "pending" | "completed"
  >("ready");
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

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
  const handleSwapClick = () => {
    if (swapStatus === "ready") {
      setIsLoading(true);

      // Simulate network request
      setTimeout(() => {
        setIsLoading(false);
        setSwapStatus("pending");

        // Simulate other user accepting after some time
        setTimeout(() => {
          setSwapStatus("completed");

          // Navigate to past swaps after completion
          setTimeout(() => {
            setActiveSubScreen("past-orders");
          }, 1500);
        }, 3000);
      }, 1000);
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
    if (isLoading) return "Processing...";

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
    if (isLoading) return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;

    switch (swapStatus) {
      case "completed":
        return <Check className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <AppShell
      title="Wishlist Item"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="swap"
    >
      <div className="p-4">
        <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg">
          <Image
            src={item.image || "/item-placeholder.svg"}
            alt={item.name}
            width={400}
            height={300}
            className="h-56 w-full object-cover"
            draggable={false}
          />

          <div className="p-4">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              {item.name}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-foreground">{item.description}</p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-lg bg-background p-3">
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={item.owner.image || "/profle-placeholder.svg"}
                    alt={item.owner.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {item.owner.name}
                  </div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < Math.floor(item.owner.rating) ? "text-primary" : "text-[#3a3a3a]"}`}
                        >
                          ★
                        </span>
                      ))}
                    <span className="ml-1 text-xs text-muted">
                      {item.owner.rating}
                    </span>
                  </div>
                </div>
              </div>

              {showMessageInput ? (
                <div className="w-full">
                  <div className="flex items-center rounded-lg bg-background p-2">
                    <input
                      type="text"
                      placeholder={`Message to ${item.owner.name}...`}
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
                      disabled={!message.trim() || isSending}
                    >
                      <Send
                        className={`h-3 w-3 ${message.trim() ? "text-black" : "text-muted"}`}
                      />
                    </button>
                  </div>
                  {sentMessage && (
                    <div className="mt-2 text-center text-xs text-primary">
                      Message sent to {item.owner.name}!
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
              disabled={swapStatus !== "ready" || isLoading}
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
