"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { createClient } from "@/lib/supabase/client";

interface AgingBucket { label: string; amount: number; color: string }

export function InvoiceAgingChart() {
  const [data, setData] = useState<AgingBucket[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const today = new Date();

      const { data: invoices } = await supabase
        .from("invoices")
        .select("amount, due_date, status")
        .eq("status", "Pending");

      const buckets = { current: 0, "1-30": 0, "31-60": 0, "60+": 0 };
      invoices?.forEach(inv => {
        const daysPast = Math.floor((today.getTime() - new Date(inv.due_date).getTime()) / 86400000);
        if (daysPast <= 0)        buckets.current += inv.amount;
        else if (daysPast <= 30)  buckets["1-30"] += inv.amount;
        else if (daysPast <= 60)  buckets["31-60"] += inv.amount;
        else                      buckets["60+"] += inv.amount;
      });

      setData([
        { label: "Current",  amount: buckets.current,  color: "#10b981" },
        { label: "1–30 d",   amount: buckets["1-30"],  color: "#f59e0b" },
        { label: "31–60 d",  amount: buckets["31-60"], color: "#f97316" },
        { label: "60+ d",    amount: buckets["60+"],   color: "#ef4444" },
      ]);
    }
    load();
  }, []);

  return (
    <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Invoice Aging (AR)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, "Outstanding"]}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
