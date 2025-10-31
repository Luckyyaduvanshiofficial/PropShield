/**
 * PropShield App Configuration
 * Central configuration for the entire application
 */

export const AppConfig = {
  // App Information
  appName: 'PropShield AI',
  appSlogan: 'Verify your property in hours, not weeks',
  version: '1.0.0',
  
  // Support
  supportEmail: 'support@propshield.ai',
  supportPhone: '+91-XXXXX-XXXXX',
  
  // Social Media
  website: 'https://propshield.ai',
  twitter: '@propshield',
  linkedin: 'propshield-ai',
  
  // Features
  features: {
    enableBiometrics: true,
    enablePushNotifications: true,
    enableAnalytics: true,
  },
} as const;

export const DocumentTypes = {
  SALE_DEED: 'sale_deed',
  EC: 'ec', // Encumbrance Certificate
  MUTATION: 'mutation',
  TAX_RECEIPT: 'tax_receipt',
  PROPERTY_CARD: 'property_card',
  APPROVAL_PLAN: 'approval_plan',
  OTHER: 'other',
} as const;

export const VerificationStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const RiskRating = {
  GREEN: 'green',  // Low risk
  YELLOW: 'yellow', // Medium risk
  RED: 'red',      // High risk
} as const;

export const RiskRatingColors = {
  [RiskRating.GREEN]: '#10B981',
  [RiskRating.YELLOW]: '#F59E0B',
  [RiskRating.RED]: '#EF4444',
} as const;

export const Pricing = {
  basic: {
    name: 'Basic Verification',
    price: 499,
    currency: '₹',
    features: [
      'Document OCR & Extraction',
      'Basic Verification',
      'Fraud Score Report',
      'PDF Download',
    ],
  },
  premium: {
    name: 'Premium with Lawyer',
    price: 2999,
    currency: '₹',
    features: [
      'Everything in Basic',
      'Lawyer Review',
      'Government API Checks',
      'Detailed Legal Report',
      'Priority Support',
    ],
  },
  enterprise: {
    name: 'Enterprise API',
    price: 'Custom',
    currency: '',
    features: [
      'API Access',
      'Bulk Verifications',
      'Custom Integrations',
      'Dedicated Support',
      'SLA Guarantee',
    ],
  },
} as const;

// API Endpoints
export const API = {
  // Supabase URLs (from env)
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Custom API
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // Endpoints
  endpoints: {
    ocr: '/ocr/process',
    verify: '/verify',
    report: '/report/generate',
    lawyers: '/lawyers',
    payments: '/payments',
  },
} as const;

// Storage Buckets
export const StorageBuckets = {
  DOCUMENTS: 'documents',
  REPORTS: 'reports',
  AVATARS: 'avatars',
} as const;

// Validation Rules
export const Validation = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxDocumentsPerVerification: 10,
  minPasswordLength: 8,
} as const;

// Toast/Alert Messages
export const Messages = {
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    auth: 'Authentication failed. Please login again.',
    fileSize: `File size must be less than ${Validation.maxFileSize / (1024 * 1024)}MB`,
    fileType: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.',
  },
  success: {
    documentUploaded: 'Document uploaded successfully',
    verificationStarted: 'Verification started',
    reportGenerated: 'Report generated successfully',
  },
} as const;
