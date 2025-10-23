import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth, withAuth } from "@/lib/auth-middleware";

// GET: Mengambil record sheets untuk sertifikat tertentu
export const GET = withAuth(async (request: NextRequest) => {
  const certificateId = request.nextUrl.searchParams.get("certificateId");

  //   if (!certificateId) {
  //     return NextResponse.json(
  //       { success: false, message: "Certificate ID is required" },
  //       { status: 400 }
  //     );
  //   }

  const recordSheets = await prisma.recordSheet.findMany({
    // where: { certificateId },
    include: {
      readings: { orderBy: { timestamp: "asc" } },
      inspector: { select: { id: true, name: true } },
    },
    orderBy: { treatmentDate: "desc" },
  });

  return NextResponse.json({ success: true, data: recordSheets });
});

// POST: Membuat record sheet baru
export const POST = withAdminAuth(async (request: NextRequest, user) => {
  const body = await request.json();

  const { inspectorName, ...restOfBody } = body;

  const recordSheet = await prisma.recordSheet.create({
    data: {
      ...restOfBody,
      inspectorId: inspectorName,
    },
  });

  return NextResponse.json(
    { success: true, data: recordSheet },
    { status: 201 }
  );
});
