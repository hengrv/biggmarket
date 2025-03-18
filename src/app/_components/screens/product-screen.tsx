"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MapPin, Eye, X, Check, AlertTriangle, Filter } from "lucide-react"
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
  category: string // added category 
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) //category
  const [showCategoryFilter, setShowCategoryFilter] = useState(false) //category 
  // Categories list
    const categories = [
      "Electronics & Tech",
      "Fashion & Apparel",
      "Home & Living",
      "Health & Beauty",
      "Sports & Outdoors",
      "Kids & Baby",
      "Automotive & Tools",
      "Books & Entertainment",
      "Pet Supplies",
      "Cooking Supplies",
    ]
  
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Men's Button Up",
      image: "/placeholder.svg?height=400&width=300",
      distance: "4 miles away",
      category: "Fashion & Apparel",
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
      category: "Home & Living",
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
      category: "Clothing & Apparel",
      description:
        "Genuine leather boots, size UK 9. Worn only a few times, in great condition. Water-resistant and perfect for autumn/winter.",
      owner: {
        name: "Sam",
        rating: 4,
        image: "/placeholder.svg?height=40&width=40",
      },
    },
  ])
  // filter products based on category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  // reset index
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

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
          setCurrentIndex((prev) => (prev + 1) % filteredProducts.length) 
          setOffsetX(0)
        }, 300)
      } else if (offsetX < -swipeThreshold) {
        
        cardRef.current.style.transform = `translateX(-1000px) rotate(-30deg)`
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % filteredProducts.length)
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
        setCurrentIndex((prev) => (prev + 1) % filteredProducts.length)
        setOffsetX(0)
      }, 300)
    }
  }

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(0) rotate(0)`
    }
  }, [cardRef, currentIndex])
   // category filtering 
   if (filteredProducts.length === 0) {
    return (
      <AppShell activeScreen="home" title="Hiya John!">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Find Items</h2>
            <button
              className="bg-[#242424] rounded-full p-2"
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <Filter className="w-5 h-5 text-[#c1ff72]" />
            </button>
          </div>

          {showCategoryFilter && (
            <div className="mb-6 bg-[#242424] p-3 rounded-lg shadow-lg animate-in fade-in duration-200">
              <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedCategory === null ? "bg-[#c1ff72] text-black" : "bg-[#1a1a1a] text-[#f3f3f3]"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedCategory === category ? "bg-[#c1ff72] text-black" : "bg-[#1a1a1a] text-[#f3f3f3]"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#242424] rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#c1ff72]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-[#a9a9a9] text-sm mb-4">
              There are no items in the {selectedCategory} category right now.
            </p>
            <button
              className="bg-[#c1ff72] text-black font-medium rounded-lg py-2 px-4"
              onClick={() => setSelectedCategory(null)}
            >
              View All Items
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  //const product = products[currentIndex]
  const product = filteredProducts[currentIndex]

  const handleViewDetails = () => {
    setCurrentProduct(product)
    setShowProductDetails(true)
  }

  return (
    <AppShell activeScreen="home" title="Hiya John!">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Find Items</h2>
          <button className="bg-[#242424] rounded-full p-2" onClick={() => setShowCategoryFilter(!showCategoryFilter)}>
            <Filter className="w-5 h-5 text-[#c1ff72]" />
          </button>
        </div>

        {showCategoryFilter && (
          <div className="mb-6 bg-[#242424] p-3 rounded-lg shadow-lg animate-in fade-in duration-200">
            <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              <button
                className={`px-3 py-1 rounded-full text-xs ${
                  selectedCategory === null ? "bg-[#c1ff72] text-black" : "bg-[#1a1a1a] text-[#f3f3f3]"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedCategory === category ? "bg-[#c1ff72] text-black" : "bg-[#1a1a1a] text-[#f3f3f3]"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

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
              alt=""
              width={300}
              height={400}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-1 left-2 bg-black/50 rounded-full px-3 py-1 flex items-center">
              <MapPin className="w-3 h-3 text-[#c1ff72] mr-1" />
              <span className="text-white text-xs">{product.distance}</span>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-1">
              <span className="text-white text-xs">{product.category}</span>
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
            <X className="w-7 h-7 text-[#f93030]" />
          </button>

          <button
            className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center shadow-lg hover:bg-[#2a2a2a] transition-colors"
            onClick={() => handleButtonClick("right")}
          >
            <Check className="w-7 h-7 text-[#6efa73]" />
          </button>
        </div>
      </div>
    </AppShell>
  )
}