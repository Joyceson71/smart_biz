"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addInvoice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get("amount") as string) || 0;
  const due_date = formData.get("due_date") as string;
  const status = (formData.get("status") as string) || "Pending";
  const invoice_number = (formData.get("invoice_number") as string) || `INV-${Date.now()}`;

  const customer_name = formData.get("customer_name") as string;
  const customer_email = formData.get("customer_email") as string;
  const customer_address = formData.get("customer_address") as string;
  const gst_number = formData.get("gst_number") as string;

  const subtotal = parseFloat(formData.get("subtotal") as string) || 0;
  const tax = parseFloat(formData.get("tax") as string) || 0;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const shipping = parseFloat(formData.get("shipping") as string) || 0;
  const total = parseFloat(formData.get("total") as string) || amount;

  // Parse line items JSON
  const itemsJson = formData.get("items") as string;
  const lineItems: Array<{ description: string; quantity: number; price: number; gst: number }> =
    itemsJson ? JSON.parse(itemsJson) : [];

  // Generate random 3D position
  const pos_x = (Math.random() - 0.5) * 20;
  const pos_y = Math.random() * 5;
  const pos_z = (Math.random() - 0.5) * 20;

  const { data, error } = await supabase
    .from("invoices")
    .insert({
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
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert invoice:", error);
    throw new Error(error.message);
  }

  // Insert line items into invoice_items
  if (lineItems.length > 0) {
    const itemRows = lineItems.map((item) => ({
      invoice_id: data.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.price,
      gst_pct: item.gst,
      amount: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase.from("invoice_items").insert(itemRows);
    if (itemsError) {
      console.error("Failed to insert invoice line items:", itemsError);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/invoices");

  return data;
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect("/invoices");
}
