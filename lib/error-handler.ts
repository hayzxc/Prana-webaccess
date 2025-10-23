import { ApiError, createErrorResponse, type ApiResponse } from "./api-response"

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(400, message, "VALIDATION_ERROR")
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND")
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access") {
    super(401, message, "UNAUTHORIZED")
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Access forbidden") {
    super(403, message, "FORBIDDEN")
  }
}

export function handleApiError(error: unknown): { response: ApiResponse; status: number } {
  console.error("[API Error]:", error)

  // Handle custom API errors
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode)
  }

  // Handle validation errors
  if (error instanceof ValidationError) {
    return createErrorResponse(`Validation failed: ${error.message}`, 400)
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    // Don't expose internal error details in production
    const message = process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    return createErrorResponse(message, 500)
  }

  // Handle unknown errors
  return createErrorResponse("An unexpected error occurred", 500)
}

export function asyncHandler<T extends any[]>(handler: (...args: T) => Promise<Response>) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error) {
      const { response, status } = handleApiError(error)
      return Response.json(response, { status })
    }
  }
}

export function validateRequest(data: any, requiredFields: string[]): void {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      throw new ValidationError(`Field '${field}' is required`, field)
    }
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format", "email")
  }
}

export function validatePhone(phone: string): void {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))) {
    throw new ValidationError("Invalid phone number format", "phone")
  }
}
