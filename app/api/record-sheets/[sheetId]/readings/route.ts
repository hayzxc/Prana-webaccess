import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

interface RouteContext {
  params: { sheetId: string };
}

// POST: Menambah gas reading baru ke record sheet
export const POST = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { sheetId } = context.params;
    const body = await request.json();

    const newReading = await prisma.gasReading.create({
      data: {
        ...body,
        recordSheetId: sheetId,
      },
    });

    return NextResponse.json(
      { success: true, data: newReading },
      { status: 201 }
    );
  }
);
