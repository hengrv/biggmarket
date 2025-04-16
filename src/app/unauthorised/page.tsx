"use client"

import { Heart } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Heart className="h-8 w-8 text-black" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-foreground">Unauthorized</h1>
      <p className="mb-8 text-center text-sm text-muted">You need to be logged in to access this page</p>

      <Link
        href="/login"
        className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-black"
      >
        Go to Login
      </Link>
    </div>
  )
}

