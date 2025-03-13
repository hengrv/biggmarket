"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { ProfileImageUploader } from "../profile/image-uploader";

// Client-Side validators
const inputParser = z.object({
  email: z.string().email("Must be a valid email"),
  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?(\s*)[0-9][A-Z]{2}$/i,
      "Invalid UK postcode",
    ),
});

function EditProfileScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
  // Fetch user profile data
  const [userProfile, { refetch: refetchProfile }] =
    api.user.getProfile.useSuspenseQuery();

  // State for form fields
  const [name, setName] = useState(userProfile?.name ?? "");
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [bio, setBio] = useState(""); // Bio isn't in the current schema
  const [postcode, setPostcode] = useState(
    userProfile?.location?.postcode ?? "",
  );
  const [profileImage, setProfileImage] = useState(
    userProfile?.image ?? "/placeholder.svg?height=96&width=96",
  );

  const [postcodeError, setPostcodeError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const { error: errorPostcode, refetch: refetchPostcode } =
    api.user.postcodeToLongLat.useQuery(postcode, {
      enabled: false,
      retry: false,
    });

  // Update state when profile data changes
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

  // Update profile mutation
  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      await refetchProfile();
      setActiveSubScreen(null); // Return to profile page after successful update
    },
  });

  const handleSave = async () => {
    let longitude, latitude;

    setEmailError("");

    setPostcodeError("");
    const parseInput = inputParser.safeParse({ email, postcode });

    if (!parseInput.success) {
      parseInput.error.errors.forEach((error) => {
        if (error.path[0] === "email") {
          setEmailError("Invalid Email!");
        }
        if (error.path[0] === "postcode") {
          setPostcodeError("Invalid UK Postcode!");
        }
      });

      return;
    }

    try {
      const result = await refetchPostcode();
      if (result.isSuccess) {
        longitude = result.data.longitude;
        latitude = result.data.latitude;
      }
    } catch {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name,
        email,
        ...(postcode
          ? {
            location: {
              postcode: postcode,
              latitude: Number(latitude ?? 0),
              longitude: Number(longitude ?? 0),
            },
          }
          : {}),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <AppShell
      title="Edit Profile"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        <ProfileImageUploader imageUrl={profileImage} />
        {/*<div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#c1ff72]">
              <Image
                src={profileImage ?? "/placeholder.svg?height=96&width=96"}
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
                setProfileImage(
                  `/ placeholder.svg ? height = 96 & width=96 & id=${randomId}`,
                );
              }}
            >
              <Camera className="h-4 w-4 text-black" />
            </button>
          </div> */}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSave();
          }}
        >
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
            <label className="text-muted mb-1 block text-xs">Email</label>
            <input
              type="email"
              className="bg-secondary text-foreground w-full rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {emailError && <h3 className="text-error text-sm">{emailError}</h3>}
          </div>

          <div>
            <label className="text-muted mb-1 block text-xs">Bio</label>
            <textarea
              className="bg-secondary text-foreground h-24 w-full resize-none rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <div>
            <label className="text-muted mb-1 block text-xs">
              Location (Postcode)
            </label>
            <input
              type="text"
              className="bg-secondary text-foreground w-full rounded-lg border border-[#3a3a3a] p-3 outline-none focus:border-[#c1ff72]"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. NE1 7RU"
            />
            {postcodeError && (
              <h3 className="text-error text-sm">{postcodeError}</h3>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-[#c1ff72] py-3 font-semibold text-black"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
