import { cookies } from "next/headers"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie) {
      return null
    }

    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function setUserCookie(user: User) {
  const cookieStore = cookies()
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearUserCookie() {
  const cookieStore = cookies()
  cookieStore.delete("user")
}
