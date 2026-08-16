import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CashFlowClient } from "./CashFlowClient";

export const metadata = {
  title: "Cash Flow | SmartBiz OS",
};

export default async function CashFlowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [invoicesResult, expensesResult] = await Promise.all([
    supabase.from("invoices").select("amount, created_at").eq("user_id", user.id).eq("status", "Paid"),
    supabase.from("expenses").select("amount, date").eq("user_id", user.id),
  ]);

  const invoices = invoicesResult.data || [];
  const expenses = expensesResult.data || [];

  const totalInflow = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalOutflow = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  let currentBalance = 50000; // Starting baseline for demonstration purposes

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const inflowMap: Record<string, number> = {};
  const outflowMap: Record<string, number> = {};

  invoices.forEach(inv => {
    const d = new Date(inv.created_at);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    inflowMap[m] = (inflowMap[m] || 0) + (inv.amount || 0);
  });

  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    outflowMap[m] = (outflowMap[m] || 0) + (exp.amount || 0);
  });

  const now = new Date();
  const monthlyData = [];

  // Create rolling 6 month forecast (past 5 months + current month)
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    
    const inflow = inflowMap[m] || 0;
    const outflow = outflowMap[m] || 0;
    const net = inflow - outflow;
    currentBalance += net;

    monthlyData.push({
      month: m,
      inflow,
      outflow,
      net,
      balance: currentBalance
    });
  }

  return (
    <CashFlowClient
      monthlyData={monthlyData}
      currentBalance={currentBalance}
      totalInflow={totalInflow}
      totalOutflow={totalOutflow}
    />
  );
}
