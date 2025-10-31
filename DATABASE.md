# PropShield Database Schema

## Overview

Complete PostgreSQL database schema for PropShield AI deployed on Supabase.

**Project Details:**
- Project ID: `kjdxxlowoyrzjyfismsi`
- Region: `ap-southeast-2` (Sydney)
- PostgreSQL Version: `17.6.1`
- Status: Active & Healthy

## Database Tables

### 1. **profiles** - User Profiles
User account information and profile data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Auto-created via trigger when user signs up via Supabase Auth
- Role-based access control (user, lawyer, admin)
- RLS policies ensure users can only access their own profile
- Automatic timestamp management

### 2. **verifications** - Property Verifications
Property verification requests and results.

```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_address TEXT NOT NULL,
  property_type TEXT CHECK (property_type IN ('residential', 'commercial', 'agricultural', 'industrial')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  fraud_score DECIMAL(5,2) CHECK (fraud_score >= 0 AND fraud_score <= 100),
  risk_rating TEXT CHECK (risk_rating IN ('green', 'yellow', 'red')),
  report_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Fraud score calculation (0-100)
- Risk rating system (green/yellow/red)
- Flexible metadata storage for additional verification data
- Status tracking through verification lifecycle

### 3. **documents** - Document Storage
Metadata for uploaded property documents.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES verifications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('sale_deed', 'encumbrance_certificate', 'mutation_certificate', 'tax_receipt', 'khata_certificate', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT,
  ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Links documents to verifications
- OCR status tracking for document processing
- Extracted data stored as JSONB for flexibility
- Supports 6+ Indian property document types

### 4. **lawyers** - Lawyer Profiles
Legal professional profiles for consultations.

```sql
CREATE TABLE lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
  bar_council_number TEXT UNIQUE NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  experience_years INTEGER CHECK (experience_years >= 0),
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  consultation_fee DECIMAL(10,2),
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Bar Council verification number
- Array-based specializations for flexible filtering
- Rating and review system
- Real-time availability status
- Pricing information (hourly rate + consultation fee)

### 5. **consultations** - Lawyer Consultations
Booking and consultation management.

```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  verification_id UUID NOT NULL REFERENCES verifications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  amount DECIMAL(10,2),
  notes TEXT,
  lawyer_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Links users, lawyers, and verifications
- Dual-sided RLS (users see their bookings, lawyers see their appointments)
- Post-consultation rating and review
- Status tracking through consultation lifecycle

### 6. **payments** - Payment Transactions
Payment processing and transaction history.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_id UUID REFERENCES verifications(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT CHECK (payment_method IN ('card', 'upi', 'netbanking', 'wallet')),
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Multi-gateway support (Cashfree, Razorpay, Stripe)
- Links to both verifications and consultations
- Payment method tracking (card, UPI, netbanking, wallet)
- Gateway response storage for reconciliation

### 7. **notifications** - Push/Email/SMS Notifications
User notification management.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('verification_update', 'payment_success', 'consultation_scheduled', 'document_processed', 'general')),
  read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Multi-channel notifications (push, email, SMS)
- Type-based categorization for filtering
- Read/unread tracking
- Additional data payload support

### 8. **referrals** - Referral System
User referral tracking and rewards.

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_credited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Key Features:**
- Unique referral codes per user
- Tracks referrer and referred user relationship
- Reward amount and credit status
- Status progression (pending → completed → rewarded)

### 9. **feedback** - User Feedback & Ratings
Feedback for lawyers, verifications, and app experience.

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lawyer', 'verification', 'app')),
  entity_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Generic feedback system for multiple entity types
- 5-star rating system
- Public lawyer feedback, private verification/app feedback
- Links to specific entities via entity_id

### 10. **activity_logs** - Analytics & Audit Trail
User activity tracking and analytics.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Tracks all user actions for analytics
- IP address and user agent logging
- Flexible metadata for additional context
- Supports anonymous actions (user_id nullable)

## Row Level Security (RLS)

All tables have RLS enabled with the following policy patterns:

### User Data Access
```sql
-- Users can view/edit only their own data
CREATE POLICY "Users can view own records"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id);
```

### Lawyer Data Access
```sql
-- Lawyers can view their consultations and related verifications
CREATE POLICY "Lawyers can view assigned consultations"
  ON consultations FOR SELECT
  USING (lawyer_id IN (SELECT id FROM lawyers WHERE user_id = auth.uid()));
```

### Public Read Access
```sql
-- Some data is publicly readable (e.g., lawyer profiles, lawyer feedback)
CREATE POLICY "Public can view lawyer profiles"
  ON lawyers FOR SELECT
  USING (verified = true AND availability_status != 'offline');
