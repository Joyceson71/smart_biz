import { Dock } from "@/components/os/dock";
import { CommandPalette } from "@/components/os/command-palette";

export default function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#040406] relative overflow-hidden text-white selection:bg-brand-500/30">
      
      {/* 3D Global OS Background - Keep it subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00E5FF]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#B026FF]/5 rounded-full blur-[120px]" />
      </div>

      {/* Main OS Desktop Area where windows are rendered */}
      <div className="relative z-10 w-full h-screen">
        {children}
      </div>

      {/* Floating OS Dock */}
      <Dock />
      
      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
