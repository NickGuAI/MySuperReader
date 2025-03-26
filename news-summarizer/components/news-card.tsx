"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, Sparkles } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { NewsItem } from "@/lib/types"
import { geminiService } from "@/lib/external-services/gemini-service"

interface NewsCardProps {
  newsItem: NewsItem
  selectable?: boolean
  selected?: boolean
  onSelectChange?: (id: string, selected: boolean) => void
}

export default function NewsCard({ newsItem, selectable = false, selected = false, onSelectChange }: NewsCardProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)

  const handleGenerateSummary = async () => {
    if (summary) return // Don't regenerate if we already have a summary

    setLoadingSummary(true)
    try {
      const generatedSummary = await geminiService.generateSummary(newsItem.title, newsItem.content)
      setSummary(generatedSummary)
    } catch (error) {
      console.error("Failed to generate summary:", error)
    } finally {
      setLoadingSummary(false)
    }
  }

  // Function to safely render the image with error handling
  const renderImage = () => {
    if (!newsItem.imageUrl) return null

    return (
      <div className="relative h-48 mb-4 overflow-hidden border border-sumi/10">
        <Image
          src={newsItem.imageUrl || "/placeholder.svg"}
          alt={newsItem.title}
          fill
          className="object-cover"
          onError={(e) => {
            // If image fails to load, remove it
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
    )
  }

  return (
    <Card className="h-full flex flex-col jp-card overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2 border-b border-sumi/5">
        <div className="flex justify-between items-start gap-2">
          {selectable && (
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onSelectChange?.(newsItem.id, checked === true)}
              className="mt-1"
            />
          )}
          <CardTitle className={`text-lg font-normal text-indigo ${selectable ? "ml-2" : ""}`}>
            {newsItem.title}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-sumi/70">{newsItem.source}</span>
          <span className="text-sumi/30">•</span>
          <span className="text-sumi/70">{formatDistanceToNow(new Date(newsItem.published), { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        {newsItem.imageUrl && renderImage()}

        {!summary && !loadingSummary && (
          <p className="text-sm line-clamp-4 mb-4 text-sumi/80 leading-relaxed">{newsItem.content}</p>
        )}

        {loadingSummary && (
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-full bg-sumi/5" />
            <Skeleton className="h-4 w-3/4 bg-sumi/5" />
          </div>
        )}

        {summary && (
          <div className="mb-4 bg-kinari-dark p-3 border-l-2 border-pine">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-pine" />
              <h4 className="font-medium text-xs text-pine">AI Summary</h4>
            </div>
            <p className="text-sm text-sumi/90 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {newsItem.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline" className="jp-badge">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-sumi/5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateSummary}
          disabled={loadingSummary || !!summary}
          className="jp-button-outline text-xs"
        >
          {summary ? "Summarized" : loadingSummary ? "Summarizing..." : "Summarize"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-indigo hover:text-indigo-dark text-xs"
          asChild
        >
          <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
            Read <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

