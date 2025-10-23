import type { NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api-response"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, user) => {
  return Response.json(createSuccessResponse(user, "User information retrieved"), { status: 200 })
})
