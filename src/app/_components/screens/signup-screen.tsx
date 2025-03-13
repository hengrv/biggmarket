"use client"

import type React from "react"

import { useState } from "react"
import { Heart, UserPlus, Loader2 } from "lucide-react"
import Image from "next/image"

export default function SignupScreen({
  setActiveScreen,
  handleLogin,
}: {
  setActiveScreen: (screen: string) => void
  handleLogin: () => void
}) {
  const [name, setName] = useState("")
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
    <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-black" />
      </div>

      <h1 className="text-foreground text-3xl font-bold mb-2">Join BiggMarket</h1>
      <p className="text-muted text-sm mb-8 text-center">Create an account to start swapping</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
        <div>
          <label className="text-muted text-xs block mb-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-muted text-xs block mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-muted text-xs block mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-black font-semibold rounded-lg py-3 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="relative w-full flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative px-4 bg-background">
          <span className="text-muted text-sm">Or continue with</span>
        </div>
      </div>

      <button className="w-full bg-secondary text-foreground font-semibold rounded-lg py-3 mb-4 flex items-center justify-center">
        <Image src="/placeholder.svg?height=20&width=20" alt="Google" width={20} height={20} className="w-5 h-5 mr-2" />
        Google
      </button>

      <p className="text-muted text-sm">
        Already have an account?{" "}
        <button className="text-primary font-semibold" onClick={() => setActiveScreen("login")}>
          Log in
        </button>
      </p>
    </div>
  )
}
