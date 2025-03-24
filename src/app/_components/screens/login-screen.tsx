"use client"

import type React from "react"
import { useState } from "react"
import { Heart, LogIn, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginScreen({
  setActiveScreen,
  handleLogin,
}: {
  setActiveScreen: (screen: string) => void
  handleLogin: () => void
}) {
    
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#1a1a1a]">
      <div className="w-16 h-16 rounded-full bg-[#c1ff72] flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-black" />
      </div>

      <h1 className="text-[#f3f3f3] text-3xl font-bold mb-2">BiggMarket</h1>
      <p className="text-[#a9a9a9] text-sm mb-8 text-center">Swap, don&apos;t shop. Reduce waste, find treasures.</p>

      <div className="relative w-full flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative px-4 bg-[#1a1a1a]">
          <span className="text-[#a9a9a9] text-sm">Continue with</span>
        </div>
      </div>

      {/* Google signin button */}
        <Link
        href="/api/auth/signin"
        className="w-full bg-[#242424] text-[#f3f3f3] font-semibold rounded-lg py-3 mb-4 flex items-center justify-center"
        >
        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" width={20} height={20} className="w-5 h-5 mr-2" />
        Sign in
        </Link>
        

        <p className="text-[#a9a9a9] text-sm">
            Don&apos;t have an account?{" "}
            <button className="text-[#c1ff72] font-semibold" onClick={() => setActiveScreen("signup")}>
                Sign up
            </button>
        </p>
    </div>
  )
}
