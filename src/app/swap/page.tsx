"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Heart, ChevronRight, Plus, X, Camera, Loader2, Upload, Check, Send } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"

export default function SwapPage() {
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null)

  if (activeSubScreen === "wishlist-item") {
    return <WishlistItemScreen setActiveSubScreen={setActiveSubScreen} />
  }

  if (activeSubScreen === "past-orders") {
    return <SwapsHistoryScreen setActiveSubScreen={setActiveSubScreen} />
  }

  if (activeSubScreen === "sell") {
    return <SellItemScreen setActiveSubScreen={setActiveSubScreen} />
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
            SELL
            <Plus className="ml-1 h-4 w-4" />
          </button>
        </div>

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

          <div className="scrollbar-hide flex space-x-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-32 flex-shrink-0 overflow-hidden rounded-lg bg-background shadow-md"
              >
                <Image
                  src={`/placeholder.svg?height=100&width=80`}
                  alt={`Past swap ${item}`}
                  width={80}
                  height={100}
                  className="h-24 w-full object-cover"
                  draggable={false}
                />
                <div className="p-2">
                  <div className="truncate text-xs font-semibold text-foreground">
                    Item {item}
                  </div>
                  <div className="text-xs text-muted">2 weeks ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-secondary p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center font-semibold text-foreground">
              <Heart className="mr-2 h-4 w-4 text-primary" />
              Wishlist Matches
            </h3>
            <div className="rounded-full bg-background px-2 py-1 text-xs text-primary">
              4 matches
            </div>
          </div>

          <div className="scrollbar-hide flex space-x-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-background shadow-md"
                onClick={() => setActiveSubScreen("wishlist-item")}
              >
                <div className="relative">
                  <Image
                    src={`/placeholder.svg?height=120&width=160`}
                    alt={`Wishlist item ${item}`}
                    width={160}
                    height={120}
                    className="h-32 w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                    {item * 2} mi
                  </div>
                </div>
                <div className="p-2">
                  <div className="truncate text-sm font-semibold text-foreground">
                    Wishlist Item {item}
                  </div>
                  <div className="mt-1 flex items-center">
                    <div className="mr-1 h-4 w-4 overflow-hidden rounded-full">
                      <Image
                        src="/placeholder.svg?height=16&width=16"
                        alt="Owner"
                        width={16}
                        height={16}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <span className="text-xs text-muted">User {item}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function WishlistItemScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const item = {
    id: 1,
    name: "Vintage Leather Jacket",
    image: "/placeholder.svg?height=300&width=400",
    distance: "3 miles away",
    description:
      "Genuine leather jacket from the 1980s. Some wear but in great condition overall. Size M, dark brown color.",
    owner: {
      name: "Alex",
      rating: 4.8,
      image: "/placeholder.svg?height=48&width=48",
    },
  }

  // Add state to track swap status
  const [swapStatus, setSwapStatus] = useState<"ready" | "pending" | "completed">("ready")
  const [isLoading, setIsLoading] = useState(false)
  const [showMessageInput, setShowMessageInput] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentMessage, setSentMessage] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsSending(true)

    // Simulate sending a message
    setTimeout(() => {
      setIsSending(false)
      setSentMessage(true)
      setMessage("")

      // Reset the success message after a delay
      setTimeout(() => {
        setSentMessage(false)
        setShowMessageInput(false)
      }, 3000)
    }, 1000)
  }

  // Handle swap button click
  const handleSwapClick = () => {
    if (swapStatus === "ready") {
      setIsLoading(true)

      // Simulate network request
      setTimeout(() => {
        setIsLoading(false)
        setSwapStatus("pending")

        // Simulate other user accepting after some time
        setTimeout(() => {
          setSwapStatus("completed")

          // Navigate to past swaps after completion
          setTimeout(() => {
            setActiveSubScreen("past-orders")
          }, 1500)
        }, 3000)
      }, 1000)
    }
  }

  
  const getButtonStyles = () => {
    switch (swapStatus) {
      case "ready":
        return "bg-[#c1ff72] text-black"
      case "pending":
        return "bg-[#3a3a3a] text-[#a9a9a9]"
      case "completed":
        return "bg-[#4c9bb0] text-white"
    }
  }

  // Get button text based on status
  const getButtonText = () => {
    if (isLoading) return "Processing..."

    switch (swapStatus) {
      case "ready":
        return "Swap Now"
      case "pending":
        return "Swap Pending"
      case "completed":
        return "Swapped!"
    }
  }

  // Get button icon based on status
  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin mr-2" />

    switch (swapStatus) {
      case "completed":
        return <Check className="w-5 h-5 mr-2" />
      default:
        return null
    }
  }

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
            src={item.image || "/placeholder.svg"}
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
                    src={item.owner.image || "/placeholder.svg"}
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

function SwapsHistoryScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const swaps = [
    {
      id: 1,
      name: "Vintage Chair",
      status: "Completed",
      date: "May 15, 2023",
      image: "/placeholder.svg?height=60&width=60",
      with: "Katie",
    },
    {
      id: 2,
      name: "Blue T-Shirt",
      status: "Completed",
      date: "Apr 22, 2023",
      image: "/placeholder.svg?height=60&width=60",
      with: "Jacob",
    },
    {
      id: 3,
      name: "Leather Boots",
      status: "Cancelled",
      date: "Mar 10, 2023",
      image: "/placeholder.svg?height=60&width=60",
      with: "Sam",
    },
    {
      id: 4,
      name: "Desk Lamp",
      status: "Completed",
      date: "Feb 5, 2023",
      image: "/placeholder.svg?height=60&width=60",
      with: "Emily",
    },
  ]

  
  useEffect(() => {
    // This would typically check some state or URL parameter
    // to determine if we're coming from a completed swap
  }, [])

  return (
    <AppShell title="Swaps History" showBackButton={true} onBack={() => setActiveSubScreen(null)} activeScreen="swap">
      <div className="p-4">
        <div className="space-y-4">
          {[
            {
              id: 0,
              name: "Vintage Leather Jacket",
              status: "Completed",
              date: "Just now",
              image: "/placeholder.svg?height=300&width=400",
              with: "Alex",
            },
            ...swaps,
          ].map((swap) => (
            <div
              key={swap.id}
              className="flex items-center bg-secondary p-4 rounded-lg shadow-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
              onClick={() => {
                
                alert(`Viewing details for ${swap.name} swap with ${swap.with}`)
              }}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <Image
                  src={swap.image || "/placeholder.svg"}
                  alt={swap.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">{swap.name}</div>
                <div className="text-muted text-xs">Swapped with {swap.with}</div>
                <div className="text-muted text-xs">{swap.date}</div>
                <div
                  className={`text-xs mt-1 ${swap.status === "Completed" ? "text-primary" : "text-red-400"} font-medium`}
                >
                  {swap.status}
                </div>
              </div>

              <button className="bg-background rounded-full p-2">
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function SellItemScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Furniture")
  const [condition, setCondition] = useState("New")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddImage = () => {
    // Simulate adding an image
    const newImage = `/placeholder.svg?height=${200 + Math.floor(Math.random() * 100)}&width=${200 + Math.floor(Math.random() * 100)}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsLoading(false)
      setActiveSubScreen(null)
    }, 1500)
  }

  return (
    <AppShell title="Sell an Item" showBackButton={true} onBack={() => setActiveSubScreen(null)} activeScreen="swap">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-muted text-xs block mb-1">Item Photos (required)</label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Item photo ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  className="aspect-square bg-secondary border-2 border-dashed border-[#3a3a3a] rounded-lg flex flex-col items-center justify-center"
                  onClick={handleAddImage}
                >
                  <Camera className="w-6 h-6 text-primary mb-1" />
                  <span className="text-muted text-xs">Add Photo</span>
                </button>
              )}
            </div>
            {images.length === 0 && <p className="text-red-400 text-xs">At least one photo is required</p>}
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Item Name (required)</label>
            <input
              type="text"
              placeholder="e.g. Vintage Chair"
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Description</label>
            <textarea
              placeholder="Describe your item..."
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted text-xs block mb-1">Category</label>
              <select
                className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary appearance-none"
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
              <label className="text-muted text-xs block mb-1">Condition</label>
              <select
                className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary appearance-none"
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
            className="w-full bg-primary text-black font-semibold rounded-lg py-3 mt-4 flex items-center justify-center"
            disabled={isLoading || images.length === 0 || !itemName}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
            {isLoading ? "Listing..." : "List Item"}
          </button>
        </form>
      </div>
    </AppShell>
  )
}



