// app/api/tracking/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET: Endpoint publik untuk mencari fumigation tracking
 * berdasarkan nomor kontainer dan notice ID.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const containerNumber = searchParams.get("containerNumber");
    const noticeId = searchParams.get("noticeId");

    // If request asks for companyEmail (public listing of all trackings for a shipper)
    const companyEmail = searchParams.get("companyEmail");
    if (companyEmail && !containerNumber && !noticeId) {
      const trackings = await prisma.fumigationTracking.findMany({
        where: {
          OR: [
            { companyEmail: companyEmail.toLowerCase().trim() },
            { shipper: { email: companyEmail.toLowerCase().trim() } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { shipper: true },
      });

      return NextResponse.json({ success: true, data: trackings });
    }

    if (!containerNumber || !noticeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Container number and notice ID are required",
        },
        { status: 400 }
      );
    }

    const trackingData = await prisma.fumigationTracking.findFirst({
      where: {
        containerNumber: containerNumber.toUpperCase().trim(),
        noticeId: noticeId.toUpperCase().trim(),
      },
      include: { shipper: true },
    });

    if (!trackingData) {
      return NextResponse.json(
        { success: false, message: "Tracking data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trackingData });
  } catch (error) {
    console.error("Error searching tracking data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
