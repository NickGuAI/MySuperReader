# Supabase Authentication Integration

This document describes the implementation of Supabase authentication in the MySuperReader application, focusing on Google OAuth sign-in.

## Overview

The application now supports authentication using Supabase, with the following features:
- Google OAuth sign-in
- Session persistence between page refreshes
- Real-time authentication state updates
- User profile data mapping

## Implementation Details

### 1. Supabase Client Setup

The Supabase client is configured in `news-summarizer/lib/external-services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwavlcylvdxagrtscvad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXZsY3lsdmR4YWdydHNjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTc1MDgsImV4cCI6MjA1ODY5MzUwOH0.fUOrzaTRmrqgKHLBcH7kN5qzE2r9EcWU8hg9maJXNaw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isClientSide = () => typeof window !== 'undefined'
```

### 2. Authentication Service

The authentication service in `news-summarizer/lib/external-services/auth-service.ts` has been updated to use Supabase for authentication. It includes the following key functions:

- `signInWithGoogle()`: Initiates Google OAuth sign-in
- `login(username, password)`: Legacy login method (still supported)
- `logout()`: Signs out the current user
- `getCurrentUser()`: Retrieves the current authenticated user
- `onAuthStateChange(callback)`: Sets up a listener for auth state changes
- `updateUserPreferences(preferences)`: Updates user preferences in Supabase user metadata
- `mapSupabaseUser(supabaseUser)`: Maps Supabase user to the application's User type

### 3. Auth Context

The Auth Context (`news-summarizer/contexts/auth-context.tsx`) has been updated to:

- Support Google sign-in
- Listen for auth state changes
- Make getCurrentUser asynchronous
- Add automatic redirect when user signs in

```typescript
// Auth Context includes:
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  updatePreferences: (preferences: Partial<User["preferences"]>) => Promise<{ success: boolean; error?: string }>
}
```

### 4. User Interface Updates

The login page now includes a Google sign-in button and maintains the original username/password login as a fallback option.

## User Flow

1. User visits the login page
2. User can choose to:
   - Sign in with Google (recommended)
   - Sign in with username/password (legacy)
3. After successful authentication:
   - User is redirected to the dashboard
   - User profile information from Google (name, email, avatar) is displayed
   - Auth state is persisted between page refreshes

## Technical Notes

- Supabase handles token management and session persistence
- User profile data is stored in Supabase user metadata
- Auth state is synchronized across tabs/windows

## Future Improvements

- Add additional OAuth providers (GitHub, Twitter, etc.)
- Implement email/password sign-up
- Add password reset functionality
- Enhance user profile with additional fields 