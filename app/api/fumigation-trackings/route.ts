import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth, withAuth } from "@/lib/auth-middleware";

export const GET = withAuth(async (request, user) => {
  const queryOptions: any = {
    orderBy: { createdAt: "desc" },
  };

  if (user.role !== "ADMIN") {
    queryOptions.where = {
      companyEmail: user.email,
    };
  }

  const trackings = await prisma.fumigationTracking.findMany(queryOptions);
  return NextResponse.json({ success: true, data: trackings });
});

// POST: Menambah fumigation tracking baru
export const POST = withAdminAuth(async (request, user) => {
  const body = await request.json();
  const newTracking = await prisma.fumigationTracking.create({
    data: { ...body, userId: user.id },
  });
  return NextResponse.json(
    { success: true, data: newTracking },
    { status: 201 }
  );
});
