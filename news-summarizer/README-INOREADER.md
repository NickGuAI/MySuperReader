# Inoreader Integration Setup Guide

This guide explains how to set up and configure the Inoreader OAuth2.0 integration for the news summarizer application.

## Prerequisites

1. An Inoreader developer account
2. A Supabase project

## Step 1: Register Inoreader API Application

1. Visit the [Inoreader Developer Page](https://www.inoreader.com/developers)
2. Register a new application with the following details:
   - **Name**: News Summarizer
   - **Description**: A personal news summarizer application
   - **Website**: Your application URL (e.g., http://localhost:3000)
   - **Redirect URI**: Your auth callback URL (e.g., http://localhost:3000/auth)
3. After registration, you'll receive a **Client ID** and **Client Secret**

## Step 2: Set Up Environment Variables

Create or update your `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_INOREADER_CLIENT_ID=your_client_id
INOREADER_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Note: The client ID is marked as public since it's used in the client-side code. The client secret should never be exposed to the client.

## Step 3: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `scripts/init-inoreader-table.sql`

This will create the necessary table and set up row-level security policies to protect user data.

## Step 4: Install Dependencies

Make sure you have the required dependencies installed:

```
npm install uuid --save
npm install --save-dev @types/uuid @types/node
```

## Step 5: Update Your Application Code

Ensure the following files are updated:

1. `lib/external-services/inoreader-service.ts`: Contains the OAuth2.0 authentication flow
2. `app/auth/page.tsx`: Handles the OAuth callback
3. `app/api/auth/inoreader/route.ts`: API endpoints for initiating auth and checking connection status
4. `app/profile/page.tsx`: UI components for connecting/disconnecting Inoreader

## Testing the Integration

1. Start your development server:
   ```
   npm run dev
   ```

2. Navigate to your profile page
3. Click the "Connect Inoreader" button
4. Authenticate with your Inoreader credentials
5. You should be redirected back to your application and see a success message

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure:
- Your redirect URI exactly matches what's registered in the Inoreader application
- You're using HTTPS if required by Inoreader

### Authentication Errors
- Double-check that your Client ID and Client Secret are correct
- Ensure the database table is properly set up
- Check for any typos in the redirect URI

### Token Storage Issues
- Verify that your Supabase connection is working
- Ensure the user has permission to write to the inoreader table 