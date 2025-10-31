# PropShield AI 🛡️

**AI-Powered Property Verification Platform**

PropShield automates property due diligence using AI and OCR, reducing verification time from 30-90 days to under 24 hours. Verify property documents, detect fraud, generate comprehensive reports, and connect with legal experts - all in one platform.

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)

> **🔥 Known Issue Fixed:** If you encounter a `PGRST204` error about `overall_score` column, clear Metro cache with `npx expo start --clear`. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for details.

## 📱 What is PropShield?

PropShield is a comprehensive property verification SaaS platform that helps home buyers, real estate agents, and legal professionals verify property documents quickly and accurately using:

- **AI-Powered OCR**: Extract data from property documents automatically
- **Fraud Detection**: ML models detect inconsistencies and red flags
- **Government API Integration**: Verify records with official sources
- **Risk Scoring**: Traffic light system (Green/Yellow/Red) for quick assessment
- **Legal Marketplace**: Connect with property lawyers for consultation
- **24-Hour Verification**: Complete property due diligence in under 24 hours

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account (free tier available)
- Azure account (for Document Intelligence - free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Luckyyaduvanshiofficial/PropShield.git
cd PropShield

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase and Azure credentials

# Start development server
npm start
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📊 Development Progress

### ✅ Completed (5/28 Todos)

#### 1. ✅ Setup Project Foundation & Dependencies

- Installed core dependencies: Supabase SDK, expo-router, expo-document-picker
- Configured app.json for PropShield branding
- Setup TypeScript strict mode
- Configured EAS build workflows

#### 2. ✅ Configure Supabase Backend

- Created 10 database tables with RLS policies:
  - `profiles` - User profiles with auto-creation trigger
  - `verifications` - Property verification records
  - `documents` - Uploaded document metadata
  - `lawyers` - Legal professional profiles
  - `consultations` - Lawyer consultation bookings
  - `payments` - Payment transactions
  - `notifications` - User notifications
  - `referrals` - Referral tracking
  - `feedback` - User feedback
  - `activity_logs` - Audit trail
- Generated TypeScript types from schema
- Created Storage buckets (documents, reports, avatars)
- Configured RLS policies for secure access
- **Status**: Database ✅ | Storage ✅ | Edge Functions ⏳

#### 3. ✅ Build Authentication Flow

- Integrated Supabase Auth with JWT
- Email/password authentication
- GitHub OAuth integration (setup required)
- Protected route handling
- Auth state management with React Context
- Profile auto-creation via database trigger
- SSR compatibility fixes
- **Status**: Fully functional and tested ✅

#### 4. ✅ Create Dashboard Screen

- Main dashboard with CTA buttons
- "Upload Property Documents" primary action
- Verification history list (with status indicators)
- Navigation to verification details
- Pull-to-refresh functionality
- Themed components (dark/light mode)
- **Status**: Complete ✅

#### 5. ✅ Implement Document Upload System

- Real file picker with expo-document-picker
- Multi-file upload support
- 7 document types (Sale Deed, EC, Tax Receipt, etc.)
- Upload progress indicator (0-100%)
- File validation (type, size, format)
- Supabase Storage integration
- Document metadata in database
- User-specific folders with RLS
- **Status**: Ready for testing 🧪

### 🚧 In Progress (0/28 Todos)

Currently testing document upload functionality.

### ⏳ Pending (23/28 Todos)

#### 6. ⏭️ Setup Azure Document Intelligence OCR (Next)

- Azure resource creation required
- API credentials configuration
- Supabase Edge Function for OCR processing
- Text extraction from documents
- Document type detection
- **Estimated Time**: 2-3 hours
- **See**: `AZURE-SETUP-GUIDE.md` for instructions

#### 7. Build AI Verification Engine - Data Extraction

- Python service for OCR data parsing
- Extract owner names, dates, property details
- Structured data format
- Store in Supabase database

#### 8. Integrate Government APIs

- Research available Indian government APIs
- EC (Encumbrance Certificate) validation
- Mutation records verification
- Property tax validation
- Land records integration

#### 9. Build NLP Fraud Detection Model

- ML model with spaCy/TensorFlow
- Detect inconsistencies and missing data
- Fraud pattern recognition
- Generate risk score (0-100)

#### 10. Create Report Generation System

- Python service with ReportLab
- PDF report generation
- Fraud score visualization
- Traffic light rating (Green/Yellow/Red)
- Recommendations and findings

#### 11. ✅ Build Verification Status & Progress Screen

- Real-time progress tracking
- Step indicators (OCR → Validation → Scoring → Report)
- Status updates
- Push notifications integration

#### 12-28. Additional Features

- Report viewer with risk visualization
- Lawyer marketplace
- Payment gateway (Cashfree/Razorpay/Stripe)
- Admin dashboard (Next.js)
- Notification system
- Feedback & referral system
- Monitoring (Datadog/Sentry)
- CI/CD pipeline
- Security measures
- Onboarding flows
- Analytics dashboard
- Redis queue system
- Testing & QA
- Performance optimization
- Marketing landing page
- Production launch prep
- Beta testing

## 🏗️ Tech Stack

### Frontend

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript 5.3
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand + React Context
- **UI Components**: Custom themed components
- **Styling**: StyleSheet API
- **File Handling**: expo-document-picker, expo-file-system
- **Authentication**: Supabase Auth

### Backend

- **Database**: Supabase (PostgreSQL 17.6.1)
- **Storage**: Supabase Storage (S3-compatible)
- **Authentication**: Supabase Auth (JWT + OAuth)
- **Real-time**: Supabase Realtime
- **Edge Functions**: Supabase Edge Functions (Deno)
- **OCR**: Azure Document Intelligence (AI-powered)
- **Hosting**: Hostinger (landing page)

### DevOps & Tools

- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions + EAS Build
- **Monitoring**: Datadog + Sentry (planned)
- **Queue System**: Redis + BullMQ (planned)
- **Analytics**: Supabase Analytics + Custom

## 📁 Project Structure

```
propertyshield/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Dashboard
│   │   └── explore.tsx      # Explore screen
│   ├── _layout.tsx          # Root layout
│   ├── login.tsx            # Login screen
│   ├── signup.tsx           # Signup screen
│   ├── upload.tsx           # Document upload
│   └── verification-status.tsx
├── components/              # Reusable components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
├── contexts/                # React contexts
│   └── auth-context.tsx    # Auth state management
├── lib/                     # Utilities & configs
│   ├── supabase.ts         # Supabase client
│   ├── storage.ts          # Storage helpers
│   └── database.types.ts   # TypeScript types
├── constants/              # App constants
│   └── theme.ts
├── scripts/                # Setup scripts
│   └── create-storage-buckets.sql
├── .env                    # Environment variables
└── README.md              # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Azure Document Intelligence
EXPO_PUBLIC_AZURE_DOC_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
EXPO_PUBLIC_AZURE_DOC_INTELLIGENCE_KEY=your-key

# API Configuration
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_ENV=development
```

## 📚 Documentation

- **[STORAGE-SETUP-COMPLETE.md](./STORAGE-SETUP-COMPLETE.md)** - Supabase Storage setup guide
- **[AZURE-SETUP-GUIDE.md](./AZURE-SETUP-GUIDE.md)** - Azure Document Intelligence setup
- **[TODO-5-COMPLETE.md](./TODO-5-COMPLETE.md)** - Document upload implementation
- **[FIX-UPLOAD-ERROR.md](./FIX-UPLOAD-ERROR.md)** - Troubleshooting guide
- **[DATABASE.md](./DATABASE.md)** - Database schema documentation
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)** - Backend setup guide
- **[AUTH-TESTING-GUIDE.md](./AUTH-TESTING-GUIDE.md)** - Authentication testing

