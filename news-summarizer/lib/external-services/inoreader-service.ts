import type { NewsItem } from "@/lib/types"

// Mock Inoreader API service
export const inoreaderService = {
  // Fetch news articles
  async fetchNews(): Promise<NewsItem[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return getMockNews()
  },

  // Fetch trending topics
  async fetchTrendingTopics(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    return ["Artificial Intelligence", "Climate Change", "Space Exploration", "Quantum Computing", "Renewable Energy"]
  },
}

// Mock data generator
function getMockNews(): NewsItem[] {
  const categories = ["technology", "business", "science", "health", "politics"]
  const sources = ["TechCrunch", "The Verge", "Wired", "BBC News", "CNN", "The New York Times"]

  const mockArticles = [
    {
      title: "Breakthrough in Quantum Computing Promises New Era of Processing Power",
      content:
        "Scientists have achieved a major breakthrough in quantum computing, demonstrating a quantum processor that can perform calculations in seconds that would take traditional supercomputers thousands of years. This development could revolutionize fields from cryptography to drug discovery, experts say. The new quantum chip uses a novel approach to maintain quantum coherence, solving one of the biggest challenges in quantum computing.",
      categories: ["technology", "science"],
      source: "Wired",
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement on Emissions",
      content:
        "World leaders have reached a landmark agreement at the Global Climate Summit, committing to reduce carbon emissions by 50% by 2030. The pact includes unprecedented financial commitments to support developing nations in transitioning to renewable energy sources. Environmental activists have cautiously welcomed the agreement while emphasizing the need for concrete action and accountability mechanisms.",
      categories: ["politics", "science"],
      source: "BBC News",
    },
    {
      title: "New AI Model Can Predict Protein Structures with 98% Accuracy",
      content:
        "Researchers have developed an artificial intelligence system capable of predicting protein structures with near-perfect accuracy, a breakthrough that could accelerate drug development and deepen our understanding of diseases. The AI model, trained on vast datasets of known protein structures, can determine the three-dimensional shape of proteins from their amino acid sequences in minutes rather than the months or years previously required for laboratory experiments.",
      categories: ["technology", "health", "science"],
      source: "The Verge",
    },
    {
      title: "Tech Giant Unveils Revolutionary Augmented Reality Glasses",
      content:
        "A leading technology company has unveiled its next-generation augmented reality glasses, promising to transform how we interact with digital information. The lightweight device projects high-resolution holograms that seamlessly blend with the physical world, with applications ranging from immersive gaming to remote collaboration and education. Industry analysts predict the device could accelerate mainstream adoption of augmented reality technology.",
      categories: ["technology", "business"],
      source: "TechCrunch",
    },
    {
      title: "Renewable Energy Now Cheaper Than Fossil Fuels in Most Markets",
      content:
        "A comprehensive global study has found that renewable energy sources are now less expensive than fossil fuels in most markets worldwide. Solar and wind power costs have declined by over 70% in the past decade, making them the most economical choice for new electricity generation in many regions. The report suggests this economic advantage could accelerate the transition to clean energy regardless of policy interventions.",
      categories: ["business", "science"],
      source: "The New York Times",
    },
    {
      title: "Breakthrough Cancer Treatment Shows Promise in Clinical Trials",
      content:
        "A novel cancer treatment approach that combines immunotherapy with targeted genetic modification has shown remarkable results in early clinical trials. Patients with advanced forms of previously untreatable cancers experienced significant tumor reduction, with some achieving complete remission. Researchers caution that larger studies are needed but describe the initial results as 'extremely promising' for developing more effective cancer therapies.",
      categories: ["health", "science"],
      source: "CNN",
    },
    {
      title: "Space Tourism Company Announces First Commercial Flights",
      content:
        "A private space company has announced plans to begin commercial space tourism flights next year, marking a significant milestone in the commercialization of space travel. The company will offer suborbital flights that allow passengers to experience weightlessness and view Earth from space. Tickets are priced at $250,000, with the company reporting that the first year of flights is already fully booked despite the high cost.",
      categories: ["technology", "business", "science"],
      source: "BBC News",
    },
    {
      title: "Global Chip Shortage Expected to Ease by End of Year",
      content:
        "Industry experts predict that the global semiconductor shortage that has affected everything from automobiles to consumer electronics will begin to ease by the end of the year. New manufacturing capacity coming online and adjustments in supply chains are expected to gradually resolve the bottlenecks that have caused production delays across multiple industries. However, analysts warn that building resilience in semiconductor supply chains will require longer-term strategic investments.",
      categories: ["technology", "business"],
      source: "The Verge",
    },
  ]

  return mockArticles.map((article, i) => {
    const date = new Date()
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)) // Random time within last 3 days

    return {
      id: `news-${i}`,
      title: article.title,
      content: article.content,
      url: "https://example.com/article",
      imageUrl: i % 2 === 0 ? `/placeholder.svg?height=400&width=600` : undefined,
      published: date.toISOString(),
      source: article.source,
      categories: article.categories,
    }
  })
}

