# PropShield AI 🏠🔐

**AI-powered Property Verification Platform**  
_Verify your property in hours, not weeks — powered by government data, AI, and legal experts._

---

## 🎯 Overview

PropShield AI is a comprehensive property verification SaaS platform that automates the due diligence process for real estate buyers, reducing verification time from 30–90 days to under 24 hours using AI-powered document analysis, government API integration, and legal expert reviews.

## ✨ Features

- 📸 **Document Scanning** - Camera & file picker for property documents
- 🤖 **AI-Powered OCR** - Azure Document Intelligence for data extraction
- ✅ **Automated Verification** - Government API integration for EC, mutation, tax records
- 📊 **Fraud Detection** - ML-based fraud scoring and risk assessment
- 📄 **Comprehensive Reports** - Detailed PDF reports with traffic light ratings
- ⚖️ **Lawyer Marketplace** - Connect with verified property lawyers
- 💳 **Secure Payments** - Integrated Cashfree/Razorpay/Stripe
- 🔔 **Real-time Updates** - Push notifications for verification status
- 🎨 **Modern UI** - Beautiful, accessible design with dark mode support

## 🚀 Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 54)
- **Navigation**: Expo Router (file-based routing)
- **UI**: Custom components with Reanimated animations
- **State Management**: Zustand
- **Styling**: Modern React Native styles with dark mode

### Backend
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **OCR & AI**: Azure Document Intelligence API
- **Cloud Functions**: Supabase Edge Functions / Appwrite
- **Payments**: Cashfree (India) + Stripe (International)
- **Notifications**: Expo Push Notifications

### DevOps
- **CI/CD**: GitHub Actions + EAS Build
- **Monitoring**: Datadog + Sentry
- **Hosting**: Expo Application Services (EAS)

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Supabase account (free tier)
- Azure account (for Document Intelligence)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/luckyonly/propshield.git
   cd propshield
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   - Supabase URL and Anon Key
   - Azure Document Intelligence credentials
   - Payment gateway keys

4. **Start the development server**

   ```bash
   npx expo start
   ```

   Then press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser
   - Scan QR code with Expo Go app on physical device

### Development Build

For full feature access (camera, notifications, etc.), create a development build:

```bash
npm run development-builds
```

---

## 📁 Project Structure

```
propertyshield/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Main tab navigation
│   │   ├── index.tsx        # Home/Dashboard
│   │   └── explore.tsx      # Explore/Settings
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Modal screens
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   └── ...                  # Feature components
├── constants/               # App constants & config
│   ├── config.ts            # App configuration
│   └── theme.ts             # Theme tokens
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & SDK configs
│   └── supabase.ts          # Supabase client
├── types/                   # TypeScript definitions
│   └── index.ts             # Type definitions
├── assets/                  # Static assets
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
└── package.json             # Dependencies
```

---

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env`
3. Run database migrations (see `supabase/migrations/`)
4. Setup storage buckets: `documents`, `reports`, `avatars`
5. Configure authentication providers (Email, Google, Phone)

### Azure Document Intelligence

1. Create Azure Document Intelligence resource
2. Copy endpoint and key to `.env`
3. Configure custom model training (optional)

### Payment Gateways

1. **Cashfree** (India): Sign up at https://cashfree.com
2. **Stripe** (International): Sign up at https://stripe.com
3. Add API keys to `.env`

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests (when implemented)
npm test
```

---

## 🚢 Deployment

### Production Build

```bash
# Deploy to production (runs EAS workflow)
npm run deploy

# Or build manually
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

### Submit to App Stores

```bash
# iOS App Store
npx eas submit --platform ios

# Google Play Store
npx eas submit --platform android
```

---

## 📚 Documentation

- [Product Requirements Document](./Product%20Requirements%20Document%20(PRD)_%20PropShield%20AI.md)
- [AGENTS.md](./AGENTS.md) - AI Agent development guidelines
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🤝 Contributing

This is a private project. For team members:

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

Proprietary - All rights reserved © 2025 Lucky Labs

---

## 👨‍💻 Team

**Lucky** - Founder & CTO  
Email: lucky@propshield.ai

---

## 🙏 Acknowledgments

- Expo team for amazing developer experience
- Supabase for powerful backend infrastructure
- Azure for AI/ML services
- Open source community

---

**Made with ❤️ in India**
