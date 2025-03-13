"use client"

import type React from "react"

import { useState } from "react"
import { Heart, LogIn, Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginScreen({
  setActiveScreen,
  handleLogin,
}: {
  setActiveScreen: (screen: string) => void
  handleLogin: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

  
    setTimeout(() => {
      setIsLoading(false)
      handleLogin()
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#1a1a1a]">
      <div className="w-16 h-16 rounded-full bg-[#c1ff72] flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-black" />
      </div>

      <h1 className="text-[#f3f3f3] text-3xl font-bold mb-2">BiggMarket</h1>
      <p className="text-[#a9a9a9] text-sm mb-8 text-center">Swap, don&apos;t shop. Reduce waste, find treasures.</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
        <div>
          <label className="text-[#a9a9a9] text-xs block mb-1">Email or Phone</label>
          <input
            type="text"
            className="w-full bg-[#242424] text-[#f3f3f3] rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email or phone"
          />
        </div>

        <div>
          <label className="text-[#a9a9a9] text-xs block mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-[#242424] text-[#f3f3f3] rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#c1ff72] text-black font-semibold rounded-lg py-3 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="relative w-full flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative px-4 bg-[#1a1a1a]">
          <span className="text-[#a9a9a9] text-sm">Or continue with</span>
        </div>
      </div>

      <button className="w-full bg-[#242424] text-[#f3f3f3] font-semibold rounded-lg py-3 mb-4 flex items-center justify-center">
        <Image src="/placeholder.svg?height=20&width=20" alt="Google" width={20} height={20} className="w-5 h-5 mr-2" />
        Google
      </button>

      <p className="text-[#a9a9a9] text-sm">
        Don&apos;t have an account?{" "}
        <button className="text-[#c1ff72] font-semibold" onClick={() => setActiveScreen("signup")}>
          Sign up
        </button>
      </p>
    </div>
  )
}
