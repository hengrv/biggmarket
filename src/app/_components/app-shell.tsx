"use client"

import type { ReactNode } from "react"
import BottomNavigation from "@/components/bottom-navigation"
import { ArrowLeft } from "lucide-react"

export default function AppShell({
  children,
  activeScreen = "home",
  title,
  showBackButton = false,
  onBack,
  rightContent,
}: {
  children: ReactNode
  activeScreen?: string
  title?: string
  showBackButton?: boolean
  onBack?: () => void
  rightContent?: ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-[#f3f3f3]">
      {title && (
        <header className="p-4 flex items-center border-b border-[#242424]">
          {showBackButton && (
            <button onClick={onBack} className="mr-3">
              <ArrowLeft className="w-6 h-6 text-[#f3f3f3]" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          {rightContent}
        </header>
      )}
      <main className="flex-1 pb-16 overflow-auto">{children}</main>
      <BottomNavigation activeScreen={activeScreen} />
    </div>
  )
}
