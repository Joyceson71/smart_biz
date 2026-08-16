import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfitLossClient } from "./ProfitLossClient";

export const metadata = {
  title: "Profit & Loss | SmartBiz OS",
};

export default async function ProfitLossPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch data for the current year
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;

  const [invoicesResult, expensesResult] = await Promise.all([
    supabase
      .from("invoices")
      .select("amount, created_at, status")
      .eq("user_id", user.id)
      .eq("status", "Paid")
      .gte("created_at", startDate),
    supabase
      .from("expenses")
      .select("amount, date, category")
      .eq("user_id", user.id)
      .gte("date", startDate),
  ]);

  const invoices = invoicesResult.data || [];
  const expenses = expensesResult.data || [];

  const totalIncome = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Group income
  const incomeItems = [
    { category: "Sales Revenue (Paid Invoices)", amount: totalIncome }
  ];

  // Group expenses by category
  const expenseMap: Record<string, number> = {};
  expenses.forEach((exp) => {
    const cat = exp.category || "Uncategorized";
    expenseMap[cat] = (expenseMap[cat] || 0) + (exp.amount || 0);
  });

  const expenseItems = Object.entries(expenseMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <ProfitLossClient
      incomeItems={incomeItems}
      expenseItems={expenseItems}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
    />
  );
}
