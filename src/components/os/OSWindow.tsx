"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Maximize2, Minus, X } from "lucide-react";
import { ReactNode } from "react";

export function OSWindow({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const appName = pathname === "/dashboard" 
    ? "Overview" 
    : pathname.split("/")[1]
      ? pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1)
      : "Application";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute top-12 bottom-24 left-4 right-4 md:left-24 md:right-24 xl:left-48 xl:right-48 flex flex-col clay-card shadow-2xl rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Title Bar */}
      <div className="h-10 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 select-none cursor-default">
        <div className="flex items-center gap-2 w-1/3">
          <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group shadow-inner">
            <X className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center group shadow-inner">
            <Minus className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center group shadow-inner">
            <Maximize2 className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        
        <div className="w-1/3 flex justify-center text-xs font-bold text-slate-400 tracking-wide">
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
