"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/external-services/auth-service"
import type { User } from "@/lib/types"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  updatePreferences: (preferences: Partial<User["preferences"]>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    
    // Initialize auth state
    initAuth()
    
    // Set up auth state change listener
    const { data: authListener } = authService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser)
      if (updatedUser) {
        // If user is signed in, redirect to home page
        router.push("/")
      }
    })
    
    // Clean up listener on unmount
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authService.login(username, password)
      if (result.success && result.user) {
        setUser(result.user)
        router.push("/")
        return { success: true }
      }
      return { success: false, error: result.error || "Login failed" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }
  
  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      const result = await authService.signInWithGoogle()
      if (result.success) {
        return { success: true }
      }
      return { success: false, error: result.error || "Google sign-in failed" }
    } catch (error) {
      console.error("Google sign-in error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = async (preferences: Partial<User["preferences"]>) => {
    try {
      const result = await authService.updateUserPreferences(preferences)
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      }
      return { success: false, error: result.error || "Failed to update preferences" }
    } catch (error) {
      console.error("Update preferences error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signInWithGoogle, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

