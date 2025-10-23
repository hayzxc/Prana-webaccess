import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/error-handler";
import { validateRequest, validateEmail } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();

  // 1. Validasi input
  validateRequest(body, ["name", "email", "password"]);
  validateEmail(body.email);

  const { name, email, password, role } = body;

  // 2. Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return Response.json(
      { success: false, message: "Email already registered" },
      { status: 409 } // 409 Conflict
    );
  }

  // 3. Hash password sebelum disimpan
  const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

  // 4. Buat user baru di database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "USER", // Role default adalah USER sesuai schema prisma
    },
  });

  // Jangan kirim balik password hash di response
  const { password: _, ...userWithoutPassword } = user;

  return Response.json(
    {
      success: true,
      data: userWithoutPassword,
      message: "User registered successfully",
    },
    { status: 201 } // 201 Created
  );
});
