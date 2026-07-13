"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addInvoice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get("amount") as string);
  const due_date = formData.get("due_date") as string;
  const status = formData.get("status") as string;
  // Use a default customer for now if not selected
  const customer_id = formData.get("customer_id") as string || null;
  
  // Generate random 3D position
  const pos_x = (Math.random() - 0.5) * 20;
  const pos_y = Math.random() * 5;
  const pos_z = (Math.random() - 0.5) * 20;

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    customer_id,
    amount,
    due_date,
    status,
    pos_x,
    pos_y,
    pos_z,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/invoices");
}
