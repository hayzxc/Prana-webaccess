import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

// GET: List all shippers (admin only)
export const GET = withAdminAuth(async (request, user) => {
  const shippers = await prisma.shipper.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ success: true, data: shippers });
});

// POST: Create or upsert shipper by email
export const POST = withAdminAuth(async (request, user) => {
  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const shipper = await prisma.shipper.upsert({
      where: { email: body.email },
      update: { name: body.name ?? body.email },
      create: { email: body.email, name: body.name ?? body.email },
    });

    return NextResponse.json({ success: true, data: shipper }, { status: 201 });
  } catch (error) {
    console.error("Error upserting shipper:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});