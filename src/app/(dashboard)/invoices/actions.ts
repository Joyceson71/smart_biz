"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addInvoice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get("amount") as string) || 0;
  const due_date = formData.get("due_date") as string;
  const status = formData.get("status") as string || "Pending";
  const invoice_number = formData.get("invoice_number") as string || `INV-${Date.now()}`;
  
  const customer_name = formData.get("customer_name") as string;
  const customer_email = formData.get("customer_email") as string;
  const customer_address = formData.get("customer_address") as string;
  const gst_number = formData.get("gst_number") as string;

  const subtotal = parseFloat(formData.get("subtotal") as string) || 0;
  const tax = parseFloat(formData.get("tax") as string) || 0;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const shipping = parseFloat(formData.get("shipping") as string) || 0;
  const total = parseFloat(formData.get("total") as string) || amount;
  
  // Generate random 3D position
  const pos_x = (Math.random() - 0.5) * 20;
  const pos_y = Math.random() * 5;
  const pos_z = (Math.random() - 0.5) * 20;

  const { data, error } = await supabase.from("invoices").insert({
    user_id: user.id,
    invoice_number,
    customer_name,
    customer_email,
    customer_address,
    gst_number,
    subtotal,
    tax,
    discount,
    shipping,
    total,
    amount: total,
    due_date,
    status,
    pos_x,
    pos_y,
    pos_z,
  }).select().single();

  if (error) {
    console.error("Failed to insert invoice:", error);
    throw new Error(error.message);
  }

  // Next we could insert items into invoice_items using data.id

  revalidatePath("/dashboard");
  revalidatePath("/invoices");
  
  return data;
}
