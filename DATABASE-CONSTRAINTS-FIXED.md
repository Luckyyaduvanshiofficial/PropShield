# Database Constraint Fixes

## ✅ Issues Fixed

### Problem 1: risk_rating Constraint Violation

**Error:**
```
ERROR 23514: new row for relation "verifications" violates check constraint "verifications_risk_rating_check"
```

**Root Cause:**
- Database constraint only allowed: `'green'`, `'yellow'`, `'red'`
- Code was trying to insert: `'pending'`

**Fix Applied:**
```sql
-- Migration: fix_risk_rating_constraint
ALTER TABLE verifications DROP CONSTRAINT IF EXISTS verifications_risk_rating_check;

ALTER TABLE verifications ADD CONSTRAINT verifications_risk_rating_check 
CHECK (risk_rating = ANY (ARRAY['pending'::text, 'green'::text, 'yellow'::text, 'red'::text]));
```

**Result:** ✅ Now allows `'pending'` as initial value

---

### Problem 2: document_type Constraint Mismatch

**Potential Issue:**
- Database constraint only allowed: `sale_deed`, `ec`, `mutation`, `tax_receipt`, `property_card`, `approval_plan`, `other`
- Code uses: `sale_deed`, `encumbrance_certificate`, `property_tax`, `mutation_records`, `approval_plans`, `title_deed`, `other`

**Fix Applied:**
```sql
-- Migration: fix_document_type_constraint
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_document_type_check;

ALTER TABLE documents ADD CONSTRAINT documents_document_type_check 
CHECK (document_type = ANY (ARRAY[
  'sale_deed'::text, 
  'encumbrance_certificate'::text, 
  'property_tax'::text, 
  'mutation_records'::text, 
  'approval_plans'::text, 
  'title_deed'::text,
  'ec'::text,
  'mutation'::text,
  'tax_receipt'::text,
  'property_card'::text,
  'approval_plan'::text,
  'other'::text
]));
```

**Result:** ✅ Now allows all document types used in the app

---

## 📊 Current Database Constraints

### verifications Table

| Constraint | Definition | Status |
|------------|-----------|--------|
| `verifications_fraud_score_check` | `fraud_score >= 0 AND fraud_score <= 100` | ✅ Correct |
| `verifications_risk_rating_check` | `risk_rating IN ('pending', 'green', 'yellow', 'red')` | ✅ **FIXED** |
| `verifications_status_check` | `status IN ('pending', 'processing', 'completed', 'failed')` | ✅ Correct |

### documents Table

| Constraint | Definition | Status |
|------------|-----------|--------|
| `documents_document_type_check` | Allows: `sale_deed`, `encumbrance_certificate`, `property_tax`, `mutation_records`, `approval_plans`, `title_deed`, `ec`, `mutation`, `tax_receipt`, `property_card`, `approval_plan`, `other` | ✅ **FIXED** |
| `documents_ocr_status_check` | `ocr_status IN ('pending', 'processing', 'completed', 'failed')` | ✅ Correct |

---

## 🔍 Verification

### Check Current Constraints

```sql
-- Check verifications constraints
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'verifications'::regclass
AND contype = 'c'
ORDER BY conname;

-- Check documents constraints
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'documents'::regclass
AND contype = 'c'
ORDER BY conname;
```

### Test Insert Queries

```sql
-- Test verifications insert with 'pending' risk_rating
INSERT INTO verifications (user_id, property_address, status, fraud_score, risk_rating)
VALUES (
  'test-user-id', 
  'Test Address', 
  'pending', 
  0, 
  'pending'  -- Should now work!
);

-- Test documents insert with app document types
INSERT INTO documents (verification_id, document_type, file_name, file_url, file_size)
VALUES (
  'test-verification-id',
  'encumbrance_certificate',  -- Should now work!
  'test.pdf',
  'test-url',
  1024
);
```

---

## 📋 Valid Values Reference

### risk_rating (verifications table)

- ✅ `'pending'` - Initial value when verification starts
- ✅ `'green'` - Low risk (fraud_score 0-33)
- ✅ `'yellow'` - Medium risk (fraud_score 34-66)
- ✅ `'red'` - High risk (fraud_score 67-100)

