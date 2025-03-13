"use client";

import { useState } from "react";
import Image from "next/image";
import AppShell from "@/components/app-shell";

function EditProfileScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
  const [name, setName] = useState("John");
  const [username, setUsername] = useState("@johnswapper");
  const [bio, setBio] = useState(
    "Passionate about sustainable living and reducing waste through swapping unwanted items.",
  );
  const [location, setLocation] = useState("The Toon");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=96&width=96",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage);
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate saving profile
    setTimeout(() => {
      setIsLoading(false);
      setActiveSubScreen(null);
    }, 1000);
  };

  return (
    <AppShell
      title="Edit Profile"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-2 h-24 w-24">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#c1ff72]">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#c1ff72] shadow-md"
              onClick={() => {
                const randomId = Math.floor(Math.random() * 1000);
                handleProfileImageChange(
                  `/placeholder.svg?height=96&width=96&id=${randomId}`,
                );
              }}
            >
              <Camera className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-muted mb-1 block text-xs">Full Name</label>
            <input
              type="text"
              className="bg-secondary text-foreground w-full rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-muted mb-1 block text-xs">Username</label>
            <input
              type="text"
              className="bg-secondary text-foreground w-full rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-muted mb-1 block text-xs">Bio</label>
            <textarea
              className="bg-secondary text-foreground h-24 w-full resize-none rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="text-muted mb-1 block text-xs">Location</label>
            <input
              type="text"
              className="bg-secondary text-foreground w-full rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex w-full items-center justify-center rounded-lg bg-[#c1ff72] py-3 font-semibold text-black"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-b-transparent"></span>
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default EditProfileScreen;
