import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { validateRequest, validateEmail } from "@/lib/api-response";
import { asyncHandler } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();

  // 1. Validasi input
  validateRequest(body, ["email", "password"]);
  validateEmail(body.email);

  const { email, password } = body;

  // 2. Cari user berdasarkan email di database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Pesan error generik untuk keamanan (mencegah email enumeration)
    return Response.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 3. Bandingkan password yang diberikan dengan hash di database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return Response.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 4. Jika valid, buat JWT (JSON Web Token)
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
    expiresIn: "7d", // Token berlaku selama 7 hari
  });

  // 5. Siapkan data user untuk response (hapus password)
  const { password: _, ...userData } = user;

  // 6. Set token di httpOnly cookie untuk keamanan
  const cookieStore = cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return Response.json(
    {
      success: true,
      data: userData,
      message: "Login successful",
    },
    { status: 200 }
  );
});
