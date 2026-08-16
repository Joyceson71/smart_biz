"use client";

import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CashFlowClientProps {
  monthlyData: { month: string; inflow: number; outflow: number; net: number; balance: number }[];
  currentBalance: number;
  totalInflow: number;
  totalOutflow: number;
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function CashFlowClient({ monthlyData, currentBalance, totalInflow, totalOutflow }: CashFlowClientProps) {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Cash Flow</h1>
            <p className="text-xs text-slate-400 font-mono">Operating liquidity</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> Current Balance
            </p>
            <p className="text-4xl font-bold text-white">{fmt(currentBalance)}</p>
            <p className="text-xs text-slate-500 mt-2">Projected end of period</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Cash Inflow (6M)
            </p>
            <p className="text-4xl font-bold text-emerald-400">{fmt(totalInflow)}</p>
            <p className="text-xs text-emerald-500/50 mt-2">From paid invoices</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" /> Cash Outflow (6M)
            </p>
            <p className="text-4xl font-bold text-red-400">{fmt(totalOutflow)}</p>
            <p className="text-xs text-red-500/50 mt-2">From logged expenses</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Cash Balance Projection</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", color: "#fff" }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [fmt(value as number), undefined]}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" name="Projected Balance" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Monthly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Month</th>
                  <th className="px-6 py-4 text-right font-semibold">Inflow</th>
                  <th className="px-6 py-4 text-right font-semibold">Outflow</th>
                  <th className="px-6 py-4 text-right font-semibold">Net Cash Flow</th>
                  <th className="px-6 py-4 text-right font-semibold">End Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthlyData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.month}</td>
                    <td className="px-6 py-4 text-right text-emerald-400 font-mono">{fmt(row.inflow)}</td>
                    <td className="px-6 py-4 text-right text-red-400 font-mono">{fmt(row.outflow)}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${row.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {row.net >= 0 ? "+" : ""}{fmt(row.net)}
                    </td>
                    <td className="px-6 py-4 text-right text-white font-mono font-bold">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
