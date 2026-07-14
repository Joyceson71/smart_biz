"use client";

import { useState } from "react";
import { Package, AlertTriangle, IndianRupee, Layers, UploadCloud } from "lucide-react";
import InventoryScene, { InventoryItem } from "./InventoryScene";
import { DataTable } from "@/components/inventory/data-table";
import { columns, Product } from "@/components/inventory/columns";
import { Button } from "@/components/ui/button";
import { AddProductForm } from "@/components/inventory/add-product-form";
import { AIInsightsPanel } from "@/components/inventory/ai-insights";
import { SupplierInvoiceUpload } from "@/components/inventory/supplier-invoice-upload";

interface InventoryDashboardProps {
  products: Product[];
  spatialProducts: InventoryItem[]; // Some overlap in types, but handled here
}

export function InventoryDashboard({ products, spatialProducts }: InventoryDashboardProps) {
  const [view, setView] = useState<"table" | "spatial">("table");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.current_stock <= p.min_stock).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.current_stock * p.purchase_price), 0);

  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(inventoryValue);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white w-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-sm text-slate-400">Manage products, stock levels, and view health scores.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "table" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              Data View
            </button>
            <button
              onClick={() => setView("spatial")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "spatial" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              Spatial View
            </button>
          </div>
          <Button variant="outline" onClick={() => setShowImportForm(true)} className="bg-slate-900 border-slate-800 text-purple-400 hover:bg-slate-800 hover:text-purple-300">
            <UploadCloud className="w-4 h-4 mr-2" /> Import Invoice
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Product
          </Button>
        </div>
      </div>

      <AddProductForm open={showAddForm} onOpenChange={setShowAddForm} />
      <SupplierInvoiceUpload open={showImportForm} onOpenChange={setShowImportForm} />

      {view === "table" ? (
        <div className="p-6 flex-1 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Total Products</h3>
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Low Stock Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-amber-500">{lowStock}</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Inventory Value</h3>
                <IndianRupee className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400">{formattedValue}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-400">Health Score</h3>
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400">{lowStock > 0 ? "85%" : "100%"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-slate-900/30 rounded-xl border border-slate-800 p-1">
              <DataTable columns={columns} data={products} />
            </div>
            <div className="lg:col-span-1">
              <AIInsightsPanel />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <InventoryScene initialInventory={spatialProducts} />
        </div>
      )}
    </div>
  );
}
