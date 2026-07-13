"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const sku = formData.get("sku") as string;
  const name = formData.get("name") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const reorder_level = parseInt(formData.get("reorder_level") as string, 10) || 10;
  
  // Distribute the items across the 3D warehouse visually
  const pos_x = (Math.random() - 0.5) * 16;
  const pos_y = 0.5; // Fixed y on the ground plane
  const pos_z = (Math.random() - 0.5) * 16;

  const { error } = await supabase.from("inventory").insert({
    user_id: user.id,
    sku,
    name,
    quantity,
    reorder_level,
    pos_x,
    pos_y,
    pos_z,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}
