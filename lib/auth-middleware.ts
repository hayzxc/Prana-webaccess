import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { ApiError } from "./api-response";
import { handleApiError } from "./error-handler";
// @ts-ignore - next-auth/jwt exports getToken but TS may not recognize it in some versions
import { getToken } from "next-auth/jwt";

interface JwtPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "USER";
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  name: string;
}

export async function validateAuth(request: NextRequest): Promise<AuthUser> {
  // 1. Try custom auth-token
  const token = request.cookies.get("auth-token")?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123") as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, name: true },
      });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          role: user.role as "ADMIN" | "USER",
          name: user.name || "",
        };
      }
    } catch {
      // Token invalid, try NextAuth
    }
  }

  // 2. Try NextAuth token
  const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (nextAuthToken) {
    const userId = (nextAuthToken.sub || nextAuthToken.id) as string;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, name: true },
      });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          role: user.role as "ADMIN" | "USER",
          name: user.name || "",
        };
      }
    }
  }

  throw new ApiError(401, "Authentication token is missing or invalid");
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  return validateAuth(request);
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await validateAuth(request);
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Admin access required");
  }
  return user;
}

export function withAuth<T extends any[]>(
  handler: (
    request: NextRequest,
    user: AuthUser,
    ...args: T
  ) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireAuth(request);
      return handler(request, user, ...args);
    } catch (error) {
      const { response, status } = handleApiError(error);
      return Response.json(response, { status });
    }
  };
}

export function withAdminAuth<T extends any[]>(
  handler: (
    request: NextRequest,
    user: AuthUser,
    ...args: T
  ) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireAdmin(request);
      return handler(request, user, ...args);
    } catch (error) {
      const { response, status } = handleApiError(error);
      return Response.json(response, { status });
    }
  };
}
