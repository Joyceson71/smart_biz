import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/inventory/data-table";
import { columns } from "@/components/inventory/columns";

export const metadata = {
  title: "Stocks | SmartBiz OS",
};

export default async function StocksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase for stocks
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching products:", error);
  }

  const formattedProducts = (products || []).map(p => ({
    ...p,
    current_stock: p.stock || 0,
    min_stock: p.min_stock || 10,
    max_stock: p.max_stock || 100,
    purchase_price: p.purchase_price || 0,
    selling_price: p.selling_price || 0,
    unit: p.unit || 'pcs',
    last_updated: p.created_at
  }));

  const totalStock = formattedProducts.reduce((sum, item) => sum + item.current_stock, 0);
  const totalValue = formattedProducts.reduce((sum, item) => sum + (item.current_stock * item.purchase_price), 0);
  const lowStockItems = formattedProducts.filter(item => item.current_stock <= item.min_stock).length;

  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(totalValue);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white w-full overflow-y-auto">
      <div className="flex justify-between items-center p-4 md:p-8 border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            Stocks Overview
          </h1>
          <p className="text-blue-400/80 font-mono text-[10px] md:text-xs mt-1 md:mt-2 uppercase tracking-[0.15em]">
            System Inventory Management
          </p>
        </div>
      </div>
      
      <div className="p-4 md:p-8 flex-1 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-blue-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-blue-500/10 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <Package className="w-20 h-20 text-blue-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Total Units in Stock</p>
              <p className="text-4xl font-bold text-white tracking-tight">{totalStock}</p>
              <div className="mt-4 flex items-center text-xs text-blue-400 font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="uppercase tracking-wider">Stable</span>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-emerald-500/10 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <RefreshCw className="w-20 h-20 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Total Stock Value</p>
              <p className="text-4xl font-bold text-emerald-400 tracking-tight">{formattedValue}</p>
              <div className="mt-4 flex items-center text-xs text-emerald-500 font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="uppercase tracking-wider">Optimized</span>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-slate-900/40 backdrop-blur-2xl border border-amber-500/20 p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-amber-500/10 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <ArrowDownRight className="w-20 h-20 text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Low Stock Items</p>
              <p className="text-4xl font-bold text-amber-400 tracking-tight">{lowStockItems}</p>
              <div className="mt-4 flex items-center text-xs text-amber-400 font-medium">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                <span className="uppercase tracking-wider">Requires Attention</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-2xl">
          <DataTable columns={columns} data={formattedProducts} />
        </div>
      </div>
    </div>
  );
}
