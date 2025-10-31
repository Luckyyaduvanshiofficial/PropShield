# Quick Setup: Storage Buckets

## Instructions

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `kjdxxlowoyrzjyfismsi`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy & Paste**
   - Copy the ENTIRE contents of `scripts/create-storage-buckets.sql`
   - Paste into the SQL Editor

4. **Run**
   - Click "Run" (or press Ctrl+Enter)
   - Wait for success message

5. **Verify**
   - Go to "Storage" in left sidebar
   - You should see 3 buckets:
     - ✅ documents (private)
     - ✅ reports (private)
     - ✅ avatars (public)

## Expected Output

```
Successfully run. Results: 3 rows, 5 columns affected.
```

## Troubleshooting

**If you get "Bucket already exists" errors:**
- This is fine! It means buckets are already created
- The SQL uses `ON CONFLICT DO NOTHING` to handle this

**If you get "Permission denied" errors:**
- Make sure you're logged in as the project owner
- Try running from Supabase Dashboard instead of external SQL client

**If policies fail to create:**
- Delete existing policies first:
  ```sql
  DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
  -- ... repeat for all policies
  ```
- Then run the create-storage-buckets.sql again

---

**After successful creation, you can test uploads immediately!**
