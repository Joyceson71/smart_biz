import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import type { Customer } from "./CustomersScene";

const CustomersScene = dynamic(() => import("./CustomersScene"), { 
  loading: () => <SkeletonLoader /> 
});
import { Suspense } from "react";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

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

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <CustomersScene initialCustomers={(customers as Customer[]) || []} />
    </Suspense>
  );
}
