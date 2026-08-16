import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const CategoriesClient = dynamic(
  () => import("./CategoriesClient").then((mod) => mod.CategoriesClient),
  { loading: () => <SkeletonLoader /> }
);

export const metadata = {
  title: "Categories | SmartBiz OS",
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return <CategoriesClient initialCategories={categories || []} />;
}
