"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ChevronRight, Loader2, FileSearch } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function OCRUploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setStep(2);
    
    // Simulate OCR processing time (in reality, calls /api/ocr/extract)
    setTimeout(() => {
      setExtractedData({
        vendorName: "Amazon Web Services India",
        invoiceNumber: "INV-AWS-24-001",
        date: "2024-07-01",
        total: 15000,
        tax: 2700,
        currency: "INR"
      });
      setIsProcessing(false);
      setStep(3);
      toast.success("Invoice scanned successfully");
    }, 3000);
  };

  const handleSave = () => {
    toast.success("Invoice saved to database!");
    router.push(ROUTES.INVOICES);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Scan Invoice"
        description="Upload a photo or PDF of a bill. Our AI will automatically extract the details."
      />

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Upload" },
          { num: 2, label: "Processing" },
          { num: 3, label: "Review" },
        ].map((s, i) => (
          <div key={s.num} className="flex flex-col items-center gap-2 relative z-10 w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
              step === s.num 
                ? "bg-primary text-primary-foreground border-primary" 
                : step > s.num
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-muted-foreground/30"
            }`}>
              {step > s.num ? <CheckCircle2 className="size-5" /> : s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
          </div>
        ))}
        {/* Connecting lines */}
        <div className="absolute top-4 left-[16.66%] right-[16.66%] h-0.5 bg-muted-foreground/20 -z-10" />
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <FileUpload onFileSelect={setFile} accept="image/*,application/pdf" />
              <div className="flex justify-end">
                <Button onClick={handleUpload} disabled={!file} className="gap-2 w-full sm:w-auto">
                  Start Scan <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <FileSearch className="size-16 text-primary animate-pulse relative z-10" />
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  Extracting invoice details...
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Our AI is reading vendor name, amounts, and taxes. This takes a few seconds.
                </p>
              </div>
            </div>
          )}

          {step === 3 && extractedData && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-start gap-3 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
                <p>OCR completed successfully. Please review the extracted data before saving. You can edit any fields if the AI made a mistake.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Vendor Name</label>
                  <Input defaultValue={extractedData.vendorName} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Invoice Number</label>
                  <Input defaultValue={extractedData.invoiceNumber} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Invoice Date</label>
                  <Input type="date" defaultValue={extractedData.date} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Total Amount</label>
                  <Input type="number" defaultValue={extractedData.total} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setStep(1)}>Rescan</Button>
                <Button onClick={handleSave}>Save Invoice</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
