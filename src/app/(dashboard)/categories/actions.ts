"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;

  const { error } = await supabase
    .from("categories")
    .insert({ user_id: user.id, name });

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/inventory");
}

export async function editCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/inventory");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/inventory");
}
