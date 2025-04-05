"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import Image from "next/image"
import { signIn } from "next-auth/react"

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1a1a1a] p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c1ff72]">
        <Heart className="h-8 w-8 text-black" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-[#f3f3f3]">BiggMarket</h1>
      <p className="mb-8 text-center text-sm text-[#a9a9a9]">Swap, don&apos;t shop. Reduce waste, find treasures.</p>

      <div className="relative mb-6 flex w-full items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative bg-[#1a1a1a] px-4">
          <span className="text-sm text-[#a9a9a9]">Continue with</span>
        </div>
      </div>

      {/* Google signin button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="mb-4 flex w-full items-center justify-center rounded-lg bg-[#242424] py-3 font-semibold text-[#f3f3f3]"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2 h-5 w-5"
            draggable={false}
          />
        )}
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  )
}

