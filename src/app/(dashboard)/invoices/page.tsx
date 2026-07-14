import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Invoice } from "./InvoicesScene";
import { InvoiceDashboard } from "./InvoiceDashboard";

export const metadata = {
  title: "Invoices | SmartBiz OS",
};

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase. Join with customers to get the name.
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
      id, invoice_number, amount, status, date:due_date, pos_x, pos_y, pos_z,
      customer:customers(first_name, last_name)
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching invoices:", error);
  }

  type DbInvoice = {
    id: string;
    invoice_number: string;
    amount: number;
    status: string;
    date?: string;
    customer?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[];
    pos_x?: number;
    pos_y?: number;
    pos_z?: number;
  };

  const getCustomerName = (customer: DbInvoice['customer']) => {
    if (!customer) return "Unknown Customer";
    if (Array.isArray(customer)) {
      const c = customer[0];
      return c ? `${c.first_name} ${c.last_name}` : "Unknown Customer";
    }
    return `${customer.first_name} ${customer.last_name}`;
  };

  const formattedInvoices = (invoices as unknown as DbInvoice[] || []).map((inv: DbInvoice) => ({
    id: inv.id,
    invoice_number: inv.invoice_number,
    customer_name: getCustomerName(inv.customer),
    amount: inv.amount,
    status: inv.status,
    due_date: inv.date || new Date().toISOString(),
  }));

  const spatialInvoices = (invoices as unknown as DbInvoice[] || []).map((inv: DbInvoice) => ({
    ...inv,
    customerName: getCustomerName(inv.customer)
  })) as Invoice[];

  return <InvoiceDashboard invoices={formattedInvoices} spatialInvoices={spatialInvoices} />;
}
