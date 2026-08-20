"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import type { InventoryItem } from "./InventoryScene";
import { DataTable } from "@/components/inventory/data-table";
import { columns, Product } from "@/components/inventory/columns";
import { ProductFormModal } from "@/components/inventory/product-form-modal";
import { AIInsightsPanel } from "@/components/inventory/ai-insights";
import { SupplierInvoiceUpload } from "@/components/inventory/supplier-invoice-upload";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryStatCards } from "@/components/inventory/InventoryStatCards";
import { WebGLErrorBoundary } from "@/components/os/WebGLErrorBoundary";

const InventoryScene = dynamic(() => import("./InventoryScene"), { ssr: false });

interface InventoryDashboardProps {
  products: Product[];
  spatialProducts: InventoryItem[];
  categories: { id: string, name: string }[];
  suppliers: { id: string, name: string }[];
}

export function InventoryDashboard({ products, spatialProducts, categories, suppliers }: InventoryDashboardProps) {
  const [view, setView] = useState<"table" | "spatial">("table");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.current_stock <= p.min_stock).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.current_stock * p.purchase_price), 0);

  return (
    <div className="flex flex-col h-full text-white w-full overflow-hidden relative">
      <div className="relative z-10 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        <InventoryHeader 
          view={view} 
          setView={setView} 
          onImport={() => setShowImportForm(true)} 
          onAddProduct={() => setShowAddForm(true)} 
        />

        <ProductFormModal 
          open={showAddForm} 
          onOpenChange={setShowAddForm} 
          categories={categories}
          suppliers={suppliers}
        />
        <SupplierInvoiceUpload open={showImportForm} onOpenChange={setShowImportForm} />

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {view === "table" ? (
              <motion.div 
                key="table-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-8"
              >
                <InventoryStatCards 
                  totalProducts={totalProducts} 
                  lowStock={lowStock} 
                  inventoryValue={inventoryValue} 
                />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="xl:col-span-3 clay-card p-6"
                  >
                    <DataTable columns={columns} data={products} />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="xl:col-span-1"
                  >
                    <AIInsightsPanel products={products} />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="spatial-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <WebGLErrorBoundary>
                  <InventoryScene initialInventory={spatialProducts} />
                </WebGLErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
