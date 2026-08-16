"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const merchant = formData.get("merchant") as string;
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    merchant,
    category,
    amount,
    date,
    notes,
    status: "Processed",
  });

  if (error) {
    console.error("Failed to add expense:", error);
    throw new Error(error.message);
  }

  revalidatePath("/expenses");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Extra safety — RLS also enforces this

  if (error) {
    console.error("Failed to delete expense:", error);
    throw new Error(error.message);
  }

  revalidatePath("/expenses");
}
