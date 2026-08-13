"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import type { Invoice as SpatialInvoice } from "./InvoicesScene";

const InvoicesScene = dynamic(() => import("./InvoicesScene"), { ssr: false });
import { DataTable } from "@/components/inventory/data-table";
import { columns, InvoiceData } from "@/components/invoices/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InvoiceDashboardProps {
  invoices: InvoiceData[];
  spatialInvoices: SpatialInvoice[]; 
}

export function InvoiceDashboard({ invoices, spatialInvoices }: InvoiceDashboardProps) {
  const [view, setView] = useState<"table" | "spatial">("table");

  const totalInvoices = invoices.length;
  const pendingAmount = invoices
    .filter(i => i.status === "Pending")
    .reduce((acc, i) => acc + i.amount, 0);
  const paidAmount = invoices
    .filter(i => i.status === "Paid")
    .reduce((acc, i) => acc + i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === "Overdue").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white w-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-8 border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            Invoice Management
          </h1>
          <p className="text-purple-400/80 font-mono text-xs mt-2 uppercase tracking-[0.15em]">
            Manage billing, track payments, and generate invoices
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl flex gap-1 shadow-lg">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === "table" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              Data View
            </button>
            <button
              onClick={() => setView("spatial")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === "spatial" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              Spatial View
            </button>
          </div>
          <Link href="/invoices/new">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold uppercase tracking-widest text-xs py-5 px-6 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all hover:scale-105 border border-purple-500/20">
              + Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {view === "table" ? (
        <div className="p-8 flex-1 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-blue-500/20 p-6 rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/40 cursor-pointer">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-blue-500/20 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-widest">Total Invoices</h3>
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-4xl font-bold tracking-tight text-white">{totalInvoices}</p>
              </div>
            </div>
            
            <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-amber-500/20 p-6 rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:border-amber-500/40 cursor-pointer">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-amber-500/20 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-widest">Pending Amount</h3>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-4xl font-bold tracking-tight text-amber-400">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
            
            <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 p-6 rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:border-emerald-500/40 cursor-pointer">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-emerald-500/20 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-widest">Paid Amount</h3>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-4xl font-bold tracking-tight text-emerald-400">{formatCurrency(paidAmount)}</p>
              </div>
            </div>

            <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-red-500/20 p-6 rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:border-red-500/40 cursor-pointer">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-red-500/20 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-widest">Overdue</h3>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-4xl font-bold tracking-tight text-red-500">{overdueCount} <span className="text-lg font-medium tracking-normal text-red-500/70">Invoices</span></p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-2xl">
            <DataTable columns={columns} data={invoices} searchKey="invoice_number" />
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <InvoicesScene initialInvoices={spatialInvoices} />
        </div>
      )}
    </div>
  );
}
