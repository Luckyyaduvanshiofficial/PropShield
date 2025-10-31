# Bug Fix: PGRST204 overall_score Column Error

## 🐛 Issue Description

**Error Message:**
```
ERROR Verification creation error: {"code": "PGRST204", "details": null, "hint": null, 
"message": "Could not find the 'overall_score' column of 'verifications' in the schema cache"}
```

**Root Cause:**
- Metro bundler was caching old code that used `overall_score` column
- The actual database schema uses `fraud_score` column instead
- Even though the code was fixed, the bundler continued serving cached version

## ✅ Fix Applied

### 1. Code Fix (Already Applied)

**File:** `app/upload.tsx` (Lines 118-127)

**OLD CODE (Incorrect):**
```typescript
.insert({
  user_id: user.id,
  property_address: 'Address to be updated',
  status: 'pending',
  overall_score: 0,  // ❌ Wrong column name
})
```

**NEW CODE (Correct):**
```typescript
.insert({
  user_id: user.id,
  property_address: 'Address to be updated',
  status: 'pending',
  fraud_score: 0,      // ✅ Correct column name
  risk_rating: 'pending',  // ✅ Added missing field
})
```

### 2. Cache Clearing Steps

**Step 1: Stop all processes**
```powershell
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*expo*"} | Stop-Process -Force
```

**Step 2: Clear Metro cache**
```bash
npx expo start --clear
```

**Step 3: Verify app restarts correctly**
- Wait for Metro bundler to rebuild
- Check for "Bundler cache is empty, rebuilding" message
- Wait for QR code to appear

**Step 4: Reload app on device**
- Press `r` in Metro terminal, OR
- Shake device → Select "Reload"

## 📊 Database Schema Verification

**Verified Schema for `verifications` table:**

| Column Name | Data Type | Nullable | Default |
|------------|-----------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| user_id | uuid | NO | - |
| property_address | text | NO | - |
| property_type | text | YES | - |
| status | text | YES | 'pending' |
| **fraud_score** | integer | YES | - |
| **risk_rating** | text | YES | - |
| report_url | text | YES | - |
| metadata | jsonb | YES | '{}' |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Key Points:**
- ✅ Column is named `fraud_score` (NOT `overall_score`)
- ✅ `risk_rating` column exists and should be used
- ✅ Both columns are nullable (can be NULL initially)

## 🔍 How to Verify the Fix

### 1. Check Code Manually
```bash
# Search for any remaining references to overall_score
grep -r "overall_score" app/ lib/
```

**Expected Result:** No matches found (except in documentation)

### 2. Test Upload Flow

1. **Start the app:**
   ```bash
   npx expo start --clear
   ```

2. **Navigate to Upload Screen:**
   - Open app on device/emulator
   - Login if needed
   - Go to "Upload Documents" screen

3. **Upload a Document:**
   - Select document type (e.g., "Sale Deed")
   - Pick a file (PDF or image)
   - Click "Upload"

4. **Expected Behavior:**
   - ✅ Progress bar shows upload progress
   - ✅ Success message appears
   - ✅ No PGRST204 errors
   - ✅ Redirected to verification status screen

5. **Verify in Database:**
   ```sql
   -- Check the created verification record
   SELECT id, user_id, status, fraud_score, risk_rating, created_at
   FROM verifications
   ORDER BY created_at DESC
   LIMIT 5;
   ```

   **Expected Result:**
   - New record with `fraud_score = 0`
   - `risk_rating = 'pending'`
   - `status = 'pending'`

## 🛠️ If Issue Persists

### Step 1: Nuclear Cache Clear

```bash
# Stop all processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Delete all cache directories
rm -rf node_modules
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*

# Reinstall dependencies
npm install

# Start with clear cache
npx expo start --clear
```

### Step 2: Clear App Data on Device

**Android:**
```bash
adb shell pm clear host.exp.exponent
```

**iOS Simulator:**
```bash
xcrun simctl erase all
```

### Step 3: Verify Environment

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check Expo CLI version
npx expo --version

# Verify environment variables
cat .env | grep SUPABASE
```

### Step 4: Regenerate TypeScript Types

```bash
# Regenerate Supabase types to match schema
npx supabase gen types typescript \
  --project-id kjdxxlowoyrzjyfismsi \
  > lib/supabase.types.ts
```

## 📝 Technical Details

### Why Metro Cache Causes This Issue

1. **First Run:** Metro bundles code with `overall_score`
2. **Code Fixed:** Developer changes `overall_score` to `fraud_score`
3. **Metro Serves Cache:** Metro serves cached bundle (still has `overall_score`)
4. **Database Rejects:** PostgreSQL can't find `overall_score` column
5. **PGRST204 Error:** Supabase PostgREST API returns error

### How --clear Flag Works

```bash
npx expo start --clear
```

This command:
- Deletes Metro bundler cache (`$TMPDIR/metro-*`)
- Deletes Haste map cache (`$TMPDIR/haste-*`)
- Forces complete rebuild of JavaScript bundle
- Ensures latest code is bundled and served

### Why Both fraud_score AND risk_rating Were Added

**Previous Code:**
```typescript
overall_score: 0  // Only one field
```

**Updated Code:**
```typescript
fraud_score: 0,        // Numerical score (0-100)
risk_rating: 'pending' // Categorical rating (low/medium/high/pending)
```

**Reason:**
- Database schema expects BOTH fields for complete verification tracking
- `fraud_score`: Numerical score calculated by ML model (0-100)
- `risk_rating`: Categorical assessment (low/medium/high/pending)
- Having both provides comprehensive risk assessment

## ✅ Verification Checklist

After applying fix, verify:

- [ ] Code has `fraud_score` and `risk_rating` (not `overall_score`)
- [ ] Metro cache cleared with `--clear` flag
- [ ] App restarted and reloaded
- [ ] Document upload works without errors
- [ ] Verification record created in database
- [ ] Database record has `fraud_score = 0` and `risk_rating = 'pending'`
- [ ] Files uploaded to Supabase Storage
- [ ] Document records created in `documents` table
- [ ] No PGRST204 errors in Metro logs

## 📚 Related Documentation

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Complete troubleshooting guide
- [STORAGE-SETUP-COMPLETE.md](Markdown_Guides_Steps/STORAGE-SETUP-COMPLETE.md) - Storage configuration
- [TODO-5-COMPLETE.md](Markdown_Guides_Steps/TODO-5-COMPLETE.md) - Document upload feature
- [Supabase Types](lib/supabase.types.ts) - TypeScript type definitions

## 🎯 Prevention for Future

1. **Always clear cache after schema changes:**
   ```bash
   npx expo start --clear
   ```

2. **Regenerate types after database changes:**
   ```bash
   npx supabase gen types typescript --project-id <project-id> > lib/supabase.types.ts
   ```

3. **Use TypeScript strict mode:**
   - Catches type mismatches at compile time
   - Prevents runtime errors

4. **Test after major changes:**
   - Clear cache before testing
   - Test on both iOS and Android
   - Verify in production environment

---

**Status:** ✅ Fixed
**Date:** October 31, 2025
**Impact:** Document upload functionality restored
**Files Changed:** `app/upload.tsx`
