# Azure Document Intelligence Setup Guide

This guide will help you set up **Azure Document Intelligence** (formerly Form Recognizer) for PropShield's OCR and document analysis features.

## Overview

Azure Document Intelligence provides:
- ✅ OCR (Optical Character Recognition) for extracting text from images/PDFs
- ✅ Pre-built models for common document types (invoices, receipts, IDs, etc.)
- ✅ Custom model training for specific document formats
- ✅ Layout analysis (tables, key-value pairs, structure detection)
- ✅ 99%+ accuracy for printed text
- ✅ Support for 100+ languages including English, Hindi, and regional Indian languages

## Prerequisites

- Azure account (create free account at https://azure.microsoft.com/free/)
- Free tier includes:
  - **5,000 pages/month free** (S0 pricing tier)
  - **20 concurrent API calls**
  - No credit card required for free tier

---

## Step 1: Create Azure Document Intelligence Resource

### Via Azure Portal (Recommended)

1. **Go to Azure Portal**
   - Navigate to https://portal.azure.com
   - Sign in with your Microsoft account

2. **Create Resource**
   - Click "Create a resource" (top left)
   - Search for "Document Intelligence" or "Form Recognizer"
   - Click "Create"

3. **Configure Resource**
   ```
   Subscription: Your Azure subscription
   Resource Group: propshield-resources (or create new)
   Region: Southeast Asia or Central India (closest to your users)
   Name: propshield-doc-intelligence
   Pricing Tier: Free (F0) - 5K pages/month OR Standard (S0) - pay-as-you-go
   ```

4. **Review + Create**
   - Click "Review + create"
   - Click "Create"
   - Wait 1-2 minutes for deployment

5. **Get Credentials**
   - Once deployed, click "Go to resource"
   - In the left sidebar, click "Keys and Endpoint"
   - Copy:
     - **Endpoint**: `https://<your-resource-name>.cognitiveservices.azure.com/`
     - **Key 1**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Via Azure CLI (Advanced)

```bash
# Login to Azure
az login

# Create resource group
az group create --name propshield-resources --location southeastasia

# Create Document Intelligence resource
az cognitiveservices account create \
  --name propshield-doc-intelligence \
  --resource-group propshield-resources \
  --kind FormRecognizer \
  --sku F0 \
  --location southeastasia \
  --yes

# Get endpoint and key
az cognitiveservices account show \
  --name propshield-doc-intelligence \
  --resource-group propshield-resources \
  --query "properties.endpoint"

az cognitiveservices account keys list \
  --name propshield-doc-intelligence \
  --resource-group propshield-resources
```

---

## Step 2: Configure PropShield Environment

Add your Azure credentials to `.env`:

```env
# Azure Document Intelligence
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://propshield-doc-intelligence.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your_key_here
```

**⚠️ IMPORTANT**: Never commit `.env` to git! It's already in `.gitignore`.

---

## Step 3: Test Connection

Create a test script to verify your setup:

```typescript
// scripts/test-azure-connection.ts
import axios from 'axios';

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

async function testConnection() {
  try {
    // Test endpoint connectivity
    const response = await axios.get(`${endpoint}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': key,
      },
    });
    
    console.log('✅ Azure Document Intelligence connected successfully!');
    console.log('API Version:', response.headers['api-supported-versions']);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run: `npx tsx scripts/test-azure-connection.ts`

---

## Step 4: Document Analysis API Overview

### Available Models

Azure Document Intelligence provides several pre-built models:

1. **prebuilt-read** (Best for PropShield)
   - General text extraction from any document
   - Supports images (JPEG, PNG, HEIC) and PDFs
   - Detects text, paragraphs, lines, words
   - **Use Case**: Sale deeds, tax receipts, certificates

2. **prebuilt-layout**
   - Extracts text + structure (tables, selection marks, paragraphs)
   - **Use Case**: Documents with complex layouts

3. **prebuilt-document**
   - General-purpose key-value pair extraction
   - **Use Case**: Forms with field-value pairs

4. **prebuilt-invoice**
   - Extracts invoice-specific fields
   - **Use Case**: Property tax receipts

### API Endpoints

```
POST {endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2023-07-31
POST {endpoint}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31
POST {endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31
GET {endpoint}/formrecognizer/documentModels/prebuilt-read/analyzeResults/{resultId}?api-version=2023-07-31
```

---

## Step 5: Example Implementation

Here's how to analyze a document:

