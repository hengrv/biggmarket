"use client";

import { api } from "~/trpc/react";
import { useFollow } from "~/hooks/useFollow";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

function FollowingCard({
  user,
}: {
  user: {
    followedAt: Date;
    id: string;
    email: string | null;
  };
}) {
  const router = useRouter();
  const { data: followedUser } = api.user.getProfile.useQuery({
    userId: user.id,
  });

  const { useFollowActions } = useFollow();
  const { isLoading, toggleFollow } = useFollowActions(user.id);

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering when clicking the follow button
    if (followedUser?.username) {
      router.push(`/profile/@${followedUser.username}`);
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
          src={
            followedUser?.image ?? "/profile-placeholder.svg?height=56&width=56"
          }
          alt={followedUser?.name ?? followedUser?.email ?? "User"}
          width={56}
          height={56}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="flex-1">
        <div className="font-semibold text-foreground">
          {followedUser?.name ?? user.email}
        </div>
        <div className="text-xs text-muted">{user.email}</div>
        <div className="mt-1 line-clamp-1 text-xs text-muted">
          Following since {new Date(user.followedAt).toLocaleDateString()}
        </div>
      </div>

      <button
        className="rounded-full bg-[#c1ff72] px-3 py-1 text-xs font-medium text-black"
        onClick={async (e) => {
          e.stopPropagation(); // Prevent navigating when clicking the button
          await toggleFollow();
        }}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Following"}
      </button>
    </div>
  );
}

export default FollowingCard;