# Supabase Authentication Improvements

## Plan
1. Review current code using cookies for user identification
2. Learn how to get the authenticated user from Supabase
3. Update the Inoreader callback route to use Supabase authentication
4. Remove the dependency on cookies for storing user ID

## Tasks

- [x] Research Supabase authentication methods
  - [x] Understand how to get the current authenticated user
- [x] Update Inoreader callback route
  - [x] Replace cookie-based user ID retrieval with Supabase auth
  - [x] Remove unnecessary cookie cleanup
  - [x] Update error messages to be more descriptive
- [ ] Test the updated authentication flow
  - [ ] Verify user is correctly authenticated
  - [ ] Verify Inoreader integration works with the updated code

## Implementation Details

The implementation changes focus on using Supabase's built-in authentication methods instead of relying on cookies for user identification. The key change is using `supabase.auth.getUser()` to retrieve the currently authenticated user in server-side route handlers.

### Before:
```typescript
// Get the user ID from the cookie we set during auth initiation
const userId = req.cookies.get('inoreader_user_id')?.value

if (!userId) {
  return NextResponse.json(
    { error: "User ID not found. Please try authenticating again." },
    { status: 400 }
  )
}
```

### After:
```typescript
// Get the current authenticated user from Supabase
const { data, error } = await supabase.auth.getUser()

if (error || !data.user) {
  return NextResponse.json(
    { error: "User not authenticated. Please sign in and try again." },
    { status: 401 }
  )
}

const userId = data.user.id
```

This change improves security by relying on Supabase's authentication system rather than manually managing user IDs in cookies. 