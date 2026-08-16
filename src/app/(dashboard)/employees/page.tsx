import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import type { Employee } from "./EmployeesScene";

const EmployeesScene = dynamic(() => import("./EmployeesScene"), { 
  loading: () => <SkeletonLoader /> 
});
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
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching employees:", error);
  }

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <EmployeesScene initialEmployees={(employees as Employee[]) || []} />
    </Suspense>
  );
}
