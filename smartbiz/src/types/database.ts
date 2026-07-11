/**
 * Supabase Database type definitions.
 * In production, generate this with: npx supabase gen types typescript --linked
 * This is a manually-maintained version for the hackathon.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type InvoiceType = "sale" | "purchase";
export type InvoiceStatus = "draft" | "sent" | "viewed" | "partial" | "paid" | "overdue" | "cancelled";
export type UserRole = "owner" | "admin" | "accountant" | "viewer";
export type OrgPlan = "free" | "pro" | "enterprise";
export type PaymentMethod = "cash" | "bank_transfer" | "upi" | "cheque" | "card" | "other";
export type NotificationType = "invoice_due" | "payment_received" | "ocr_complete" | "report_ready" | "system";
export type DiscountType = "percent" | "fixed";
export type ResetPeriod = "never" | "yearly" | "monthly";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          gst_number: string | null;
          pan_number: string | null;
          address: Json | null;
          currency: string;
          fiscal_year_start: number;
          timezone: string;
          plan: OrgPlan;
          plan_expires_at: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          is_active: boolean;
          last_seen_at: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          gst_number: string | null;
          pan_number: string | null;
          billing_address: Json | null;
          shipping_address: Json | null;
          payment_terms_days: number;
          credit_limit: number | null;
          notes: string | null;
          tags: string[] | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      vendors: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          gst_number: string | null;
          pan_number: string | null;
          address: Json | null;
          payment_terms_days: number;
          notes: string | null;
          tags: string[] | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vendors"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          invoice_number: string;
          type: InvoiceType;
          status: InvoiceStatus;
          customer_id: string | null;
          vendor_id: string | null;
          issue_date: string;
          due_date: string;
          currency: string;
          subtotal: number;
          discount_type: DiscountType | null;
          discount_value: number;
          tax_amount: number;
          total_amount: number;
          amount_paid: number;
          amount_due: number;
          notes: string | null;
          terms: string | null;
          file_url: string | null;
          ocr_raw_data: Json | null;
          ocr_confidence: number | null;
          is_ocr_verified: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "amount_due" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      invoice_line_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit: string | null;
          unit_price: number;
          discount_percent: number;
          tax_rate: number;
          tax_amount: number | null;
          total_amount: number;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["invoice_line_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["invoice_line_items"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          organization_id: string;
          invoice_id: string;
          amount: number;
          payment_date: string;
          payment_method: PaymentMethod;
          reference_number: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      expenses: {
        Row: {
          id: string;
          organization_id: string;
          category: string;
          description: string;
          amount: number;
          expense_date: string;
          payment_method: PaymentMethod;
          vendor_id: string | null;
          receipt_url: string | null;
          is_reimbursable: boolean;
          is_billable: boolean;
          customer_id: string | null;
          tags: string[] | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["expenses"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          action_url: string | null;
          is_read: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at"> & { id?: string };
        Update: never;
      };
      invoice_sequence: {
        Row: {
          organization_id: string;
          prefix: string;
          current_number: number;
          padding: number;
          reset_period: ResetPeriod;
          last_reset_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["invoice_sequence"]["Row"]> & { organization_id: string };
        Update: Partial<Omit<Database["public"]["Tables"]["invoice_sequence"]["Row"], "organization_id">>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_dashboard_stats: {
        Args: { p_org_id: string; p_start_date: string; p_end_date: string };
        Returns: {
          total_revenue: number;
          total_expenses: number;
          net_profit: number;
          outstanding_ar: number;
          overdue_amount: number;
          invoice_count: number;
          paid_invoice_count: number;
        };
      };
      get_cash_flow_forecast: {
        Args: { p_org_id: string; p_days: number };
        Returns: Array<{ date: string; cash_in: number; cash_out: number; running_balance: number }>;
      };
      generate_invoice_number: {
        Args: { p_org_id: string };
        Returns: string;
      };
      get_top_customers: {
        Args: { p_org_id: string; p_limit: number; p_period: string };
        Returns: Array<{ customer_id: string; customer_name: string; total_revenue: number; invoice_count: number }>;
      };
      search_global: {
        Args: { p_org_id: string; p_query: string };
        Returns: Array<{ type: string; id: string; title: string; subtitle: string; url: string }>;
      };
    };
    Enums: {
      invoice_type: InvoiceType;
      invoice_status: InvoiceStatus;
      user_role: UserRole;
      org_plan: OrgPlan;
      payment_method: PaymentMethod;
      notification_type: NotificationType;
    };
  };
}
