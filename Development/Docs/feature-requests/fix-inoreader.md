## Fix Inoreader Authentication with Database Insert

### Current Situation

- The Inoreader OAuth callback route handles receiving the authorization code and state.
- The client ID and secret for Inoreader are stored in Supabase (see below):

```
id	created_at	provider	client_id	client_secret
1	2025-03-28 01:48:59+00	inoreader	1000002136	N6ArNlikpYBnJlDRN0sgCYucFZcoe1E9
```

### Issues

- After redirection to the Inoreader authentication page, the user session is lost, which makes it impossible to perform authenticated inserts into Supabase from the client side.

### Detailed Fix Plan

1. **Move Token Insertion to the Server Side**
   - During the Inoreader OAuth callback (e.g., in `app/api/auth/inoreader/callback/route.ts`), process the authentication entirely on the server.
   
2. **Use a Service Role Supabase Client**
   - Configure a Supabase client instance that uses the service role key (stored securely in environment variables). This client bypasses row-level security and allows database inserts without a user session.
   
3. **Validate and Process the Callback**
   - Retrieve the `code` and `state` parameters from the callback URL.
   - Validate these parameters and verify the state against a previously stored value (to protect against CSRF attacks).
   - Extract the user ID from the state parameter to associate the tokens with the correct user.

4. **Exchange Authorization Code for Tokens**
   - Call Inoreader's token exchange endpoint with the authorization code.
   - Parse the response to obtain the `access_token` and `refresh_token`.

5. **Insert Tokens into Supabase**
   - Using the service role Supabase client, perform an `upsert` into the `inoreader` table with the following fields:
     - `user_id`: Extracted from the state parameter.
     - `access_token`: Received from Inoreader.
     - `refresh_token`: Received from Inoreader.
     - `created_at`: Current timestamp (to track when the token was inserted).

6. **Clean Up and Redirect**
   - Clear any temporary cookies or state that were used to manage the OAuth flow.
   - Redirect the user back to their profile page or another appropriate location.

7. **Security and Testing Considerations**
   - Ensure all communications are done over HTTPS.
   - Verify that the service role key is never exposed to the client-side code.
   - Add tests to verify the callback flow, state verification, token exchange, and database insertion.

### Summary

By shifting the token insertion process to a server-side API route that uses a Supabase client configured with the service role, we can ensure that tokens are securely stored in the database without requiring an active user session. This method handles the loss of client authentication post-redirect and leverages server-side security to manage sensitive token data.

### Implementation Report

The fix has been implemented with the following changes:

1. **Created a Service Role Supabase Client**
   - Added a new file `news-summarizer/lib/external-services/supabase-admin.ts` that creates a Supabase client with service role access.
   - This client bypasses row-level security and allows database operations without user authentication.

2. **Updated the Inoreader Callback Route**
   - Modified `news-summarizer/app/api/auth/inoreader/callback/route.ts` to use the service role client.
   - Removed the code that stored tokens in cookies.
   - Added code to store tokens directly in the Supabase `inoreader` table.

3. **Updated the Profile Page**
   - Modified `news-summarizer/app/profile/page.tsx` to remove the token syncing from cookies logic.
   - The profile page now relies on the API to check if Inoreader is connected by querying the database.

4. **Deprecated the Token Sync Endpoint**
   - Added a deprecated notice to `news-summarizer/app/api/auth/token-sync/route.ts` since this endpoint is no longer needed.
   - The route now returns a 410 Gone status code with a message indicating that it's deprecated.

5. **Security Benefits**
   - Tokens are no longer exposed to the client-side code.
   - All token handling occurs on the server side.
   - The service role key is used only in server-side code and is not exposed to clients.

This implementation ensures a more secure and reliable authentication flow with Inoreader, while avoiding the issues caused by session loss during the OAuth redirect process.






