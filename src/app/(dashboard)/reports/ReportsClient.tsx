"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, Activity, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReportsClientProps {
  revenueData: { month: string; revenue: number }[];
  expenseData: { month: string; expenses: number }[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function ReportsClient({ revenueData, expenseData, totalRevenue, totalExpenses, netProfit }: ReportsClientProps) {
  // Combine data for the dual-axis chart
  const combinedData = revenueData.map((rev) => {
    const exp = expenseData.find((e) => e.month === rev.month)?.expenses || 0;
    return {
      month: rev.month,
      revenue: rev.revenue,
      expenses: exp,
      profit: rev.revenue - exp,
    };
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 md:px-8 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">Reports Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Financial performance and metrics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports/profit-loss">
            <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30 gap-2">
              <Activity className="w-4 h-4" /> Profit & Loss
            </Button>
          </Link>
          <Link href="/reports/tax-summary">
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-950/30 gap-2">
              <DollarSign className="w-4 h-4" /> Tax Summary
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold">Total Revenue</p>
            <p className="text-3xl font-bold text-white">{fmt(totalRevenue)}</p>
            <div className="absolute top-6 right-6 p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold">Total Expenses</p>
            <p className="text-3xl font-bold text-white">{fmt(totalExpenses)}</p>
            <div className="absolute top-6 right-6 p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold">Net Profit</p>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(netProfit)}</p>
            <div className="absolute top-6 right-6 p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Revenue vs Expenses</h3>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    formatter={(value: number) => [fmt(value), undefined]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Net Profit Trend</h3>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [fmt(value), "Profit"]}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                    {combinedData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
