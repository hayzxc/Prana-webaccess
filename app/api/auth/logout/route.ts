import { cookies } from "next/headers";
import { asyncHandler } from "@/lib/error-handler";

export const POST = asyncHandler(async () => {
  const cookieStore = cookies();

  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return Response.json(
    { success: true, message: "Logout successful" },
    { status: 200 }
  );
});
