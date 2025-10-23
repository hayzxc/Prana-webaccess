import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth-middleware";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const POST = withAdminAuth(async (request) => {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No file uploaded" },
      { status: 400 }
    );
  }

  try {
    // Use the UTApi to upload the file
    const response = await utapi.uploadFiles(file);

    // The response is an object with `data` or `error`.
    // We need to check for errors.
    if (response.error) {
      console.error("UploadThing Error:", response.error.message);
      throw new Error("Failed to upload file.");
    }

    // On success, the data object contains file details.
    const uploadedFile = response.data;

    // Return the URL and other details from UploadThing
    return NextResponse.json({
      success: true,
      url: uploadedFile.ufsUrl,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    // You can provide a more specific message if you want
    const message =
      error instanceof Error ? error.message : "Error saving file";
    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
});
