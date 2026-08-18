import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
    <div className="flex flex-col min-h-[100dvh] w-full bg-background font-sans antialiased">
      <Header />
      <main className="flex-1 w-full relative">
        <div className="container max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full">
          <WebGLErrorBoundary>
            {children}
          </WebGLErrorBoundary>
        </div>
      </main>
      <RealtimeProvider />
    </div>
  );
}

