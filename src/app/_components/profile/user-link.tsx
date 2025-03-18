"use client"

import Link from "next/link"
import Image from "next/image"
import { api } from "~/trpc/react"

interface UserLinkProps {
  userId: string
  className?: string
  showImage?: boolean
  imageSize?: number
  useUsername?: boolean // New prop to control link format
}

export default function UserLink({
  userId,
  className = "",
  showImage = true,
  imageSize = 24,
  useUsername = false, // Default to using ID
}: UserLinkProps) {
  const { data: user, isLoading } = api.user.getProfile.useQuery(
    { userId },
    {
      enabled: !!userId,
    },
  )

  if (isLoading) {
    return <span className={`text-muted ${className}`}>Loading...</span>
  }

  if (!user) {
    return <span className={`text-muted ${className}`}>Unknown User</span>
  }

  // Generate the profile link based on the useUsername prop
  const profileLink = useUsername && user.username ? `/profile/@${user.username}` : `/profile/${user.id}`

  return (
    <Link href={profileLink} className={`flex items-center ${className}`}>
      {showImage && (
        <div className="mr-2 overflow-hidden rounded-full" style={{ width: imageSize, height: imageSize }}>
          <Image
            src={user.image ?? "/placeholder.svg"}
            alt={user.name ?? "User"}
            width={imageSize}
            height={imageSize}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <span className="text-foreground hover:text-primary transition-colors">{user.name ?? user.email ?? "User"}</span>
    </Link>
  )
}

