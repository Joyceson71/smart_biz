
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Dock } from "@/components/os/Dock";
import { DraggableWindow } from "@/components/os/DraggableWindow";
import { Clock } from "@/components/os/Clock";
import { CommandPalette } from "@/components/os/CommandPalette";
import { Wifi, BatteryMedium, Search } from "lucide-react";

export default async function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: verify session server-side on every render of this layout.
  // Middleware is the first line of defense; this is the second.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-950 overscroll-none">
      {/* Background image - local for performance */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/os-bg.jpg')" }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
      
      {/* Main OS Desktop Area */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Status Bar */}
        <div className="h-8 w-full bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center px-4 justify-between text-xs text-slate-200 shadow-sm shrink-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <span className="text-[8px] font-bold text-white">S</span>
            </div>
            <span className="font-semibold tracking-widest uppercase opacity-90">SmartBiz OS</span>
            <div className="hidden sm:flex items-center gap-4 ml-4 opacity-60">
              <span className="cursor-pointer hover:opacity-100 transition-opacity">File</span>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">Edit</span>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">View</span>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">Window</span>
              <span className="cursor-pointer hover:opacity-100 transition-opacity">Help</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 opacity-80">
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <Search className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
              <Wifi className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
              <BatteryMedium className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
            </div>
            <Clock />
          </div>
        </div>

        {/* Central Draggable Window */}
        <main className="flex-1 w-full h-full relative">
          <DraggableWindow>
            {children}
          </DraggableWindow>
        </main>
        
        {/* The Dock - macOS/VisionPro style taskbar */}
        <Dock />

        {/* Global Spotlight Search */}
        <CommandPalette />
      </div>
    </div>
  );
}