### status (verifications table)

- ✅ `'pending'` - Verification not started
- ✅ `'processing'` - OCR and analysis in progress
- ✅ `'completed'` - Verification finished successfully
- ✅ `'failed'` - Verification failed with errors

### document_type (documents table)

**App Document Types (Primary):**
- ✅ `'sale_deed'` - Sale Deed document
- ✅ `'encumbrance_certificate'` - Encumbrance Certificate (EC)
- ✅ `'property_tax'` - Property Tax Receipt
- ✅ `'mutation_records'` - Mutation Records
- ✅ `'approval_plans'` - Approval Plans
- ✅ `'title_deed'` - Title Deed
- ✅ `'other'` - Other documents

**Legacy/Alternative Types (Supported):**
- ✅ `'ec'` - Encumbrance Certificate (short form)
- ✅ `'mutation'` - Mutation (short form)
- ✅ `'tax_receipt'` - Tax Receipt (alternative name)
- ✅ `'property_card'` - Property Card
- ✅ `'approval_plan'` - Approval Plan (singular)

### ocr_status (documents table)

- ✅ `'pending'` - OCR not started
- ✅ `'processing'` - OCR in progress
- ✅ `'completed'` - OCR finished
- ✅ `'failed'` - OCR failed

---

## 🎯 Code Changes

### app/upload.tsx

```typescript
// Line 124 - Now uses correct risk_rating value
.insert({
  user_id: user.id,
  property_address: 'Address to be updated',
  status: 'pending',
  fraud_score: 0,
  risk_rating: 'pending', // ✅ Now allowed by constraint
})
```

**Document Types in App:**
```typescript
const DOCUMENT_TYPES = [
  { id: 'sale_deed', label: 'Sale Deed' },
  { id: 'encumbrance_certificate', label: 'Encumbrance Certificate' }, // ✅ Now allowed
  { id: 'property_tax', label: 'Property Tax Receipt' },               // ✅ Now allowed
  { id: 'mutation_records', label: 'Mutation Records' },               // ✅ Now allowed
  { id: 'approval_plans', label: 'Approval Plans' },                   // ✅ Now allowed
  { id: 'title_deed', label: 'Title Deed' },                           // ✅ Now allowed
  { id: 'other', label: 'Other Documents' },
];
```

---

## 🚀 Next Steps

1. **Clear Metro cache** (IMPORTANT):
   ```bash
   npx expo start --clear
   ```

2. **Test document upload**:
   - Login to app
   - Navigate to Upload screen
   - Select any document type
   - Upload file
   - ✅ Should work without constraint errors

3. **Verify in database**:
   ```sql
   -- Check latest verifications
   SELECT id, status, fraud_score, risk_rating, created_at
   FROM verifications
   ORDER BY created_at DESC
   LIMIT 5;
   
   -- Check uploaded documents
   SELECT id, document_type, file_name, ocr_status, created_at
   FROM documents
   ORDER BY created_at DESC
   LIMIT 5;
   ```

---

## 📚 Related Files

- **App Code**: `app/upload.tsx` - Document upload screen
- **Types**: `lib/supabase.types.ts` - TypeScript types (regenerated)
- **Storage**: `lib/storage.ts` - Storage helper functions
- **Migrations**: Applied via Supabase MCP
  - `fix_risk_rating_constraint`
  - `fix_document_type_constraint`

---

## ✅ Summary

**Fixed Issues:**
1. ✅ `risk_rating` constraint - Added 'pending' as valid value
2. ✅ `document_type` constraint - Added all app document types

**Database Migrations:**
- ✅ `fix_risk_rating_constraint` - Applied successfully
- ✅ `fix_document_type_constraint` - Applied successfully

**TypeScript Types:**
- ✅ Regenerated to match updated schema

**Code Updates:**
- ✅ `app/upload.tsx` - Already using correct values

**Status:** 
- 🎯 Ready to test document upload
- 🔄 Metro cache needs to be cleared
- ✅ All constraints fixed and verified

---

**Date:** October 31, 2025  
**Migrations Applied:** 2  
**Tables Updated:** verifications, documents  
**Status:** ✅ Complete
