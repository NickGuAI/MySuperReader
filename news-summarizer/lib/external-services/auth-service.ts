import type { User } from "@/lib/types"

// Mock authentication service
export const authService = {
  // Mock login with Inoreader credentials
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (!username || !password) {
      return { success: false, error: "Please enter both username and password" }
    }

    // For demo purposes, accept any non-empty credentials
    // In a real implementation, this would validate against Inoreader API
    if (username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    // Create a mock user based on the username
    const user: User = {
      id: `user-${Date.now()}`,
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      email: `${username}@example.com`,
      avatar: `/placeholder.svg?height=200&width=200`,
      preferences: {
        categories: ["technology", "science"],
        sources: ["TechCrunch", "Wired"],
        emailDigest: true,
        theme: "light",
      },
      stats: {
        articlesRead: Math.floor(Math.random() * 100),
        articlesSaved: Math.floor(Math.random() * 50),
        summariesGenerated: Math.floor(Math.random() * 30),
      },
    }

    // Store user in localStorage for persistence
    localStorage.setItem("news-summarizer-user", JSON.stringify(user))

    return { success: true, user }
  },

  // Mock logout
  async logout(): Promise<{ success: boolean }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Clear user from localStorage
    localStorage.removeItem("news-summarizer-user")

    return { success: true }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userJson = localStorage.getItem("news-summarizer-user")
    if (!userJson) return null

    try {
      return JSON.parse(userJson) as User
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
      return null
    }
  },

  // Update user preferences
  async updateUserPreferences(
    preferences: Partial<User["preferences"]>,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not logged in" }
    }

    const updatedUser: User = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences,
      },
    }

    // Update user in localStorage
    localStorage.setItem("news-summarizer-user", JSON.stringify(updatedUser))

    return { success: true, user: updatedUser }
  },
}

