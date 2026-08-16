import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const SuppliersClient = dynamic(
  () => import("./SuppliersClient").then((mod) => mod.SuppliersClient),
  { loading: () => <SkeletonLoader /> }
);

export const metadata = {
  title: "Suppliers | SmartBiz OS",
};

export default async function SuppliersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: suppliers, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching suppliers:", error);
  }

  return <SuppliersClient initialSuppliers={suppliers || []} />;
}
