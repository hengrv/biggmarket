"use client";

import { useState, use } from "react";
import {
  UserPlus,
  Heart,
  Package,
  User,
  ChevronRight,
  Star,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import EditProfileScreen from "@screens/edit-profile";
import FollowingScreen from "@screens/following-screen";
import FollowersScreen from "@screens/followers-screen";
import SwapsHistoryScreen from "@screens/swaps-history-screen";
import { useFollow } from "~/hooks/useFollow";
import FollowButton from "../../_components/profile/follow-button";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const router = useRouter();
  const { userId } = use(params);
  const isUsername = userId.startsWith("%40");

  // Get the current user's ID for comparison
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  // Fetch the profile based on userId or username
  const { data: userProfile, isLoading: loadingProfile } =
    api.user.getProfile.useQuery(
      {
        userId: isUsername ? undefined : userId,
        username: isUsername ? userId.substring(3) : undefined, // Remove the @ symbol
      },
      {
        retry: false,
      },
    );

  const isOwnProfile = currentUserId === userProfile?.id;

  const { useFollowerCount, useFollowingCount } = useFollow();

  const { count: followers, isLoading: loadingFollowers } = useFollowerCount(
    userProfile?.id ?? "",
  );

  const { count: following, isLoading: loadingFollowing } = useFollowingCount(
    userProfile?.id ?? "",
  );

  const { data: swipeStats } = api.item.getSwipeStats.useQuery(
    {
      userId: userProfile?.id,
    },
    {
      enabled: !!userProfile?.id,
    },
  );

  const [city] = api.user.getCityFromPostcode.useSuspenseQuery(userProfile?.location?.postcode ?? "NE1 1AA");

  const [profileTab, setProfileTab] = useState("gear");
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);

  // Fetch user's items
  const { data: userItems, isLoading: loadingItems } =
    api.item.getUserItems.useQuery(
      {
        userId: userProfile?.id,
        status: "AVAILABLE", // Only show available items by default
      },
      {
        enabled: !!userProfile?.id,
      },
    );

  const totalLikes =
    swipeStats
      ?.filter((stat) => stat.direction === "RIGHT")
      .reduce((acc, stat) => acc + stat._count, 0) ?? 0;

  // const { data: userReviews } = api.user.getProfileReviews.useQuery({userId: userProfile?.id})
  const { data: userReviews } = api.user.getProfileReviews.useQuery(
    {
      userId: userProfile?.id ?? "",
    },
    {
      enabled: !!userProfile?.id,
    },
  );

  const { data: ratingData } = api.user.getAverageRating.useQuery(
    {
      userId: userProfile?.id ?? "",
    },
    {
      enabled: !!userProfile?.id,
    },
  );

  const averageRating = ratingData?.averageRating ?? 0;
  const reviewCount = ratingData?.reviewCount ?? 0;

  if (loadingProfile) {
    return (
      <AppShell activeScreen="profile" title="Profile">
        <div className="flex h-full items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c1ff72] border-t-transparent"></div>
        </div>
      </AppShell>
    );
  }

  if (activeSubScreen === "edit-profile" && isOwnProfile) {
    return <EditProfileScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  if (activeSubScreen === "following") {
    return (
      <FollowingScreen
        setActiveSubScreen={setActiveSubScreen}
        userId={userProfile?.id}
      />
    );
  }

  if (activeSubScreen === "followers") {
    return (
      <FollowersScreen
        setActiveSubScreen={setActiveSubScreen}
        userId={userProfile?.id}
      />
    );
  }

  if (activeSubScreen === "swaps") {
    return (
      <SwapsHistoryScreen
        setActiveSubScreen={setActiveSubScreen}
        userId={userProfile?.id}
      />
    );
  }

  if (!userProfile) {
    return (
      <AppShell activeScreen="profile" title="Profile">
        <div className="p-4 text-center">
          <p className="text-foreground">User not found</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeScreen="profile"
      title={isOwnProfile ? "Profile" : (userProfile.name ?? "User Profile")}
    >
      <div className="p-4">
        <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
          <div className="flex items-center">
            <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-[#c1ff72]">
              <Image
                src={
                  userProfile.image ??
                  "/profile-placeholder.svg?height=96&width=96"
                }
                alt="Profile"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {userProfile.name}
              </h3>
              <div className="text-xs text-muted">
                {userProfile.username
                  ? `${userProfile.username}`
                  : userProfile.email}
              </div>
              <div className="mt-1 text-xs text-muted">
                {city ?? "Unknown City"}
              </div>
            </div>

            {isOwnProfile ? (
              <button
                className="flex items-center rounded-full bg-[#c1ff72] px-3 py-1 text-xs font-medium text-black"
                onClick={() => setActiveSubScreen("edit-profile")}
              >
                <Pencil className="mr-1 h-3 w-3" />
                Edit Profile
              </button>
            ) : (
              <FollowButton userId={userProfile.id} />
            )}
          </div>

          <div className="mt-4 flex justify-around border-t border-background pt-4">
            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("swaps")}
            >
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                <Package className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {totalLikes} Swaps
              </span>
            </button>

            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("following")}
            >
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                <User className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {following} Following
              </span>
            </button>

            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("followers")}
            >
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                <UserPlus className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {followers} Followers
              </span>
            </button>
          </div>
        </div>

        <div className="mb-4 flex rounded-lg bg-secondary p-1 shadow-lg">
          <button
            className={`flex-1 rounded-md py-2 text-sm ${profileTab === "gear" ? "bg-[#c1ff72] font-medium text-black" : "text-muted"}`}
            onClick={() => setProfileTab("gear")}
          >
            {isOwnProfile ? "My Gear" : "Their Gear"}
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm ${profileTab === "reviews" ? "bg-[#c1ff72] font-medium text-black" : "text-muted"}`}
            onClick={() => setProfileTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {profileTab === "gear" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {isOwnProfile ? "Your Items" : `${userProfile.name}'s Items`}
              </h3>
              {isOwnProfile && (
                <button
                  className="flex items-center text-xs text-[#c1ff72]"
                  onClick={() => router.push("/swap")}
                >
                  Add New
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}
            </div>

            {loadingItems ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c1ff72] border-t-transparent"></div>
              </div>
            ) : userItems && userItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-lg bg-secondary shadow-lg"
                  >
                    <div className="relative">
                      <Image
                        src={
                          item.image ||
                          "/item-placeholder.svg?height=150&width=150"
                        }
                        alt={item.title ?? "Item"}
                        width={150}
                        height={150}
                        className="h-32 w-full object-cover"
                      />
                      <div className="absolute right-2 top-2 flex items-center rounded-full bg-black/50 px-2 py-0.5">
                        <Heart className="mr-1 h-3 w-3 text-[#c1ff72]" />
                        <span className="text-xs text-white">
                          {item._count?.swipes || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {item.description ?? "No description"}
                      </div>
                      <div className="text-xs text-muted">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
                <Package className="mx-auto mb-3 h-10 w-10 text-[#c1ff72]" />
                <h3 className="mb-2 font-semibold text-foreground">
                  No items yet
                </h3>
                <p className="text-sm text-muted">
                  {isOwnProfile
                    ? "Add some items to start swapping!"
                    : "This user hasn't added any items yet."}
                </p>
                {isOwnProfile && (
                  <button
                    className="mt-4 rounded-lg bg-[#c1ff72] px-4 py-2 text-sm font-medium text-black"
                    onClick={() => router.push("/swap")}
                  >
                    Add Your First Item
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {isOwnProfile
                  ? "Your Reviews"
                  : `${userProfile.name}'s Reviews`}
              </h3>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-[#c1ff72]" />
                <span className="font-semibold text-foreground">
                  {averageRating}
                </span>
                <span className="ml-1 text-xs text-muted">({reviewCount})</span>
              </div>
            </div>

            <div className="space-y-3">
              {userReviews && userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg bg-secondary p-4 shadow-lg"
                  >
                    <div className="mb-2 flex items-center">
                      <div
                        className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full"
                        onClick={() => {
                          router.push(`/profile/${review.reviewerUser.id}`);
                        }}
                      >
                        <Image
                          src={
                            review.reviewerUser.image ??
                            "/profile-placeholder.svg"
                          }
                          alt={review.reviewerUser.name ?? "Anonymous"}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className="cursor-pointer font-semibold text-foreground"
                          onClick={() => {
                            router.push(`/profile/${review.reviewerUser.id}`);
                          }}
                        >
                          {review.reviewerUser.name}
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 flex">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <span key={i} className="text-lg">
                                  {i < review.rating ? (
                                    <span className="text-[#c1ff72]">★</span>
                                  ) : (
                                    <span className="text-[#3a3a3a]">☆</span>
                                  )}
                                </span>
                              ))}
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {review.rating}/5
                          </span>
                          <span className="mx-2 text-xs text-muted">•</span>
                          <span className="text-xs text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-foreground">
                      {review.review}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
                  <Star className="mx-auto mb-3 h-10 w-10 text-[#c1ff72]" />
                  <h3 className="mb-2 font-semibold text-foreground">
                    No reviews yet
                  </h3>
                  <p className="text-sm text-muted">
                    {isOwnProfile
                      ? "You haven't received any reviews yet."
                      : `${userProfile.name} hasn't received any reviews yet.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
