import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Database types for strong typing across the app.
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "admin" | "user"
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "admin" | "user"
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "admin" | "user"
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          name: string
          recipient_email: string
          recipient_name: string
          issue_date: string
          status: "valid" | "expired" | "revoked"
          file_url: string | null
          file_name: string | null
          file_size: number | null
          issued_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          recipient_email: string
          recipient_name: string
          issue_date: string
          status?: "valid" | "expired" | "revoked"
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          issued_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          recipient_email?: string
          recipient_name?: string
          issue_date?: string
          status?: "valid" | "expired" | "revoked"
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          issued_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Lazy initialization to avoid build-time environment variable access
let supabaseInstance: SupabaseClient<Database> | null = null
let supabaseAdminInstance: SupabaseClient<Database> | null = null

export const supabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export const supabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase admin environment variables")
    }

    supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return supabaseAdminInstance
}
