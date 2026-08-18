import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EmployeesClient from "./EmployeesClient";
import type { Employee } from "./EmployeesClient";
import { Suspense } from "react";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching employees:", error);
  }

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <EmployeesClient initialEmployees={(employees as Employee[]) || []} />
    </Suspense>
  );
}
