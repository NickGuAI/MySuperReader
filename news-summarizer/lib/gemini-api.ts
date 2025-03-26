// This is a placeholder for the Gemini API
// In a real implementation, you would use your API key
export async function generateSummary(title: string, content: string): Promise<string> {
  try {
    // In a real implementation, you would use the Gemini API
    // const { text } = await generateText({
    //   model: gemini("gemini-pro"),
    //   prompt: `Summarize this news article in 2-3 concise sentences:
    //   Title: ${title}
    //   Content: ${content}`
    // })
    // return text

    // For now, return a mock summary after a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return getMockSummary(title)
  } catch (error) {
    console.error("Error generating summary:", error)
    throw new Error("Failed to generate summary")
  }
}

// Mock summaries for development
function getMockSummary(title: string): string {
  const summaries = [
    "This article explores the latest advancements in artificial intelligence and their potential impact on various industries. Researchers highlight both opportunities and ethical concerns as AI becomes more integrated into daily life.",
    "Scientists have discovered a new approach to renewable energy that could significantly reduce carbon emissions. The breakthrough involves using sustainable materials that are both cost-effective and environmentally friendly.",
    "A recent study reveals surprising connections between diet and cognitive health in adults over 50. Researchers found that certain nutrients may help prevent cognitive decline and improve memory function.",
    "Tech companies are racing to develop the next generation of smartphones with revolutionary features. Industry analysts predict these innovations will transform how we interact with mobile technology in the coming years.",
  ]

  return summaries[Math.floor(Math.random() * summaries.length)]
}

