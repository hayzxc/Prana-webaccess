import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ConsultationRequest } from "@/types";

// GET /api/consultation-requests - Mendapatkan semua request konsultasi
export async function GET() {
  try {
    const requests = await prisma.consultationRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching consultation requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultation requests" },
      { status: 500 }
    );
  }
}

// POST /api/consultation-requests - Membuat request konsultasi baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      serviceType,
      message,
    } = body;

    // Validasi input
    if (!customerName || !customerEmail || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const consultationRequest = await prisma.consultationRequest.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        companyName: companyName || null,
        serviceType: serviceType || "FUMIGATION",
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(consultationRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation request:", error);
    return NextResponse.json(
      { error: "Failed to create consultation request" },
      { status: 500 }
    );
  }
}