## 🧪 Testing

### Current Testing Status

**✅ Tested & Working:**

- Authentication (email/password)
- Protected routes
- Session persistence
- Database queries
- Storage bucket creation
- RLS policies

**🧪 Currently Testing:**

- Document upload flow
- File picker functionality
- Progress tracking
- Multi-file uploads

**⏳ Pending Tests:**

- OCR processing
- Report generation
- Payment integration
- End-to-end flows

### Run Tests

```bash
# Unit tests (coming soon)
npm test

# E2E tests (coming soon)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Deployment

### Development Build

```bash
# Create development build for Android
npm run development-builds

# Create development build for iOS (Mac only)
eas build --platform ios --profile development
```

### Production Deployment

```bash
# Deploy to production
npm run deploy

# Preview update
npm run draft
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Lucky Yaduvanshi
- **Repository**: [PropShield](https://github.com/Luckyyaduvanshiofficial/PropShield)

## 🙏 Acknowledgments

- **Expo** - Cross-platform development framework
- **Supabase** - Backend infrastructure
- **Azure** - AI and document intelligence
- **React Native Community** - Amazing ecosystem

## 📞 Support

For issues, questions, or feedback:

- Open an issue on [GitHub](https://github.com/Luckyyaduvanshiofficial/PropShield/issues)
- Contact: [Your Email]

## 📈 Roadmap

### Phase 1: Foundation (Current) ✅

- ✅ Project setup
- ✅ Database & authentication
- ✅ Document upload system

### Phase 2: AI Integration (Next) 🚧

- ⏳ Azure OCR integration
- ⏳ Data extraction engine
- ⏳ Fraud detection model

### Phase 3: Verification & Reports 📋

- ⏳ Government API integration
- ⏳ Report generation
- ⏳ Risk scoring system

### Phase 4: Marketplace & Payments 💰

- ⏳ Lawyer marketplace
- ⏳ Payment gateway
- ⏳ Consultation booking

### Phase 5: Production Launch 🎉

- ⏳ Testing & QA
- ⏳ Performance optimization
- ⏳ App store submission

---

**Last Updated**: October 31, 2025  
**Version**: 1.0.0-alpha  
**Status**: Active Development 🚧
