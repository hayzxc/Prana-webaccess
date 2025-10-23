import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/consultation-requests/[id] - Update status dan notes konsultasi
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const updatedRequest = await prisma.consultationRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating consultation request:", error);
    return NextResponse.json(
      { error: "Failed to update consultation request" },
      { status: 500 }
    );
  }
}

// DELETE /api/consultation-requests/[id] - Hapus request konsultasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.consultationRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Consultation request deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultation request:", error);
    return NextResponse.json(
      { error: "Failed to delete consultation request" },
      { status: 500 }
    );
  }
}
