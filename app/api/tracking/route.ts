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
