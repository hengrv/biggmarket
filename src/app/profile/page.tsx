"use client";

import { useState } from "react";
import {
  UserPlus,
  Heart,
  Package,
  User,
  ChevronRight,
  Camera,
  Star,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { useRouter } from "next/navigation";

import EditProfileScreen from "@screens/edit-profile";
import FollowingScreen from "@screens/following-screen";
import FollowersScreen from "@screens/followers-screen";
import SwapsHistoryScreen from "@screens/swaps-history-screen";

export default function ProfilePage() {
  const router = useRouter();
  const [profileTab, setProfileTab] = useState("gear");
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);

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

  const userItems = [
    {
      id: 1,
      name: "Vintage Record Player",
      image: "/placeholder.svg?height=150&width=150",
      likes: 12,
    },
    {
      id: 2,
      name: "Leather Jacket",
      image: "/placeholder.svg?height=150&width=150",
      likes: 8,
    },
    {
      id: 3,
      name: "Polaroid Camera",
      image: "/placeholder.svg?height=150&width=150",
      likes: 15,
    },
  ];

  const userReviews = [
    {
      id: 1,
      reviewer: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 5,
      text: "Great experience swapping with John! The item was exactly as described and the exchange was smooth.",
      date: "2 weeks ago",
      item: "Vintage Record Player",
    },
    {
      id: 2,
      reviewer: {
        name: "Mike Peters",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 4,
      text: "Good communication and fair trade. Would swap with again!",
      date: "1 month ago",
      item: "Leather Jacket",
    },
    {
      id: 3,
      reviewer: {
        name: "Emily Davis",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 5,
      text: "John is a reliable swapper. Item was in perfect condition and he was very responsive.",
      date: "2 months ago",
      item: "Polaroid Camera",
    },
  ];

  return (
    <AppShell activeScreen="profile" title="Profile">
      <div className="p-4">
        <div className="bg-secondary mb-6 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-[#c1ff72]">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Profile"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-foreground text-lg font-bold">John</h3>
              <div className="text-muted text-xs">@johnswapper</div>
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
                12 Swaps
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
                24 Following
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
                18 Followers
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

            <div className="grid grid-cols-2 gap-3">
              {userItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="h-32 w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex items-center rounded-full bg-black/50 px-2 py-0.5">
                      <Heart className="mr-1 h-3 w-3 text-[#c1ff72]" />
                      <span className="text-xs text-white">{item.likes}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-foreground text-sm font-semibold">
                      {item.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-semibold">Your Reviews</h3>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-[#c1ff72]" />
                <span className="text-foreground font-semibold">4.7</span>
                <span className="text-muted ml-1 text-xs">
                  ({userReviews.length})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {userReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-secondary rounded-lg p-4 shadow-lg"
                >
                  <div className="mb-2 flex items-center">
                    <div
                      className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full"
                      onClick={() => {
                        alert(`Viewing ${review.reviewer.name}'s profile`);
                      }}
                    >
                      <Image
                        src={review.reviewer.image || "/placeholder.svg"}
                        alt={review.reviewer.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-foreground cursor-pointer font-semibold"
                        onClick={() => {
                          alert(`Viewing ${review.reviewer.name}'s profile`);
                        }}
                      >
                        {review.reviewer.name}
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
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground mb-2 text-sm">{review.text}</p>
                  <div className="text-muted text-xs">
                    Item: <span className="text-[#c1ff72]">{review.item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
