import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth, withAuth, type AuthUser } from "@/lib/auth-middleware";

// GET: Mengambil semua sertifikat
export const GET = withAuth(async (request, user) => {
  const queryOptions: any = {
    orderBy: { issueDate: "desc" },
    include: {
      issuedBy: { select: { id: true, name: true, email: true } },
    },
  };

  if (user.role !== "ADMIN") {
    queryOptions.where = {
      recipientEmail: user.email,
    };
  }

  const certificates = await prisma.certificate.findMany(queryOptions);
  return NextResponse.json({ success: true, data: certificates });
});

// POST: Membuat sertifikat baru
export const POST = withAdminAuth(async (request, user: AuthUser) => {
  try {
    const body = await request.json();

    const { gassingTime, serviceType, containerNumber, noticeId, woNumber, ...restOfBody } = body;
    const newCertData: any = { ...restOfBody, issuedById: user.id, serviceType };

    // Handle fumigation-specific fields
    if (serviceType === "FUMIGATION") {
      // Only set these fields if they have values
      if (containerNumber) newCertData.containerNumber = containerNumber;
      if (noticeId) newCertData.noticeId = noticeId;
      if (woNumber) newCertData.woNumber = woNumber;

      if (gassingTime) {
        const gassingDate = new Date(gassingTime);
        newCertData.gassingTime = gassingDate;
        newCertData.aerationStartTime = gassingDate;

        // Tambah 27 jam untuk container ready time
        const readyDate = new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000);
        newCertData.containerReadyTime = readyDate;

        newCertData.progressStatus = "GASSING";
      }
    }

    console.log("Service Type", serviceType);
    console.log("Certificate Data:", newCertData);

    const certificate = await prisma.certificate.create({
      data: newCertData,
      include: {
        issuedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: certificate },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating certificate:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json(
        { 
          success: false, 
          error: `Certificate with this ${field} already exists. Please use a different ${field}.`
        },
        { status: 409 } // Conflict status
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create certificate",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
});
