# **Product Requirements Document (PRD): PropShield AI**

**Project Title:** PropShield AI – AI-powered Property Verification SaaS Platform  
 **Prepared by:** Lucky (Founder & CTO)  
 **Version:** 1.0  
 **Date:** Oct 2025

---

## **🧩 1\. Product Overview**

**Goal:**  
 Build an **AI-powered Property Verification Platform** that automates the due diligence process for real estate buyers, reducing verification time from 30–90 days to under 24 hours.

**Core Value Proposition:**

"PropShield AI verifies your property in hours, not weeks — powered by government data, AI, and legal experts."

**Problem:**

* Property verification requires 10+ documents from 5+ departments.

* Fraud cases rising due to lack of automation and poor access to records.

* Lawyers are costly and inconsistent.

**Solution:**  
 An **AI-driven SaaS** that scans, verifies, and scores property documents with automated checks, crowdsourced insights, and verified lawyer reviews.

---

## **🧱 2\. Objectives & Success Metrics**

| Objective | Success Metric |
| ----- | ----- |
| Verify property documents automatically | 95% accuracy OCR & data extraction |
| Reduce verification time | From 30+ days → \<24 hours |
| Fraud detection | \>90% precision in fraud risk score |
| Monetization | ₹10L revenue within 6 months post-launch |
| User adoption | 5,000+ active verifications in 3 months |

---

## **📲 3\. Target Users**

| Segment | Description |
| ----- | ----- |
| Individual Buyers | People buying flats or land plots |
| Real Estate Agents | Need quick verification for multiple clients |
| Lawyers | Use PropShield as verification toolkit |
| Banks / NBFCs | Use API for property loan validation |

---

## **⚙️ 4\. Product Flow (App Flow)**

### **App Journey:**

1. **User Signup/Login**

   * Using Supabase Auth (Email, Google, Phone OTP)

2. **Dashboard**

   * “Upload Property Documents” button

   * List of past verifications \+ status

3. **Document Upload**

   * Upload via camera or PDF

   * Stored in Supabase Storage

   * AI (OCR) detects document type: Sale Deed, EC, Mutation, Tax Receipt, etc.

4. **AI Verification Engine**

   * Step 1: OCR → extract data

   * Step 2: Validate using Government APIs (EC, mutation, ownership, etc.)

   * Step 3: NLP model checks for missing or fraudulent info

   * Step 4: Fraud Score generated

5. **PropShield Report Generation**

   * Backend (Python service) compiles verified report (PDF \+ HTML)

   * Stored in Azure Blob or Supabase Storage

6. **Report Review**

   * User views risk score \+ recommendations

   * Option to “Connect with Verified Lawyer”

7. **Payment & Lawyer Review**

   * Integrated with Cashfree / Razorpay

   * Lawyer uploads digital review (stored & attached)

8. **Final Report**

   * Downloadable 50-page PDF

   * Traffic light rating (Green/Yellow/Red)

9. **User Feedback & Referrals**

   * User rates verification experience

   * Referral code auto-generated

---

## **🧠 5\. Core Features**

| Feature | Description | Tech |
| ----- | ----- | ----- |
| OCR & Document Detection | Identify and extract data from PDFs/images | Azure Document Intelligence API \+ Tesseract |
| AI Data Validation | Verify chain of ownership, EC, tax records | Python (spaCy, TensorFlow) |
| Government API Integration | Auto-fetch EC, land, mutation data | Node.js backend service |
| Fraud Scoring System | Risk model based on NLP \+ heuristic rules | Custom AI model |
| Report Generator | Generate property report (PDF/HTML) | Python \+ ReportLab |
| Lawyer Marketplace | Connect user with lawyers | Supabase database \+ Stripe Payments |
| Notification System | Email & SMS updates | Appwrite Functions \+ Resend API |
| Admin Dashboard | Manage verifications, payments, lawyers | Next.js Web App |
| Analytics Dashboard | Real-time data insights | Datadog \+ Supabase Analytics |

---

## **🏗️ 6\. Technical Architecture**

### **Frontend**

* **Framework:** React Native (mobile) \+ Next.js (admin web)

* **UI Library:** Shadcn/UI \+ TailwindCSS

* **State Management:** Zustand / Redux Toolkit

* **Hosting:** Hostinger (static) / Vercel (Next.js)

### **Backend**

* **Primary Backend:** Supabase (Auth, DB, Storage)

* **Custom Functions:** Appwrite Cloud Functions (Python / Node.js)

* **API Gateway:** Cloudflare Workers or Fastify Node.js server

