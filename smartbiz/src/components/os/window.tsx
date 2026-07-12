"use client";

import { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { useWindowStore } from "@/stores/useWindowStore";

interface WindowProps {
  id: string;
  children: React.ReactNode;
}

export default function OSWindow({ id, children }: WindowProps) {
  const windowState = useWindowStore((state) => state.windows.find((w) => w.id === id));
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    restoreWindow, 
    focusWindow,
    updateWindowPosition
  } = useWindowStore();
  
  const dragControls = useDragControls();

  if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

  const isMaximized = windowState.isMaximized;

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMaximized) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation between -2 and 2 degrees
    const rX = ((y / rect.height) - 0.5) * -4;
    const rY = ((x / rect.width) - 0.5) * 4;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (!isMaximized) {
          updateWindowPosition(id, {
            x: windowState.position.x + info.offset.x,
            y: windowState.position.y + info.offset.y,
          });
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={false}
      animate={{
        x: isMaximized ? 0 : windowState.position.x,
        y: isMaximized ? 0 : windowState.position.y,
        width: isMaximized ? "100vw" : windowState.size.width,
        height: isMaximized ? "100vh" : windowState.size.height,
        zIndex: windowState.zIndex,
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      onPointerDown={() => focusWindow(id)}
      className="absolute top-0 left-0 os-panel flex flex-col overflow-hidden shadow-2xl"
      style={{
        borderRadius: isMaximized ? 0 : "var(--radius-xl)",
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Title Bar (Draggable Area) */}
      <div 
        onPointerDown={(e) => {
          focusWindow(id);
          dragControls.start(e);
        }}
        onDoubleClick={() => isMaximized ? restoreWindow(id) : maximizeWindow(id)}
        className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          {/* Mac-style window controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group"
          >
             <X size={10} className="opacity-0 group-hover:opacity-100 text-black" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center group"
          >
             <Minus size={10} className="opacity-0 group-hover:opacity-100 text-black" />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              isMaximized ? restoreWindow(id) : maximizeWindow(id); 
            }}
            className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center group"
          >
             {isMaximized ? (
               <Square size={8} className="opacity-0 group-hover:opacity-100 text-black" />
             ) : (
               <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black" />
             )}
          </button>
        </div>
        
        <div className="text-white/70 font-semibold text-sm tracking-wide">
          {windowState.title}
        </div>
        
        <div className="w-14" /> {/* Spacer to center title */}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-black/40">
        {children}
      </div>
      
      {/* Optional: Resize Handle could go here */}
    </motion.div>
  );
}
