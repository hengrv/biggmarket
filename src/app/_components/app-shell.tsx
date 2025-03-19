"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-[#f3f3f3]">
      {title && (
        <header className="flex items-center border-b border-[#242424] p-4">
          {showBackButton && (
            <button onClick={onBack} className="mr-3">
              <ArrowLeft className="h-6 w-6 text-[#f3f3f3]" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          {rightContent}
        </header>
      )}
      <main className="flex-1 overflow-auto pb-16">{children}</main>
      <BottomNavigation activeScreen={activeScreen} />
    </div>
  );
}

export default memo(AppShell);
