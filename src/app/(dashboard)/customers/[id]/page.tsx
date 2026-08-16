import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { CustomerDetailClient } from "./CustomerDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("first_name, last_name").eq("id", id).single();
  return { title: data ? `${data.first_name} ${data.last_name} | SmartBiz OS` : "Customer | SmartBiz OS" };
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [customerResult, invoicesResult] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, status, due_date, created_at")
      .eq("customer_email", "") // will match by customer name/email in a real schema
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (customerResult.error || !customerResult.data) {
    notFound();
  }

  const customer = customerResult.data;

  // Fetch invoices related to this customer by email
  const { data: customerInvoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount, status, due_date, created_at")
    .eq("user_id", user.id)
    .eq("customer_email", customer.email)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <CustomerDetailClient
      customer={customer}
      invoices={customerInvoices ?? []}
    />
  );
}
