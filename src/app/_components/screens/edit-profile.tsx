"use client";

import { set, z } from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { ProfileImageUploader } from "../profile/image-uploader";
import { useRouter } from "next/navigation";

// Client-Side validators
const inputParser = z.object({
  email: z.string().email("Must be a valid email"),
  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?(\s*)[0-9][A-Z]{2}$/i,
      "Invalid UK postcode",
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
});

function EditProfileScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();

  // Fetch user profile data
  const [userProfile, { refetch: refetchProfile }] =
    api.user.getProfile.useSuspenseQuery();

  // Profile State
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [name, setName] = useState(userProfile?.name ?? "");
  const [username, setUsername] = useState(userProfile?.username ?? "");
  const [bio, setBio] = useState(userProfile?.bio ?? "");

  // Postcode
  const [postcode, setPostcode] = useState(
    userProfile?.location?.postcode ?? "",
  );

  // Profile image
  const [profileImage, setProfileImage] = useState(
    userProfile?.image ?? "/profile-placeholder.svg?height=96&width=96",
  );

  const [postcodeError, setPostcodeError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [bioError, setBioError] = useState<string>("");

  const { error: errorPostcode, refetch: refetchPostcode } =
    api.user.postcodeToLongLat.useQuery(postcode, {
      enabled: false,
      retry: false,
    });

  // Update state when profile data changes
  useEffect(() => {
    if (userProfile) {
      setEmail(userProfile.email ?? "");
      setName(userProfile.name ?? "");
      setUsername(userProfile.username ?? "");
      setBio(userProfile.bio ?? "");
      setPostcode(userProfile.location?.postcode ?? "");
      setProfileImage(
        userProfile.image ?? "/profile-placeholder.svg?height=96&width=96",
      );
    }
  }, [userProfile]);

  // Update profile mutation
  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      await refetchProfile();
      setActiveSubScreen(null); // Return to profile page after successful update
    },
    onError: (error) => {
      if (error.message.includes("Username already taken")) {
        setUsernameError("Username already taken");
      }
    },
  });

  const handleSave = async () => {
    let longitude, latitude;

    setEmailError("");
    setPostcodeError("");
    setUsernameError("");
    setBioError("");

    const parseInput = inputParser.safeParse({
      email,
      postcode,
      username,
      bio,
    });

    if (!parseInput.success) {
      parseInput.error.errors.forEach((error) => {
        if (error.path[0] === "email") {
          setEmailError("Invalid Email!");
        }
        if (error.path[0] === "postcode") {
          setPostcodeError("Invalid UK Postcode!");
        }
        if (error.path[0] === "username") {
          setUsernameError(error.message);
        }
        if (error.path[0] === "bio") {
          setBioError(error.message);
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
        username,
        bio,
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

      await utils.user.getProfile.invalidate();
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

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSave();
          }}
        >
          <div>
            <label className="mb-1 block text-xs text-muted">Full Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-[#c1ff72]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Username</label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-[#c1ff72]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
            {usernameError && (
              <h3 className="text-sm text-error">{usernameError}</h3>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-[#c1ff72]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {emailError && <h3 className="text-sm text-error">{emailError}</h3>}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Bio</label>
            <textarea
              className="h-24 w-full resize-none rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-[#c1ff72]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">
              Location (Postcode)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#3a3a3a] bg-secondary p-3 text-foreground outline-none focus:border-[#c1ff72]"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. NE1 7RU"
            />
            {postcodeError && (
              <h3 className="text-sm text-error">{postcodeError}</h3>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-bm-green py-3 font-semibold text-bm-black"
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
          <div className="pt-4">
            <button
              onClick={() => router.push("/settings")}
              className="flex w-full items-center justify-center rounded-lg bg-bm-white/60 py-3 font-semibold text-black"
            >
              User Settings
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default EditProfileScreen;
