// Mock Gemini API service
export const geminiService = {
  // Generate summary for an article
  async generateSummary(title: string, content: string): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return a mock summary based on the title
    return getMockSummary(title, content)
  },

  // Generate a mega trend summary from multiple articles
  async generateTrendSummary(articles: { title: string; content: string }[]): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return `Based on recent news, there are several emerging trends:

1. **Technological Advancement**: Breakthroughs in quantum computing and AI are accelerating, with practical applications emerging in healthcare and scientific research.

2. **Climate Action**: Global initiatives to address climate change are gaining momentum, with renewable energy becoming increasingly cost-competitive with fossil fuels.

3. **Space Commercialization**: Private companies are making significant strides in making space more accessible, from satellite networks to tourism.

4. **Healthcare Innovation**: Novel treatment approaches combining genetic techniques with traditional therapies show promise for previously difficult-to-treat conditions.

These trends suggest we're entering a period of rapid technological transformation with significant implications for society, the economy, and the environment.`
  },
}

// Generate mock summaries based on the article title and content
function getMockSummary(title: string, content: string): string {
  // Extract keywords from title to customize the summary
  const keywords = title.toLowerCase()

  if (keywords.includes("quantum")) {
    return "Scientists have achieved a breakthrough in quantum computing that dramatically outperforms traditional computers. This development could transform cryptography, drug discovery, and complex system modeling by solving previously intractable problems."
  } else if (keywords.includes("climate")) {
    return "World leaders have reached a significant agreement to reduce carbon emissions by 50% by 2030, with financial support for developing nations. While the pact represents progress, implementation and accountability mechanisms will be crucial for its success."
  } else if (keywords.includes("ai") || keywords.includes("artificial intelligence")) {
    return "A new AI system can predict protein structures with unprecedented accuracy, potentially revolutionizing drug development and disease research. This AI can determine complex protein shapes in minutes rather than the months required by traditional laboratory methods."
  } else if (keywords.includes("augmented reality") || keywords.includes("ar")) {
    return "A major tech company has launched advanced AR glasses that project high-resolution holograms integrated with the physical world. The lightweight device has applications in gaming, collaboration, and education, potentially driving mainstream AR adoption."
  } else if (keywords.includes("renewable") || keywords.includes("energy")) {
    return "Renewable energy has become more economical than fossil fuels in most global markets, with solar and wind costs declining over 70% in a decade. This economic advantage may accelerate clean energy transition regardless of policy interventions."
  } else if (keywords.includes("cancer") || keywords.includes("treatment")) {
    return "A promising new cancer treatment combining immunotherapy with targeted genetic modification has shown remarkable results in early trials. Patients with advanced, previously untreatable cancers experienced significant tumor reduction, with some achieving complete remission."
  } else if (keywords.includes("space")) {
    return "A private space company will begin offering commercial space tourism flights next year at $250,000 per ticket. The suborbital flights will allow passengers to experience weightlessness and view Earth from space, with the first year already fully booked."
  } else if (keywords.includes("chip") || keywords.includes("semiconductor")) {
    return "The global semiconductor shortage affecting multiple industries is expected to ease by year-end as new manufacturing capacity comes online. However, building resilient semiconductor supply chains will require longer-term strategic investments."
  } else {
    // Generic summary if no keywords match
    return "This article discusses important developments in its field, highlighting key innovations and their potential impact. Experts suggest these changes could have significant implications for the industry and broader society in the coming years."
  }
}

