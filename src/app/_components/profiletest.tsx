"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import { ProfileImageUpload } from "./upload-button";

export function ProfileTester() {
    const [userProfile, { refetch: refetchProfile }] =
        api.user.getProfile.useSuspenseQuery();
    const [newProfileData, setNewProfileData] = useState({
        email: userProfile?.email ?? "",
        name: userProfile?.name ?? "",
    });

    const updateProfile = api.user.updateProfile.useMutation({
        onSuccess: async () => {
            try {
                await refetchProfile();
            } catch (error) {
                console.error("Error refetching profile:", error);
            }
        },
    });

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(newProfileData);

            setNewProfileData({
                email: userProfile?.email ?? "",
                name: userProfile?.name ?? "",
            });
        } catch (error) {
            console.error("Profile update error:", error);
        }
    };

    return (
        <div className="w-full max-w-xs">
            {userProfile ? (
                <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <Image
                            src={userProfile?.image ?? "/placeholder.svg?height=96&width=96"}
                            alt="Profile picture"
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <ProfileImageUpload />
                    <div className="w-full">
                        <p className="truncate">
                            <span className="font-semibold">ID:</span> {userProfile?.id}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold">Name:</span> {userProfile?.name}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold">Email:</span> {userProfile?.email}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold">Email Verified:</span>{" "}
                            {userProfile?.emailVerified
                                ? userProfile.emailVerified.toLocaleDateString()
                                : "UNVERIFIED"}
                        </p>
                    </div>
                </div>
            ) : (
                <p>There was a problem getting your account information...</p>
            )}

            <div className="mb-8 rounded border p-4">
                <h2 className="mb-4 text-xl font-semibold">Update Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="mb-1 block">Name:</label>
                        <input
                            type="text"
                            value={newProfileData.name}
                            onChange={(e) =>
                                setNewProfileData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full rounded border p-2 text-black"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block">Email:</label>
                        <input
                            type="email"
                            value={newProfileData.email}
                            onChange={(e) =>
                                setNewProfileData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            className="w-full rounded border p-2 text-black"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        disabled={updateProfile.isPending}
                    >
                        {updateProfile.isPending ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
