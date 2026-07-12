"use client";

import { motion, useDragControls } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function DraggableWindow({ children }: { children: React.ReactNode }) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const dragControls = useDragControls();
  const pathname = usePathname();
  const router = useRouter();

  // Determine window title from pathname
  const title = pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';

  if (minimized) {
    return (
      <div className="fixed bottom-32 left-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 rounded-xl text-white shadow-2xl flex items-center gap-4 cursor-pointer" onClick={() => setMinimized(false)}>
        <span className="font-semibold text-sm">{title}</span>
        <Maximize2 className="w-4 h-4 text-slate-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: maximized ? '100%' : '80%',
        height: maximized ? '100%' : '85%',
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={!maximized}
      dragControls={dragControls}
      dragListener={false} // Drag only from header
      dragMomentum={false}
      className={`absolute left-0 top-0 right-0 bottom-0 m-auto flex flex-col overflow-hidden bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 shadow-2xl ${
        maximized ? 'rounded-none' : 'rounded-2xl'
      }`}
    >
      {/* Window Header */}
      <div 
        onPointerDown={(e) => {
          if (!maximized) dragControls.start(e);
        }}
        onDoubleClick={() => setMaximized(!maximized)}
        className="flex items-center justify-between px-4 py-3 bg-white/30 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 cursor-grab active:cursor-grabbing backdrop-blur-md shrink-0 z-50"
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
            className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"
          >
            <Minus className="w-2.5 h-2.5 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={() => setMaximized(!maximized)}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center group"
          >
            {maximized ? (
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
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </motion.div>
  );
}
