import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RealtimeProvider } from "@/components/os/RealtimeProvider";
import { WebGLErrorBoundary } from "@/components/os/WebGLErrorBoundary";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 w-full relative">
          <WebGLErrorBoundary>
            {children}
          </WebGLErrorBoundary>
        </main>
      </div>
      <RealtimeProvider />
    </div>
  );
}

