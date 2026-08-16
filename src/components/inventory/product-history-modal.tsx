"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInventoryTransactions } from "@/app/(dashboard)/inventory/actions";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, History, Activity } from "lucide-react";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { Product } from "./columns";

type Transaction = {
  id: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reference: string | null;
  created_at: string;
};

interface ProductHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductHistoryModal({ open, onOpenChange, product }: ProductHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      setLoading(true);
      getInventoryTransactions(product.id)
        .then((data) => {
          setTransactions(data as Transaction[]);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, product]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a] text-white border-slate-800 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <History className="w-6 h-6 text-blue-500" />
            Stock History
          </DialogTitle>
          <p className="text-slate-400 text-sm">
            {product?.name} ({product?.sku})
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <SkeletonLoader />
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p>No stock movements recorded yet.</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-800 ml-4 space-y-8 pb-4">
              {transactions.map((tx) => {
                const isPositive = tx.quantity > 0;
                
                return (
                  <div key={tx.id} className="relative pl-6">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#0f172a] ${
                      tx.type === "IN" ? "bg-emerald-500" :
                      tx.type === "OUT" ? "bg-rose-500" :
                      isPositive ? "bg-emerald-500" : "bg-rose-500"
                    }`} />
                    
                    <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-start justify-between group hover:bg-slate-800/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            tx.type === "IN" ? "bg-emerald-500/10 text-emerald-400" :
                            tx.type === "OUT" ? "bg-rose-500/10 text-rose-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>
                            {tx.type}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {format(new Date(tx.created_at), "MMM d, yyyy • h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mt-2">
                          {tx.reference || "System Adjustment"}
                        </p>
                      </div>
                      
                      <div className={`flex items-center gap-1 font-bold text-lg ${
                        isPositive ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        {isPositive ? "+" : ""}{tx.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
