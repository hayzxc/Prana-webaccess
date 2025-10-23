import { type NextRequest, NextResponse } from "next/server"

// Mock users data - replace with actual database query
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@prana.com", role: "admin" as const },
  { id: "2", name: "John Doe", email: "john@example.com", role: "user" as const },
  { id: "3", name: "Jane Smith", email: "jane@example.com", role: "user" as const },
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify admin authentication
    // 2. Query the database for users
    // For now, return mock data

    return NextResponse.json({
      users: mockUsers,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
