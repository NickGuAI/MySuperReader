import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use the provided AppId and AppKey
    const appId = "1000002136"
    const appKey = "N6ArNIikpYBnJIDRN0sgCYucFZcoe1E9"

    // Try using URL parameters as specified in the documentation
    const url = `https://www.inoreader.com/reader/api/0/stream/contents/user/-/state/com.google/reading-list?n=20&AppId=${appId}&AppKey=${appKey}`

    console.log("Fetching from URL:", url)

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error ${response.status}: ${errorText}`)

      // Fall back to mock data
      return NextResponse.json(getMockNews())
    }

    const data = await response.json()
    const news = convertInoreaderToNewsItems(data)
    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return mock data on error
    return NextResponse.json(getMockNews())
  }
}

// Mock data for development
function getMockNews() {
  const categories = ["technology", "business", "science", "health", "politics"]
  const sources = ["TechCrunch", "The Verge", "Wired", "BBC News", "CNN", "The New York Times"]

  return Array.from({ length: 12 }, (_, i) => {
    const randomCategories = getRandomSubarray(categories, Math.floor(Math.random() * 3) + 1)
    const randomSource = sources[Math.floor(Math.random() * sources.length)]
    const date = new Date()
    date.setHours(date.getHours() - Math.floor(Math.random() * 24))

    return {
      id: `news-${i}`,
      title: `Sample News Article ${i + 1}: The Future of Technology and Innovation`,
      content: `This is a placeholder for the content of article ${i + 1}. In a real implementation, this would contain the actual content of the news article fetched from the Inoreader API. The content would be much longer and would provide detailed information about the news story.`,
      url: "https://example.com/article",
      imageUrl: i % 3 === 0 ? `/placeholder.svg?height=400&width=600` : undefined,
      published: date.toISOString(),
      source: randomSource,
      categories: randomCategories,
    }
  })
}

function getRandomSubarray(arr, size) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, size)
}

function convertInoreaderToNewsItems(data) {
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error("Invalid response format from Inoreader API")
  }

  return data.items.map((item) => {
    // Extract categories from the item
    const categories = item.categories
      ? item.categories
          .filter((cat) => !cat.includes("user/") && !cat.includes("state/"))
          .map((cat) => {
            // Extract the last part of the category path
            const parts = cat.split("/")
            return parts[parts.length - 1]
          })
      : []

    // Find the first image in the content if available
    let imageUrl = item.visual?.url
    if (!imageUrl && item.summary?.content) {
      const imgMatch = item.summary.content.match(/<img[^>]+src="([^">]+)"/)
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1]
      }
    }

    // Clean the content by removing HTML tags
    const content = item.summary?.content
      ? item.summary.content
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : ""

    return {
      id: item.id,
      title: item.title || "Untitled Article",
      content: content || "No content available",
      url: item.canonical?.href || item.alternate?.[0]?.href || "#",
      imageUrl: imageUrl,
      published: new Date(item.published * 1000).toISOString(),
      source: item.origin?.title || "Unknown Source",
      categories: categories.length > 0 ? categories : ["uncategorized"],
    }
  })
}

// Add this to make the route handler work with the API key
export const dynamic = "force-dynamic"

