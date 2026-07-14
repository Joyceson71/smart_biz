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

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}
