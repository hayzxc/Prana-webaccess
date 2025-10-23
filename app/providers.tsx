"use client"

import type React from "react"

import { AuthProvider } from "@/lib/simple-backend-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
