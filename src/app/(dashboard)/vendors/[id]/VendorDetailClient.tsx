"use client";

import { ArrowLeft, Building2, Mail, Phone, Trash2, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteVendor } from "../actions";
import { useRouter } from "next/navigation";

type Vendor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  balance: number;
  created_at: string;
};

interface VendorDetailClientProps {
  vendor: Vendor;
  expenses?: {
    id: string;
    merchant: string;
    category: string;
    amount: number;
    date: string;
    created_at: string;
  }[];
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function VendorDetailClient({ vendor, expenses = [] }: VendorDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this vendor?")) return;
    startTransition(async () => {
      try {
        await deleteVendor(vendor.id);
        toast.success("Vendor deleted.");
        router.push("/vendors");
      } catch {
        toast.error("Failed to delete vendor.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto">
      <div className="sticky top-0 z-10  px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/vendors">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{vendor.name}</h1>
            <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
              vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {vendor.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)] shrink-0">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Company Name</p>
                <p className="text-xl font-bold text-white">{vendor.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                {vendor.email ? (
                  <a href={`mailto:${vendor.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">{vendor.email}</a>
                ) : (
                  <span className="text-slate-500">Not provided</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300">{vendor.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="space-y-4 md:border-l md:border-white/5 md:pl-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Outstanding Balance</p>
                <p className="text-3xl font-mono font-bold text-emerald-400">{fmt(vendor.balance)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300 text-sm">Added {new Date(vendor.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions / Purchase Orders Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Purchase Orders</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Integration with purchase orders and expense tracking is coming in the next update.
          </p>
        </motion.div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 mt-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Purchase History</h3>
          {expenses.length === 0 ? (
            <p className="text-xs text-slate-500">No expenses linked to this vendor yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs border-b border-white/5">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                    <th className="pb-2 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-white">{e.merchant}</td>
                      <td className="py-3 text-slate-400">{e.category}</td>
                      <td className="py-3 text-right text-emerald-400">₹{e.amount.toLocaleString()}</td>
                      <td className="py-3 text-right text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
