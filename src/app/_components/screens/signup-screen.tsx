"use client";

import type React from "react";

import { useState } from "react";
import { Heart, UserPlus, Loader2 } from "lucide-react";
import Image from "next/image";

export default function SignupScreen({
  setActiveScreen,
  handleLogin,
}: {
  setActiveScreen: (screen: string) => void;
  handleLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      handleLogin();
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Heart className="h-8 w-8 text-black" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Join BiggMarket
      </h1>
      <p className="mb-8 text-center text-sm text-muted">
        Create an account to start swapping
      </p>

      <form onSubmit={handleSubmit} className="mb-6 w-full space-y-4">
        <div>
          <label className="mb-1 block text-xs text-muted">Full Name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-black"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="relative mb-6 flex w-full items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative bg-background px-4">
          <span className="text-sm text-muted">Or continue with</span>
        </div>
      </div>

      <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-secondary py-3 font-semibold text-foreground">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google"
          width={20}
          height={20}
          className="mr-2 h-5 w-5"
          draggable={false}
        />
        Google
      </button>

      <p className="text-sm text-muted">
        Already have an account?{" "}
        <button
          className="font-semibold text-primary"
          onClick={() => setActiveScreen("login")}
        >
          Log in
        </button>
      </p>
    </div>
  );
}
