# 🔧 Fix Upload Error: "Failed to create verification record"

## Issue
You're seeing this error when trying to upload documents:
```
ERROR Upload error: [Error: Failed to create verification record]
```

## Root Cause
This error occurs because:
1. ❌ **Storage buckets not created** - The SQL script hasn't been run yet
2. ❌ **RLS policies may be blocking** - Row Level Security might be preventing inserts

## Solution

### ✅ Step 1: Create Storage Buckets (REQUIRED)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `kjdxxlowoyrzjyfismsi`

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Run the SQL Script**
   - Copy **ALL** content from `scripts/create-storage-buckets.sql`
   - Paste into SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)

4. **Verify Success**
   - Go to **"Storage"** in left sidebar
   - You should see 3 buckets:
     - ✅ `documents` (private)
     - ✅ `reports` (private)
     - ✅ `avatars` (public)

---

### ✅ Step 2: Check RLS Policies on Verifications Table

The `verifications` table needs an INSERT policy for authenticated users.

**Run this SQL in Supabase SQL Editor:**

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'verifications';

-- If no INSERT policy exists, create it:
CREATE POLICY "Users can create their own verifications"
ON verifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Verify it was created
SELECT * FROM pg_policies WHERE tablename = 'verifications' AND cmd = 'INSERT';
```

---

### ✅ Step 3: Test Upload Again

After creating buckets and policies:

1. Reload the app (press 'r' in terminal or refresh app)
2. Try uploading a document again
3. It should work! ✅

---

## Common Issues & Fixes

### Issue: "Buckets already exist"
**Solution:** This is fine! It means buckets were created. Just continue.

### Issue: "Policy already exists"
**Solution:** This is fine! The policy is there. Continue testing.

### Issue: Still getting verification error
**Solution:** Check the detailed error in the terminal after the fix above. It will now show the actual Supabase error message.

### Issue: "Storage bucket not found"
**Solution:** 
1. Go to Supabase Dashboard → Storage
2. Manually create a bucket named `documents`:
   - Click "New bucket"
   - Name: `documents`
   - Public: **unchecked** (private)
   - File size limit: 52428800 (50MB)
   - Allowed MIME types: Add PDF, JPG, PNG, HEIC
3. Repeat for `reports` and `avatars`

---

## Quick Verification Checklist

- [ ] Storage buckets created (documents, reports, avatars)
- [ ] RLS policies active on storage.objects
- [ ] INSERT policy exists on verifications table
- [ ] User is authenticated (logged in)
- [ ] App reloaded after changes

---

## After Setup

Once buckets are created, your upload flow will:
1. ✅ Create verification record
2. ✅ Upload files to Storage
3. ✅ Create document records
4. ✅ Navigate to verification status

---

**Need Help?** Check the full SQL script at: `scripts/create-storage-buckets.sql`
