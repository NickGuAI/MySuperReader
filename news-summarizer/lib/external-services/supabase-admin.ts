import { createClient } from '@supabase/supabase-js'

// These should be stored in environment variables in production
const supabaseUrl = 'https://hwavlcylvdxagrtscvad.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Creates and exports a Supabase client with service role access
 * This client is for server-side use ONLY, as it bypasses RLS policies
 * WARNING: Never expose this client to the client-side
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
}) 