import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

interface RouteContext {
  params: { id: string };
}

// PATCH: Mengupdate user
export const PATCH = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { id } = context.params;
    const body = await request.json();

    const { name, email, role } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  }
);

// DELETE: Menghapus user
export const DELETE = withAdminAuth(
  async (request, user, context: RouteContext) => {
    const { id } = context.params;

    // Jangan biarkan admin menghapus dirinya sendiri
    if (id === user.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own account." },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  }
);
