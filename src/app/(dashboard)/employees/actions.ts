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
  
  // Assign a random 3D position in the employee orbital space
  const angle = Math.random() * Math.PI * 2;
  const radius = 5 + Math.random() * 5;
  const pos_x = Math.cos(angle) * radius;
  const pos_y = (Math.random() - 0.5) * 4;
  const pos_z = Math.sin(angle) * radius;

  const { error } = await supabase.from("employees").insert({
    user_id: user.id,
    first_name,
    last_name,
    email,
    department,
    role,
    status: "Active",
    pos_x,
    pos_y,
    pos_z,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/employees");
}
