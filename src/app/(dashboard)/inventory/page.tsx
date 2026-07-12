import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InventoryScene, { InventoryItem } from "./InventoryScene";

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

  return <InventoryScene initialInventory={(products as InventoryItem[]) || []} />;
}
