# Inoreader Authentication Integration

## Overview
This document details the implementation plan for integrating Inoreader's OAuth2.0 authentication into our news summarizer application.

This provides a way for user to authenticate and connect their inoreader account, but doesn't replace existing authentication like Google.

Refer to /Users/yugu/Desktop/Cool Projects/MySuperReader/Development/Docs/worklogs/20240711-supabase-google-auth.md for supabase setup

## User Authentication Flow
0. All inoreader API calls are handled in /Users/yugu/Desktop/Cool Projects/MySuperReader/news-summarizer/lib/external-services/inoreader-service.ts and hiddne behind server APIs. the cliends only talk to server API through inoreader-service and never direclty with inoreader

1. User clicks "Connect Inoreader" button
   - inoreaderService.initiateAuth() generates CSRF token and constructs authorization URL
   - User is redirected to: https://www.inoreader.com/oauth2/auth with:
     - client_id from env
     - redirect_uri=http://localhost:3000/auth 
     - response_type=code
     - scope=read
     - state=generated CSRF token

2. User approves permissions on Inoreader consent page

3. Inoreader redirects to http://localhost:3000/auth with:
   - authorization code
   - state parameter (CSRF token)

4. Auth callback handler:
   - Verifies state matches original CSRF token
   - Calls inoreaderService.exchangeCodeForTokens() which:
     - POSTs to https://www.inoreader.com/oauth2/token
     - Exchanges code for access & refresh tokens
     - Stores tokens and expiration
   - Save ACCESS_TOKEN and REFRESH_TOKEN into supabase
     - Table: inoreader
       - Columns
         - id
         - created_at
         - access_token
         - refresh_token
         - user_id (uuid of authenticated user)

5. inoreaderService.getUserProfile() fetches user info using access token

6. User session is created and they can access personalized feed
   - All subsequent API calls use stored access token
   - Token refresh handled automatically by inoreaderService

7. If token expired, request new ones and update database.

## Technical Architecture

### OAuth2.0 Implementation
Following Inoreader's OAuth2.0 specification:

1. **Authorization Request**
   ```
   https://www.inoreader.com/oauth2/auth?
     client_id=[CLIENT_ID]&
     redirect_uri=http://localhost:3000/auth&
     response_type=code&
     scope=read&
     state=[CSRF_TOKEN]
   ```

2. **Token Exchange**
   - Endpoint: `https://www.inoreader.com/oauth2/token`
   - Method: POST
   - Headers: `Content-type: application/x-www-form-urlencoded`
   - Body: 
     ```
     code=[AUTHORIZATION_CODE]&
     redirect_uri=http://localhost:3000/auth&
     client_id=[CLIENT_ID]&
     client_secret=[CLIENT_SECRET]&
     grant_type=authorization_code
     ```

3. **Token Refresh**
   - Endpoint: `https://www.inoreader.com/oauth2/token`
   - Method: POST
   - Body:
     ```
     client_id=[CLIENT_ID]&
     client_secret=[CLIENT_SECRET]&
     grant_type=refresh_token&
     refresh_token=[REFRESH_TOKEN]
     ```

### Data Models

#### Auth State
```typescript
interface AuthState {
  user: InoreaderUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}
```

#### User Profile
```typescript
interface InoreaderUser {
  userId: string;
  userName: string;
  userProfileId: string;
  userEmail?: string;
  userPicture?: string;
  isPro: boolean;
}
```

### API Services

#### InoreaderAuthService
- `initiateAuth()`: Redirect to Inoreader authorization page
- `handleCallback(code: string)`: Exchange code for tokens
- `refreshToken()`: Handle token refresh
- `fetchUserProfile()`: Get user information
- `logout()`: Clear auth state

#### InoreaderService (Extended)
- Updated to use authentication tokens
- Handle token refresh on API calls
- Include error handling for auth failures

### Storage Strategy
- Tokens stored in HTTP-only cookies for security
- Basic user profile info cached in localStorage for UI purposes
- Full profile data fetched from API when needed

## UI Components

### Auth Callback Page
- Handles `/auth` route
- Processes authorization code
- Shows loading state during token exchange
- Redirects to home page after successful authentication

### User Profile Page
- Displays user information from Inoreader
- Shows subscription details
- Allows preference management
- Provides logout option

### Header Integration
- Login button replaced with profile icon when authenticated
- Profile dropdown with quick actions
- Visual indicator of authentication state

## Security Considerations
1. CSRF protection using state parameter
2. Secure token storage in HTTP-only cookies
3. Access token validation before API requests
4. Proper error handling for auth failures
5. Token refresh strategy to maintain session

## Implementation Phases

### Phase 1: Core Authentication
- Implement OAuth2.0 flow
- Create auth callback handler
- Update auth context with Inoreader methods

### Phase 2: User Profile
- Fetch and store user profile data
- Create profile page
- Implement UI changes for logged-in state

### Phase 3: Integration with News Feed
- Connect authentication with news fetching
- Personalize content based on user preferences
- Implement proper error handling for API requests

## Testing Criteria
- Successful OAuth flow completion
- Proper token storage and management
- Correct handling of auth errors
- Session persistence across page reloads
- Successful token refresh
- Clean logout process 