"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEmployee(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;
  const role = formData.get("role") as string;
  
  const { error } = await supabase.from("employees").insert({
    user_id: user.id,
    first_name,
    last_name,
    email,
    department,
    role,
    status: "Active",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/employees");
}

export async function updateEmployee(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  
  const { error } = await supabase
    .from("employees")
    .update({
      first_name,
      last_name,
      email,
      department,
      role,
      status,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/employees");
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/employees");
}
