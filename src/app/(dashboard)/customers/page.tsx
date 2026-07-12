import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CustomersScene, { Customer } from "./CustomersScene";

export const metadata = {
  title: "Customers | SmartBiz OS",
};

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching customers:", error);
  }

  return <CustomersScene initialCustomers={(customers as Customer[]) || []} />;
}
