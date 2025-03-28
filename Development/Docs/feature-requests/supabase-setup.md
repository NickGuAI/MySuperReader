CUJ

1. Set up supabase framework in /Users/yugu/Desktop/Cool Projects/MySuperReader/news-summarizer/lib/external-services following /Users/yugu/Desktop/Cool Projects/MySuperReader/Development/supabase/javascript/installing.mdx
2. Support Google sign in

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwavlcylvdxagrtscvad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXZsY3lsdmR4YWdydHNjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTc1MDgsImV4cCI6MjA1ODY5MzUwOH0.fUOrzaTRmrqgKHLBcH7kN5qzE2r9EcWU8hg9maJXNaw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sign in with Google
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  
  if (error) {
    console.error('Error signing in with Google:', error.message)
  }
}
```

3. Handle Auth State
After successful sign-in, Supabase automatically creates or updates the user record in your Auth schema. You can listen for authentication state changes:

```js
// Subscribe to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user)
    // Update your UI or redirect the user
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    // Update your UI
  }
})
```

4. Display signed in user name and profile name