'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Wallet, TrendingDown, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const EXPENSES = [
  { id: 1, merchant: "Vercel", category: "Software", amount: 20.00, date: "2026-07-12", status: "Processed" },
  { id: 2, merchant: "Google Workspace", category: "Software", amount: 35.00, date: "2026-07-10", status: "Processed" },
  { id: 3, merchant: "Stripe", category: "Fees", amount: 15.50, date: "2026-07-08", status: "Processed" },
  { id: 4, merchant: "AWS", category: "Infrastructure", amount: 142.30, date: "2026-07-01", status: "Processed" },
];

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white w-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 p-6 md:p-8 border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shadow-inner">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              Expenses
            </h1>
            <p className="text-emerald-400/80 font-mono text-xs mt-2 uppercase tracking-[0.15em]">
              Track and manage company outgoings
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-10 w-full sm:w-[280px] bg-slate-900/40 backdrop-blur-2xl border-white/10 text-white placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-emerald-500/50 rounded-full py-5" 
              placeholder="Search expenses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold uppercase tracking-widest text-xs py-5 px-6 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 gap-2 border border-emerald-500/20">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Log Expense
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 border-b border-white/5 bg-slate-900/10">
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] cursor-pointer">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-emerald-500/10 transition-opacity duration-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-[50px] group-hover:bg-emerald-500/30 transition-colors duration-500 animate-pulse" />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
              Total Spend (This Month)
            </span>
            <span className="text-4xl font-bold text-white tracking-tight">$212.80</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center mt-2 bg-emerald-500/10 w-fit px-2 py-1 rounded-md border border-emerald-500/20">
              <TrendingDown className="w-3 h-3 mr-1" /> 12% vs last month
            </span>
          </div>
        </div>
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-blue-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] cursor-pointer">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-blue-500/10 transition-opacity duration-500" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-blue-500/30 transition-colors duration-500 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
              Largest Category
            </span>
            <span className="text-4xl font-bold text-white tracking-tight">Software</span>
            <span className="text-xs text-blue-400 mt-2 font-mono">
              Accounts for 45% of total
            </span>
          </div>
        </div>
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-purple-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] cursor-pointer">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-purple-500/10 transition-opacity duration-500" />
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] group-hover:bg-purple-500/30 transition-colors duration-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
              Pending Reimbursements
            </span>
            <span className="text-4xl font-bold text-white tracking-tight">$0.00</span>
            <span className="text-xs text-purple-400 mt-2 font-mono">
              All expenses processed
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Desktop Table View */}
          <table className="hidden md:table w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/60 border-b border-white/5">
              <tr>
                <th className="px-6 py-5">Merchant</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {EXPENSES.filter(e => e.merchant.toLowerCase().includes(searchTerm.toLowerCase())).map((expense, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={expense.id} 
                  className="group hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5 font-medium text-white">
                    {expense.merchant}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-slate-800/80 border border-white/10 text-slate-300 rounded-lg text-xs tracking-wide">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono font-bold text-white tracking-tight">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5 text-slate-400 font-mono text-xs">
                    {expense.date}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center w-fit gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right overflow-hidden">
                    <Button variant="ghost" size="icon" className="opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {EXPENSES.filter(e => e.merchant.toLowerCase().includes(searchTerm.toLowerCase())).map((expense, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={expense.id} 
                className="p-6 hover:bg-white/5 transition-colors flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{expense.merchant}</h3>
                    <div className="mt-2">
                      <span className="px-3 py-1.5 bg-slate-800/80 border border-white/10 text-slate-300 rounded-lg text-xs tracking-wide">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tracking-tight text-xl">
                    ${expense.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-col gap-3">
                    <span className="text-slate-400 font-mono text-xs flex items-center gap-2">
                      {expense.date}
                    </span>
                    <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center w-fit gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {expense.status}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-full bg-white/5 border border-white/5">
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
