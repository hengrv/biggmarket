"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MapPin, Eye, X, Check, AlertTriangle } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"


interface ProductOwner {
  name: string
  rating: number
  image: string
}

interface Product {
  id: number
  name: string
  image: string
  distance: string
  description: string
  owner: ProductOwner
}

export default function ProductScreen({
  setShowProductDetails,
  setCurrentProduct,
}: {
  setShowProductDetails: (show: boolean) => void
  setCurrentProduct: (product: Product) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Men's Button Up",
      image: "/placeholder.svg?height=400&width=300",
      distance: "4 miles away",
      description:
        "Stylish men's button-up shirt in excellent condition. Size M, blue color with subtle pattern. Perfect for casual or semi-formal occasions.",
      owner: {
        name: "Jacob",
        rating: 4.5,
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 2,
      name: "Vintage Chair",
      image: "/placeholder.svg?height=400&width=300",
      distance: "2 miles away",
      description:
        "Beautiful vintage wooden chair from the 1970s. Some minor wear but structurally sound. Would look great in any living room or study.",
      owner: {
        name: "Katie",
        rating: 5,
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 3,
      name: "Leather Boots",
      image: "/placeholder.svg?height=400&width=300",
      distance: "6 miles away",
      description:
        "Genuine leather boots, size UK 9. Worn only a few times, in great condition. Water-resistant and perfect for autumn/winter.",
      owner: {
        name: "Sam",
        rating: 4,
        image: "/placeholder.svg?height=40&width=40",
      },
    },
  ])

  const cardRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const swipeThreshold = 100

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === 0) return
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - startX
    setOffsetX(diff)

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`
    }
  }

  const handleTouchEnd = () => {
    if (cardRef.current) {
      if (offsetX > swipeThreshold) {
        
        cardRef.current.style.transform = `translateX(1000px) rotate(30deg)`
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % products.length)
          setOffsetX(0)
        }, 300)
      } else if (offsetX < -swipeThreshold) {
        
        cardRef.current.style.transform = `translateX(-1000px) rotate(-30deg)`
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % products.length)
          setOffsetX(0)
        }, 300)
      } else {
        
        cardRef.current.style.transform = `translateX(0) rotate(0)`
        setOffsetX(0)
      }
    }
    setStartX(0)
  }

  const handleButtonClick = (dir: string) => {
    if (cardRef.current) {
      if (dir === "right") {
        cardRef.current.style.transform = `translateX(1000px) rotate(30deg)`
      } else if (dir === "left") {
        cardRef.current.style.transform = `translateX(-1000px) rotate(-30deg)`
      } else {
        cardRef.current.style.transform = `translateX(0) rotate(0)`
      }

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length)
        setOffsetX(0)
      }, 300)
    }
  }

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(0) rotate(0)`
    }
  }, [cardRef, currentIndex])

  const product = products[currentIndex]

  const handleViewDetails = () => {
    setCurrentProduct(product)
    setShowProductDetails(true)
  }

  return (
    <AppShell activeScreen="home" title="Hiya John!">
      <div className="p-4">
        <div
          ref={cardRef}
          className="bg-[#242424] rounded-lg overflow-hidden mb-3 transition-transform duration-300 ease-out shadow-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div className="relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 flex items-center">
              <MapPin className="w-3 h-3 text-[#c1ff72] mr-1" />
              <span className="text-white text-xs">{product.distance}</span>
            </div>
          </div>

          <div className="p-3">
            <h2 className="text-[#f3f3f3] text-lg font-bold">{product.name}</h2>
            <div className="flex items-center mt-1">
              <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                <Image
                  src={product.owner.image || "/placeholder.svg"}
                  alt={product.owner.name}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[#a9a9a9] text-xs">
                {product.owner.name} • {product.owner.rating} ★
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <button
            className="flex-1 bg-[#242424] rounded-full px-3 py-2 text-[#f3f3f3] text-sm flex items-center justify-center mr-3 hover:bg-[#2a2a2a] transition-colors"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 text-[#c1ff72] mr-1" />
            View Details
          </button>

          <button
            className="flex-1 bg-[#242424] rounded-full px-3 py-2 text-[#f3f3f3] text-sm flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
            onClick={() => {
              
              const reason = window.prompt(
                "Please select a reason for reporting this item:\n\n1. Prohibited item\n2. Inappropriate content\n3. Suspected scam\n4. Other",
              )

              if (reason) {
                
                alert("Thank you for your report. Our team will review this item.")


                console.log("Item reported:", product.name, "Reason:", reason)
              }
            }}
          >
            <AlertTriangle className="w-4 h-4 text-[#ff4b55] mr-1" />
            Report
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center shadow-lg hover:bg-[#2a2a2a] transition-colors"
            onClick={() => handleButtonClick("left")}
          >
            <X className="w-7 h-7 text-[#4c9bb0]" />
          </button>

          <button
            className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center shadow-lg hover:bg-[#2a2a2a] transition-colors"
            onClick={() => handleButtonClick("right")}
          >
            <Check className="w-7 h-7 text-[#ff4b55]" />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
