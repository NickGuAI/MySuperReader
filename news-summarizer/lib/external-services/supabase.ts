import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwavlcylvdxagrtscvad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXZsY3lsdmR4YWdydHNjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTc1MDgsImV4cCI6MjA1ODY5MzUwOH0.fUOrzaTRmrqgKHLBcH7kN5qzE2r9EcWU8hg9maJXNaw'

/**
 * Creates and exports a Supabase client instance
 * This client can be used throughout the application for authentication and data operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * This helper checks if we're on the client side before attempting to access localStorage
 * Prevents SSR issues in Next.js
 */
export const isClientSide = () => typeof window !== 'undefined' 