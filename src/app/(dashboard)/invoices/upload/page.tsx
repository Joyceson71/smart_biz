"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ExtractedItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface ExtractedData {
  invoice_number?: string;
  vendor_name?: string;
  date?: string;
  total?: number;
  items?: ExtractedItem[];
}

export default function InvoiceUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      toast.error("Only image and PDF files are supported.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB.");
      return;
    }
    setFile(f);
    setExtracted(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleExtract = () => {
    if (!file) return;
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/ocr/extract", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Extraction failed");
        }
        const data = await res.json();
        setExtracted(data);
        toast.success("Invoice data extracted successfully!");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to extract data.");
        toast.error("Extraction failed.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto">
      <div className="sticky top-0 z-10  px-6 py-4 flex items-center gap-4">
        <Link href="/invoices">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Upload Invoice</h1>
          <p className="text-xs text-slate-400 font-mono">AI-powered OCR extraction</p>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 max-w-2xl w-full mx-auto space-y-8">
        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-white/20 bg-slate-900/30 hover:border-white/40 hover:bg-slate-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <p className="font-semibold text-white">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                <p className="text-xs text-slate-500">Click to change file</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-slate-400" />
                <p className="font-semibold text-white text-lg">Drop invoice here</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, PDF (up to 10MB)</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Button
          onClick={handleExtract}
          disabled={!file || isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl gap-3"
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Extracting with AI...</>
          ) : (
            <><FileText className="w-5 h-5" /> Extract Invoice Data</>
          )}
        </Button>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Extracted Results */}
        {extracted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Extracted Data</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {extracted.invoice_number && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Invoice #</p>
                  <p className="text-white font-mono font-semibold mt-1">{extracted.invoice_number}</p>
                </div>
              )}
              {extracted.vendor_name && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Vendor</p>
                  <p className="text-white font-semibold mt-1">{extracted.vendor_name}</p>
                </div>
              )}
              {extracted.date && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="text-white mt-1">{extracted.date}</p>
                </div>
              )}
              {extracted.total !== undefined && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                  <p className="text-emerald-400 font-bold text-lg mt-1">₹{extracted.total.toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
            {extracted.items && extracted.items.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Line Items</p>
                <div className="space-y-2">
                  {extracted.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-200 text-sm">{item.description}</span>
                      <span className="text-white font-mono text-sm">₹{item.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link href="/invoices/new">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 mt-2">
                <FileText className="w-4 h-4" /> Create Invoice from Data
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
