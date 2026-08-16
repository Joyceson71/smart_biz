"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle, Clock, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { updateInvoiceStatus, deleteInvoice } from "../actions";
import { useRouter } from "next/navigation";

type Invoice = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_address?: string | null;
  gst_number?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  shipping?: number | null;
  total: number;
  amount: number;
  status: string;
  due_date?: string | null;
  created_at: string;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  gst_pct?: number | null;
  amount: number;
};

interface InvoiceDetailClientProps {
  invoice: Invoice;
  items: InvoiceItem[];
}

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n)}`;

export function InvoiceDetailClient({ invoice, items }: InvoiceDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (status: string) => {
    startTransition(async () => {
      try {
        await updateInvoiceStatus(invoice.id, status);
        toast.success(`Invoice marked as ${status}`);
      } catch {
        toast.error("Failed to update invoice status.");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteInvoice(invoice.id);
        toast.success("Invoice deleted.");
        router.push("/invoices");
      } catch {
        toast.error("Failed to delete invoice.");
      }
    });
  };

  const statusConfig = {
    Paid: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    Overdue: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  } as const;

  const StatusIcon = statusConfig[invoice.status as keyof typeof statusConfig]?.icon ?? Clock;
  const statusColor = statusConfig[invoice.status as keyof typeof statusConfig]?.color ?? "text-slate-400";
  const statusBg = statusConfig[invoice.status as keyof typeof statusConfig]?.bg ?? "bg-slate-500/10 border-slate-500/30";

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{invoice.invoice_number}</h1>
            <p className="text-xs text-slate-400 font-mono">Invoice Detail</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== "Paid" && (
            <Button
              onClick={() => handleStatusUpdate("Paid")}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Paid
            </Button>
          )}
          {invoice.status !== "Overdue" && (
            <Button
              onClick={() => handleStatusUpdate("Overdue")}
              disabled={isPending}
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-950/30 gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Mark Overdue
            </Button>
          )}
          <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-slate-400 hover:text-white gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </a>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2" onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </Button>
        </div>
      </div>

      {/* A4-style invoice preview */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white text-black w-full max-w-[794px] min-h-[1123px] shadow-2xl p-12 flex flex-col print:shadow-none"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">INVOICE</h1>
              <p className="text-slate-500 mt-2">SmartBiz OS Inc.</p>
              <p className="text-slate-500 text-sm">123 Business Road, Tech Park</p>
              <p className="text-slate-500 text-sm">Bangalore, India 560001</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold mb-3 ${statusBg} ${statusColor}`}>
                <StatusIcon className="w-4 h-4" />
                {invoice.status}
              </div>
              <p className="font-semibold text-slate-700">Invoice No: <span className="text-slate-900">{invoice.invoice_number}</span></p>
              <p className="text-sm text-slate-500 mt-1">Date: {new Date(invoice.created_at).toLocaleDateString("en-IN")}</p>
              {invoice.due_date && <p className="text-sm text-slate-500">Due: {invoice.due_date}</p>}
            </div>
          </div>

          {/* Bill To */}
          <div className="mt-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-semibold text-lg">{invoice.customer_name || "—"}</p>
            {invoice.customer_email && <p className="text-slate-600 text-sm">{invoice.customer_email}</p>}
            {invoice.customer_address && <p className="text-slate-600 text-sm whitespace-pre-line mt-1">{invoice.customer_address}</p>}
            {invoice.gst_number && <p className="text-slate-600 text-sm mt-1">GSTIN: {invoice.gst_number}</p>}
          </div>

          {/* Line Items Table */}
          <div className="mt-12 flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-800 text-left">
                  <th className="pb-3 font-semibold text-slate-700">Description</th>
                  <th className="pb-3 font-semibold text-slate-700 text-center">Qty</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">Price</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">GST %</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {items.length > 0 ? items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-4">{item.description}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">{fmt(item.unit_price)}</td>
                    <td className="py-4 text-right">{item.gst_pct ?? 0}%</td>
                    <td className="py-4 text-right font-medium text-slate-900">{fmt(item.amount)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No line items recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-64 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{fmt(invoice.subtotal ?? 0)}</span>
              </div>
              {(invoice.tax ?? 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax</span>
                  <span>{fmt(invoice.tax ?? 0)}</span>
                </div>
              )}
              {(invoice.shipping ?? 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{fmt(invoice.shipping ?? 0)}</span>
                </div>
              )}
              {(invoice.discount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{fmt(invoice.discount ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-slate-900 border-t-2 border-slate-800 pt-3 mt-3">
                <span>Total</span>
                <span>{fmt(invoice.total ?? invoice.amount)}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            Thank you for your business.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
