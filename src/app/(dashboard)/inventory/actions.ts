"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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
  const category_id = formData.get("category_id") as string || null;
  const supplier_id = formData.get("supplier_id") as string || null;
  
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
    category_id,
    supplier_id,
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

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}

export async function editInventoryItem(id: string, formData: FormData) {
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
  const category_id = formData.get("category_id") as string || null;
  const supplier_id = formData.get("supplier_id") as string || null;

  const { error } = await supabase
    .from("products")
    .update({
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
      category_id,
      supplier_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}

export async function generateInventoryInsights(products: { name: string; sku: string; current_stock?: number; stock?: number; min_stock: number; selling_price: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Summarize products to save tokens
  const summary = products.map(p => ({
    name: p.name,
    sku: p.sku,
    stock: p.current_stock || p.stock,
    min: p.min_stock,
    price: p.selling_price
  }));

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    system: "You are an expert inventory analyst for SmartBiz OS. Analyze the provided inventory data and generate 2 highly actionable insights. Use exact SKUs and names. Insight types should be 'warning' (e.g., low stock, dead stock) or 'success' (e.g., high demand, good health). Keep the text concise and business-focused.",
    prompt: JSON.stringify(summary),
    schema: z.object({
      insights: z.array(z.object({
        type: z.enum(["warning", "success"]),
        title: z.string(),
        description: z.string(),
        actionText: z.string().optional()
      })).length(2)
    })
  });

  return object.insights;
}
