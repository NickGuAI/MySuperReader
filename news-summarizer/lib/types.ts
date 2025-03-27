export interface NewsItem {
  id: string
  title: string
  content: string
  summary?: string
  url: string
  imageUrl?: string
  published: string
  source: string
  categories: string[]
}

export interface TrendingSummary {
  content: string
  topics: string[]
  generatedAt: string
}

export interface EmailFormData {
  email: string
  articleIds: string[]
  includeSummaries: boolean
}

export interface UserPreferences {
  categories: string[]
  sources: string[]
  emailDigest: boolean
  theme: "light" | "dark"
}

export interface UserStats {
  articlesRead: number
  articlesSaved: number
  summariesGenerated: number
}

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  avatar: string
  preferences: UserPreferences
  stats: UserStats
}

