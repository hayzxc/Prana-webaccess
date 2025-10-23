import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";
import { log } from "console";

interface RouteContext {
  params: { id: string };
}

export const PATCH = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { id } = context.params;
    const { progressStatus } = await request.json();

    const certificate = await prisma.certificate.findUnique({ where: { id } });
    if (!certificate) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }

    const updateData: any = { progressStatus };
    const now = new Date();

    if (progressStatus === "AERATION") {
      updateData.aerationStartTime = now;
    } else if (progressStatus === "READY" && certificate.gassingTime) {
      const gassingDate = new Date(certificate.gassingTime);
      const readyDate = new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000);
      updateData.containerReadyTime = readyDate;
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedCertificate });
  }
);

// DELETE: Menghapus sertifikat
export const DELETE = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { id } = context.params;
    try {
      await prisma.certificate.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
      console.log("Failed to delete certificate:", error);
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }
  }
);
