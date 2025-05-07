"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AppShellProps {
  children: ReactNode;
  activeScreen?: string;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: ReactNode;
}

function AppShell({
  children,
  activeScreen = "home",
  title,
  showBackButton = false,
  onBack,
  rightContent,
}: AppShellProps) {
  return (
    <div className="w-full lg:w-1/3">
      <div className="mx-auto flex min-h-screen w-full flex-col bg-[#1a1a1a] text-[#f3f3f3]">
        {title && (
          <header className="flex w-full items-center border-b border-[#242424] p-4">
            {/* App logo */}
            <Link href="/" className="mr-4">
              <Image
                src="/logo.png"
                alt="BiggMarket Logo"
                width={32}
                height={32}
              />
            </Link>

            {/* Optional back button */}
            {showBackButton && (
              <button onClick={onBack} className="mr-3">
                <ArrowLeft className="h-6 w-6 text-[#f3f3f3]" />
              </button>
            )}

            {/* Title */}
            <div className="flex-1">
              <h1 className="text-xl font-bold">{title}</h1>
            </div>

            {rightContent}
          </header>
        )}
        <main className="flex-1 overflow-auto pb-16">{children}</main>
        <BottomNavigation activeScreen={activeScreen} />
      </div>
    </div>
  );
}

export default memo(AppShell);
