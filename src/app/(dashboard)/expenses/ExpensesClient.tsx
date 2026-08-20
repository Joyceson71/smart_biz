"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Wallet, TrendingDown, TrendingUp, ArrowUpRight, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addExpense, deleteExpense } from "./actions";
import { toast } from "sonner";
import { ExpenseCategoryChart } from "@/components/expenses/ExpenseCategoryChart";

type Expense = {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  notes?: string | null;
};

interface ExpensesClientProps {
  expenses: Expense[];
  totalSpend: number;
  largestCategory: string;
  pendingTotal: number;
}

const CATEGORIES = ["Software", "Infrastructure", "Marketing", "Fees", "Travel", "Office", "Legal", "General"];

export function ExpensesClient({ expenses: initialExpenses, totalSpend, largestCategory, pendingTotal }: ExpensesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ merchant: "", category: "Software", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const filtered = initialExpenses.filter(e => e.merchant.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    startTransition(async () => {
      try {
        await addExpense(formData);
        toast.success("Expense logged!");
        setShowModal(false);
        setForm({ merchant: "", category: "Software", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });
      } catch {
        toast.error("Failed to log expense.");
      }
    });
  };

  const handleDelete = (id: string, merchant: string) => {
    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success(`Deleted "${merchant}"`);
      } catch {
        toast.error("Failed to delete expense.");
      }
    });
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col h-full text-white w-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 p-6 md:p-8 border-b border-white/5  sticky top-0 z-10">
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
          <Button
            onClick={() => setShowModal(true)}
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold uppercase tracking-widest text-xs py-5 px-6 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 gap-2 border border-emerald-500/20"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Log Expense
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 border-b border-white/5 bg-slate-900/10">
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] cursor-pointer">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-emerald-500/10 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">Total Spend</span>
            <span className="text-4xl font-bold text-white tracking-tight">{fmt(totalSpend)}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center mt-2 bg-emerald-500/10 w-fit px-2 py-1 rounded-md border border-emerald-500/20">
              <TrendingDown className="w-3 h-3 mr-1" /> From real data
            </span>
          </div>
        </div>
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-blue-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-blue-500/10 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">Largest Category</span>
            <span className="text-4xl font-bold text-white tracking-tight">{largestCategory || "—"}</span>
            <span className="text-xs text-blue-400 mt-2 font-mono">Top spending area</span>
          </div>
        </div>
        <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-purple-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-purple-500/10 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">Pending</span>
            <span className="text-4xl font-bold text-white tracking-tight">{fmt(pendingTotal)}</span>
            <span className="text-xs text-purple-400 mt-2 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Awaiting processing
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 pt-6">
        <ExpenseCategoryChart expenses={initialExpenses} />
      </div>

      {/* Main Table */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    No expenses found. Click &quot;Log Expense&quot; to add your first one.
                  </td>
                </tr>
              ) : (
                filtered.map((expense, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    key={expense.id}
                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5 font-medium text-white">{expense.merchant}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-slate-800/80 border border-white/10 text-slate-300 rounded-lg text-xs tracking-wide">{expense.category}</span>
                    </td>
                    <td className="px-6 py-5 font-mono font-bold text-white tracking-tight">
                      {fmt(expense.amount)}
                    </td>
                    <td className="px-6 py-5 text-slate-400 font-mono text-xs">{expense.date}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center w-fit gap-2 ${expense.status === "Processed" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${expense.status === "Processed" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                          onClick={() => handleDelete(expense.id, expense.merchant)}
                          disabled={isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {filtered.map((expense, i) => (
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
                      <span className="px-3 py-1.5 bg-slate-800/80 border border-white/10 text-slate-300 rounded-lg text-xs tracking-wide">{expense.category}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tracking-tight text-xl">{fmt(expense.amount)}</span>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-slate-400 font-mono text-xs">{expense.date}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-full"
                    onClick={() => handleDelete(expense.id, expense.merchant)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Log Expense</h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Merchant</label>
                    <Input
                      required
                      placeholder="e.g. AWS, Stripe, Vercel"
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-500"
                      value={form.merchant}
                      onChange={e => setForm({ ...form, merchant: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                      <select
                        required
                        className="w-full bg-slate-800/50 border border-white/10 text-white rounded-md px-3 py-2 text-sm"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount (₹)</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="bg-slate-800/50 border-white/10 text-white placeholder-slate-500"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Date</label>
                    <Input
                      required
                      type="date"
                      className="bg-slate-800/50 border-white/10 text-white"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 border-white/10 text-slate-300 hover:bg-white/10" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                      {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Log Expense"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
