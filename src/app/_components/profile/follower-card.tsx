"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useFollow } from "~/hooks/useFollow";
import Image from "next/image";
import { Loader2, UserPlus } from "lucide-react";

export default function FollowerCard({
  user,
}: {
  user: {
    followedAt: Date;
    id: string;
    email: string | null;
  };
}) {
  const router = useRouter();
  const { data: userId } = api.user.getCurrentlyAuthenticatedUser.useQuery();
  const { data: follower } = api.user.getProfile.useQuery({
    userId: user.id,
  });

  const { useFollowActions } = useFollow();
  const { isFollowing, isLoading, toggleFollow } = useFollowActions(user.id);

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering when clicking the follow button
    if (follower?.username) {
      router.push(`/profile/@${follower.username}`);
    } else {
      router.push(`/profile/${user.id}`);
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center rounded-lg bg-secondary p-4 shadow-lg"
      onClick={navigateToProfile}
    >
      <div className="mr-4 h-14 w-14 overflow-hidden rounded-full">
        <Image
          src={follower?.image ?? "/profile-placeholder.svg?height=56&width=56"}
          alt={follower?.name ?? follower?.email ?? "User"}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="font-semibold text-foreground">
          {follower?.name ?? follower?.email}
        </div>
        <div className="xs:block hidden text-xs text-muted">{user.email}</div>
        <div className="xs:block mt-1 line-clamp-1 hidden text-xs text-muted">
          Followed since {new Date(user.followedAt).toLocaleDateString()}
        </div>
      </div>

      {follower?.id !== userId && (
        <button
          className={`${isFollowing ? "border border-[#3a3a3a] bg-secondary text-foreground" : "bg-bm-green text-black"} flex items-center rounded-full px-3 py-1 text-xs font-medium`}
          onClick={async (e) => {
            e.stopPropagation();
            await toggleFollow();
          }}
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
      )}
    </div>
  );
}
