export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  pagination?: ApiResponse["pagination"],
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination,
  }
}

export function createErrorResponse(error: string, statusCode = 400): { response: ApiResponse; status: number } {
  return {
    response: {
      success: false,
      error,
    },
    status: statusCode,
  }
}

export function handleApiError(error: unknown): { response: ApiResponse; status: number } {
  console.error("[API Error]:", error)

  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }

  return createErrorResponse("Internal server error", 500)
}

export function validateRequest(data: Record<string, any>, requiredFields: string[]): void {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      throw new ApiError(400, `Field '${field}' is required`)
    }
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format")
  }
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      return `Field '${field}' is required`
    }
  }
  return null
}

export function createPagination(page: number, limit: number, total: number): ApiResponse["pagination"] {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}
