"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Building2, Mail, Phone, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { addVendor, deleteVendor } from "./actions";
import Link from "next/link";

type Vendor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  balance: number;
};

interface VendorsClientProps {
  vendors: Vendor[];
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function VendorsClient({ vendors }: VendorsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await addVendor(formData);
        toast.success("Vendor added successfully");
        setShowAddModal(false);
      } catch {
        toast.error("Failed to add vendor");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    startTransition(async () => {
      try {
        await deleteVendor(id);
        toast.success("Vendor deleted");
      } catch {
        toast.error("Failed to delete vendor");
      }
    });
  };

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto w-full">
      {/* Header */}
      <div className="sticky top-0 z-10  p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 tracking-tight">
            Vendors
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your suppliers and contractors</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendors..."
              className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 w-full"
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Vendor</span>
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-8 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {vendor.status}
                  </span>
                  <button onClick={() => handleDelete(vendor.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Link href={`/vendors/${vendor.id}`}>
                <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer">{vendor.name}</h3>
              </Link>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                {vendor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {vendor.email}
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {vendor.phone}
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm text-slate-500">Outstanding Balance</span>
                <span className="font-mono font-bold text-white">{fmt(vendor.balance)}</span>
              </div>
            </motion.div>
          ))}

          {filteredVendors.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/20 border border-dashed border-white/10 rounded-2xl">
              No vendors found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Add New Vendor</h2>
              <form onSubmit={handleAddVendor} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                  <Input name="name" required className="bg-slate-950 border-white/10" placeholder="Vendor Inc." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                    <Input name="email" type="email" className="bg-slate-950 border-white/10" placeholder="contact@vendor.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
                    <Input name="phone" className="bg-slate-950 border-white/10" placeholder="+1 234 567 890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Initial Balance</label>
                  <Input name="balance" type="number" defaultValue={0} className="bg-slate-950 border-white/10" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1 border-white/10 text-slate-300" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Vendor"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
