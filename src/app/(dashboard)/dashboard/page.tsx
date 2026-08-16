import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const DashboardClient = dynamic(
  () => import("./DashboardClient").then((mod) => mod.DashboardClient), 
  { loading: () => <SkeletonLoader /> }
);

export const metadata = {
  title: "Dashboard | SmartBiz OS",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch real KPI data
  const [revenueResult, customerResult, pendingResult] = await Promise.all([
    supabase
      .from("invoices")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "Paid"),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "Pending"),
  ]);

  const totalRevenue = (revenueResult.data || []).reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const customerCount = customerResult.count ?? 0;
  const pendingCount = pendingResult.count ?? 0;

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      customerCount={customerCount}
      pendingCount={pendingCount}
    />
  );
}
