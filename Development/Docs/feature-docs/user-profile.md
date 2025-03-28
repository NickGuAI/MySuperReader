# User Profile Feature

## Overview
This document details the user profile feature that will be implemented as part of the Inoreader OAuth integration. The profile page will display user information fetched from Inoreader and allow users to manage their preferences and log out.

## User Interface

### Profile Icon
- Replaces the Login button in the header after successful authentication
- Displays user's profile picture if available, or a default avatar
- Clicking opens a dropdown menu with quick actions:
  - View Profile
  - Settings
  - Logout

### Profile Page
- Accessible via `/profile` route
- Displays user information:
  - Username
  - Email (if available)
  - Profile picture
  - Account type (Pro/Free)
  - Subscription details
- Shows reading preferences
- Provides logout functionality

## Data Structure

### User Profile Data
```typescript
interface InoreaderUser {
  userId: string;
  userName: string;
  userProfileId: string;
  userEmail?: string;
  userPicture?: string;
  isPro: boolean;
}

interface UserPreferences {
  preferredCategories: string[];
  preferredSources: string[];
  readingMode: 'summary' | 'full';
  theme: 'light' | 'dark' | 'system';
}
```

## Technical Implementation

### Profile Storage
- Basic profile information stored in AuthContext
- Extended profile data fetched on profile page load
- Preferences stored in localStorage and synced with AuthContext

### API Services

#### Profile Service
- `fetchUserProfile()`: Get detailed user information
- `updateUserPreferences(preferences: UserPreferences)`: Update user preferences
- `getUserSubscriptions()`: Get user's subscription information

### AuthContext Integration
- Enhanced to include user profile data
- Provides methods to update profile information
- Handles synchronization with local storage

## User Flows

### Viewing Profile
1. User clicks on profile icon in header
2. Selects "View Profile" from dropdown
3. User is navigated to `/profile` route
4. Profile page loads with user information

### Updating Preferences
1. User navigates to profile page
2. Modifies preferences using the provided UI controls
3. Clicks "Save Changes"
4. Preferences are updated in AuthContext and localStorage
5. UI reflects the updated preferences

### Logout Flow
1. User clicks on profile icon
2. Selects "Logout" from dropdown
3. AuthContext clears user data and tokens
4. User is redirected to home page
5. UI reverts to unauthenticated state

## Implementation Considerations

### Privacy
- Only display information explicitly shared by Inoreader
- Provide options to control data visibility

### Performance
- Cache profile data to minimize API calls
- Load profile page progressively

### Error Handling
- Gracefully handle missing profile information
- Provide fallbacks for failed API requests

## Testing Criteria
- Profile information correctly displayed
- Preferences successfully updated and persisted
- Logout functionality properly clears user state
- UI correctly adapts between authenticated and unauthenticated states 