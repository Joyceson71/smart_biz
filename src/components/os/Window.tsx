"use client";

import { motion, useDragControls } from "framer-motion";
import { useWindowStore, WindowData } from "@/store/useWindowStore";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useRef } from "react";

export function OSWindow({ windowData }: { windowData: WindowData }) {
  const { id, title, component, x, y, width, height, minimized, maximized, zIndex } = windowData;
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition } = useWindowStore();
  const dragControls = useDragControls();
  const constraintsRef = useRef(null); // In a real app, pass this from DesktopEnvironment

  if (minimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: maximized ? 0 : x,
        y: maximized ? 0 : y,
        width: maximized ? '100vw' : width,
        height: maximized ? 'calc(100vh - 80px)' : height, // Leave room for dock
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ zIndex }}
      drag={!maximized}
      dragControls={dragControls}
      dragListener={false} // Drag only from header
      dragMomentum={false}
      onDragEnd={(e, info) => {
        updatePosition(id, x + info.offset.x, y + info.offset.y);
      }}
      onPointerDown={() => focusWindow(id)}
      className={`absolute flex flex-col overflow-hidden bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 shadow-2xl ${
        maximized ? 'rounded-none' : 'rounded-xl'
      }`}
    >
      {/* Window Header */}
      <div 
        onPointerDown={(e) => {
          focusWindow(id);
          if (!maximized) dragControls.start(e);
        }}
        onDoubleClick={() => maximizeWindow(id)}
        className="flex items-center justify-between px-4 py-3 bg-white/30 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 cursor-grab active:cursor-grabbing backdrop-blur-md shrink-0"
      >
        <div className="flex items-center gap-2">
          {/* Mac-style traffic lights */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center group"
          >
            {maximized ? (
              <Minimize2 className="w-2 h-2 text-emerald-900 opacity-0 group-hover:opacity-100" />
            ) : (
              <Maximize2 className="w-2 h-2 text-emerald-900 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        </div>
        
        <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 pointer-events-none select-none">
          {title}
        </div>
        
        <div className="w-14" /> {/* Spacer to balance header */}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 relative">
        {component}
      </div>
    </motion.div>
  );
}
