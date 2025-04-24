import { createClient } from "@supabase/supabase-js"
import type { Database } from '@/types/supabase'

// For client components (singleton pattern)
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  clientSupabaseClient = createClient<Database>(supabaseUrl, supabaseKey)

  return clientSupabaseClient
}

// For server-side usage with service role
export const createServiceRoleClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseKey)
}
