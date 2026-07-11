/** Application route constants — single source of truth for all navigation */

export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────────────────
  HOME: "/",
  
  // ── Auth ────────────────────────────────────────────────────────────────
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // ── Dashboard ────────────────────────────────────────────────────────────
  DASHBOARD: "/dashboard",
  AI_ASSISTANT: "/ai-assistant",

  // ── Finance ──────────────────────────────────────────────────────────────
  INVOICES: "/invoices",
  INVOICE_NEW: "/invoices/new",
  INVOICE_UPLOAD: "/invoices/upload",
  INVOICE_DETAIL: (id: string) => `/invoices/${id}`,
  EXPENSES: "/expenses",
  EXPENSE_NEW: "/expenses/new",
  CASH_FLOW: "/cash-flow",

  // ── Reports ──────────────────────────────────────────────────────────────
  REPORTS: "/reports",
  REPORT_PL: "/reports/profit-loss",
  REPORT_TAX: "/reports/tax-summary",

  // ── Contacts ─────────────────────────────────────────────────────────────
  CUSTOMERS: "/customers",
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,
  VENDORS: "/vendors",
  VENDOR_DETAIL: (id: string) => `/vendors/${id}`,

  // ── Settings ─────────────────────────────────────────────────────────────
  SETTINGS: "/settings",
  SETTINGS_TEAM: "/settings/team",
  SETTINGS_BILLING: "/settings/billing",
  SETTINGS_INTEGRATIONS: "/settings/integrations",

  // ── Notifications ────────────────────────────────────────────────────────
  NOTIFICATIONS: "/notifications",

  // ── API ──────────────────────────────────────────────────────────────────
  API: {
    INVOICES: "/api/invoices",
    INVOICE_DETAIL: (id: string) => `/api/invoices/${id}`,
    OCR_EXTRACT: "/api/ocr/extract",
    AI_QUERY: "/api/ai/query",
    REPORTS_GENERATE: "/api/reports/generate",
    HEALTH: "/api/health",
    AUTH_CALLBACK: "/api/auth/callback",
  },
} as const;
