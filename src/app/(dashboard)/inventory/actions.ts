"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const sku = formData.get("sku") as string;
  const name = formData.get("name") as string;
  const barcode = formData.get("barcode") as string;
  const description = formData.get("description") as string;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const min_stock = parseInt(formData.get("min_stock") as string, 10) || 5;
  const max_stock = parseInt(formData.get("max_stock") as string, 10) || 100;
  const purchase_price = parseFloat(formData.get("purchase_price") as string) || 0;
  const selling_price = parseFloat(formData.get("selling_price") as string) || 0;
  const unit = formData.get("unit") as string || "pcs";
  
  // Distribute the items across the 3D warehouse visually
  const pos_x = (Math.random() - 0.5) * 16;
  const pos_y = 0.5; // Fixed y on the ground plane
  const pos_z = (Math.random() - 0.5) * 16;

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    sku,
    name,
    barcode,
    description,
    stock,
    min_stock,
    max_stock,
    purchase_price,
    selling_price,
    unit,
    pos_x,
    pos_y,
    pos_z,
  });

  if (error) {
    console.error("Insert error:", error);
    throw new Error(error.message);
  }

  // Next we could insert items into invoice_items using data.id

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}

export async function bulkAddInventoryItems(items: { sku: string; name: string; quantity: number; purchase_price: number; selling_price?: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const formattedItems = items.map(item => ({
    user_id: user.id,
    sku: item.sku,
    name: item.name,
    stock: item.quantity,
    min_stock: 5,
    max_stock: 100,
    purchase_price: item.purchase_price,
    selling_price: item.selling_price || item.purchase_price * 1.5,
    unit: 'pcs',
    pos_x: (Math.random() - 0.5) * 16,
    pos_y: 0.5,
    pos_z: (Math.random() - 0.5) * 16,
  }));

  const { error } = await supabase.from("products").insert(formattedItems);

  if (error) {
    console.error("Bulk Insert error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}
