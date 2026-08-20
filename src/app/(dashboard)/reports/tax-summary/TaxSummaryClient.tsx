"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Landmark, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TaxSummaryClientProps {
  totalRevenue: number;
  totalTaxCollected: number;
  invoiceCount: number;
  taxableIncome: number;
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export function TaxSummaryClient({ totalRevenue, totalTaxCollected, invoiceCount, taxableIncome }: TaxSummaryClientProps) {
  const effectiveTaxRate = totalRevenue > 0 ? (totalTaxCollected / totalRevenue) * 100 : 0;

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto">
      <div className="sticky top-0 z-10  px-6 py-4 flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Tax Summary</h1>
          <p className="text-xs text-slate-400 font-mono">GST & Tax Liability Overview</p>
        </div>
        <Button variant="outline" className="ml-auto border-white/10 text-slate-300 hover:bg-white/10" onClick={() => window.print()}>
          Print Summary
        </Button>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8 print:p-0 print:text-black">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="clay-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 bg-blue-500/10 rounded-bl-full w-32 h-32 -mr-8 -mt-8" />
            <div className="relative z-10">
              <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-400" /> GST Collected
              </p>
              <p className="text-4xl font-bold text-white">{fmt(totalTaxCollected)}</p>
              <p className="text-sm text-slate-500 mt-2">From {invoiceCount} paid invoices</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="clay-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-bl-full w-32 h-32 -mr-8 -mt-8" />
            <div className="relative z-10">
              <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Effective Tax Rate
              </p>
              <p className="text-4xl font-bold text-white">{effectiveTaxRate.toFixed(1)}%</p>
              <p className="text-sm text-slate-500 mt-2">Based on total revenue</p>
            </div>
          </motion.div>
        </div>

        {/* Detailed Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 print:bg-white print:border-none print:shadow-none print:p-0">
          <h2 className="text-2xl font-bold mb-8 print:text-black flex items-center gap-3">
            <Landmark className="w-6 h-6 text-blue-500 print:text-black" />
            Tax Liability Summary
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 print:border-black/10">
              <div>
                <p className="font-semibold text-white print:text-black">Gross Revenue</p>
                <p className="text-sm text-slate-400 print:text-slate-600">Total sales including tax</p>
              </div>
              <span className="text-xl font-mono text-white print:text-black">{fmt(totalRevenue)}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10 print:border-black/10">
              <div>
                <p className="font-semibold text-white print:text-black">Taxable Income</p>
                <p className="text-sm text-slate-400 print:text-slate-600">Base amount subject to tax (Subtotal)</p>
              </div>
              <span className="text-xl font-mono text-white print:text-black">{fmt(taxableIncome)}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10 print:border-black/10">
              <div>
                <p className="font-semibold text-blue-400 print:text-black">GST Collected</p>
                <p className="text-sm text-slate-400 print:text-slate-600">Total tax amount to be remitted</p>
              </div>
              <span className="text-xl font-mono font-bold text-blue-400 print:text-black">{fmt(totalTaxCollected)}</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3 print:border-black/20 print:bg-transparent">
            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 print:text-black" />
            <p className="text-sm text-blue-200 print:text-black">
              This summary calculates the total GST collected from your paid invoices. It does not include Input Tax Credit (ITC) from expenses. Please consult your CA for final filings.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
