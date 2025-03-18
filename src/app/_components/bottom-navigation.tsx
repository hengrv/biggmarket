"use client"

import { Home, Heart, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export default function BottomNavigation({
  activeScreen = "home",
}: {
  activeScreen?: string
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#242424] flex justify-around items-center h-[72px] px-4 w-full">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center h-full w-1/4 transition-colors duration-200 ${
          activeScreen === "home"
            ? "text-[#c1ff72] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
        }`}
      >
        <Home className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Home</span>
      </Link>

     {/* <Link
        href="/search"
        className={`flex flex-col items-center justify-center h-full w-16 transition-colors duration-200 ${
          activeScreen === "search"
            ? "text-[#c1ff72] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
        }`}
      >
        <Search className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Search</span>
      </Link> */}

      <Link
        href="/swap"
        className={`flex flex-col items-center justify-center h-full w-1/4 transition-colors duration-200 ${
          activeScreen === "swap"
            ? "text-[#c1ff72] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
        }`}
      >
        <Heart className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Wishlist</span>
      </Link>

      <Link
        href="/feed"
        className={`flex flex-col items-center justify-center h-full w-1/4 transition-colors duration-200 ${
          activeScreen === "feed"
            ? "text-[#c1ff72] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
        }`}
      >
        <MessageSquare className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Feed</span>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center h-full w-1/4 transition-colors duration-200 ${
          activeScreen === "profile"
            ? "text-[#c1ff72] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
        }`}
      >
        <User className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Profile</span>
      </Link>
    </div>
  )
}
