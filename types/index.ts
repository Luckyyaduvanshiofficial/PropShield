/**
 * PropShield TypeScript Type Definitions
 */

export type DocumentType = 'sale_deed' | 'ec' | 'mutation' | 'tax_receipt' | 'property_card' | 'approval_plan' | 'other';

export type VerificationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type RiskRating = 'green' | 'yellow' | 'red';

export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  id: string;
  userId: string;
  propertyAddress: string;
  status: VerificationStatus;
  fraudScore?: number;
  riskRating?: RiskRating;
  reportUrl?: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  verificationId: string;
  documentType: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  ocrStatus: OCRStatus;
  extractedData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface OCRResult {
  documentType: DocumentType;
  confidence: number;
  extractedFields: {
    [key: string]: {
      value: string;
      confidence: number;
    };
  };
  rawText: string;
}

export interface FraudAnalysis {
  score: number; // 0-100
  riskRating: RiskRating;
  flags: FraudFlag[];
  recommendations: string[];
}

export interface FraudFlag {
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  affectedFields: string[];
}

export interface Report {
  id: string;
  verificationId: string;
  generatedAt: string;
  pdfUrl: string;
  htmlUrl?: string;
  summary: {
    totalDocuments: number;
    verifiedDocuments: number;
    fraudScore: number;
    riskRating: RiskRating;
  };
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  status: 'pass' | 'warning' | 'fail';
  details?: any;
}

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number; // years
  rating: number; // 0-5
  totalCases: number;
  pricePerCase: number;
  avatarUrl?: string;
  bio?: string;
  verified: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  verificationId?: string;
  lawyerId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId?: string;
  code: string;
  status: 'pending' | 'completed';
  rewardAmount: number;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  fullName: string;
  phone?: string;
}

export interface VerificationForm {
  propertyAddress: string;
  propertyType?: string;
  notes?: string;
}
