import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

interface RouteContext {
  params: { sheetId: string };
}

// DELETE: Menghapus sertifikat
export const DELETE = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { sheetId } = context.params;
    try {
      await prisma.recordSheet.delete({
        where: { id: sheetId },
      });
      return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Record sheet not found" },
        { status: 404 }
      );
    }
  }
);
