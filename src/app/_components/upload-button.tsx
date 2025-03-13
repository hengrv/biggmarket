"use client";

import { useState } from "react";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/trpc/react";
import { Loader2, Upload } from "lucide-react";

export function ProfileImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { refetch: refetchProfile } = api.user.getProfile.useQuery(undefined, {
    enabled: false,
  });

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      await refetchProfile();
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <UploadButton
        endpoint="profileImage"
        onClientUploadComplete={(res) => {
          // Do something with the response
          if (res && res.length > 0) {
            setIsUploading(true);
            console.log("Upload completed, file URL:", res[0].url);

            // Update the profile with the new image URL
            updateProfile.mutate(
              { image: res[0].url },
              {
                onSuccess: () => {
                  console.log(
                    "Profile updated successfully with new image:",
                    res[0].url,
                  );
                  setIsUploading(false);
                  setUploadError(null);
                },
                onError: (error) => {
                  console.error(
                    "Failed to update profile with new image:",
                    error,
                  );
                  setIsUploading(false);
                  setUploadError(error.message);
                },
              },
            );
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.error("Upload error:", error);
          setUploadError(error.message);
        }}
        className="ut-button:bg-blue-500 ut-button:hover:bg-blue-600 ut-button:text-white ut-button:rounded ut-button:px-4 ut-button:py-2 ut-button:flex ut-button:items-center ut-button:gap-2"
        content={{
          button({ ready }) {
            if (isUploading) {
              return (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating profile...</span>
                </div>
              );
            }
            return (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{ready ? "Upload profile image" : "Loading..."}</span>
              </div>
            );
          },
        }}
      />
      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </div>
  );
}
