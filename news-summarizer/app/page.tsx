"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Mail, RefreshCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import NewsCard from "@/components/news-card"
import TrendingSummary from "@/components/trending-summary"
import EmailForm from "@/components/email-form"
import TranslationToggle from "@/components/translation-toggle"
import UserMenu from "@/components/user-menu"
import { inoreaderService } from "@/lib/external-services/inoreader-service"
import { useTranslation } from "@/contexts/translation-context"
import { useAuth } from "@/contexts/auth-context"
import type { NewsItem } from "@/lib/types"

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [translatedNews, setTranslatedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const { isTranslated, translateText } = useTranslation()
  const { user } = useAuth()

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    // Translate news items when translation is toggled
    const translateNews = async () => {
      if (isTranslated && news.length > 0) {
        setLoading(true)
        try {
          // In a real implementation, we would batch translate all items
          // For this mock, we'll just create a simple translated version
          const translated = await Promise.all(
            news.map(async (item) => ({
              ...item,
              title: await translateText(item.title),
              content: await translateText(item.content),
              summary: item.summary ? await translateText(item.summary) : undefined,
            })),
          )
          setTranslatedNews(translated)
        } catch (error) {
          console.error("Translation error:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    translateNews()
  }, [isTranslated, news])

  const loadNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const newsData = await inoreaderService.fetchNews()
      setNews(newsData)
      // Initialize translated news with original news
      setTranslatedNews(newsData)
    } catch (error) {
      console.error("Failed to fetch news:", error)
      setError("Failed to load news. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Use translated news when translation is enabled
  const displayedNews = isTranslated ? translatedNews : news

  // Get unique categories from all articles
  const allCategories = Array.from(new Set(displayedNews.flatMap((item) => item.categories))).sort()

  const categories = ["all", ...allCategories]

  const filteredNews =
    activeCategory === "all" ? displayedNews : displayedNews.filter((item) => item.categories.includes(activeCategory))

  const handleSelectArticle = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedArticles((prev) => [...prev, id])
    } else {
      setSelectedArticles((prev) => prev.filter((articleId) => articleId !== id))
    }
  }

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev)
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedArticles([])
    }
  }

  const selectedArticlesData = displayedNews.filter((article) => selectedArticles.includes(article.id))

  // Translate page title
  const [pageTitle, setPageTitle] = useState("ニュース要約")

  useEffect(() => {
    const updateTitle = async () => {
      if (isTranslated) {
        const translated = await translateText("ニュース要約")
        setPageTitle(translated)
      } else {
        setPageTitle("ニュース要約")
      }
    }

    updateTitle()
  }, [isTranslated])

  return (
    <main className="container mx-auto py-12 px-4 md:px-6 bg-kinari min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-sumi/10 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-indigo">{pageTitle}</h1>
          <p className="text-sumi/60 mt-1 text-sm">
            {isTranslated ? "AI-translated news with summaries" : "News Summarizer with AI-generated insights"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <TranslationToggle />

          <Button
            variant={selectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
            className={
              selectionMode
                ? "jp-button bg-ochre hover:bg-ochre-light"
                : "jp-button-outline border-ochre text-ochre hover:bg-ochre/5"
            }
          >
            {selectionMode ? "Cancel Selection" : "Select Articles"}
          </Button>

          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 jp-button-outline border-pine text-pine hover:bg-pine/5 disabled:opacity-50"
                disabled={selectedArticles.length === 0}
              >
                <Mail className="h-4 w-4" />
                Email ({selectedArticles.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md jp-card border border-sumi/10">
              <EmailForm selectedArticles={selectedArticlesData} onClose={() => setEmailDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button onClick={loadNews} variant="outline" className="flex items-center gap-2 jp-button-outline">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>

          <UserMenu />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-vermilion/10 border-vermilion text-vermilion">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-vermilion/80">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
            <TabsList className="mb-6 bg-kinari-dark border border-sumi/10 p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize text-xs data-[state=active]:bg-indigo data-[state=active]:text-kinari"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="jp-card">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-2/3 mb-2 bg-sumi/5" />
                        <Skeleton className="h-4 w-full bg-sumi/5" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-[200px] w-full mb-4 bg-sumi/5" />
                        <Skeleton className="h-4 w-full mb-2 bg-sumi/5" />
                        <Skeleton className="h-4 w-full mb-2 bg-sumi/5" />
                        <Skeleton className="h-4 w-2/3 bg-sumi/5" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.map((item) => (
                    <NewsCard
                      key={item.id}
                      newsItem={item}
                      selectable={selectionMode}
                      selected={selectedArticles.includes(item.id)}
                      onSelectChange={handleSelectArticle}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-sumi/10 bg-kinari-dark">
                  <h3 className="text-lg font-light text-sumi/70">No news found</h3>
                  <p className="text-sumi/50 mt-1 text-sm">Try selecting a different category or refreshing</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <TrendingSummary articles={displayedNews} />
        </div>
      </div>
    </main>
  )
}

