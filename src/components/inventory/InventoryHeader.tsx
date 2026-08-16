import { UploadCloud, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface InventoryHeaderProps {
  view: "table" | "spatial";
  setView: (view: "table" | "spatial") => void;
  onImport: () => void;
  onAddProduct: () => void;
}

export function InventoryHeader({ view, setView, onImport, onAddProduct }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Inventory Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage products, stock levels, and view health scores.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* View Toggle */}
        <div className="bg-slate-950/50 border border-white/10 p-1 rounded-xl flex gap-1 relative overflow-hidden shadow-inner">
          {['table', 'spatial'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as "table" | "spatial")}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors z-10 ${
                view === v ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {view === v && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-lg shadow-blue-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="capitalize">{v} View</span>
            </button>
          ))}
        </div>
        
        {/* Actions */}
        <Button 
          variant="outline" 
          onClick={onImport} 
          className="bg-slate-900/50 border-white/10 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 backdrop-blur-sm transition-all"
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Import Invoice
        </Button>
        <Button 
          onClick={onAddProduct} 
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
          Add Product
        </Button>
      </div>
    </div>
  );
}