* **Serverless AI Layer:** Azure Functions (OCR, AI inference)

### **Database & Storage**

* **Database:** Supabase PostgreSQL

* **File Storage:** Supabase Buckets \+ Azure Blob Storage (for large docs)

* **Cache:** Redis (via Azure Cache for Redis or Docker VM)

### **AI & NLP**

* **OCR:** Azure Document Intelligence

* **NLP Models:** spaCy \+ Transformers (HuggingFace)

* **Fraud Detection:** TensorFlow-based classification model

* **Prompt-based AI:** DeepSeek API (via custom wrapper)

### **Payments & Billing**

* **Gateway:** Cashfree (India) \+ Stripe (international)

* **Billing Automation:** Paddle or LemonSqueezy (optional)

### **DevOps / Infrastructure**

| Component | Tech | Hosting |
| ----- | ----- | ----- |
| CI/CD | GitHub Actions | GitHub Pro (free student) |
| Monitoring | Datadog \+ Sentry | Free Student Plan |
| Logging | Loki / Grafana | Hosted on Azure VM |
| Containerization | Docker \+ Heroku | Use Heroku credits |
| Queues | BullMQ (Redis) | Redis on DigitalOcean |

---

## **💡 7\. Resource Utilization (Using Your Credits)**

| Resource | Usage |
| ----- | ----- |
| **$100 MongoDB Atlas** | For logs, analytics, or backups |
| **$100 Azure Credits** | AI services (OCR, Document Intelligence) |
| **$200 DigitalOcean** | Run backend microservices or Redis queue |
| **Heroku Credits ($312)** | Host staging environments |
| **Appwrite Education Plan** | Cloud Functions & email workflows |
| **Hostinger** | Landing page \+ static web hosting |
| **GitHub Pro & Codespaces** | Development & CI/CD pipelines |
| **Datadog Pro** | Application monitoring |
| **Sentry Student Plan** | Error tracking for mobile/web |
| **Stripe & Cashfree** | Payment & subscription integration |

---

## **🔄 8\. System Flow (High-Level)**

User → React Native App → Supabase Auth  
→ Upload Docs → Supabase Storage  
→ Appwrite Function triggers Azure OCR  
→ AI Engine (Python) parses \+ validates  
→ Fraud Score generated → Supabase DB updated  
→ Report Generator (Python) → PDF → Azure Blob  
→ Notification → User Dashboard → Lawyer Review → Payment → Final Report

---

## **📅 9\. Development Roadmap (6 Months Plan)**

| Phase | Duration | Goals |
| ----- | ----- | ----- |
| **Phase 1: MVP (Month 1–2)** | Build doc upload, OCR, fraud score | Supabase \+ Azure OCR |
| **Phase 2: Verification Engine (Month 3\)** | API integration with Govt data \+ report gen | Appwrite Functions |
| **Phase 3: Payments \+ Lawyer Portal (Month 4\)** | Razorpay \+ lawyer dashboard | Next.js Web |
| **Phase 4: Monitoring & CI/CD (Month 5\)** | Datadog \+ GitHub Actions | Deploy staging |
| **Phase 5: Production Launch (Month 6\)** | User testing \+ marketing rollout | Scale backend |

---

## **🔐 10\. Security & Compliance**

* AES-256 encryption for document storage

* JWT-based auth (Supabase default)

* Secure HTTPS via Cloudflare

* Data isolation per user (row-level security in Supabase)

* Optional end-to-end encryption for legal reports

---

## **🧭 11\. Future Enhancements**

* Blockchain-based verification ledger (Hyperledger Fabric)

* AI chatbot for instant property advice

* Partner API for real estate portals (99acres, MagicBricks)

* Predictive fraud analytics from aggregated data

---

## **✅ 12\. Deliverables Summary**

| Deliverable | Description | Stack |
| ----- | ----- | ----- |
| Mobile App | React Native \+ Supabase Auth | React Native |
| Web Admin Portal | Lawyer/admin dashboard | Next.js |
| AI Verification API | OCR, NLP, Risk Scoring | Python \+ Azure |
| Report Engine | PDF \+ HTML generator | Python \+ ReportLab |
| Payments Module | Subscriptions, lawyer payments | Stripe \+ Cashfree |
| Monitoring Stack | Metrics, logs, alerts | Datadog \+ Sentry |
| CI/CD | Auto build \+ deploy | GitHub Actions \+ Docker |

---

Would you like me to now create a **visual system architecture diagram** (like what real startups show investors) showing data flow between Supabase, Appwrite, Azure, and AI services?  
 It’ll make your PRD presentation-level professional.

