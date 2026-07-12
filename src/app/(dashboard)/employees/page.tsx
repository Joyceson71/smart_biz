import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EmployeesScene, { Employee } from "./EmployeesScene";

export const metadata = {
  title: "Organization | SmartBiz OS",
};

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase
  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching employees:", error);
  }

  return <EmployeesScene initialEmployees={(employees as Employee[]) || []} />;
}
