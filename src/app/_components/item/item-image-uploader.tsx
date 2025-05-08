"use client";
import { Camera } from "lucide-react";
import { useState, useCallback } from "react";
import { useUploadThing } from "~/utils/uploadthing";

// Custom hook for managing profile image uploads
function useItemImageUpload({
  onImagesUploaded,
}: {
  onImagesUploaded: (urls: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { startUpload, isUploading: isUploadingFile } = useUploadThing(
    "itemImage",
    {
      onClientUploadComplete: (res) => {
        if (res && res.length > 0) {
          const uploadedUrls = res.map((item) => item.ufsUrl);
          onImagesUploaded(uploadedUrls);
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
    async (files: File[]) => {
      setIsUploading(true);
      await startUpload(files);
    },
    [startUpload],
  );

  return {
    isUploading: isUploading || isUploadingFile,
    uploadError,
    handleUpload,
  };
}

export function ItemImageUploader({
  onImagesUploaded,
}: {
  onImagesUploaded: (urls: string[]) => void;
}) {
  const { isUploading, uploadError, handleUpload } = useItemImageUpload({
    onImagesUploaded,
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);

      if (files.length > 0) {
        await handleUpload(files);
      }
    },
    [handleUpload],
  );

  const handleClick = useCallback(() => {
    // Find and click the hidden file input
    const fileInput = document.getElementById(
      "item-image-input",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-3 gap-2"
        onClick={isUploading ? undefined : handleClick}
      >
        <button
          type="button"
          className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3a3a3a] bg-secondary"
        >
          <Camera className="mb-1 h-6 w-6 text-primary" />
          <span className="text-xs text-muted">Add Photo</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        id="item-image-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </>
  );
}
