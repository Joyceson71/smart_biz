import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const ReportsClient = dynamic(
  () => import("./ReportsClient").then((mod) => mod.ReportsClient),
  { loading: () => <SkeletonLoader /> }
);

export const metadata = {
  title: "Reports | SmartBiz OS",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all paid invoices and all processed expenses
  const [invoicesResult, expensesResult] = await Promise.all([
    supabase.from("invoices").select("amount, created_at").eq("user_id", user.id).eq("status", "Paid"),
    supabase.from("expenses").select("amount, date").eq("user_id", user.id),
  ]);

  const invoices = invoicesResult.data || [];
  const expenses = expensesResult.data || [];

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Aggregate by month (last 6 months for simplicity)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revMap: Record<string, number> = {};
  const expMap: Record<string, number> = {};

  invoices.forEach(inv => {
    const d = new Date(inv.created_at);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    revMap[m] = (revMap[m] || 0) + (inv.amount || 0);
  });

  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    expMap[m] = (expMap[m] || 0) + (exp.amount || 0);
  });

  // Get last 6 months in order
  const now = new Date();
  const revenueData = [];
  const expenseData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    revenueData.push({ month: m, revenue: revMap[m] || 0 });
    expenseData.push({ month: m, expenses: expMap[m] || 0 });
  }

  return (
    <ReportsClient
      revenueData={revenueData}
      expenseData={expenseData}
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      netProfit={netProfit}
    />
  );
}
