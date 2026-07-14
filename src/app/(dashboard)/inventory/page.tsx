import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InventoryScene, { InventoryItem } from "./InventoryScene";
import { InventoryDashboard } from "./InventoryDashboard";

export const metadata = {
  title: "Inventory | SmartBiz OS",
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Map db products to Product interface and InventoryItem interface
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

  return <InventoryDashboard products={formattedProducts} spatialProducts={(products as InventoryItem[]) || []} />;
}
