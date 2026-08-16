import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExpensesClient } from "./ExpensesClient";

export const metadata = {
  title: "Expenses | SmartBiz OS",
};

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const allExpenses = expenses || [];

  // Compute metrics
  const totalSpend = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const pendingTotal = allExpenses.filter(e => e.status === "Pending").reduce((sum, e) => sum + (e.amount || 0), 0);

  // Find largest category by total spend
  const categoryTotals = allExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (e.amount || 0);
    return acc;
  }, {});
  const largestCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";

  return (
    <ExpensesClient
      expenses={allExpenses}
      totalSpend={totalSpend}
      largestCategory={largestCategory}
      pendingTotal={pendingTotal}
    />
  );
}
