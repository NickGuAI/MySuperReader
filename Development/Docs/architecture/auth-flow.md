# Authentication Flow Architecture

## Overview
This document describes the authentication flow architecture for integrating Inoreader OAuth2.0 into our news summarizer application.

## Authentication Flow Diagram

```
┌──────────┐     1. Click Login     ┌──────────────┐
│   User   │────────────────────────▶ News App UI  │
└──────────┘                        └──────────────┘
     ▲                                     │
     │                                     │ 2. Redirect to Inoreader
     │                                     ▼
     │                             ┌───────────────────┐
     │                             │ Inoreader Auth UI │
     │                             └───────────────────┘
     │                                     │
     │                                     │ 3. User Authorizes
     │                                     ▼
     │                             ┌───────────────────┐
     │        7. Redirect          │    Inoreader      │
     │◀────────────────────────────│    OAuth API      │
     │                             └───────────────────┘
     │                                     ▲
     │                                     │ 4. Return Auth Code
     │                                     │
┌────┴─────┐     6. Store Tokens   ┌──────────────┐
│ News App │◀────────────────────────│  /auth      │
│ Home Page│                        │  Callback   │ 5. Exchange Code for Tokens
└──────────┘                        └─────┬────────┘      ┌───────────────┐
                                          └────────────────▶ Token API     │
                                                           └───────────────┘
```

## Components and Responsibilities

### Client-side Components

1. **Auth Button Component**
   - Triggers the OAuth flow
   - Redirects to Inoreader authorization URL
   - Includes CSRF protection

2. **Auth Callback Page (`/auth`)**
   - Receives the authorization code
   - Exchanges code for tokens
   - Stores tokens securely
   - Redirects to home page

3. **Auth Context Provider**
   - Manages authentication state
   - Provides login/logout methods
   - Handles token refresh
   - Stores user profile

4. **Profile Icon Component**
   - Displays authentication status
   - Shows user profile picture
   - Provides dropdown menu with actions

### Authentication Services

1. **InoreaderAuthService**
   - Generates authorization URL
   - Handles token exchange
   - Manages token refresh
   - Fetches user profile

2. **Token Storage Service**
   - Securely stores tokens
   - Handles token encryption/decryption
   - Manages token expiration

3. **User Profile Service**
   - Fetches and stores user information
   - Updates user preferences
   - Manages profile data

## Authentication States

1. **Unauthenticated**
   - No valid tokens
   - Login button visible
   - Limited app functionality

2. **Authenticating**
   - OAuth flow in progress
   - Loading indicators
   - Temporary state during auth process

3. **Authenticated**
   - Valid tokens available
   - User profile loaded
   - Full app functionality
   - Profile icon visible

4. **Token Refresh**
   - Access token expired
   - Using refresh token to get new access token
   - Transparent to user

5. **Authentication Error**
   - Failed auth attempt
   - Error displayed to user
   - Option to retry

## Security Considerations

1. **CSRF Protection**
   - State parameter in OAuth flow
   - Validation on callback

2. **Token Storage**
   - Access token: HTTP-only cookie
   - Refresh token: HTTP-only cookie with strict path
   - Token encryption at rest

3. **Token Validation**
   - Expiration check before API requests
   - Automatic refresh when expired

4. **Error Handling**
   - Rate limiting for failed auth attempts
   - Secure error messages (no sensitive data)

## Data Flow

1. **Login Flow**
   - User clicks "Sign in with Inoreader"
   - App generates state parameter and stores it
   - Redirect to Inoreader auth page
   - User approves app
   - Redirect to `/auth` with code
   - Code exchanged for tokens
   - Tokens stored, user profile fetched
   - Redirect to home page

2. **Token Refresh Flow**
   - Before API request, check token expiration
   - If expired, use refresh token to get new access token
   - Update stored tokens
   - Continue with original API request

3. **Logout Flow**
   - User initiates logout
   - Clear tokens and user data
   - Reset auth state
   - Redirect to home page 