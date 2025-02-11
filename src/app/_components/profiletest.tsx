"use client";

import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";

export function ProfileTester() {
    const [userProfile, { refetch: refetchProfile }] = api.user.getProfile.useSuspenseQuery();
    const [newProfileData, setNewProfileData] = useState({
        image: "",
        email: ""
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
            setNewProfileData({ image: "", email: "" });
        } catch (error) {
            console.error("Profile update error:", error);
        }
    };
    
    return (
    <div className="w-full max-w-xs">
        {userProfile ? (
        <div>
            <Image src={userProfile?.image ?? "/default-profile.png"} alt="Profile picture" width={100} height={100} />
            <p className="truncate">ID: {userProfile?.id}</p>
            <p className="truncate">Name: {userProfile?.name}</p>
            <p className="truncate">Email: {userProfile?.email}</p>
            <p className="truncate">Email Verified On: {userProfile?.emailVerified ? userProfile.emailVerified.getDate() : "UNVERIFIED"}</p>
        </div>
        ) : (
        <p>There was a problem getting your account information...</p>
        )}

    <div className="mb-8 rounded border p-4">
        <h2 className="mb-4 text-xl font-semibold">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
            <label className="mb-1 block">Image URL:</label>
            <input
                type="text"
                value={newProfileData.image}
                onChange={(e) =>
                    setNewProfileData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full rounded border p-2 text-black"
                placeholder="https://example.com/image.jpg"
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
