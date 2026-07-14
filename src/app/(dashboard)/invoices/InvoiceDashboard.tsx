"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import InvoicesScene, { Invoice as SpatialInvoice } from "./InvoicesScene";
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
      <div className="flex justify-between items-center p-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-sm text-slate-400">Manage billing, track payments, and generate professional invoices.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "table" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              Data View
            </button>
            <button
              onClick={() => setView("spatial")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "spatial" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              Spatial View
            </button>
          </div>
          <Link href="/invoices/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              + Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {view === "table" ? (
        <div className="p-6 flex-1 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Total Invoices</h3>
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold">{totalInvoices}</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Pending Amount</h3>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-amber-500">{formatCurrency(pendingAmount)}</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Paid Amount</h3>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(paidAmount)}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Overdue</h3>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-500">{overdueCount} Invoices</p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-1">
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
