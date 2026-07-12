"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, CreditCard, TrendingUp, 
  Users, Bot, Settings, Search, Box
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useWindowStore } from "@/stores/useWindowStore";

const DOCK_ITEMS = [
  { id: "finance", label: "Spatial Analytics", icon: TrendingUp, component: "SpatialFinance" },
  { id: "inventory", label: "Virtual Warehouse", icon: Box, component: "Warehouse3D" },
  { id: "customers", label: "Business Network", icon: Users, component: "CustomerNetwork3D" },
];

function DockItem({ item, mouseX }: { item: typeof DOCK_ITEMS[0]; mouseX: any }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { openWindow, activeWindowId } = useWindowStore();
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  
  // Transform distance to scale (closer = bigger)
  const widthSync = useTransform(distance, [-150, 0, 150], [45, 80, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const isActive = activeWindowId === item.id;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap shadow-xl z-50 pointer-events-none"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={() => openWindow(item.id, item.label, item.component)}
        className={`flex items-center justify-center rounded-2xl border transition-colors shadow-lg ${
          isActive 
            ? "bg-brand-500/20 border-brand-500/50 text-brand-400 shadow-[0_0_20px_rgba(0,229,255,0.4)]" 
            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        }`}
      >
        <item.icon className="w-1/2 h-1/2" />
      </motion.button>
    </div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const { openGlobalSearch } = useUIStore();
  const { openWindow } = useWindowStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
      <motion.div 
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end h-20 gap-3 px-4 pb-4 pt-4 rounded-3xl os-panel"
      >
        {/* Core Modules */}
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.id} item={item} mouseX={mouseX} />
        ))}
        
        <div className="w-[1px] h-10 bg-white/10 mx-2 self-center rounded-full" />
        
        {/* AI Command Center */}
        <div className="relative" onMouseEnter={(e) => {}} onMouseLeave={() => {}}>
           <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWindow("ai-core", "AI Command Center", "AICore")}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#B026FF]/20 border border-[#B026FF]/30 text-white hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all"
            >
              <Bot className="w-6 h-6 text-[#7C4DFF]" />
            </motion.button>
        </div>

        {/* Search / Command Palette Toggle */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openGlobalSearch}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
