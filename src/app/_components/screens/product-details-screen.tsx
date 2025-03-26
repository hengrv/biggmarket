"use client";

import { useState } from "react";
import { MapPin, MessageSquare, Send } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";

interface ProductOwner {
  name: string;
  image: string;
  rating: number;
}

interface Product {
  id?: number;
  name: string;
  image: string;
  distance: string;
  description: string;
  owner: ProductOwner;
}

export default function ProductDetailsScreen({
  product,
  setShowProductDetails,
}: {
  product: Product | null | undefined;
  setShowProductDetails: (show: boolean) => void;
}) {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  if (!product) {
    return (
      <AppShell
        title="Item Details"
        showBackButton={true}
        onBack={() => setShowProductDetails(false)}
      >
        <div className="p-4 text-center">
          <p className="text-muted">Product information not available</p>
          <button
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-black"
            onClick={() => setShowProductDetails(false)}
          >
            Go Back
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSentMessage(true);
      setMessage("");

      setTimeout(() => {
        setSentMessage(false);
        setShowMessageInput(false);
      }, 3000);
    }, 1000);
  };

  return (
    <AppShell
      title="Item Details"
      showBackButton={true}
      onBack={() => setShowProductDetails(false)}
    >
      <div className="p-4">
        <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg">
          <Image
            src={product.image || "/item-placeholder.svg"}
            alt={product.name}
            width={300}
            height={400}
            className="h-56 w-full object-cover"
            draggable={false}
          />

          <div className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {product.name}
              </h3>
              <div className="flex items-center rounded-full bg-background px-3 py-1">
                <MapPin className="mr-1 h-3 w-3 text-primary" />
                <span className="text-xs text-foreground">
                  {product.distance}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-1 text-sm text-muted">Description</h4>
              <p className="text-sm text-foreground">{product.description}</p>
            </div>

            <div
              className="mb-4 flex cursor-pointer items-center justify-between rounded-lg bg-background p-3 transition-colors hover:bg-[#2a2a2a]"
              onClick={() => {
                document.body.style.opacity = "0.5";
                setTimeout(() => {
                  alert(`Viewing ${product.owner.name}'s profile`);
                  document.body.style.opacity = "1";
                }, 300);
              }}
            >
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={product.owner.image || "/profile-placeholder.svg"}
                    alt={product.owner.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <div className="font-semibold text-[#f3f3f3]">
                    {product.owner.name}
                  </div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < Math.floor(product.owner.rating) ? "text-[#c1ff72]" : "text-[#3a3a3a]"}`}
                        >
                          ★
                        </span>
                      ))}
                    <span className="ml-1 text-xs text-[#a9a9a9]">
                      {product.owner.rating}
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

            {showMessageInput ? (
              <div className="mb-4">
                <div className="flex items-center rounded-lg bg-background p-2">
                  <input
                    type="text"
                    placeholder={`Message to ${product.owner.name}...`}
                    className="flex-1 border-none bg-transparent text-sm text-[#f3f3f3] outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    autoFocus
                  />
                  <button
                    className={`rounded-full p-2 ${message.trim() ? "bg-[#c1ff72]" : "bg-[#3a3a3a]"}`}
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                  >
                    <Send
                      className={`h-4 w-4 ${message.trim() ? "text-black" : "text-[#a9a9a9]"}`}
                    />
                  </button>
                </div>
                {sentMessage && (
                  <div className="mt-2 text-center text-xs text-[#c1ff72]">
                    Message sent to {product.owner.name}!
                  </div>
                )}
              </div>
            ) : (
              <button
                className="flex w-full items-center justify-center rounded-lg bg-[#c1ff72] py-3 font-semibold text-black"
                onClick={() => setShowMessageInput(true)}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Message {product.owner.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
