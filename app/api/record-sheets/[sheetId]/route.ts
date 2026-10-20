import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

interface RouteContext {
  params: { sheetId: string };
}

// DELETE: Menghapus sertifikat
export const DELETE = withAdminAuth(
  async (request, user, context: RouteContext) => {
    void request;
    void user;
    const { sheetId } = context.params;
    try {
      await prisma.recordSheet.delete({
        where: { id: sheetId },
      });
      return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
      console.error("Failed to delete record sheet:", error);
      return NextResponse.json(
        { success: false, message: "Record sheet not found" },
        { status: 404 }
      );
    }
  }
);
