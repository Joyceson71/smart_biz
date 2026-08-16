"use client";

import { motion, useDragControls } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

export function DraggableWindow({ children }: { children: React.ReactNode }) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const dragControls = useDragControls();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isMaximized = maximized || isMobile;

  // Determine window title from pathname
  const title = pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';

  if (minimized) {
    return (
      <motion.div 
        layoutId="window-wrapper"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/50 dark:border-slate-600/50 px-6 py-3 rounded-full text-slate-900 dark:text-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-colors z-[100]" 
        onClick={() => setMinimized(false)}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-sm tracking-wide">{title}</span>
        <Maximize2 className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2" />
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="window-wrapper"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isMaximized ? '100%' : '80%',
        height: isMaximized ? '100%' : '85%',
      }}
      layout
      transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 }, type: "spring", stiffness: 300, damping: 30 }}
      drag={!isMaximized && !isMobile}
      dragConstraints={{ top: 0 }}
      dragElastic={0.1}
      dragControls={dragControls}
      dragListener={false} // Drag only from header
      dragMomentum={false}
      className={`absolute left-0 top-0 right-0 bottom-0 m-auto flex flex-col overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-[40px] border-y border-white/60 dark:border-slate-600/50 border-x border-white/40 dark:border-slate-600/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ${
        isMaximized ? 'rounded-none' : 'rounded-3xl'
      }${isMobile ? ' pb-16' : ''}`}
    >
      {/* Window Header */}
      <div 
        onPointerDown={(e) => {
          if (!isMaximized && !isMobile) dragControls.start(e);
        }}
        onDoubleClick={() => !isMobile && setMaximized(!maximized)}
        className={`flex items-center justify-between px-4 py-3 bg-white/40 dark:bg-slate-800/40 border-b border-white/40 dark:border-slate-600/40 backdrop-blur-xl shrink-0 z-50 ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <div className="flex items-center gap-2">
          {/* Mac-style traffic lights */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"
          >
            <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={() => setMinimized(true)}
            className={`w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group ${isMobile ? 'hidden' : ''}`}
          >
            <Minus className="w-2.5 h-2.5 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={() => !isMobile && setMaximized(!maximized)}
            className={`w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center group ${isMobile ? 'hidden' : ''}`}
          >
            {isMaximized ? (
              <Minimize2 className="w-2.5 h-2.5 text-emerald-900 opacity-0 group-hover:opacity-100" />
            ) : (
              <Maximize2 className="w-2.5 h-2.5 text-emerald-900 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        </div>
        
        <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 pointer-events-none select-none tracking-widest">
          {title}
        </div>
        
        <div className="w-14" /> {/* Spacer to balance header */}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {children}
      </div>
    </motion.div>
  );
}
