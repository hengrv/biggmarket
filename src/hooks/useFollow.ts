import { useState } from "react";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export function useFollow() {
  const utils = api.useUtils();

  const currentUserId = api.user.getCurrentlyAuthenticatedUser.useQuery().data ?? "";

  const followMutation = api.user.followUser.useMutation({
    onSuccess: async (_, variables) => {

      // Invalidate relevant queries to update UI
      await utils.user.getFollowers.invalidate({
        userId: variables.followingId,
      });
      await utils.user.getFollowing.invalidate({ userId: currentUserId });
      await utils.user.getFollowerCount.invalidate({
        userId: variables.followingId,
      });
      await utils.user.getFollowingCount.invalidate({
        userId: currentUserId,
      });
      await utils.user.checkIfFollowing.invalidate({
        followingId: variables.followingId,
      });
    },
  });

  // Unfollow a user mutation
  const unfollowMutation = api.user.unfollowUser.useMutation({
    onSuccess: async (_, variables) => {


      // Invalidate relevant queries to update UI
      await utils.user.getFollowers.invalidate({
        userId: variables.followingId,
      });
      await utils.user.getFollowing.invalidate({ userId: currentUserId });
      await utils.user.getFollowerCount.invalidate({
        userId: variables.followingId,
      });
      await utils.user.getFollowingCount.invalidate({
        userId: currentUserId,
      });
      await utils.user.checkIfFollowing.invalidate({
        followingId: variables.followingId,
      });
    },
  });

  // Hook to handle following/unfollowing logic
  const useFollowActions = (userId: string) => {
    const { data: isFollowing, isLoading: checkingFollow } =
      api.user.checkIfFollowing.useQuery(
        { followingId: userId },
        { enabled: !!userId },
      );

    const toggleFollow = async () => {
      if (isFollowing) {
        await unfollowMutation.mutateAsync({ followingId: userId });
      } else {
        await followMutation.mutateAsync({ followingId: userId });
      }
    };

    return {
      isFollowing,
      isLoading:
        checkingFollow ||
        followMutation.isPending ||
        unfollowMutation.isPending,
      toggleFollow,
    };
  };

  // Hook to get followers with pagination
  const useFollowers = (userId: string, initialLimit = 10) => {
    const [limit, setLimit] = useState(initialLimit);
    const [cursor, setCursor] = useState<number | undefined>(undefined);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
      api.user.getFollowers.useInfiniteQuery(
        { userId, limit },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          enabled: !!userId,
        },
      );

    return {
      followers: data?.pages.flatMap((page) => page.followers) ?? [],
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  // Hook to get following with pagination
  const useFollowing = (userId: string, initialLimit = 10) => {
    const [limit, setLimit] = useState(initialLimit);
    const [cursor, setCursor] = useState<number | undefined>(undefined);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
      api.user.getFollowing.useInfiniteQuery(
        { userId, limit },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          enabled: !!userId,
        },
      );

    return {
      following: data?.pages.flatMap((page) => page.following) ?? [],
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  // Hook to get follower count
  const useFollowerCount = (userId: string) => {
    const { data: count, isLoading } = api.user.getFollowerCount.useQuery(
      { userId },
      { enabled: !!userId },
    );

    return { count, isLoading };
  };

  // Hook to get following count
  const useFollowingCount = (userId: string) => {
    const { data: count, isLoading } = api.user.getFollowingCount.useQuery(
      { userId },
      { enabled: !!userId },
    );

    return { count, isLoading };
  };

  return {
    useFollowActions,
    useFollowers,
    useFollowing,
    useFollowerCount,
    useFollowingCount,
  };
}
