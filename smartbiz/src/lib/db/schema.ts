/**
 * SmartBiz — Drizzle ORM Schema
 * Single source of truth for all database tables, enums, and relations.
 * Run `pnpm drizzle-kit generate` to produce migrations.
 * Run `pnpm drizzle-kit push` to apply directly to Supabase.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ── Enums ────────────────────────────────────────────────────────────────────

export const orgPlanEnum = pgEnum("org_plan", ["free", "pro", "enterprise"]);
export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "accountant", "viewer"]);
export const invoiceTypeEnum = pgEnum("invoice_type", ["sale", "purchase"]);
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft", "sent", "viewed", "partial", "paid", "overdue", "cancelled",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "cash", "bank_transfer", "upi", "cheque", "card", "other",
]);
export const discountTypeEnum = pgEnum("discount_type", ["percent", "fixed"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "invoice_due", "payment_received", "ocr_complete", "report_ready", "system",
]);
export const resetPeriodEnum = pgEnum("reset_period", ["never", "yearly", "monthly"]);

// ── Tables ───────────────────────────────────────────────────────────────────

/**
 * organizations — Top-level multi-tenant entity.
 * Every other table is isolated by organization_id.
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),               // URL-friendly identifier
  logoUrl: text("logo_url"),
  gstNumber: text("gst_number"),                       // Indian GST registration number
  panNumber: text("pan_number"),                       // PAN card number
  address: jsonb("address"),                           // { line1, line2, city, state, pincode, country }
  currency: text("currency").notNull().default("INR"),
  fiscalYearStart: integer("fiscal_year_start").notNull().default(4), // 4 = April (Indian FY)
  timezone: text("timezone").notNull().default("Asia/Kolkata"),
  plan: orgPlanEnum("plan").notNull().default("free"),
  planExpiresAt: timestamp("plan_expires_at", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * users — Links to Supabase Auth (auth.users) via id.
 * Each user belongs to exactly one organization.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),                         // References auth.users(id)
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("viewer"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * customers — Accounts Receivable counterparties (buyers).
 */
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  billingAddress: jsonb("billing_address"),
  shippingAddress: jsonb("shipping_address"),
  paymentTermsDays: integer("payment_terms_days").notNull().default(30),
  creditLimit: numeric("credit_limit", { precision: 15, scale: 2 }),
  notes: text("notes"),
  tags: text("tags").array(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orgActiveIdx: index("idx_customers_org").on(table.organizationId, table.isActive),
}));

/**
 * vendors — Accounts Payable counterparties (suppliers).
 */
export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  address: jsonb("address"),
  paymentTermsDays: integer("payment_terms_days").notNull().default(30),
  notes: text("notes"),
  tags: text("tags").array(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * invoices — Core entity for both sales (AR) and purchase (AP) invoices.
 * amount_due is a generated column: total_amount - amount_paid.
 */
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull(),      // Auto-generated via generate_invoice_number()
  type: invoiceTypeEnum("type").notNull(),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  currency: text("currency").notNull().default("INR"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull().default("0"),
  discountType: discountTypeEnum("discount_type"),
  discountValue: numeric("discount_value", { precision: 15, scale: 2 }).default("0"),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  amountPaid: numeric("amount_paid", { precision: 15, scale: 2 }).default("0"),
  // amount_due is a PostgreSQL GENERATED ALWAYS AS STORED column
  // Drizzle reads it but doesn't write it
  amountDue: numeric("amount_due", { precision: 15, scale: 2 }),
  notes: text("notes"),
  terms: text("terms"),
  fileUrl: text("file_url"),                           // Original uploaded file in Supabase Storage
  ocrRawData: jsonb("ocr_raw_data"),                   // Raw OCR response (audit trail)
  ocrConfidence: numeric("ocr_confidence", { precision: 5, scale: 2 }),
  isOcrVerified: boolean("is_ocr_verified").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orgNumberUnique: uniqueIndex("uq_org_invoice_number").on(table.organizationId, table.invoiceNumber),
  orgStatusIdx: index("idx_invoices_org_status").on(table.organizationId, table.status),
  orgDueDateIdx: index("idx_invoices_org_due_date").on(table.organizationId, table.dueDate),
  orgTypeIdx: index("idx_invoices_org_type").on(table.organizationId, table.type),
  customerIdx: index("idx_invoices_customer").on(table.customerId),
}));

