# PropShield AI - Troubleshooting Guide

## Common Issues and Solutions

### 1. ❌ PGRST204 Error: "Could not find the 'overall_score' column"

**Error Message:**
```
ERROR Verification creation error: {"code": "PGRST204", "details": null, "hint": null, 
"message": "Could not find the 'overall_score' column of 'verifications' in the schema cache"}
```

**Root Cause:**
- Metro bundler cache is serving old code
- The code was previously using `overall_score` but the database schema uses `fraud_score`

**Solution:**
1. **Stop all processes:**
   ```powershell
   # Windows PowerShell
   Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*expo*"} | Stop-Process -Force
   
   # macOS/Linux
   killall node
   killall expo
   ```

2. **Clear all caches:**
   ```bash
   # Clear Metro bundler cache
   npx expo start --clear
   
   # OR if that doesn't work, manually delete cache folders:
   rm -rf .expo
   rm -rf node_modules/.cache
   rm -rf $TMPDIR/metro-*
   rm -rf $TMPDIR/haste-*
   ```

3. **Restart the development server:**
   ```bash
   npm run android
   # or
   npm run ios
   # or
   npm run web
   ```

4. **Force reload the app:**
   - Press `r` in the Metro terminal to reload
   - Or shake your device and select "Reload"

**Verification:**
The correct code in `app/upload.tsx` should be:
```typescript
.insert({
  user_id: user.id,
  property_address: 'Address to be updated',
  status: 'pending',
  fraud_score: 0,        // ✅ Correct column name
  risk_rating: 'pending',
})
```

---

### 2. 🔒 Storage Upload Errors

**Error:** Files upload but database insert fails

**Common Causes:**
- Missing RLS policies
- Incorrect bucket configuration
- Invalid file paths

**Solutions:**

#### Check RLS Policies:
```sql
-- Verify policies exist
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('verifications', 'documents');

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'documents';
```

#### Verify Bucket Configuration:
```bash
# Using Supabase MCP or Dashboard
- Bucket: documents
- Public: false
- Max file size: 50MB
- Allowed MIME types: application/pdf, image/*, application/msword, etc.
```

#### Check File Path Format:
```typescript
// Correct format: {userId}/{verificationId}/{filename}
const filePath = `${user.id}/${verificationId}/${filename}`;
```

---

### 3. 🔐 Authentication Issues

**Error:** "User must be logged in" or "Invalid JWT"

**Solutions:**

#### Check Environment Variables:
```bash
# .env file must have:
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Verify Auth Session:
```typescript
import { supabase } from '@/lib/supabase';

// Check current session
const { data: { session }, error } = await supabase.auth.getSession();
console.log('Current session:', session);
console.log('User:', session?.user);
```

#### Clear Auth Cache:
```bash
# Clear app data on Android
adb shell pm clear host.exp.exponent

# Or use device settings: Settings > Apps > Expo Go > Clear Data
```

---

### 4. 📦 Metro Bundler Issues

**Error:** "Unable to resolve module" or build failures

**Solutions:**

#### Full Clean Install:
```bash
# 1. Stop all processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 2. Remove dependencies
rm -rf node_modules
rm package-lock.json

# 3. Clear all caches
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
npx expo start --clear

# 4. Reinstall
npm install

# 5. Start fresh
npm run android -- --clear
```

#### Check TypeScript Configuration:
```json
// tsconfig.json should include:
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### 5. 🗄️ Database Schema Mismatches

**Error:** PGRST errors about missing columns

**Root Cause:**
- Code expects different column names than database
- Schema was changed but types not regenerated

**Solutions:**

#### Regenerate TypeScript Types:
```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id kjdxxlowoyrzjyfismsi > lib/supabase.types.ts

# Or use Supabase MCP in VS Code
```

#### Verify Schema Matches Code:
```sql
-- Check actual schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'verifications'
ORDER BY ordinal_position;

-- Expected columns:
-- id (uuid)
-- user_id (uuid)
-- property_address (text)
-- property_type (text)
-- status (text)
-- fraud_score (integer)      ← Note: NOT overall_score
-- risk_rating (text)
-- report_url (text)
-- metadata (jsonb)
-- created_at (timestamptz)
-- updated_at (timestamptz)
```

#### Update Code to Match Schema:
```typescript
// Always use the correct column names from schema
// Check lib/supabase.types.ts for the exact type definitions
import { Database } from '@/lib/supabase.types';

type Verification = Database['public']['Tables']['verifications']['Row'];
```

---

### 6. 🎯 Common Development Issues

#### Issue: Changes not reflecting in app

**Solutions:**
1. Press `r` in Metro terminal to reload
2. Clear cache: `npx expo start --clear`
3. Close and reopen app completely
4. Check for errors in Metro terminal

#### Issue: TypeScript errors

**Solutions:**
1. Restart TypeScript server in VS Code: `Cmd/Ctrl + Shift + P` → "Restart TypeScript Server"
2. Check `tsconfig.json` configuration
3. Ensure all dependencies are installed
4. Regenerate types if using Supabase

#### Issue: Build errors

**Solutions:**
```bash
# For Android
cd android && ./gradlew clean && cd ..
npx expo run:android --clear

# For iOS
cd ios && pod deintegrate && pod install && cd ..
npx expo run:ios --clear
```

---

## Debugging Checklist

Before reporting an issue, verify:

- [ ] All dependencies installed: `npm install`
- [ ] Environment variables set correctly in `.env`
- [ ] Metro cache cleared: `npx expo start --clear`
- [ ] Device/emulator restarted
- [ ] Latest code pulled from repository
- [ ] No TypeScript errors in VS Code
- [ ] Supabase connection working (check Dashboard)
- [ ] RLS policies enabled and correct
- [ ] Storage buckets configured properly
- [ ] Database schema matches code expectations

---

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Metro bundler terminal
   - `npx react-native log-android` (Android)
   - `npx react-native log-ios` (iOS)

2. **Verify Supabase connection:**
   - Check Supabase Dashboard for errors
   - Review API logs in Supabase
   - Test queries in SQL Editor

3. **Search existing issues:**
   - GitHub repository issues
   - Expo documentation
   - Supabase documentation

4. **Report the issue:**
   - Include error messages
   - Provide steps to reproduce
   - Share relevant code snippets
   - Mention your environment (OS, Node version, Expo SDK version)

---

## Prevention Best Practices

1. **Always clear cache when switching branches:**
   ```bash
   npx expo start --clear
   ```

2. **Keep dependencies updated:**
   ```bash
   npx expo install --fix
   ```

3. **Regenerate types after schema changes:**
   ```bash
   # After any database schema changes
   npx supabase gen types typescript --project-id <your-project-id> > lib/supabase.types.ts
   ```

4. **Use TypeScript strict mode:**
   - Catches type mismatches early
   - Prevents runtime errors

5. **Test after major changes:**
   - Clear cache and restart
   - Test on both platforms (iOS/Android)
   - Verify in production environment

---

## Quick Reference Commands

```bash
# Clear everything and start fresh
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
rm -rf node_modules .expo $TMPDIR/metro-* $TMPDIR/haste-*
npm install
npx expo start --clear

# Regenerate types
npx supabase gen types typescript --project-id kjdxxlowoyrzjyfismsi > lib/supabase.types.ts

# Check Supabase status
npx supabase status

# View logs
npx react-native log-android
npx react-native log-ios

# Force reload app
# In Metro terminal: press 'r'
# On device: shake and select "Reload"
```

---

**Last Updated:** October 31, 2025
**PropShield AI Version:** 1.0.0
**Expo SDK:** 54.0.0
