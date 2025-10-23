import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";
import { ProgressStatus } from "@/types";

// Definisikan tipe untuk parameter rute (ID)
interface RouteContext {
  params: { id: string };
}

/**
 * PATCH: Mengupdate data fumigation tracking berdasarkan ID.
 * Biasanya digunakan untuk mengubah progressStatus.
 */
export const PATCH = withAdminAuth(
  async (request, user, context: RouteContext) => {
    try {
      const { id } = context.params;
      const body: { progressStatus: ProgressStatus } = await request.json();
      const { progressStatus } = body;

      const updateData: { [key: string]: any } = {
        progressStatus,
      };

      const now = new Date();

      switch (progressStatus) {
        case "GASSING":
          updateData.gassingTime = now;
          break;

        case "AERATION":
          updateData.aerationStartTime = now;
          break;

        case "READY":
          updateData.containerReadyTime = now;
          break;

        case "PENDING":
        case "COMPLETED":
        default:
          break;
      }

      const updatedTracking = await prisma.fumigationTracking.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ success: true, data: updatedTracking });
    } catch (error) {
      console.error("Error updating fumigation tracking:", error);
      return NextResponse.json(
        { success: false, message: "Record not found or invalid data" },
        { status: 404 }
      );
    }
  }
);

/**
 * DELETE: Menghapus data fumigation tracking berdasarkan ID.
 */
export const DELETE = withAdminAuth(
  async (request, user, context: RouteContext) => {
    try {
      const { id } = context.params;

      await prisma.fumigationTracking.delete({
        where: { id },
      });

      // Return status 204 No Content yang menandakan sukses tanpa body response
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting fumigation tracking:", error);
      // Handle kasus jika ID tidak ditemukan
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }
  }
);
