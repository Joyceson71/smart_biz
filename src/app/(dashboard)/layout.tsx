import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OSMenuBar } from "@/components/os/OSMenuBar";
import { OSDock } from "@/components/os/OSDock";
import { OSWindow } from "@/components/os/OSWindow";
import { RealtimeProvider } from "@/components/os/RealtimeProvider";
import { ShortcutHelp } from "@/components/os/ShortcutHelp";

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
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased text-slate-200 bg-[#1e293b] relative select-none">
      <OSMenuBar />
      
      <main className="flex-1 w-full relative z-0">
        {/* The Desktop Background (can add a subtle grid or image here if desired) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        
        <OSWindow>
          {children}
        </OSWindow>
      </main>

      <OSDock />
      
      <RealtimeProvider />
      <ShortcutHelp />
    </div>
  );
}
