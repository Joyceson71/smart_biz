"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const ltv = parseFloat(formData.get("ltv") as string) || 0;
  
  // Generate random 3D position (clustering around center)
  const pos_x = (Math.random() - 0.5) * 10;
  const pos_y = (Math.random() - 0.5) * 5;
  const pos_z = (Math.random() - 0.5) * 10;

  const { error } = await supabase.from("customers").insert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    status: 'New',
    ltv: ltv,
    pos_x,
    pos_y,
    pos_z
  });

  if (error) {
    console.error("Error adding customer:", error);
    throw new Error(error.message);
  }

  // Revalidate the page to fetch the new customer
  revalidatePath("/customers");
}
