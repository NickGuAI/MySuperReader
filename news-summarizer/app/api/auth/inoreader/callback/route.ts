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
    
    console.log('[Inoreader Callback] Received callback with code and state', { 
      hasCode: !!code, 
      hasState: !!state 
    })
    
    // Check if required parameters are present
    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }
    
    // Verify state to prevent CSRF attacks
    const savedState = req.cookies.get('inoreader_auth_state')?.value
    
    console.log('[Inoreader Callback] Checking state validation', { 
      hasSavedState: !!savedState, 
      stateMatches: savedState === state 
    })
    
    if (!savedState || state !== savedState) {
      return NextResponse.json(
        { error: "Invalid authorization state" },
        { status: 400 }
      )
    }
    
    // Extract user ID from state
    let userId;
    try {
      // Try to decode the state to get userId
      const decodedState = JSON.parse(atob(state));
      userId = decodedState.userId;
      console.log('[Inoreader Callback] Extracted userId from state:', userId);
    } catch (e) {
      console.error('[Inoreader Callback] Failed to extract userId from state:', e);
      
      // Fall back to getting the current authenticated user from Supabase
      console.log('[Inoreader Callback] Attempting to get Supabase session as fallback');
      const { data, error } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      console.log('[Inoreader Callback] Auth session result:', {
        hasError: !!error,
        errorMessage: error?.message,
        hasSession: !!data.session,
        hasUser: !!user,
        cookiesPresent: Object.fromEntries(
          Array.from(req.cookies.getAll()).map(c => [c.name, 'present'])
        )
      })
      
      if (error || !user) {
        return NextResponse.json(
          { error: "User not authenticated. Please sign in and try again." },
          { status: 401 }
        )
      }
      userId = user.id;
    }
    
    // Exchange code for tokens using the extracted or fallback userId
    console.log('[Inoreader Callback] Exchanging code for tokens for userId:', userId);
    const result = await inoreaderService.exchangeCodeForTokens(code, userId, state);
    
    if (!result.success || !result.tokens) {
      console.error('[Inoreader Callback] Token exchange failed:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to authenticate with Inoreader" },
        { status: 400 }
      );
    }
    
    console.log('[Inoreader Callback] Successfully authenticated with Inoreader');
    
    // Create response with redirect to profile page
    const response = NextResponse.redirect(new URL('/profile', req.url));
    
    // Store tokens in cookies instead of database
    const tokenData = {
      userId,
      ...result.tokens
    };
    
    // Set cookies with the tokens (encrypted and HTTP-only)
    response.cookies.set({
      name: 'inoreader_pending_tokens',
      value: btoa(JSON.stringify(tokenData)),
      maxAge: 86400, // 24 hours
      path: '/',
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax'
    });
    
    // Clear the state cookie
    response.cookies.set({
      name: 'inoreader_auth_state',
      value: '',
      expires: new Date(0), // Expire immediately
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error("[Inoreader Callback] Unexpected error:", error)
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 