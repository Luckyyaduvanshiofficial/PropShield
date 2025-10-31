# Authentication Testing Guide

## Current Status
✅ Expo server running on http://localhost:8082  
✅ App loaded in browser

---

## Manual Testing Checklist

### 🧪 Test 1: Initial App Load & Navigation

**Steps:**
1. ✅ App should load successfully
2. Check if you see the dashboard or login screen
3. Verify theming works (light/dark mode)

**Expected Result:**
- App loads without errors
- Dashboard shows if not logged in (or login screen if auth redirect is working)

---

### 🧪 Test 2: Registration Flow (Sign Up)

**Steps:**
1. Navigate to signup screen (from dashboard, click "Login" then "Sign Up")
2. Fill in the form:
   - **Full Name:** Test User
   - **Email:** test@propshield.com (use a real email you have access to)
   - **Password:** TestPassword123!
   - **Confirm Password:** TestPassword123!
3. Click "Sign Up" button

**Expected Result:**
- ✅ Form validation works
- ✅ Loading state shows "Creating Account..."
- ✅ Success alert: "Account created! Please check your email to verify your account."
- ✅ Redirects to login screen
- ✅ Email verification sent to your inbox

**Potential Issues to Watch:**
- ❌ "User already registered" - Use a different email
- ❌ Password too short - Must be 8+ characters
- ❌ Network error - Check Supabase credentials in .env

---

### 🧪 Test 3: Email Verification

**Steps:**
1. Check your email inbox for verification email from Supabase
2. Click the verification link in the email
3. Should redirect to Supabase confirmation page

**Expected Result:**
- ✅ Verification email received (check spam folder)
- ✅ Link opens Supabase confirmation page
- ✅ Email verified successfully

**Note:** Without email verification, login might not work depending on Supabase settings.

---

### 🧪 Test 4: Login Flow (Email/Password)

**Steps:**
1. Go to login screen
2. Enter credentials:
   - **Email:** test@propshield.com
   - **Password:** TestPassword123!
3. Click "Sign In" button

**Expected Result:**
- ✅ Loading state shows "Signing in..."
- ✅ Successfully authenticated
- ✅ Redirected to dashboard (tabs) automatically
- ✅ Auth state updates (user logged in)

**Potential Issues:**
- ❌ "Invalid credentials" - Email not verified or wrong password
- ❌ "Email not confirmed" - Check email and verify first
- ❌ Stays on login screen - Check console for errors

---

### 🧪 Test 5: Profile Auto-Creation

**Steps:**
1. After successful login, open browser DevTools (F12)
2. Go to Console tab
3. Type and run:
   ```javascript
   const { data } = await supabase.from('profiles').select('*').single()
   console.log(data)
   ```

**Expected Result:**
- ✅ Profile record exists in database
- ✅ Contains your email
- ✅ `created_at` timestamp present
- ✅ `role` defaults to 'user'

**Alternative Check:**
- Go to Supabase Dashboard → Table Editor → profiles table
- Should see your user profile

---

### 🧪 Test 6: Protected Routes

**Steps:**
1. While logged in, try to access:
   - Dashboard: http://localhost:8082/
   - Upload Document: Click "Upload Property Documents"
   - Verification Status: Click "View Status"

2. All should be accessible

