# API Reference

This document outlines the custom Next.js Route Handlers built for SmartBiz. Note that standard CRUD operations bypass these routes and use the Supabase client directly via Server Actions or RSCs.

## `POST /api/ai/query`
Processes natural language queries from the user and returns an AI-generated response.

**Headers:**
- Cookie: Requires valid Supabase Auth session.

**Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What are my total expenses this month?" }
  ]
}
```

**Response:** 
`text/event-stream` (Server-Sent Events) streaming the OpenAI response.

---

## `POST /api/ocr/extract`
Uploads an invoice image/PDF and extracts structured data using OCR.

**Headers:**
- Cookie: Requires valid Supabase Auth session.
- Content-Type: `multipart/form-data`

**Body:**
- `file`: The image or PDF file to scan.

**Response (200 OK):**
```json
{
  "success": true,
  "fileUrl": "https://.../storage/v1/object/public/invoices/...",
  "rawText": "Raw extracted string...",
  "data": {
    "vendorName": "Tech Solutions",
    "invoiceNumber": "INV-001",
    "date": "01/07/2024",
    "totalAmount": 15000.00
  }
}
```