/**
 * invoice_line_items — Individual line items on an invoice.
 * Cascade deletes when parent invoice is deleted.
 */
export const invoiceLineItems = pgTable("invoice_line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3 }).notNull().default("1"),
  unit: text("unit"),                                  // e.g., "kg", "hrs", "pcs"
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).default("0"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"), // GST: 0, 5, 12, 18, 28
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * payments — Payment records against invoices.
 * Insert triggers update invoice.amount_paid and potentially invoice.status.
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  referenceNumber: text("reference_number"),           // UTR, cheque number, etc.
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  invoiceIdx: index("idx_payments_invoice").on(table.invoiceId),
}));

/**
 * expenses — Business expense records with receipt storage.
 */
export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  category: text("category").notNull(),                // "Office Supplies", "Travel", etc.
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
  receiptUrl: text("receipt_url"),
  isReimbursable: boolean("is_reimbursable").notNull().default(false),
  isBillable: boolean("is_billable").notNull().default(false),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  tags: text("tags").array(),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orgDateIdx: index("idx_expenses_org_date").on(table.organizationId, table.expenseDate),
}));

/**
 * notifications — In-app + push notification records.
 * Subscribed via Supabase Realtime on the client.
 */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userUnreadIdx: index("idx_notifications_user_unread").on(table.userId, table.isRead),
}));

/**
 * audit_logs — Immutable append-only audit trail.
 * Nobody can DELETE from this table (enforced via RLS).
 */
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),                    // e.g., "invoice.created", "user.role_changed"
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orgCreatedIdx: index("idx_audit_logs_org").on(table.organizationId, table.createdAt),
}));

/**
 * invoice_sequence — Per-organization sequential invoice numbering.
 * Generates numbers like INV-0042 with configurable prefix and padding.
 */
export const invoiceSequence = pgTable("invoice_sequence", {
  organizationId: uuid("organization_id")
    .primaryKey()
    .references(() => organizations.id, { onDelete: "cascade" }),
  prefix: text("prefix").notNull().default("INV"),
  currentNumber: integer("current_number").notNull().default(0),
  padding: integer("padding").notNull().default(4),    // INV-0001 has padding=4
  resetPeriod: resetPeriodEnum("reset_period").notNull().default("yearly"),
  lastResetAt: timestamp("last_reset_at", { withTimezone: true }),
});

// ── Relations ────────────────────────────────────────────────────────────────

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  users: many(users),
  customers: many(customers),
  vendors: many(vendors),
  invoices: many(invoices),
  expenses: many(expenses),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  invoiceSequence: one(invoiceSequence, {
    fields: [organizations.id],
    references: [invoiceSequence.organizationId],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  notifications: many(notifications),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  invoices: many(invoices),
  expenses: many(expenses),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [vendors.organizationId],
    references: [organizations.id],
  }),
  invoices: many(invoices),
  expenses: many(expenses),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  vendor: one(vendors, {
    fields: [invoices.vendorId],
    references: [vendors.id],
  }),
  lineItems: many(invoiceLineItems),
  payments: many(payments),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceLineItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  organization: one(organizations, {
    fields: [expenses.organizationId],
    references: [organizations.id],
  }),
  vendor: one(vendors, {
    fields: [expenses.vendorId],
    references: [vendors.id],
  }),
  customer: one(customers, {
    fields: [expenses.customerId],
    references: [customers.id],
  }),
}));
