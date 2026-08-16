import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VendorsClient } from "./VendorsClient";

export const metadata = {
  title: "Vendors | SmartBiz OS",
};

export default async function VendorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Attempt to fetch vendors. If the table doesn't exist, this will error, so we catch it gracefully.
  const { data: vendors, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.warn("Vendors table might not exist yet. Please run migration 00006_vendors.sql");
  }

  return <VendorsClient vendors={vendors ?? []} />;
}
