"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bulkAddInventoryItems } from "@/app/(dashboard)/inventory/actions";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierInvoiceUpload({ open, onOpenChange }: UploadDialogProps) {
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload");
  const [, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<{ supplier_name: string; invoice_number: string; total: number; items: { name: string; sku: string; quantity: number; purchase_price: number }[] } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep("upload");
    setFile(null);
    setExtractedData(null);
    setIsSaving(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await processInvoice(selectedFile);
    }
  };

  const processInvoice = async (invoiceFile: File) => {
    setStep("processing");
    try {
      const formData = new FormData();
      formData.append("file", invoiceFile);
      
      const res = await fetch("/api/ocr/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Extraction failed");

      const { data } = await res.json();
      setExtractedData(data);
      setStep("review");
    } catch (e) {
      console.error(e);
      toast.error("Failed to parse the invoice.");
      setStep("upload");
    }
  };

  const handleConfirm = async () => {
    if (!extractedData || !extractedData.items) return;
    
    setIsSaving(true);
    try {
      await bulkAddInventoryItems(extractedData.items);
      toast.success("Products added to inventory successfully!");
      onOpenChange(false);
      resetState();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add items to inventory.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={(val) => {
      if (!val) resetState();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            AI Supplier Invoice Import
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload a PDF or image of your supplier invoice. Our AI will extract line items and automatically draft your inventory updates.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[400px] flex flex-col justify-center relative mt-4">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 p-12 text-center"
              >
                <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                  <UploadCloud className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drag & Drop Invoice</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Supports PDF, JPG, or PNG up to 10MB. AI will extract SKUs, quantities, and pricing automatically.
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Browse Files
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,image/*" 
                  onChange={handleFileChange}
                />
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">SmartBiz AI is scanning...</h3>
                  <p className="text-sm text-slate-500 mt-2">Extracting line items and supplier details</p>
                </div>
              </motion.div>
            )}

            {step === "review" && extractedData && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full space-y-4"
              >
                <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Supplier</p>
                    <p className="font-medium">{extractedData.supplier_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Invoice No</p>
                    <p className="font-medium">{extractedData.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Invoice Value</p>
                    <p className="font-medium text-emerald-400">₹{extractedData.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-hidden flex-1">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-400 text-left border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-medium">SKU / Item</th>
                        <th className="py-3 px-4 font-medium text-center">Qty</th>
                        <th className="py-3 px-4 font-medium text-right">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {extractedData.items.map((item: { name: string; sku: string; quantity: number; purchase_price: number }, i: number) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.sku}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-purple-500/20 text-purple-400 py-1 px-2 rounded font-medium">
                              +{item.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">₹{item.purchase_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4 mt-auto">
                  <Button 
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSaving ? (
                      "Adding to Inventory..."
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm & Add to Inventory
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
