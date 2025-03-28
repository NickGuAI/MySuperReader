import type { NewsItem } from "@/lib/types"
import { supabase } from "./supabase"
import { v4 as uuidv4 } from 'uuid'

// Inoreader API endpoints
const INOREADER_AUTH_URL = 'https://www.inoreader.com/oauth2/auth'
const INOREADER_TOKEN_URL = 'https://www.inoreader.com/oauth2/token'
const INOREADER_API_BASE = 'https://www.inoreader.com/reader/api/0'

// Default redirect URI - will be overridden by config if available
const DEFAULT_REDIRECT_URI = 'http://localhost:3000/api/auth/inoreader/callback'

interface InoreaderCredentials {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

interface InoreaderUser {
  userId: string;
  userName: string;
  userProfileId: string;
  isPro: boolean;
  userEmail?: string;
  userPicture?: string;
}

/**
 * Fetch Inoreader credentials from Supabase
 * This runs on the server side only
 */
async function getInoreaderCredentials(): Promise<InoreaderCredentials> {
  try {
    // Get credentials from Supabase credentials table
    const { data, error } = await supabase
      .from('credentials')
      .select('client_id, client_secret')
      .eq('provider', 'inoreader')
      .single();
      
    console.log('[Server] Inoreader credentials from Supabase:', {
      client_id: data?.client_id,
      client_secret: data?.client_secret ? '[REDACTED]' : undefined
    });
    if (error || !data) {
      console.error('Error fetching Inoreader credentials:', error);
      // Return empty credentials if not found
      return {
        client_id: '',
        client_secret: '',
        redirect_uri: DEFAULT_REDIRECT_URI
      };
    }
    
    // Use a hardcoded base URL based on environment
    // In a production environment, this should be configured properly
    const baseUrl = 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/inoreader/callback`;
    
    return {
      client_id: data.client_id,
      client_secret: data.client_secret,
      redirect_uri: redirectUri
    };
  } catch (error) {
    console.error('Failed to fetch Inoreader credentials:', error);
    return {
      client_id: '',
      client_secret: '',
      redirect_uri: DEFAULT_REDIRECT_URI
    };
  }
}

/**
 * Inoreader API service
 * Server-side only - do NOT import directly in client components!
 */
export const inoreaderService = {
  /**
   * Initiate OAuth2.0 authentication flow
   * Generates state token and constructs authorization URL
   */
  async initiateAuth(userId: string): Promise<{ authUrl: string; state: string }> {
    // Generate CSRF protection token and include userId
    const stateObj = {
      csrf: uuidv4(),
      userId: userId
    };
    
    const state = btoa(JSON.stringify(stateObj));
    
    // Get credentials from Supabase
    const credentials = await getInoreaderCredentials();
    
    // Construct authorization URL
    const params = new URLSearchParams({
      client_id: credentials.client_id,
      redirect_uri: credentials.redirect_uri,
      response_type: 'code',
      scope: 'read',
      state: state
    });
    
    const authUrl = `${INOREADER_AUTH_URL}?${params.toString()}`;
    
    return { authUrl, state };
  },
  
  /**
   * Exchange authorization code for access and refresh tokens
   */
  async exchangeCodeForTokens(code: string, userId: string, state: string): Promise<{ 
    success: boolean; 
    error?: string;
    tokens?: {
      access_token: string;
      refresh_token: string;
      expires_at: string;
    };
  }> {
    try {
      // Check if state contains encoded user info
      let stateUserId = userId;
      
      try {
        const decodedState = JSON.parse(atob(state));
        if (decodedState && decodedState.userId) {
          stateUserId = decodedState.userId;
          console.log('[Inoreader] Using userId from state:', stateUserId);
        }
      } catch (e) {
        // If decoding fails, use the provided userId
        console.log('[Inoreader] Using original userId (state decode failed)');
      }
      
      // Get credentials from Supabase
      const credentials = await getInoreaderCredentials();
      
      // Exchange code for tokens
      const response = await fetch(INOREADER_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          redirect_uri: credentials.redirect_uri,
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          grant_type: 'authorization_code'
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Token exchange failed:', error);
        return { success: false, error: `Token exchange failed: ${error}` };
      }
      
      const data = await response.json();
      
      // Calculate token expiration time - convert to ISO string instead of Unix timestamp
      const expiresDate = new Date();
      expiresDate.setSeconds(expiresDate.getSeconds() + data.expires_in);
      
      // Return the tokens instead of storing them
      return { 
        success: true,
        tokens: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: expiresDate.toISOString()
        }
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Store Inoreader tokens in Supabase
   */
  async storeTokens(userId: string, tokens: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Store tokens in Supabase
      const { error } = await supabase
        .from('inoreader')
        .upsert({
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at
        });
      
      if (error) {
        console.error('Failed to store tokens:', error);
        return { success: false, error: `Failed to store tokens: ${error.message}` };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error storing tokens:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Refresh access token using stored refresh token
   */
  async refreshToken(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get credentials from Supabase
      const credentials = await getInoreaderCredentials();
      
      // Get current tokens from Supabase
      const { data, error } = await supabase
        .from('inoreader')
        .select('refresh_token')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        return { success: false, error: 'No refresh token found' };
      }
      
      const refreshToken = data.refresh_token;
      
      // Request new tokens
      const response = await fetch(INOREADER_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh failed:', errorText);
        return { success: false, error: `Token refresh failed: ${errorText}` };
      }
      
      const newTokens = await response.json();
      
      // Calculate token expiration time
      const expiresDate = new Date();
      expiresDate.setSeconds(expiresDate.getSeconds() + newTokens.expires_in);
      
      // Update tokens in Supabase
      const { error: updateError } = await supabase
        .from('inoreader')
        .update({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_at: expiresDate.toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Failed to update tokens:', updateError);
        return { success: false, error: `Failed to update tokens: ${updateError.message}` };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Get user's access token, refreshing if needed
   */
  async getAccessToken(userId: string): Promise<string | null> {
    try {
      // Get current tokens from Supabase
      const { data, error } = await supabase
        .from('inoreader')
        .select('access_token, expires_at')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        console.error('No access token found:', error);
        return null;
      }
      
      // Check if token is expired or about to expire (within 5 minutes)
      const expiresAtDate = new Date(data.expires_at);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      if (expiresAtDate < fiveMinutesFromNow) {
        // Token is expired or about to expire, refresh it
        const refreshResult = await this.refreshToken(userId);
        if (!refreshResult.success) {
          return null;
        }
        
        // Get the new token
        const { data: newData, error: newError } = await supabase
          .from('inoreader')
          .select('access_token')
          .eq('user_id', userId)
          .single();
        
        if (newError || !newData) {
          return null;
        }
        
        return newData.access_token;
      }
      
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },
  
  /**
   * Check if user has connected Inoreader account
   */
  async isConnected(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('inoreader')
        .select('access_token')
        .eq('user_id', userId)
        .single();
      
      return !error && !!data;
    } catch {
      return false;
    }
  },
  
  /**
   * Disconnect Inoreader account
   */
  async disconnect(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('inoreader')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting Inoreader:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Fetch user profile information from Inoreader
   */
  async getUserProfile(userId: string): Promise<InoreaderUser | null> {
    const accessToken = await this.getAccessToken(userId);
    
    if (!accessToken) {
      return null;
    }
    
    try {
      const response = await fetch(`${INOREADER_API_BASE}/user-info`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch user profile:', await response.text());
        return null;
      }
      
      const data = await response.json();
      
      return {
        userId: data.userId,
        userName: data.userName,
        userProfileId: data.userProfileId,
        isPro: data.isPro,
        userEmail: data.userEmail,
        userPicture: data.userPicture
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  /**
   * Fetch news articles from Inoreader
   */
  async fetchNews(userId: string): Promise<NewsItem[]> {
    const accessToken = await this.getAccessToken(userId);
    
    if (!accessToken) {
      console.log('No access token available, returning mock news');
      return getMockNews();
    }
    
    try {
      const response = await fetch(`${INOREADER_API_BASE}/stream/contents?n=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch news:', await response.text());
        return getMockNews();
      }
      
      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.summary.content,
        url: item.canonical[0].href,
        imageUrl: extractImageUrl(item),
        published: new Date(item.published * 1000).toISOString(),
        source: extractSource(item),
        categories: extractCategories(item)
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return getMockNews();
    }
  },

  /**
   * Fetch trending topics from user's subscriptions
   */
  async fetchTrendingTopics(userId: string): Promise<string[]> {
    const accessToken = await this.getAccessToken(userId);
    
    if (!accessToken) {
      return ["Artificial Intelligence", "Climate Change", "Space Exploration", "Quantum Computing", "Renewable Energy"];
    }
    
    try {
      // For now, return static topics
      // In a real implementation, this would analyze the user's feed
      return ["Artificial Intelligence", "Climate Change", "Space Exploration", "Quantum Computing", "Renewable Energy"];
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return ["Artificial Intelligence", "Climate Change", "Space Exploration", "Quantum Computing", "Renewable Energy"];
    }
  },
};

