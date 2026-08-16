"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addVendor(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string || "Active";
  const balance = parseFloat(formData.get("balance") as string) || 0;

  const { error } = await supabase.from("vendors").insert({
    user_id: user.id,
    name,
    email,
    phone,
    status,
    balance
  });

  if (error) {
    console.error("Error adding vendor:", error);
    throw new Error(error.message);
  }

  revalidatePath("/vendors");
}

export async function deleteVendor(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/vendors");
}
