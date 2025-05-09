"use client"

import { useState } from "react"
import { MapPin, MessageSquare, Send } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"

interface ProductOwner {
  name: string
  image: string
  rating: number
}

interface Product {
  id?: number
  name: string
  image: string
  distance: string
  description: string
  owner: ProductOwner
}

export default function ProductDetailsScreen({
  product,
  setShowProductDetails,
}: {
  product: Product | null | undefined
  setShowProductDetails: (show: boolean) => void
}) {
  const [showMessageInput, setShowMessageInput] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentMessage, setSentMessage] = useState(false)

  
  if (!product) {
    return (
      <AppShell title="Item Details" showBackButton={true} onBack={() => setShowProductDetails(false)}>
        <div className="p-4 text-center">
          <p className="text-muted">Product information not available</p>
          <button
            className="mt-4 bg-primary text-black px-4 py-2 rounded-lg"
            onClick={() => setShowProductDetails(false)}
          >
            Go Back
          </button>
        </div>
      </AppShell>
    )
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
      setSentMessage(true)
      setMessage("")

      setTimeout(() => {
        setSentMessage(false)
        setShowMessageInput(false)
      }, 3000)
    }, 1000)
  }

  return (
    <AppShell title="Item Details" showBackButton={true} onBack={() => setShowProductDetails(false)}>
      <div className="p-4">
        <div className="bg-secondary rounded-lg overflow-hidden mb-4 shadow-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-56 object-cover"
          />

          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-foreground text-xl font-bold">{product.name}</h3>
              <div className="flex items-center bg-background rounded-full px-3 py-1">
                <MapPin className="w-3 h-3 text-primary mr-1" />
                <span className="text-foreground text-xs">{product.distance}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-muted text-sm mb-1">Description</h4>
              <p className="text-foreground text-sm">{product.description}</p>
            </div>

            <div
              className="flex items-center justify-between mb-4 bg-background rounded-lg p-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
              onClick={() => {

                document.body.style.opacity = "0.5"
                setTimeout(() => {
                  alert(`Viewing ${product.owner.name}'s profile`)
                  document.body.style.opacity = "1"
                }, 300)
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={product.owner.image || "/placeholder.svg"}
                    alt={product.owner.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[#f3f3f3] font-semibold">{product.owner.name}</div>
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
                    <span className="text-[#a9a9a9] text-xs ml-1">{product.owner.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-[#a9a9a9] text-xs mr-1">View profile</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className="flex items-center bg-background rounded-lg p-2">
                  <input
                    type="text"
                    placeholder={`Message to ${product.owner.name}...`}
                    className="flex-1 bg-transparent border-none outline-none text-[#f3f3f3] text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    autoFocus
                  />
                  <button
                    className={`p-2 rounded-full ${message.trim() ? "bg-[#c1ff72]" : "bg-[#3a3a3a]"}`}
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                  >
                    <Send className={`w-4 h-4 ${message.trim() ? "text-black" : "text-[#a9a9a9]"}`} />
                  </button>
                </div>
                {sentMessage && (
                  <div className="text-[#c1ff72] text-xs mt-2 text-center">Message sent to {product.owner.name}!</div>
                )}
              </div>
            ) : (
              <button
                className="w-full bg-[#c1ff72] text-black font-semibold rounded-lg py-3 flex items-center justify-center"
                onClick={() => setShowMessageInput(true)}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Message {product.owner.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