// Helper functions for parsing Inoreader API responses
function extractImageUrl(item: any): string | undefined {
  // Try to find image in content
  if (item.visual && item.visual.url) {
    return item.visual.url;
  }
  
  // Placeholder if no image is found
  return undefined;
}

function extractSource(item: any): string {
  if (item.origin && item.origin.title) {
    return item.origin.title;
  }
  return 'Unknown Source';
}

function extractCategories(item: any): string[] {
  if (item.categories && Array.isArray(item.categories)) {
    // Extract just the category name from the full path
    return item.categories
      .map((cat: string) => {
        const parts = cat.split('/');
        return parts[parts.length - 1];
      })
      .filter((cat: string) => cat && !cat.startsWith('user/'))
      .slice(0, 3); // Limit to 3 categories
  }
  return ['general'];
}

// Mock data generator for fallback
function getMockNews(): NewsItem[] {
  const categories = ["technology", "business", "science", "health", "politics"];
  const sources = ["TechCrunch", "The Verge", "Wired", "BBC News", "CNN", "The New York Times"];

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
  ];

  return mockArticles.map((article, i) => {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Random time within last 3 days

    return {
      id: `news-${i}`,
      title: article.title,
      content: article.content,
      url: "https://example.com/article",
      imageUrl: i % 2 === 0 ? `/placeholder.svg?height=400&width=600` : undefined,
      published: date.toISOString(),
      source: article.source,
      categories: article.categories,
    };
  });
}

