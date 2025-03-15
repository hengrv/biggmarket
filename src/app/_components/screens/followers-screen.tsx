"use client"

import AppShell from "@components/app-shell"
import Image from "next/image"
import { UserPlus, Loader2 } from "lucide-react"
import { useFollow } from "~/hooks/useFollow"
import { api } from "~/trpc/react"

function FollowersScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void
}) {
  const [userProfile] = api.user.getProfile.useSuspenseQuery()
  const { useFollowers, useFollowActions } = useFollow()

  const { followers, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFollowers(
    userProfile?.id ?? "",
    10,
  )

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <AppShell
      title="Your Followers"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : followers.length === 0 ? (
          <div className="bg-secondary rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-foreground font-semibold mb-2">No followers yet</h3>
            <p className="text-muted text-sm">When people follow you, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {followers.map((user) => (
              <FollowerCard key={user.id} user={user} />
            ))}

            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="bg-secondary text-foreground rounded-lg px-4 py-2 text-sm flex items-center"
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function FollowerCard({ user }: { user: any }) {
  const { useFollowActions } = useFollow()
  const { isFollowing, isLoading, toggleFollow } = useFollowActions(user.id)

  return (
    <div className="bg-secondary flex items-center rounded-lg p-4 shadow-lg">
      <div className="mr-4 h-14 w-14 overflow-hidden rounded-full">
        <Image
          src={user.image || "/placeholder.svg?height=56&width=56"}
          alt={user.name || user.email || "User"}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="text-foreground font-semibold">{user.name || user.email}</div>
        <div className="text-muted text-xs">{user.email}</div>
        <div className="text-muted mt-1 line-clamp-1 text-xs">
          Followed you {new Date(user.followedAt).toLocaleDateString()}
        </div>
      </div>

      <button
        className={`${isFollowing ? "bg-secondary text-foreground border border-[#3a3a3a]" : "bg-[#c1ff72] text-black"} flex items-center rounded-full px-3 py-1 text-xs font-medium`}
        onClick={toggleFollow}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isFollowing ? (
          "Following"
        ) : (
          <>
            <UserPlus className="mr-1 h-3 w-3" /> Follow
          </>
        )}
      </button>
    </div>
  )
}

export default FollowersScreen