```

## Indexes

Performance indexes on frequently queried columns:

```sql
-- User lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Verification queries
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_verifications_status ON verifications(status);
CREATE INDEX idx_verifications_created_at ON verifications(created_at DESC);

-- Document queries
CREATE INDEX idx_documents_verification_id ON documents(verification_id);
CREATE INDEX idx_documents_ocr_status ON documents(ocr_status);

-- Lawyer searches
CREATE INDEX idx_lawyers_verified ON lawyers(verified);
CREATE INDEX idx_lawyers_rating ON lawyers(rating DESC);
CREATE INDEX idx_lawyers_specializations ON lawyers USING GIN(specializations);

-- Consultation lookups
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Payment queries
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Notification queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Referral lookups
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
```

## Database Functions & Triggers

### Auto-Create Profile Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Updated_at Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to: profiles, verifications, documents, lawyers, consultations, payments, feedback
```

## Storage Buckets (To Be Created)

### 1. **documents** - Property Documents
- Public: false (private)
- File types: PDF, JPG, PNG
- Max size: 10MB per file
- RLS policies: Users can upload/view own documents

### 2. **reports** - Verification Reports
- Public: false (private)
- File types: PDF
- Max size: 5MB per file
- RLS policies: Users can view reports for their verifications

### 3. **avatars** - User Profile Pictures
- Public: true
- File types: JPG, PNG
- Max size: 2MB per file
- RLS policies: Users can upload/update own avatar

## Edge Functions (To Be Created)

### 1. **process-document** - OCR Processing
- Triggers on document upload
- Calls Azure Document Intelligence API
- Updates `documents.extracted_data` and `documents.ocr_status`
- Sends notification on completion

### 2. **generate-report** - Verification Report Generator
- Triggers when verification completes
- Aggregates all verification data
- Generates PDF report
- Uploads to `reports` bucket
- Updates `verifications.report_url`

### 3. **send-notification** - Multi-channel Notifications
- Receives notification data
- Sends via push (Expo), email (Resend), SMS (Twilio)
- Creates record in `notifications` table

### 4. **process-payment** - Payment Gateway Integration
- Handles payment webhook callbacks
- Updates `payments.status`
- Triggers verification/consultation activation
- Sends payment confirmation notification

## TypeScript Type Generation

Generated types are available in `lib/database.types.ts`. Import and use with Supabase client:

```typescript
import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';

// Type-safe queries
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .returns<Tables<'profiles'>[]>();

// Type-safe inserts
const newVerification: TablesInsert<'verifications'> = {
  user_id: userId,
  property_address: '123 Main St',
  property_type: 'residential',
};
```

## Migration History

| # | Migration Name | Status | Description |
|---|---------------|---------|-------------|
| 1 | create_profiles_table | ✅ Applied | User profiles with auto-creation trigger |
| 2 | create_verifications_table | ✅ Applied | Property verification tracking |
| 3 | create_documents_table | ✅ Applied | Document metadata with OCR status |
| 4 | create_lawyers_table | ✅ Applied | Lawyer profiles with ratings |
| 5 | create_consultations_table | ✅ Applied | Consultation booking system |
| 6 | create_payments_table | ✅ Applied | Payment transaction records |
| 7 | create_notifications_table | ✅ Applied | Multi-channel notifications |
| 8 | create_referrals_table | ✅ Applied | Referral system tracking |
| 9 | create_feedback_table | ✅ Applied | User feedback and ratings |
| 10 | create_analytics_table | ✅ Applied | Activity logs and analytics |

## Connection Information

**Environment Variables Required:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://kjdxxlowoyrzjyfismsi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Service Role Key** (for Edge Functions only):
Available in Supabase Dashboard → Settings → API

## Next Steps

1. ✅ Create all database tables (COMPLETED)
2. ✅ Generate TypeScript types (COMPLETED)
3. ⏳ Create storage buckets for documents, reports, avatars
4. ⏳ Deploy Edge Functions for OCR, report generation, notifications
5. ⏳ Setup government API integrations (e-Courts, IGRS, etc.)
6. ⏳ Configure payment gateway webhooks (Cashfree/Razorpay)
7. ⏳ Setup scheduled jobs for report generation and notifications

## Database Monitoring

Access Supabase Dashboard:
- **URL**: https://supabase.com/dashboard/project/kjdxxlowoyrzjyfismsi
- **Tables**: Database → Tables
- **SQL Editor**: Database → SQL Editor
- **API Logs**: Logs → API Logs
- **Database Logs**: Logs → Postgres Logs
