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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Expenses</h1>
            <p className="text-sm text-slate-500">Track and manage your company outgoings.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-9 w-[250px] bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" 
              placeholder="Search expenses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Log Expense
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-6 p-6 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20">
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
            Total Spend (This Month)
          </span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">$212.80</span>
          <span className="text-xs text-emerald-500 flex items-center mt-1">
            <TrendingDown className="w-3 h-3 mr-1" /> 12% vs last month
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
            Largest Category
          </span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">Software</span>
          <span className="text-xs text-slate-400 mt-1">
            Accounts for 45% of total
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
            Pending Reimbursements
          </span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">$0.00</span>
          <span className="text-xs text-slate-400 mt-1">
            All expenses processed
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Merchant</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {EXPENSES.filter(e => e.merchant.toLowerCase().includes(searchTerm.toLowerCase())).map((expense, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={expense.id} 
                  className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {expense.merchant}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-xs flex items-center w-fit gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
