import { NextRequest, NextResponse } from "next/server"
import { inoreaderService } from "@/lib/external-services/inoreader-service"
import { authService } from "@/lib/external-services/auth-service"
import { supabase } from "@/lib/external-services/supabase"

/**
 * API route to initiate Inoreader OAuth2.0 authentication
 * Requires user to be logged in
 * 
 * This route will redirect the user to Inoreader for authorization
 */
export async function GET(req: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = req.headers.get('authorization')
    const userEmail = req.headers.get('x-user-email')
    
    if (!authHeader || !userEmail) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    const userId = authHeader.replace('Bearer ', '')
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      )
    }
    
    // Generate authorization URL and state token
    const { authUrl, state } = await inoreaderService.initiateAuth()
    
    // Create response with the authUrl
    const response = NextResponse.json({ authUrl })
    
    // Store CSRF state token in a secure HTTP-only cookie directly on the response
    response.cookies.set({
      name: 'inoreader_auth_state',
      value: state,
      httpOnly: true,
      secure: false, // Use true in production
      maxAge: 3600, // 1 hour
      path: '/',
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    console.error("Error initiating Inoreader auth:", error)
    
    return NextResponse.json(
      { error: "Failed to initiate authentication" },
      { status: 500 }
    )
  }
}

/**
 * API route to check if user has connected Inoreader or disconnect
 */
export async function POST(req: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = req.headers.get('authorization')
    const userEmail = req.headers.get('x-user-email')
    
    if (!authHeader || !userEmail) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    const userId = authHeader.replace('Bearer ', '')
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      )
    }
    
    const body = await req.json()
    
    // Check if this is a disconnect request
    if (body.action === "disconnect") {
      const result = await inoreaderService.disconnect(userId)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to disconnect account" },
          { status: 400 }
        )
      }
      
      return NextResponse.json({ success: true, connected: false })
    }
    
    // Otherwise, check if connected
    const connected = await inoreaderService.isConnected(userId)
    
    return NextResponse.json({
      connected,
      userId
    })
  } catch (error) {
    console.error("Error checking Inoreader connection:", error)
    
    return NextResponse.json(
      { error: "Failed to check connection status" },
      { status: 500 }
    )
  }
} 