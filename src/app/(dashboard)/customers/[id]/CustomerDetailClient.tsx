"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Edit2, Trash2, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateCustomer, deleteCustomer } from "../actions";

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: string;
  ltv?: number | null;
  created_at: string;
};

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date?: string | null;
  created_at: string;
};

interface CustomerDetailClientProps {
  customer: Customer;
  invoices: Invoice[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function CustomerDetailClient({ customer, invoices }: CustomerDetailClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    first_name: customer.first_name,
    last_name: customer.last_name,
    phone: customer.phone ?? "",
    status: customer.status,
  });

  const fullName = `${customer.first_name} ${customer.last_name}`;
  const initials = `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase();

  const statusColors: Record<string, string> = {
    Active: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    Inactive: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    New: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    Lead: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("id", customer.id);

    startTransition(async () => {
      try {
        await updateCustomer(formData);
        toast.success("Customer updated!");
        setShowEditModal(false);
      } catch {
        toast.error("Failed to update customer.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCustomer(customer.id);
        toast.success(`${fullName} deleted.`);
        // redirect handled by server action
      } catch {
        toast.error("Failed to delete customer.");
        setShowDeleteConfirm(false);
      }
    });
  };

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10  px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Customer Detail</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowEditModal(true)} className="border-white/10 text-slate-300 hover:bg-white/10 gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="border-red-500/30 text-red-400 hover:bg-red-950/30 gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-4xl w-full mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/20">
              {initials}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[customer.status] ?? statusColors.New}`}>
              {customer.status}
            </span>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Full Name</p>
              <p className="text-xl font-bold text-white">{fullName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Customer Since</p>
              <p className="text-white font-medium">{new Date(customer.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={`mailto:${customer.email}`} className="text-blue-400 hover:text-blue-300 transition-colors truncate">{customer.email}</a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300">{customer.phone}</span>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Lifetime Value</p>
              <p className="text-2xl font-bold text-emerald-400">{fmt(customer.ltv ?? 0)}</p>
            </div>
          </div>
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold text-white">Related Invoices ({invoices.length})</h2>
          </div>
          {invoices.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">No invoices found for this customer.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-900/40 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">Invoice #</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/invoices/${inv.id}`} className="text-blue-400 hover:text-blue-300 font-mono">
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">{fmt(inv.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" :
                        inv.status === "Overdue" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{inv.due_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Edit Customer</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">First Name</label>
                      <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="bg-slate-800/50 border-white/10 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Name</label>
                      <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="bg-slate-800/50 border-white/10 text-white" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-slate-800/50 border-white/10 text-white" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/10 text-white rounded-md px-3 py-2 text-sm"
                    >
                      {["New", "Active", "Inactive", "Lead"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 border-white/10 text-slate-300 hover:bg-white/10" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button type="submit" disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
                      {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900/95 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-2xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white text-center mb-2">Delete Customer?</h2>
                <p className="text-slate-400 text-center text-sm mb-6">This will permanently delete <strong className="text-white">{fullName}</strong> and all their data. This cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:bg-white/10" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button onClick={handleDelete} disabled={isPending} className="flex-1 bg-red-600 hover:bg-red-500 text-white">
                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Delete"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
