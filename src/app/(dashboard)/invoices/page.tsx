import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvoicesScene, { Invoice } from "./InvoicesScene";

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

  return <InvoicesScene initialInvoices={(invoices as unknown as Invoice[]) || []} />;
}
