import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { auth } from "~/server/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth();

      // Check if user should be able to upload images
      if (!session || !session.user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Send back to client
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),

  itemImage: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth();

      // Check if user should be able to upload images
      if (!session || !session.user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Send back to client
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