3. Now logout (we'll implement logout button next)
4. Try accessing the same routes

**Expected Result:**
- ✅ Logged in: All routes accessible
- ✅ Logged out: Redirects to /login automatically
- ✅ Protected route logic working

---

### 🧪 Test 7: Login Error Handling

**Steps:**
1. Try login with wrong password:
   - **Email:** test@propshield.com
   - **Password:** WrongPassword123!
2. Try login with non-existent email:
   - **Email:** nonexistent@test.com
   - **Password:** TestPassword123!

**Expected Result:**
- ✅ Shows error alert: "Invalid credentials" or "Failed to sign in"
- ✅ Stays on login screen
- ✅ No crash or console errors

---

### 🧪 Test 8: Form Validation

**Test Signup Validation:**
1. Try submitting with empty fields → Should show "Please fill in all fields"
2. Try passwords that don't match → Should show "Passwords do not match"
3. Try password < 8 chars → Should show "Password must be at least 8 characters"

**Test Login Validation:**
1. Try submitting with empty email → Should show "Please fill in all fields"
2. Try submitting with empty password → Should show "Please fill in all fields"

**Expected Result:**
- ✅ All validation working
- ✅ User-friendly error messages
- ✅ No form submission until valid

---

### 🧪 Test 9: GitHub OAuth (Optional - Requires Setup)

**Prerequisites:**
- GitHub OAuth app must be configured (see GITHUB-OAUTH-SETUP.md)
- Credentials added to Supabase Dashboard

**Steps:**
1. Go to login screen
2. Click "⚫ Continue with GitHub" button
3. Should redirect to GitHub authorization page
4. Authorize the app
5. Redirects back to app

**Expected Result:**
- ✅ GitHub OAuth popup/redirect works
- ✅ Successfully authenticates
- ✅ Redirects to dashboard
- ✅ Profile auto-created in database

**Note:** This will only work after GitHub OAuth setup is complete.

---

### 🧪 Test 10: Session Persistence

**Steps:**
1. Login successfully
2. Refresh the page (F5 or Ctrl+R)
3. Check if still logged in

**Expected Result:**
- ✅ User stays logged in after refresh
- ✅ Auth state persists
- ✅ No redirect to login

---

### 🧪 Test 11: Logout (Once Implemented)

**Steps:**
1. Navigate to profile/settings (when implemented)
2. Click logout button
3. Should redirect to login screen

**Expected Result:**
- ✅ Successfully logged out
- ✅ Redirected to login
- ✅ Session cleared
- ✅ Cannot access protected routes

---

## Debugging Tips

### Check Supabase Connection

Open browser console and run:
```javascript
// Check if Supabase client is initialized
console.log(supabase)

// Check current session
supabase.auth.getSession().then(({ data }) => {
  console.log('Current session:', data.session)
})

// Check current user
supabase.auth.getUser().then(({ data }) => {
  console.log('Current user:', data.user)
})
```

### Check Environment Variables

In browser console:
```javascript
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL)
// Should show: https://kjdxxlowoyrzjyfismsi.supabase.co

console.log('Has Anon Key:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
// Should show: true
```

### Check Auth State

Add this to any component:
```typescript
const { user, session, loading } = useAuth();

console.log('Auth State:', { user, session, loading });
```

### Common Errors & Solutions

**Error: "Invalid API key"**
- Solution: Check EXPO_PUBLIC_SUPABASE_ANON_KEY in .env

**Error: "Network request failed"**
- Solution: Check EXPO_PUBLIC_SUPABASE_URL in .env
- Verify internet connection
- Check Supabase project is active

**Error: "Email not confirmed"**
- Solution: Check email inbox for verification link
- Verify email in Supabase Dashboard → Authentication → Users

**Error: "User already registered"**
- Solution: Use different email or login with existing credentials

**Error: Profile not created**
- Solution: Check trigger exists in Supabase → Database → Functions
- Verify RLS policies allow profile creation

---

## Testing Supabase Backend Directly

### Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/kjdxxlowoyrzjyfismsi
2. Navigate to **Authentication** → **Users**
3. You should see your test user listed
4. Navigate to **Table Editor** → **profiles**
5. Verify profile was auto-created

### Via SQL Editor

Run these queries in Supabase SQL Editor:

```sql
-- Check if user exists in auth.users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'test@propshield.com';

-- Check if profile was created
SELECT * FROM profiles 
WHERE email = 'test@propshield.com';

-- Check all profiles
SELECT * FROM profiles;

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';
```

---

## Test Results Template

Use this to track your testing:

```
✅ Test 1: Initial App Load - PASSED
✅ Test 2: Registration Flow - PASSED
✅ Test 3: Email Verification - PASSED
✅ Test 4: Login Flow - PASSED
✅ Test 5: Profile Auto-Creation - PASSED
✅ Test 6: Protected Routes - PASSED
✅ Test 7: Login Error Handling - PASSED
✅ Test 8: Form Validation - PASSED
⏭️ Test 9: GitHub OAuth - SKIPPED (Setup required)
✅ Test 10: Session Persistence - PASSED
⏭️ Test 11: Logout - PENDING (Not implemented yet)
```

---

## Next Steps After Testing

If all tests pass:
1. ✅ Mark Todo #3 as fully tested
2. ✅ Document any issues found
3. ✅ Proceed to Todo #5 (Document Upload System)

If issues found:
1. ❌ Document the issue
2. 🔧 Fix the bug
3. 🔄 Re-test
4. ✅ Proceed when all tests pass

---

## Additional Manual Tests

### Test on Different Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Test on Different Devices
- [ ] Desktop
- [ ] Android (via Expo Go)
- [ ] iOS (via Expo Go)
- [ ] Tablet

---

## Performance Testing

Monitor these metrics during testing:

**Load Times:**
- Initial app load: < 3 seconds
- Login response: < 2 seconds
- Signup response: < 2 seconds
- Navigation: < 500ms

**Network:**
- API calls should complete successfully
- Proper error handling for network failures

**Memory:**
- No memory leaks on page refresh
- Smooth animations and transitions

---

## Security Testing

**Check:**
- [ ] Passwords not visible in DevTools Network tab
- [ ] Tokens stored securely (not in localStorage on native)
- [ ] Session expires appropriately
- [ ] Protected routes truly protected
- [ ] No sensitive data logged to console

---

**Happy Testing! 🧪**

Report any issues you find, and we'll fix them before moving forward.
