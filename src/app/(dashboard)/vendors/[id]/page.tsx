import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { VendorDetailClient } from "./VendorDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("vendors").select("name").eq("id", id).single();
  return { title: data ? `${data.name} | Vendors | SmartBiz OS` : "Vendor | SmartBiz OS" };
}

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: vendor, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !vendor) {
    notFound();
  }

  const { data: vendorExpenses } = await supabase
    .from("expenses")
    .select("id, merchant, amount, category, date, created_at")
    .eq("user_id", user.id)
    .eq("vendor_id", vendor.id)
    .order("date", { ascending: false })
    .limit(25);
  
  return <VendorDetailClient vendor={vendor} expenses={vendorExpenses ?? []} />;
}
