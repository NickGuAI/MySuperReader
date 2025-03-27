"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, TrendingUp } from "lucide-react"
import { geminiService } from "@/lib/external-services/gemini-service"
import { inoreaderService } from "@/lib/external-services/inoreader-service"
import { useTranslation } from "@/contexts/translation-context"
import type { NewsItem, TrendingSummary } from "@/lib/types"

interface TrendingSummaryProps {
  articles: NewsItem[]
}

export default function TrendingSummaryComponent({ articles }: TrendingSummaryProps) {
  const [trendingSummary, setTrendingSummary] = useState<TrendingSummary | null>(null)
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null)
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { isTranslated, translateText } = useTranslation()

  useEffect(() => {
    if (articles.length > 0) {
      generateTrendingSummary()
      fetchTrendingTopics()
    }
  }, [articles])

  useEffect(() => {
    // Translate the summary when translation is toggled
    const translateSummary = async () => {
      if (isTranslated && trendingSummary?.content) {
        try {
          const translated = await translateText(trendingSummary.content)
          setTranslatedSummary(translated)
        } catch (error) {
          console.error("Translation error:", error)
        }
      } else {
        setTranslatedSummary(null)
      }
    }

    translateSummary()
  }, [isTranslated, trendingSummary])

  const generateTrendingSummary = async () => {
    setLoading(true)
    try {
      // Extract title and content from articles
      const articleData = articles.map((article) => ({
        title: article.title,
        content: article.content,
      }))

      const summary = await geminiService.generateTrendSummary(articleData)
      setTrendingSummary({
        content: summary,
        topics: [],
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to generate trending summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingTopics = async () => {
    try {
      const topics = await inoreaderService.fetchTrendingTopics()
      setTrendingTopics(topics)
    } catch (error) {
      console.error("Failed to fetch trending topics:", error)
    }
  }

  // Use translated summary if available
  const displayContent = isTranslated && translatedSummary ? translatedSummary : trendingSummary?.content

  return (
    <Card className="jp-card border-l-4 border-l-vermilion">
      <CardHeader className="pb-3 border-b border-sumi/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-vermilion" />
            <CardTitle className="text-lg font-normal text-vermilion">
              {isTranslated ? "Mega Trend" : "Mega Trend"}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateTrendingSummary}
            disabled={loading}
            className="jp-button-outline text-xs h-8 px-2 border-vermilion text-vermilion hover:bg-vermilion/5"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-xs text-sumi/60 mt-1">
          {isTranslated
            ? "AI-generated analysis of current news trends"
            : "AI-generated analysis of current news trends"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-3/4 bg-sumi/5" />
            <div className="pt-2" />
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-1/2 bg-sumi/5" />
          </div>
        ) : displayContent ? (
          <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-sumi/80 prose-strong:text-vermilion prose-strong:font-normal">
            <div
              dangerouslySetInnerHTML={{
                __html: displayContent
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n/g, "<br />"),
              }}
            />
          </div>
        ) : (
          <p className="text-sumi/60 text-sm">No trend summary available. Click refresh to generate.</p>
        )}

        {trendingTopics.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sumi/5">
            <h4 className="text-xs font-medium mb-3 text-sumi/70">
              {isTranslated ? "Trending Topics" : "Trending Topics"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="jp-badge bg-kinari-dark border-vermilion/20 text-vermilion"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-sumi/50 border-t border-sumi/5 pt-3">
        {trendingSummary && (
          <span>
            {isTranslated ? "Last updated: " : "Last updated: "}
            {new Date(trendingSummary.generatedAt).toLocaleString()}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

