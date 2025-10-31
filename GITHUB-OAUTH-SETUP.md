# GitHub OAuth Setup Guide for PropShield

## Prerequisites

- Supabase project created (✅ Done: kjdxxlowoyrzjyfismsi)
- GitHub account

## Step 1: Create GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps**
   URL: https://github.com/settings/developers

2. Click **"New OAuth App"**

3. Fill in the details:
   - **Application name:** PropShield AI
   - **Homepage URL:** `https://kjdxxlowoyrzjyfismsi.supabase.co`
   - **Application description:** AI-powered Property Verification Platform
   - **Authorization callback URL:** `https://kjdxxlowoyrzjyfismsi.supabase.co/auth/v1/callback`

4. Click **"Register application"**

5. You'll get:
   - **Client ID** (e.g., `Ov23liAbc123XYZ`)
   - **Client Secret** (click "Generate a new client secret")

## Step 2: Configure Supabase

1. Go to **Supabase Dashboard**
   URL: https://supabase.com/dashboard/project/kjdxxlowoyrzjyfismsi

2. Navigate to **Authentication** → **Providers**

3. Find **GitHub** in the list and click to expand

4. Enable GitHub provider and fill in:
   - **Enable GitHub provider:** Toggle ON
   - **Client ID:** Paste from GitHub OAuth App
   - **Client Secret:** Paste from GitHub OAuth App
   - **Redirect URL:** (Auto-filled) `https://kjdxxlowoyrzjyfismsi.supabase.co/auth/v1/callback`

5. Click **Save**

## Step 3: Configure Deep Linking (Already Done ✅)

The app.json is already configured with:

```json
{
  "expo": {
    "scheme": "propshield"
  }
}
```

This allows the OAuth callback to redirect to: `propshield://auth/callback`

## Step 4: Test GitHub OAuth

### In Development (Expo Go)

⚠️ **Note:** OAuth with custom deep links won't work in Expo Go. You need a development build.

### Create Development Build

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to EAS
eas login

# Create development build for iOS
eas build --profile development --platform ios

# Create development build for Android
eas build --profile development --platform android
```

### Test Flow

1. Open the app
2. Go to Login screen
3. Tap "Continue with GitHub"
4. Browser opens → GitHub authorization page
5. Click "Authorize PropShield AI"
6. Redirects back to app → `propshield://auth/callback`
7. User is logged in → Dashboard

## Step 5: Update Environment Variables (Optional)

If you want to track OAuth credentials locally:

```env
# .env.local (DO NOT COMMIT)
GITHUB_OAUTH_CLIENT_ID=Ov23liAbc123XYZ
GITHUB_OAUTH_CLIENT_SECRET=your_secret_here
```

## How GitHub OAuth Works

### 1. User Initiates Sign In

```typescript
// In login.tsx or signup.tsx
const handleGithubLogin = async () => {
  const { error } = await signInWithGithub();
  // Opens browser to GitHub authorization
};
```

### 2. Supabase Auth Context

```typescript
// In contexts/auth-context.tsx
const signInWithGithub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'propshield://auth/callback',
    },
  });
  return { error };
};
```

### 3. GitHub Authorization

- User sees GitHub authorization page
- Permissions requested: Email, profile info
- User clicks "Authorize"

### 4. Callback Handling

- GitHub redirects to Supabase callback URL
- Supabase validates the code
- Supabase creates/updates user in `auth.users`
- Profile auto-created in `profiles` table (via trigger)
- Supabase redirects to: `propshield://auth/callback`

### 5. App Deep Link Handler

```typescript
// In app/auth/callback.tsx
useEffect(() => {
  // Auth state is already updated by Supabase
  // Just redirect to main app
  router.replace('/(tabs)');
}, []);
```

## User Data from GitHub

When a user signs in with GitHub, Supabase receives:

```json
{
  "id": "uuid-generated-by-supabase",
  "email": "user@example.com",
  "user_metadata": {
    "avatar_url": "https://avatars.githubusercontent.com/u/12345",
    "email": "user@example.com",
    "email_verified": true,
    "full_name": "John Doe",
    "iss": "https://api.github.com",
    "name": "John Doe",
    "preferred_username": "johndoe",
    "provider_id": "12345",
    "sub": "12345",
    "user_name": "johndoe"
  },
  "app_metadata": {
    "provider": "github",
    "providers": ["github"]
  }
}
```

This data is automatically saved to:
- `auth.users` table (managed by Supabase)
- `profiles` table (via auto-creation trigger)

## Profile Auto-Creation Trigger

Our database trigger automatically creates a profile:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Troubleshooting

### Issue: OAuth popup doesn't open

**Solution:** Make sure you're using a development build, not Expo Go.

### Issue: "Invalid redirect URI" error

**Solution:** 
- Check GitHub OAuth App settings
- Ensure callback URL matches exactly: `https://kjdxxlowoyrzjyfismsi.supabase.co/auth/v1/callback`

### Issue: App doesn't redirect after auth

**Solution:**
- Verify `scheme: "propshield"` in app.json
- Check that `app/auth/callback.tsx` exists
- Ensure deep linking is configured in native builds

### Issue: User created but profile not created

**Solution:**
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check trigger function: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Run migration again if needed

### Issue: "Email already exists" when signing up

**Solution:**
- User might have signed up with email/password first
- Try linking accounts or use "Sign In" instead

## Security Considerations

### Client Secret Protection

- ✅ **Never commit** Client Secret to Git
- ✅ **Only configure** in Supabase Dashboard
- ✅ **Not needed** in app code (handled by Supabase)

### Deep Link Security

- ✅ Use HTTPS for all Supabase URLs
- ✅ Validate redirect URLs in GitHub OAuth settings
- ✅ Implement state parameter validation (handled by Supabase)

### User Data Privacy

- ✅ Only request necessary permissions (email, profile)
- ✅ Store minimal data in profiles table
- ✅ Use RLS policies to protect user data

## Additional OAuth Providers

Want to add more OAuth providers? Follow similar steps:

### Google OAuth

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add to Supabase: Authentication → Providers → Google
4. Update auth context:

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'propshield://auth/callback',
    },
  });
  return { error };
};
```

### Apple Sign In

1. Apple Developer Account required
2. Configure in Supabase: Authentication → Providers → Apple
3. Add capability in Xcode: "Sign in with Apple"

## Testing Checklist

- [ ] GitHub OAuth app created
- [ ] Supabase provider configured
- [ ] Development build created
- [ ] Deep linking tested
- [ ] Sign in flow tested
- [ ] Profile auto-creation verified
- [ ] User data populated correctly
- [ ] Logout tested
- [ ] Re-login tested

## Next Steps

After GitHub OAuth is working:

1. Add Google OAuth (optional)
2. Add Apple Sign In (for iOS App Store requirement)
3. Implement email verification for email/password signups
4. Add password reset functionality
5. Implement profile editing
6. Add account deletion feature

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Expo Deep Linking](https://docs.expo.dev/guides/deep-linking/)
- [Expo Authentication](https://docs.expo.dev/guides/authentication/)
