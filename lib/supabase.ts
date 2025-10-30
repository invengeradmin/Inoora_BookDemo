import { createClient } from "@supabase/supabase-js"

// Supabase credentials
const supabaseUrl = "https://wxgtdbgxbmwhozaupqcc.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z3RkYmd4Ym13aG96YXVwcWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDM3NzEsImV4cCI6MjA2NDA3OTc3MX0.qXlPuTY-Jia0Z7sHlAJtMX697mgObvpc-adTr-UkAPs"
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z3RkYmd4Ym13aG96YXVwcWNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODUwMzc3MSwiZXhwIjoyMDY0MDc5NzcxfQ.r2ikq0ylxr9fTQ_SLtXe0fFQrtABNZrWA9tWHRD86ss"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true // We now have hardcoded credentials
}
