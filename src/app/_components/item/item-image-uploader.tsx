"use client";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { api } from "~/trpc/react";

// Custom hook for managing profile image uploads
function useItemImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { refetch: refetchItem } = api.item.getItemById.useQuery("", {
    enabled: false,
  });

  const updateItem = api.item.updateItem.useMutation({
    onSuccess: async () => {
      await refetchItem();
    },
  });

  const { startUpload, isUploading: isUploadingFile } = useUploadThing(
    "itemImage",
    {
      onClientUploadComplete: (res) => {
        if (res && res.length > 0) {
          console.log("Upload completed, file URL:", res[0]?.ufsUrl);

          // Update the profile with the new image URL
          updateProfile.mutate(
            { image: res[0]?.ufsUrl },
            {
              onSuccess: () => {
                console.log(
                  "Profile updated successfully with new image:",
                  res[0]?.ufsUrl,
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
      },
      onUploadError: (error) => {
        console.error("Upload error:", error);
        setUploadError(error.message);
        setIsUploading(false);
      },
    },
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      await startUpload([file]);
    },
    [startUpload],
  );

  return {
    isUploading: isUploading || isUploadingFile,
    uploadError,
    handleUpload,
  };
}

export function ItemImageUploader({ imageUrl }: { imageUrl: string }) {
  const { isUploading, uploadError, handleUpload } = useItemImageUpload();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleClick = useCallback(() => {
    // Find and click the hidden file input
    const fileInput = document.getElementById(
      "profile-image-input",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className="relative h-24 w-24"
          onClick={isUploading ? undefined : handleClick}
        >
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#c1ff72]">
            <Image
              src={imageUrl ?? "/profile-placeholder.svg?height=96&width=96"}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#c1ff72] shadow-md">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-bm-black" />
              ) : (
                <Camera className="h-4 w-4 text-bm-black" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        id="profile-image-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </>
  );
}
