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
      <div className="flex justify-between items-center p-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stocks Overview</h1>
          <p className="text-sm text-slate-400">View and manage all your product stock levels in one place.</p>
        </div>
      </div>
      
      <div className="p-6 flex-1 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Package className="w-16 h-16 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-slate-400 mb-2">Total Units in Stock</p>
            <p className="text-4xl font-bold text-white">{totalStock}</p>
            <div className="mt-4 flex items-center text-xs text-blue-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>Stable</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RefreshCw className="w-16 h-16 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-400 mb-2">Total Stock Value</p>
            <p className="text-4xl font-bold text-emerald-400">{formattedValue}</p>
            <div className="mt-4 flex items-center text-xs text-emerald-500">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>Optimized</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ArrowDownRight className="w-16 h-16 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-slate-400 mb-2">Low Stock Items</p>
            <p className="text-4xl font-bold text-amber-500">{lowStockItems}</p>
            <div className="mt-4 flex items-center text-xs text-amber-400">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>Requires Attention</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-1">
          <DataTable columns={columns} data={formattedProducts} />
        </div>
      </div>
    </div>
  );
}
