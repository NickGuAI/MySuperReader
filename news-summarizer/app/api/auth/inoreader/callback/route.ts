import { NextRequest, NextResponse } from "next/server"
import { inoreaderService } from "@/lib/external-services/inoreader-service"
import { authService } from "@/lib/external-services/auth-service"
import { supabase } from "@/lib/external-services/supabase"

/**
 * API route to handle Inoreader OAuth2.0 callback
 * This receives the authorization code from Inoreader and exchanges it for tokens
 */
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    
    // Check if required parameters are present
    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }
    
    // Verify state to prevent CSRF attacks
    const savedState = req.cookies.get('inoreader_auth_state')?.value
    
    if (!savedState || state !== savedState) {
      return NextResponse.json(
        { error: "Invalid authorization state" },
        { status: 400 }
      )
    }
    
    // Get the user session from the request cookie
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Exchange code for tokens
    const result = await inoreaderService.exchangeCodeForTokens(code, userId, state)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to authenticate with Inoreader" },
        { status: 400 }
      )
    }
    
    // Create response with success message
    const response = NextResponse.json({ success: true })
    
    // Clear the state cookie
    response.cookies.set({
      name: 'inoreader_auth_state',
      value: '',
      expires: new Date(0), // Expire immediately
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error("Auth callback error:", error)
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 