"use client";

import type React from "react";
import { useState } from "react";
import { Heart, LogIn, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginScreen({
  setActiveScreen,
  handleLogin,
}: {
  setActiveScreen: (screen: string) => void;
  handleLogin: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1a1a1a] p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c1ff72]">
        <Heart className="h-8 w-8 text-black" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-[#f3f3f3]">BiggMarket</h1>
      <p className="mb-8 text-center text-sm text-[#a9a9a9]">
        Swap, don&apos;t shop. Reduce waste, find treasures.
      </p>

      <div className="relative mb-6 flex w-full items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3a3a3a]"></div>
        </div>
        <div className="relative bg-[#1a1a1a] px-4">
          <span className="text-sm text-[#a9a9a9]">Continue with</span>
        </div>
      </div>

      {/* Google signin button */}
      <Link
        href="/api/auth/signin"
        className="mb-4 flex w-full items-center justify-center rounded-lg bg-[#242424] py-3 font-semibold text-[#f3f3f3]"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google"
          width={20}
          height={20}
          className="mr-2 h-5 w-5"
          draggable={false}
        />
        Sign in
      </Link>

      <p className="text-sm text-[#a9a9a9]">
        Don&apos;t have an account?{" "}
        <link className="font-semibold text-[#c1ff72]" href="s">
          Sign up
        </link>
      </p>
    </div>
  );
}
