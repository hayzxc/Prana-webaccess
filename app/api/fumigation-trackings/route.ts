import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth, withAuth } from "@/lib/auth-middleware";

export const GET = withAuth(async (request, user) => {
  const queryOptions: any = {
    orderBy: { createdAt: "desc" },
    include: { shipper: true },
  };

  if (user.role !== "ADMIN") {
    queryOptions.where = {
      companyEmail: user.email,
    };
  }

  const trackings = await prisma.fumigationTracking.findMany(queryOptions);
  return NextResponse.json({ success: true, data: trackings });
});

// POST: Menambah fumigation tracking baru (akan meng-upsert shipper berdasarkan email bila diperlukan)
export const POST = withAdminAuth(async (request, user) => {
  const body = await request.json();

  // Jika shipperId tidak diberikan tetapi companyEmail tersedia, maka lakukan upsert
  let shipperId: string | undefined = body.shipperId;
  try {
    if (!shipperId && body.companyEmail) {
      const shipper = await prisma.shipper.upsert({
        where: { email: body.companyEmail },
        update: { name: body.companyName ?? body.companyEmail },
        create: {
          email: body.companyEmail,
          name: body.companyName ?? body.companyEmail,
        },
      });
      shipperId = shipper.id;
    }

    const newTracking = await prisma.fumigationTracking.create({
      data: { ...body, userId: user.id, shipperId },
      include: { shipper: true },
    });

    return NextResponse.json(
      { success: true, data: newTracking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fumigation tracking:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
});
