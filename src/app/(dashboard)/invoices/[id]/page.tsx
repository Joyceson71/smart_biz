import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { InvoiceDetailClient } from "./InvoiceDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("invoices").select("invoice_number").eq("id", id).single();
  return { title: data ? `Invoice ${data.invoice_number} | SmartBiz OS` : "Invoice | SmartBiz OS" };
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [invoiceResult, itemsResult] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (invoiceResult.error || !invoiceResult.data) {
    notFound();
  }

  return (
    <InvoiceDetailClient
      invoice={invoiceResult.data}
      items={itemsResult.data ?? []}
    />
  );
}
