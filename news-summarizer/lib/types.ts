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

