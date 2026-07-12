
import { Dock } from "@/components/os/Dock";
import { DraggableWindow } from "@/components/os/DraggableWindow";

export default function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat dark:bg-slate-950">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-[2px]" />
      
      {/* Main OS Desktop Area */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Status Bar (Placeholder for Spotlight/Global Search) */}
        <div className="h-8 w-full bg-slate-900/20 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between text-xs text-white shadow-sm">
          <div className="font-semibold tracking-widest uppercase">SmartBiz OS</div>
          <div className="flex gap-4 opacity-80">
            <span>Enterprise Network</span>
            <span>All Systems Operational</span>
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
      </div>
    </div>
  );
}
