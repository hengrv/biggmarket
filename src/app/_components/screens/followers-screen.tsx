"use client";

import type React from "react";

import AppShell from "@components/app-shell";
import { Loader2 } from "lucide-react";
import { useFollow } from "@hooks/useFollow";
import { api } from "~/trpc/react";

import FollowerCard from "@components/profile/follower-card";

function FollowersScreen({
  setActiveSubScreen,
  userId,
}: {
  setActiveSubScreen: (screen: string | null) => void;
  userId?: string;
}) {
  const [userProfile] = api.user.getProfile.useSuspenseQuery(
    userId ? { userId } : undefined,
  );
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();
  const { useFollowers } = useFollow();

  const isOwnProfile = !userId || userId === currentUserId;

  // Get the name of the user whose followers list we're viewing
  const titlePrefix = isOwnProfile
    ? "Your"
    : `${userProfile?.name ?? "User"}'s`;

  const {
    followers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowers(userId ?? userProfile?.id ?? "", 10);

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  return (
    <AppShell
      title={`${titlePrefix} Followers`}
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
          <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
            <h3 className="mb-2 font-semibold text-foreground">
              {isOwnProfile
                ? "No followers yet"
                : `${userProfile?.name ?? "This user"} has no followers yet`}
            </h3>
            <p className="text-sm text-muted">
              {isOwnProfile
                ? "When people follow you, they'll appear here."
                : "When people follow them, they'll appear here."}
            </p>
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
                  className="flex items-center rounded-lg bg-secondary px-4 py-2 text-sm text-foreground"
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
  );
}
//
// // Update the FollowerCard component to navigate to the user's profile when clicked
// function FollowerCard({
//   user,
// }: {
//   user: {
//     followedAt: Date;
//     id: string;
//     email: string | null;
//   };
// }) {
//   const router = useRouter();
//   const { data: follower } = api.user.getProfile.useQuery({
//     userId: user.id,
//   });
//
//   const { useFollowActions } = useFollow();
//   const { isFollowing, isLoading, toggleFollow } = useFollowActions(user.id);
//
//   const navigateToProfile = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering when clicking the follow button
//     if (follower?.username) {
//       router.push(`/profile/@${follower.username}`);
//     } else {
//       router.push(`/profile/${user.id}`);
//     }
//   };
//
//   return (
//     <div
//       className="flex cursor-pointer items-center rounded-lg bg-secondary p-4 shadow-lg"
//       onClick={navigateToProfile}
//     >
//       <div className="mr-4 h-14 w-14 overflow-hidden rounded-full">
//         <Image
//           src={follower?.image ?? "/profile-placeholder.svg?height=56&width=56"}
//           alt={follower?.name ?? follower?.email ?? "User"}
//           width={56}
//           height={56}
//           className="h-full w-full object-cover"
//         />
//       </div>
//
//       <div className="flex-1">
//         <div className="font-semibold text-foreground">
//           {follower?.name ?? follower?.email}
//         </div>
//         <div className="text-xs text-muted">{user.email}</div>
//         <div className="mt-1 line-clamp-1 text-xs text-muted">
//           Followed you {new Date(user.followedAt).toLocaleDateString()}
//         </div>
//       </div>
//
//       <button
//         className={`${isFollowing ? "border border-[#3a3a3a] bg-secondary text-foreground" : "bg-[#c1ff72] text-black"} flex items-center rounded-full px-3 py-1 text-xs font-medium`}
//         onClick={async (e) => {
//           e.stopPropagation(); // Prevent navigating when clicking the button
//           await toggleFollow();
//         }}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <Loader2 className="h-3 w-3 animate-spin" />
//         ) : isFollowing ? (
//           "Following"
//         ) : (
//           <>
//             <UserPlus className="mr-1 h-3 w-3" /> Follow
//           </>
//         )}
//       </button>
//     </div>
//   );
// }

export default FollowersScreen;
