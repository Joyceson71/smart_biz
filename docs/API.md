# SmartBiz OS — API Reference

All routes live under `/api/`. All protected routes require a valid Supabase session cookie.
The server derives the authenticated user ID from `supabase.auth.getUser()` — never from the request body.

---

## Auth

### `GET /api/auth/callback`
**Public.** Supabase OAuth callback. Exchanges the `code` parameter for a session and redirects to `/dashboard`.

| Query Param | Description |
|-------------|-------------|
| `code` | OAuth authorization code from Supabase |
| `next` | (optional) Path to redirect to after login. Defaults to `/dashboard` |

---

## Health

### `GET /api/health`
**Public.** Returns application and database health.

**Response `200 OK`:**
```json
{
  "status": "ok",
  "db": "connected",
  "latency_ms": 42,
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**Response `503 Service Unavailable`** when database is unreachable.

---

## Invoices

### `GET /api/invoices`
**Authenticated.** Returns all invoices for the current user, ordered by newest first.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "invoice_number": "INV-001",
      "amount": 5000,
      "status": "Paid",
      "due_date": "2024-02-01",
      "customer_name": "Acme Corp",
      "customer": { "first_name": "Ravi", "last_name": "Kumar", "email": "ravi@acme.com" }
    }
  ]
}
```

### `POST /api/invoices`
**Authenticated.** Creates a new invoice and optional line items.

**Request body:**
```json
{
  "invoice_number": "INV-002",
  "amount": 10000,
  "status": "Pending",
  "due_date": "2024-03-01",
  "customer_id": "uuid-optional",
  "customer_name": "Acme Corp",
  "subtotal": 8850,
  "tax": 1150,
  "total": 10000,
  "items": [
    { "product_name": "Widget A", "quantity": 10, "unit_price": 885, "total": 8850 }
  ]
}
```

**Response `201 Created`:** Created invoice object.

### `GET /api/invoices/:id`
**Authenticated.** Returns a single invoice with its line items and customer details.

### `PUT /api/invoices/:id`
**Authenticated.** Updates an existing invoice. Cannot change `user_id`.

### `DELETE /api/invoices/:id`
**Authenticated.** Deletes an invoice and its line items (cascade). Returns `204 No Content`.

---

## AI Chat

### `POST /api/chat`
**Authenticated.** Streams an AI response using OpenAI `gpt-4o-mini` via the Vercel AI SDK.
The AI has tool access to live inventory, customer, and invoice data.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "What's my inventory status?" }
  ]
}
```

**Response:** Server-Sent Events stream (AI SDK data stream format).

---

## OCR / Invoice Import

### `POST /api/ocr/extract`
**Authenticated.** Accepts a multipart file upload (PDF or image). Extracts text using OCR.space, then parses structured invoice data using OpenAI.

**Request:** `multipart/form-data` with a `file` field.

**Response `200 OK`:**
```json
{
  "data": {
    "supplier_name": "TechNova Ltd.",
    "invoice_number": "TN-1234",
    "date": "2024-01-15",
    "items": [
      { "sku": "TN-KB-01", "name": "Keyboard", "quantity": 10, "purchase_price": 2500, "selling_price": 4000 }
    ],
    "subtotal": 25000,
    "tax": 4500,
    "total": 29500
  }
}
```

---

## Reports

### `GET /api/reports/generate`
**Authenticated.** Returns aggregated business metrics.

| Query Param | Value | Description |
|-------------|-------|-------------|
| `type` | `summary` (default) | Report type |

**Response `200 OK`:**
```json
{
  "demoMode": false,
  "type": "summary",
  "data": {
    "revenue": { "total": 150000, "pending": 45000, "invoiceCount": 12 },
    "inventory": { "totalProducts": 47, "inventoryValue": 320000, "lowStockAlerts": 3 },
    "customers": { "total": 24, "active": 18, "new": 6 }
  }
}
```

---

## Removed / Stub Routes

| Route | Status | Reason |
|-------|--------|--------|
| `GET /api/ai/query` | Removed | Redundant — use `/api/chat` |
| `POST /api/webhooks/stripe` | Stub (no handler) | Stripe billing not in scope |
