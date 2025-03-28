# Inoreader Authentication Integration

## Plan
1. Update the inoreader-service.ts to support OAuth2.0 authentication flow
2. Create necessary API routes for authentication callback
3. Update the database schema to store Inoreader tokens
4. Implement UI components for connecting Inoreader account
5. Test the complete authentication flow

## Tasks

- [x] Update inoreader-service.ts
  - [x] Implement initiateAuth() for OAuth2.0 flow
  - [x] Add handleCallback() for processing authorization code
  - [x] Implement token exchange and refresh functionality
  - [x] Add user profile fetching capability
  - [x] Update existing news fetch to use authentication
- [x] Create API Routes
  - [x] Add /api/auth/inoreader/callback route
  - [x] Add route for initiating authentication
- [x] Database Integration
  - [x] Create inoreader table in Supabase (SQL script)
  - [x] Implement token storage functions
- [x] UI Components
  - [x] Add "Connect Inoreader" button to profile page
  - [x] Create auth callback processing page
  - [x] Update UI to show connected status
- [ ] Testing
  - [ ] Test full OAuth flow
  - [ ] Test token refresh
  - [ ] Test fetching authenticated news feed

## Implementation Details

The Inoreader authentication integration follows the standard OAuth2.0 authorization code flow:

1. User initiates authentication from the profile page
2. The application redirects to Inoreader's authorization endpoint with app credentials
3. User authorizes the application on Inoreader's consent page
4. Inoreader redirects back to our app with an authorization code
5. Our app exchanges the code for access and refresh tokens
6. Tokens are stored securely in Supabase under the user's account

The implementation is divided into several components:

- **inoreader-service.ts**: Core service that handles API interactions with Inoreader
- **auth/page.tsx**: Handles OAuth callbacks from Inoreader
- **api/auth/inoreader/route.ts**: API endpoints for auth and connection management
- **profile/page.tsx**: UI for user to connect/disconnect their Inoreader account
- **init-inoreader-table.sql**: Database script to set up token storage in Supabase 