```typescript
// lib/azure-document-intelligence.ts
import axios from 'axios';

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;
const apiVersion = '2023-07-31';

export async function analyzeDocument(fileUrl: string) {
  try {
    // Step 1: Submit document for analysis
    const analyzeResponse = await axios.post(
      `${endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=${apiVersion}`,
      { urlSource: fileUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': key,
        },
      }
    );

    // Get operation location (polling URL)
    const operationLocation = analyzeResponse.headers['operation-location'];

    // Step 2: Poll for results
    let result;
    let status = 'running';
    
    while (status === 'running') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const resultResponse = await axios.get(operationLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': key },
      });
      
      result = resultResponse.data;
      status = result.status;
    }

    if (status === 'succeeded') {
      return {
        success: true,
        text: result.analyzeResult.content,
        pages: result.analyzeResult.pages,
        paragraphs: result.analyzeResult.paragraphs,
      };
    } else {
      throw new Error(`Analysis failed with status: ${status}`);
    }
  } catch (error) {
    console.error('Document analysis error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

---

## Step 6: Supported File Formats

| Format | Extension | Max Size |
|--------|-----------|----------|
| PDF | `.pdf` | 500 MB |
| JPEG | `.jpg`, `.jpeg` | 50 MB |
| PNG | `.png` | 50 MB |
| BMP | `.bmp` | 50 MB |
| TIFF | `.tif`, `.tiff` | 500 MB |
| HEIF | `.heic`, `.heif` | 50 MB |

**PropShield Configuration**: We allow PDF, JPG, PNG, HEIC up to 50MB per file.

---

## Step 7: Cost Estimation

### Free Tier (F0)
- **5,000 pages/month free**
- **20 concurrent requests**
- Perfect for development and early users

### Standard Tier (S0) Pay-As-You-Go
- **$1.00 per 1,000 pages** (Read model)
- **$10.00 per 1,000 pages** (Layout model)
- **$50.00 per 1,000 pages** (Custom models)

**PropShield Usage Estimate**:
- Average document: 5 pages
- 1,000 verifications/month = 5,000 pages = **$5/month**
- 10,000 verifications/month = 50,000 pages = **$50/month**

### Cost Optimization Tips
1. Use **prebuilt-read** instead of prebuilt-layout (cheaper)
2. Cache OCR results in Supabase (don't re-process same document)
3. Compress images before upload
4. Use Free tier (F0) during development

---

## Step 8: Integration Checklist

- [ ] Create Azure Document Intelligence resource
- [ ] Copy endpoint and key to `.env`
- [ ] Test connection with test script
- [ ] Implement document analysis function
- [ ] Create Supabase Edge Function for OCR processing
- [ ] Update `documents` table with `extracted_data` column
- [ ] Add error handling and retry logic
- [ ] Implement result caching
- [ ] Test with real property documents
- [ ] Monitor usage in Azure Portal

---

## Step 9: Monitoring & Best Practices

### Monitor Usage
1. Go to Azure Portal > Your Resource
2. Click "Metrics" in left sidebar
3. Add metrics:
   - Total Calls
   - Data In/Out
   - Latency
   - Errors

### Best Practices
- ✅ Use HTTPS for all API calls
- ✅ Store keys in environment variables (never in code)
- ✅ Implement retry logic with exponential backoff
- ✅ Cache results to avoid redundant API calls
- ✅ Handle errors gracefully
- ✅ Monitor usage to avoid unexpected costs
- ✅ Use webhook/callback for long-running operations
- ✅ Rotate API keys regularly

---

## Troubleshooting

### Error: "Access Denied" (401)
- ❌ Wrong API key
- ✅ Verify key in Azure Portal > Keys and Endpoint
- ✅ Check `.env` configuration

### Error: "Invalid Request" (400)
- ❌ Unsupported file format or size
- ✅ Check file format and size limits
- ✅ Ensure file URL is publicly accessible

### Error: "Rate Limit Exceeded" (429)
- ❌ Too many concurrent requests
- ✅ Implement request throttling
- ✅ Upgrade to Standard tier
- ✅ Add retry logic with exponential backoff

### Error: "Endpoint Not Found" (404)
- ❌ Wrong endpoint URL
- ✅ Verify endpoint includes region (e.g., southeastasia)
- ✅ Check API version in URL

---

## Next Steps

After completing Azure setup:

1. ✅ **Todo #6**: Setup Azure Document Intelligence OCR (CURRENT)
2. ⏭️ **Todo #7**: Build AI Verification Engine - Data Extraction
3. ⏭️ **Todo #8**: Integrate Government APIs
4. ⏭️ **Todo #9**: Build NLP Fraud Detection Model

---

## Resources

- **Official Docs**: https://learn.microsoft.com/azure/ai-services/document-intelligence/
- **API Reference**: https://learn.microsoft.com/rest/api/aiservices/document-models
- **Pricing**: https://azure.microsoft.com/pricing/details/form-recognizer/
- **Samples**: https://github.com/Azure-Samples/document-intelligence-code-samples
- **Support**: https://docs.microsoft.com/answers/topics/azure-form-recognizer.html

---

**Created by PropShield Team** | Last Updated: October 31, 2025
