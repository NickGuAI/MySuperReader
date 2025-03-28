import type { User, UserPreferences, UserStats } from "@/lib/types"
import { supabase, isClientSide } from "./supabase"

/**
 * Authentication service using Supabase
 */
export const authService = {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      
      if (error) {
        console.error('Error signing in with Google:', error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  },

  /**
   * Legacy login method with username/password
   * Kept for backward compatibility
   */
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (!username || !password) {
      return { success: false, error: "Please enter both username and password" }
    }

    // For demo purposes, accept any non-empty credentials
    if (username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    try {
      // Use Supabase email/password login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@example.com`,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: "Failed to get user information" }
      }

      // Map Supabase user to our app's User format
      const user = this.mapSupabaseUser(data.user)
      return { success: true, user }
    } catch (error) {
      console.error('Error during login:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  },

  /**
   * Sign out the current user
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error during logout:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isClientSide()) return null

    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return null
      
      return this.mapSupabaseUser(data.user)
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  /**
   * Set up a listener for auth state changes
   * @param callback Function to call when auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_IN' && session?.user) {
        const user = this.mapSupabaseUser(session.user)
        callback(user)
      } else if (event === 'SIGNED_OUT') {
        callback(null)
      }
    })
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    preferences: Partial<User["preferences"]>,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        return { success: false, error: "Not logged in" }
      }
      
      const userId = userData.user.id
      
      // Store preferences in Supabase user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { preferences }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: "Failed to update user" }
      }

      return { success: true, user: this.mapSupabaseUser(data.user) }
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  },

  /**
   * Maps a Supabase user to our application User type
   */
  mapSupabaseUser(supabaseUser: any): User {
    const metadata = supabaseUser.user_metadata || {}
    
    return {
      id: supabaseUser.id,
      username: metadata.user_name || supabaseUser.email?.split('@')[0] || 'user',
      displayName: metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.full_name || supabaseUser.email?.split('@')[0] || 'User')}`,
      preferences: (metadata.preferences as UserPreferences) || {
        categories: ["technology", "science"],
        sources: ["TechCrunch", "Wired"],
        emailDigest: true,
        theme: "light",
      },
      stats: (metadata.stats as UserStats) || {
        articlesRead: 0,
        articlesSaved: 0,
        summariesGenerated: 0,
      },
    }
  }
}

