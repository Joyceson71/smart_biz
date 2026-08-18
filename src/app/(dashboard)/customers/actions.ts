"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const ltv = parseFloat(formData.get("ltv") as string) || 0;

  const { error } = await supabase.from("customers").insert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    status: "New",
    ltv: ltv,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
}

export async function updateCustomer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  const ltv = parseFloat(formData.get("ltv") as string) || 0;

  const { error } = await supabase
    .from("customers")
    .update({ first_name, last_name, email, phone, status, ltv })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
}
