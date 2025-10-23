import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// This is your new "uploader"
export const ourFileRouter = {
  fileUploader: f(["image", "pdf", "text"]).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.ufsUrl);

      return { url: file.ufsUrl };
    }
  ),

  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);

    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
