import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { ApiError } from "./api-response";
import { handleApiError } from "./error-handler";

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
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new ApiError(401, "Authentication token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("USER MNIH", user);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      role: user.role as "ADMIN" | "USER",
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid authentication token");
    }
    throw error;
  }
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
