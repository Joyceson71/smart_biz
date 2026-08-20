"use client";

import { motion, useDragControls } from "framer-motion";
import { usePathname } from "next/navigation";
import { Maximize2, Minus, X, GripHorizontal } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

export function OSWindow({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const controls = useDragControls();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const appName = pathname === "/dashboard" 
    ? "Overview" 
    : pathname.split("/")[1]
      ? pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1)
      : "Application";

  return (
    <motion.div 
      drag={isClient ? true : false}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        width: "min(90vw, 1200px)",
        height: "min(80vh, 800px)",
        resize: "both",
        position: "absolute",
        left: "calc(50% - min(45vw, 600px))",
        top: "10%"
      }}
      className="flex flex-col clay-card shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-2xl border border-white/10 overflow-hidden z-20"
    >
      {/* Title Bar - Drag Handle */}
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="h-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 select-none cursor-grab active:cursor-grabbing shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      >
        <div className="flex items-center gap-2 w-1/3">
          <button className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-red-400 to-red-600 hover:brightness-110 flex items-center justify-center group shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.5)] border border-red-800/50 transition-all">
            <X className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 flex items-center justify-center group shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.5)] border border-amber-800/50 transition-all">
            <Minus className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 hover:brightness-110 flex items-center justify-center group shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.5)] border border-emerald-800/50 transition-all">
            <Maximize2 className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        
        <div className="w-1/3 flex justify-center items-center gap-2 text-xs font-bold text-slate-400 tracking-wide pointer-events-none">
          <GripHorizontal className="w-3 h-3 opacity-50" />
          {appName}
        </div>
        
        <div className="w-1/3" />
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-y-auto bg-transparent relative w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
