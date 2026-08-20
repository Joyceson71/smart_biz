import { UploadCloud, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface InventoryHeaderProps {
  view: "table" | "spatial";
  setView: (view: "table" | "spatial") => void;
  onImport: () => void;
  onAddProduct: () => void;
}

export function InventoryHeader({ view, setView, onImport, onAddProduct }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 mb-6 mt-4">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Inventory Management
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          Manage products, stock levels, and view health scores.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* View Toggle */}
        <div className="neo-pressed p-1 rounded-xl flex gap-1 relative overflow-hidden">
          {['table', 'spatial'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as "table" | "spatial")}
              className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${
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
        <button 
          onClick={onImport} 
          className="px-4 py-2.5 neo-flat rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> Import Invoice
        </button>
        <button 
          onClick={onAddProduct} 
          className="px-6 py-2.5 clay-btn-primary flex items-center gap-2 whitespace-nowrap text-sm"
        >
          <Plus className="w-4 h-4" /> 
          Add Product
        </button>
      </div>
    </div>
  );
}
