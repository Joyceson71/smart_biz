import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Settings | SmartBiz OS",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const meta = user.user_metadata ?? {};

  return (
    <SettingsClient
      firstName={meta.first_name ?? meta.full_name?.split(" ")[0] ?? ""}
      lastName={meta.last_name ?? meta.full_name?.split(" ").slice(1).join(" ") ?? ""}
      email={user.email ?? ""}
      avatarUrl={meta.avatar_url ?? null}
    />
  );
}
