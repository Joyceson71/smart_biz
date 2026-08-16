import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TaxSummaryClient } from "./TaxSummaryClient";

export const metadata = {
  title: "Tax Summary | SmartBiz OS",
};

export default async function TaxSummaryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch only Paid invoices for the tax summary
  const { data: invoices } = await supabase
    .from("invoices")
    .select("amount, subtotal, tax")
    .eq("user_id", user.id)
    .eq("status", "Paid");

  const paidInvoices = invoices || [];

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const taxableIncome = paidInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
  const totalTaxCollected = paidInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);

  return (
    <TaxSummaryClient
      totalRevenue={totalRevenue}
      totalTaxCollected={totalTaxCollected}
      invoiceCount={paidInvoices.length}
      taxableIncome={taxableIncome}
    />
  );
}
