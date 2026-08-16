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

  // We could fetch related purchase orders here in the future
  
  return <VendorDetailClient vendor={vendor} />;
}
