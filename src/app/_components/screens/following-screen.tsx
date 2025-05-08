"use client";

import type React from "react";

import AppShell from "@components/app-shell";
import { Loader2 } from "lucide-react";
import { useFollow } from "~/hooks/useFollow";
import { api } from "~/trpc/react";

import FollowingCard from "@components/profile/following-card";

function FollowingScreen({
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
  const { useFollowing } = useFollow();

  const isOwnProfile = !userId || userId === currentUserId;

  // Get the name of the user whose following list we're viewing
  const titlePrefix = isOwnProfile
    ? "People You're"
    : `${userProfile?.name ?? "User"}'s`;

  const {
    following,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowing(userId ?? userProfile?.id ?? "", 10);

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  return (
    <AppShell
      title={`${titlePrefix} Following`}
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : following.length === 0 ? (
          <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
            <h3 className="mb-2 font-semibold text-foreground">
              {isOwnProfile
                ? "You're not following anyone yet"
                : `${userProfile?.name ?? "This user"} isn't following anyone yet`}
            </h3>
            <p className="text-sm text-muted">
              {isOwnProfile
                ? "When you follow people, they'll appear here."
                : "When they follow people, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {following.map((user) => (
              <FollowingCard key={user.id} user={user} />
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
// function FollowingCard({
//   user,
// }: {
//   user: {
//     followedAt: Date;
//     id: string;
//     email: string | null;
//   };
// }) {
//   const router = useRouter();
//   const { data: followedUser } = api.user.getProfile.useQuery({
//     userId: user.id,
//   });
//
//   const { useFollowActions } = useFollow();
//   const { isLoading, toggleFollow } = useFollowActions(user.id);
//
//   const navigateToProfile = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering when clicking the follow button
//     if (followedUser?.username) {
//       router.push(`/profile/@${followedUser.username}`);
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
//           src={
//             followedUser?.image ?? "/profile-placeholder.svg?height=56&width=56"
//           }
//           alt={followedUser?.name ?? followedUser?.email ?? "User"}
//           width={56}
//           height={56}
//           className="h-full w-full object-cover"
//           draggable={false}
//         />
//       </div>
//
//       <div className="flex-1">
//         <div className="font-semibold text-foreground">
//           {followedUser?.name ?? user.email}
//         </div>
//         <div className="text-xs text-muted">{user.email}</div>
//         <div className="mt-1 line-clamp-1 text-xs text-muted">
//           Following since {new Date(user.followedAt).toLocaleDateString()}
//         </div>
//       </div>
//
//       <button
//         className="rounded-full bg-[#c1ff72] px-3 py-1 text-xs font-medium text-black"
//         onClick={async (e) => {
//           e.stopPropagation(); // Prevent navigating when clicking the button
//           await toggleFollow();
//         }}
//         disabled={isLoading}
//       >
//         {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Following"}
//       </button>
//     </div>
//   );
// }
//
export default FollowingScreen;
