"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
        <Heart className="h-8 w-8 text-black" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-foreground">Forbidden</h1>
      <p className="mb-8 text-center text-sm text-muted">
        {"You don't have permission to access this resource"}
      </p>

      <Link
        href="/"
        className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-black"
      >
        Return Home
      </Link>
    </div>
  );
}
