"use client";

import { useState } from "react";
import {
  UserPlus,
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

import EditProfileScreen from "@components/screens/edit-profile";
import FollowingScreen from "@components/screens/following-screen";
import FollowersScreen from "@components/screens/followers-screen";
import FollowButton from "../profile/follow-button";
import ReviewsSkeleton from "@/components/profile/reviews-skeleton";
import ItemsSkeleton from "@/components/profile/items-skeleton";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import ItemGrid from "../item/item-grid";

export default function ProfilePageComponent({ userId }: { userId?: string }) {
  const router = useRouter();
  const [profileTab, setProfileTab] = useState("gear");
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const isUsername = userId?.startsWith("%40") ?? false;

  // Get the current user's ID for comparison
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  // Critical data - needed for initial render
  const { data: userProfile, isLoading: loadingProfile } =
    api.user.getProfile.useQuery(
      {
        userId: isUsername ? undefined : userId,
        username: isUsername ? userId?.substring(3) : undefined, // Remove the @ symbol
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
      },
    );

  const isOwnProfile = !userId || currentUserId === userProfile?.id;

  // Non-critical data - can be loaded after initial render
  const { data: followers, isLoading: loadingFollowers } =
    api.user.getFollowerCount.useQuery(
      { userId: userProfile?.id ?? "" },
      { enabled: !!userProfile?.id, refetchOnWindowFocus: false },
    );

  const { data: following, isLoading: loadingFollowing } =
    api.user.getFollowingCount.useQuery(
      { userId: userProfile?.id ?? "" },
      { enabled: !!userProfile?.id, refetchOnWindowFocus: false },
    );

  const { data: city, isLoading: loadingCity } =
    api.user.getCityFromPostcode.useQuery(
      userProfile?.location?.postcode ?? "NE1 1AA",
      {
        enabled: !!userProfile?.location?.postcode,
        refetchOnWindowFocus: false,
      },
    );

  // Only fetch items when the "gear" tab is active
  const { data: userItems, isLoading: loadingItems } =
    api.item.getUserItems.useQuery(
      {
        userId: userProfile?.id,
        status: "AVAILABLE", // Only show available items by default
      },
      {
        enabled: !!userProfile?.id && profileTab === "gear",
        refetchOnWindowFocus: false,
      },
    );

  // Only fetch reviews when the "reviews" tab is active
  const { data: userReviews, isLoading: loadingReviews } =
    api.user.getProfileReviews.useQuery(
      { userId: userProfile?.id ?? "" },
      {
        enabled: !!userProfile?.id && profileTab === "reviews",
        refetchOnWindowFocus: false,
      },
    );

  const { data: ratingData, isLoading: loadingRating } =
    api.user.getAverageRating.useQuery(
      { userId: userProfile?.id ?? "" },
      {
        enabled: !!userProfile?.id && profileTab === "reviews",
        refetchOnWindowFocus: false,
      },
    );

  const { data: matches, isLoading: loadingMatches } =
    api.item.getMatches.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const totalSwaps = matches?.filter(
    (swipe) => swipe.status === "ACCEPTED",
  ).length;

  const averageRating = ratingData?.averageRating ?? 0;
  const reviewCount = ratingData?.reviewCount ?? 0;

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

  // Show skeleton UI while loading critical data
  if (loadingProfile) {
    return <ProfileSkeleton />;
  }

  if (!userProfile) {
    return (
      <AppShell activeScreen="profile" title="Profile">
        <div className="p-4 text-center">
          <p className="text-foreground">User profile not found</p>
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
                draggable={false}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {userProfile.name}
              </h3>
              <div className="text-xs text-muted">
                {userProfile.username
                  ? `@${userProfile.username}`
                  : userProfile.email}
              </div>
              <div className="mt-1 text-xs text-muted">
                {loadingCity ? "Loading location..." : (city ?? "Unknown City")}
              </div>
              <div className="mt-1 text-xs text-muted">
                {userProfile.bio ?? ""}
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
              onClick={() => router.push(`/swaphistory/${userProfile?.id}`)}
            >
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                <Package className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {loadingMatches ? "..." : totalSwaps} Swaps
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
                {loadingFollowing ? "..." : following} Following
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
                {loadingFollowers ? "..." : followers} Followers
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
              <ItemsSkeleton />
            ) : (
              <ItemGrid
                items={userItems}
                isLoading={loadingItems}
                emptyMessage={
                  isOwnProfile
                    ? "Add some items to start swapping!"
                    : "This user hasn't added any items yet."
                }
                emptyActionButton={
                  isOwnProfile ? (
                    <button
                      className="mt-4 rounded-lg bg-[#c1ff72] px-4 py-2 text-sm font-medium text-black"
                      onClick={() => router.push("/swap")}
                    >
                      Add Your First Item
                    </button>
                  ) : undefined
                }
              />
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
                  {loadingRating ? "..." : averageRating}
                </span>
                <span className="ml-1 text-xs text-muted">
                  ({loadingRating ? "..." : reviewCount})
                </span>
              </div>
            </div>

            {loadingReviews ? (
              <ReviewsSkeleton />
            ) : userReviews && userReviews.length > 0 ? (
              <div className="space-y-3">
                {userReviews.map((review) => (
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
                          draggable={false}
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
                ))}
              </div>
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
        )}
      </div>
    </AppShell>
  );
}
