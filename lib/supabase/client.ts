import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to avoid creating multiple clients
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): SupabaseClient<any> {
  if (client) {
    return client
  }
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Use a consistent storage key to prevent lock conflicts
        storageKey: 'kanash-auth',
        // Reduce lock acquisition timeout
        lockAcquireTimeoutMs: 3000,
        // Don't auto refresh - we'll handle it manually
        autoRefreshToken: true,
        // Detect session from URL (for OAuth redirects)
        detectSessionInUrl: true,
        // Persist session in localStorage
        persistSession: true,
        // Use default flow type
        flowType: 'pkce',
      },
    }
  )
  
  return client
}
