import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth, withAuth } from "@/lib/auth-middleware";

// GET: Mengambil record sheets untuk sertifikat tertentu
export const GET = withAuth(async (request: NextRequest) => {
  const certificateId = request.nextUrl.searchParams.get("certificateId");

  const recordSheets = await prisma.recordSheet.findMany({
    where: certificateId ? { certificateId } : undefined,
    include: {
      readings: { orderBy: { timestamp: "asc" } },
      inspector: { select: { id: true, name: true } },
      certificate: {
        select: {
          name: true,
          recipientName: true,
          recipientEmail: true,
          containerNumber: true
        }
      }
    },
    orderBy: { treatmentDate: "desc" },
  });

  return NextResponse.json({ success: true, data: recordSheets });
});

// POST: Membuat record sheet baru
export const POST = withAdminAuth(async (request: NextRequest, user) => {
  const body = await request.json();

  void user;

  const { inspectorName, certificateId, ...restOfBody } = body;

  const recordSheet = await prisma.recordSheet.create({
    data: {
      ...restOfBody,
      inspectorId: inspectorName,
      certificateId: certificateId && certificateId !== "" ? certificateId : undefined,
    },
  });

  return NextResponse.json(
    { success: true, data: recordSheet },
    { status: 201 }
  );
});
