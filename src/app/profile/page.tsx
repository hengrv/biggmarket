"use client";

import { useEffect, useState } from "react";
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
import FollowButton from "../_components/profile/follow-button";

export default function ProfilePage() {
  const [userProfile, { refetch: refetchProfile }] =
    api.user.getProfile.useSuspenseQuery();

  const { useFollowerCount, useFollowingCount } = useFollow();

  const { count: followers, isLoading: loadingFollowers } = useFollowerCount(
    userProfile?.id ?? "",
  );

  const { count: following, isLoading: loadingFollowing } = useFollowingCount(
    userProfile?.id ?? "",
  );

  const { data: swipeStats } = api.item.getSwipeStats.useQuery({
    userId: userProfile?.id,
  });

  const [name, setName] = useState(userProfile?.name ?? "");
  const [email, setEmail] = useState(userProfile?.email ?? "");

  const [postcode, setPostcode] = useState(
    userProfile?.location?.postcode ?? "",
  );

  const [profileImage, setProfileImage] = useState(
    userProfile?.image ?? "/placeholder.svg?height=96&width=96",
  );

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name ?? "");
      setEmail(userProfile.email ?? "");
      setPostcode(userProfile.location?.postcode ?? "");
      setProfileImage(
        userProfile.image ?? "/placeholder.svg?height=96&width=96",
      );
    }
  }, [userProfile]);

  const router = useRouter();
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

  const { data: userReviews } = api.user.getProfileReviews.useQuery();
  const [{ averageRating, reviewCount }] =
    api.user.getAverageRating.useSuspenseQuery();

  if (activeSubScreen === "edit-profile") {
    return <EditProfileScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  if (activeSubScreen === "following") {
    return <FollowingScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  if (activeSubScreen === "followers") {
    return <FollowersScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  if (activeSubScreen === "swaps") {
    return <SwapsHistoryScreen setActiveSubScreen={setActiveSubScreen} />;
  }

  return (
    <AppShell activeScreen="profile" title="Profile">
      <div className="p-4">
        <div className="bg-secondary mb-6 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-[#c1ff72]">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-foreground text-lg font-bold">{name}</h3>
              <div className="text-muted text-xs">
                {userProfile?.username ? `@${userProfile?.username}` : email}
              </div>
              <div className="text-muted mt-1 text-xs">The Toon</div>
            </div>

            <button
              className="flex items-center rounded-full bg-[#c1ff72] px-3 py-1 text-xs font-medium text-black"
              onClick={() => setActiveSubScreen("edit-profile")}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit Profile
            </button>
          </div>

          <div className="border-background mt-4 flex justify-around border-t pt-4">
            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("swaps")}
            >
              <div className="bg-background mb-1 flex h-8 w-8 items-center justify-center rounded-full">
                <Package className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">
                {totalLikes} Swaps
              </span>
            </button>

            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("following")}
            >
              <div className="bg-background mb-1 flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">
                {following} Following
              </span>
            </button>

            <button
              className="flex flex-col items-center"
              onClick={() => setActiveSubScreen("followers")}
            >
              <div className="bg-background mb-1 flex h-8 w-8 items-center justify-center rounded-full">
                <UserPlus className="h-4 w-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">
                {followers} Followers
              </span>
            </button>
          </div>
        </div>

        <div className="bg-secondary mb-4 flex rounded-lg p-1 shadow-lg">
          <button
            className={`flex-1 rounded-md py-2 text-sm ${profileTab === "gear" ? "bg-[#c1ff72] font-medium text-black" : "text-muted"}`}
            onClick={() => setProfileTab("gear")}
          >
            My Gear
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
              <h3 className="text-foreground font-semibold">Your Items</h3>
              <button
                className="flex items-center text-xs text-[#c1ff72]"
                onClick={() => router.push("/swap")}
              >
                Add New
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
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
                    className="bg-secondary overflow-hidden rounded-lg shadow-lg"
                  >
                    <div className="relative">
                      <Image
                        src={
                          item.image || "/placeholder.svg?height=150&width=150"
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
                      <div className="text-foreground truncate text-sm font-semibold">
                        {item.description ?? "No description"}
                      </div>
                      <div className="text-muted text-xs">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary rounded-lg p-6 text-center shadow-lg">
                <Package className="mx-auto mb-3 h-10 w-10 text-[#c1ff72]" />
                <h3 className="text-foreground mb-2 font-semibold">
                  No items yet
                </h3>
                <p className="text-muted text-sm">
                  Add some items to start swapping!
                </p>
                <button
                  className="mt-4 rounded-lg bg-[#c1ff72] px-4 py-2 text-sm font-medium text-black"
                  onClick={() => router.push("/swap")}
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-semibold">Your Reviews</h3>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-[#c1ff72]" />
                <span className="text-foreground font-semibold">
                  {averageRating}
                </span>
                <span className="text-muted ml-1 text-xs">({reviewCount})</span>
              </div>
            </div>

            <div className="space-y-3">
              {userReviews?.map((review) => (
                <div
                  key={review.id}
                  className="bg-secondary rounded-lg p-4 shadow-lg"
                >
                  <div className="mb-2 flex items-center">
                    <div
                      className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full"
                      onClick={() => {
                        alert(`Viewing ${review.reviewerUser.name}'s profile`);
                      }}
                    >
                      <Image
                        src={review.reviewerUser.image ?? "/placeholder.svg"}
                        alt={review.reviewerUser.name ?? "Anonymous"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-foreground cursor-pointer font-semibold"
                        onClick={() => {
                          alert(
                            `Viewing ${review.reviewerUser.name}'s profile`,
                          );
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
                        <span className="text-foreground text-xs font-medium">
                          {review.rating}/5
                        </span>
                        <span className="text-muted mx-2 text-xs">•</span>
                        <span className="text-muted text-xs">
                          {review.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground mb-2 text-sm">
                    {review.review}
                  </p>
                  {/* //! TODO: Add item box here */}
                  {/* <div className="text-muted text-xs">
                    Item: <span className="text-[#c1ff72]">{review.item}</span>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
