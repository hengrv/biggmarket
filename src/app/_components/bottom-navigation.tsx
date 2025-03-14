"use client";

import { Home, Search, Heart, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface BottomNavigationProps {
  activeScreen?: string;
}

function BottomNavigation({ activeScreen = "home" }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-[72px] w-full items-center justify-around border-t border-[#242424] bg-[#1A1A1A] px-4">
      <Link
        href="/"
        className={`flex h-full w-16 flex-col items-center justify-center transition-colors duration-200 ${activeScreen === "home"
            ? "relative text-[#c1ff72] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
          }`}
      >
        <Home className="mb-0.5 h-6 w-6" />
        <span className="text-[10px]">Home</span>
      </Link>

      <Link
        href="/search"
        className={`flex h-full w-16 flex-col items-center justify-center transition-colors duration-200 ${activeScreen === "search"
            ? "relative text-[#c1ff72] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
          }`}
      >
        <Search className="mb-0.5 h-6 w-6" />
        <span className="text-[10px]">Search</span>
      </Link>

      <Link
        href="/swap"
        className={`flex h-full w-16 flex-col items-center justify-center transition-colors duration-200 ${activeScreen === "swap"
            ? "relative text-[#c1ff72] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
          }`}
      >
        <Heart className="mb-0.5 h-6 w-6" />
        <span className="text-[10px]">Wishlist</span>
      </Link>

      <Link
        href="/feed"
        className={`flex h-full w-16 flex-col items-center justify-center transition-colors duration-200 ${activeScreen === "feed"
            ? "relative text-[#c1ff72] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
          }`}
      >
        <MessageSquare className="mb-0.5 h-6 w-6" />
        <span className="text-[10px]">Feed</span>
      </Link>

      <Link
        href="/profile"
        className={`flex h-full w-16 flex-col items-center justify-center transition-colors duration-200 ${activeScreen === "profile"
            ? "relative text-[#c1ff72] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#c1ff72]"
            : "text-[#a9a9a9]"
          }`}
      >
        <User className="mb-0.5 h-6 w-6" />
        <span className="text-[10px]">Profile</span>
      </Link>
    </div>
  );
}

export default memo(BottomNavigation);
