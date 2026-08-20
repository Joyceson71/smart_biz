"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProfitLossClientProps {
  incomeItems: { category: string; amount: number }[];
  expenseItems: { category: string; amount: number }[];
  totalIncome: number;
  totalExpenses: number;
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function ProfitLossClient({ incomeItems, expenseItems, totalIncome, totalExpenses }: ProfitLossClientProps) {
  const netProfit = totalIncome - totalExpenses;
  const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto">
      <div className="sticky top-0 z-10  px-6 py-4 flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Profit & Loss Statement</h1>
          <p className="text-xs text-slate-400 font-mono">Current Year to Date</p>
        </div>
        <Button variant="outline" className="ml-auto border-white/10 text-slate-300 hover:bg-white/10" onClick={() => window.print()}>
          Print Report
        </Button>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8 print:p-0 print:text-black">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Income</p>
            <p className="text-xl font-bold text-emerald-400">{fmt(totalIncome)}</p>
          </div>
          <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-xl font-bold text-red-400">{fmt(totalExpenses)}</p>
          </div>
          <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Net Profit</p>
            <p className={`text-xl font-bold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(netProfit)}</p>
          </div>
          <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Profit Margin</p>
            <p className={`text-xl font-bold ${margin >= 0 ? "text-emerald-400" : "text-red-400"}`}>{margin.toFixed(1)}%</p>
          </div>
        </div>

        {/* Statement Layout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 print:bg-white print:border-none print:shadow-none print:p-0">
          <h2 className="text-2xl font-bold mb-8 print:text-black hidden print:block">Profit & Loss Statement</h2>
          
          {/* Income Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 print:border-black/10">
              <ArrowUpRight className="w-5 h-5 text-emerald-400 print:text-black" />
              <h3 className="text-lg font-semibold text-emerald-400 print:text-black">Operating Income</h3>
            </div>
            <div className="space-y-3">
              {incomeItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm pl-7">
                  <span className="text-slate-300 print:text-black">{item.category}</span>
                  <span className="font-mono text-white print:text-black">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm font-bold pl-7 pt-3 mt-3 border-t border-white/5 print:border-black/5">
                <span className="text-emerald-400 print:text-black">Total Income</span>
                <span className="font-mono text-emerald-400 print:text-black">{fmt(totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 print:border-black/10">
              <ArrowDownRight className="w-5 h-5 text-red-400 print:text-black" />
              <h3 className="text-lg font-semibold text-red-400 print:text-black">Operating Expenses</h3>
            </div>
            <div className="space-y-3">
              {expenseItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm pl-7">
                  <span className="text-slate-300 print:text-black">{item.category}</span>
                  <span className="font-mono text-white print:text-black">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm font-bold pl-7 pt-3 mt-3 border-t border-white/5 print:border-black/5">
                <span className="text-red-400 print:text-black">Total Expenses</span>
                <span className="font-mono text-red-400 print:text-black">{fmt(totalExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Net Profit Section */}
          <div className={`mt-8 pt-6 border-t-2 ${netProfit >= 0 ? "border-emerald-500/50" : "border-red-500/50"} print:border-black flex justify-between items-center`}>
            <h3 className="text-xl font-bold print:text-black">Net Profit</h3>
            <span className={`text-2xl font-bold font-mono ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"} print:text-black`}>
              {fmt(netProfit)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
