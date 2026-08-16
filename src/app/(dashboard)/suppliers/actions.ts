"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSupplier(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const gst_number = formData.get("gst_number") as string;

  const { error } = await supabase
    .from("suppliers")
    .insert({ user_id: user.id, name, email, phone, gst_number });

  if (error) throw new Error(error.message);

  revalidatePath("/suppliers");
  revalidatePath("/inventory");
}

export async function editSupplier(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const gst_number = formData.get("gst_number") as string;

  const { error } = await supabase
    .from("suppliers")
    .update({ name, email, phone, gst_number })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/suppliers");
  revalidatePath("/inventory");
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/suppliers");
  revalidatePath("/inventory");
}
