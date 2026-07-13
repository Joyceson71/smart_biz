"use client";

import { motion, useMotionValue, useTransform, useSpring, MotionValue } from "framer-motion";

import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Cpu,
  Power,
  Wallet,
  Settings,
  Package,
  Briefcase
} from "lucide-react";
import { useRef } from "react";
import { logout } from "@/app/(auth)/actions";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

const APPS = [
  { id: "ai-core", route: "/ai-core", title: "AI Command Center", icon: Cpu, color: "text-purple-500" },
  { id: "dashboard", route: "/dashboard", title: "Overview", icon: LayoutDashboard, color: "text-blue-500" },
  { id: "employees", route: "/employees", title: "Organization", icon: Briefcase, color: "text-purple-400" },
  { id: "inventory", route: "/inventory", title: "Inventory", icon: Package, color: "text-amber-500" },
  { id: "expenses", route: "/expenses", title: "Expenses", icon: Wallet, color: "text-emerald-500" },
  { id: "invoices", route: "/invoices", title: "Invoices", icon: FileText, color: "text-indigo-500" },
  { id: "customers", route: "/customers", title: "Customers", icon: Users, color: "text-blue-400" },
  { id: "settings", route: "/settings", title: "Settings", icon: Settings, color: "text-slate-500" },
];

function DockIcon({ 
  app, 
  mouseX, 
  isOpen, 
  isFocused, 
  onClick,
  isMobile
}: { 
  app: typeof APPS[0], 
  mouseX: MotionValue<number>, 
  isOpen: boolean, 
  isFocused: boolean, 
  onClick: () => void,
  isMobile: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distance from mouse to the center of the icon
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate size based on distance
  const sizeTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className={`relative group flex flex-col items-center justify-end ${isMobile ? 'h-14 w-14 shrink-0' : 'h-24'}`}>
      {/* Tooltip */}
      {!isMobile && (
        <div className="absolute -top-10 px-3 py-1 bg-slate-900/90 dark:bg-slate-800/90 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
          {app.title}
        </div>
      )}
      
      <motion.button
        ref={ref}
        onClick={onClick}
        style={isMobile ? { width: 48, height: 48 } : { width: size, height: size }}
        className="relative flex items-center justify-center rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800 backdrop-blur-md shadow-lg overflow-hidden group-hover:-translate-y-2 transition-transform duration-200"
      >
        <app.icon className={`w-1/2 h-1/2 ${app.color} drop-shadow-md`} strokeWidth={1.5} />
      </motion.button>

      {/* Active Indicator */}
      <div className="h-1 mt-2 flex items-center justify-center">
        {isOpen && (
          <div className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-slate-900 dark:bg-slate-200' : 'bg-slate-400 dark:bg-slate-600'}`} />
        )}
      </div>
    </div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={`fixed z-[100] ${isMobile ? 'bottom-0 left-0 right-0' : 'bottom-4 left-1/2 -translate-x-1/2'}`}>
      <div 
        onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
        onMouseLeave={() => !isMobile && mouseX.set(Infinity)}
        className={`flex items-end gap-2 sm:gap-4 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl border-t sm:border-white/30 sm:dark:border-slate-800/50 shadow-2xl ${
          isMobile ? 'px-2 py-2 h-16 w-full justify-between overflow-x-auto border-t border-slate-200/50 dark:border-slate-800/50' : 'px-6 h-24 rounded-3xl border border-white/30 dark:border-slate-800/50'
        }`}
      >
        {APPS.map((app) => (
          <DockIcon 
            key={app.id}
            app={app} 
            mouseX={mouseX} 
            isOpen={pathname === app.route}
            isFocused={pathname === app.route}
            onClick={() => router.push(app.route)}
            isMobile={isMobile}
          />
        ))}

        {!isMobile && <div className="w-[1px] h-12 bg-slate-300 dark:bg-slate-800 self-center mx-2 shrink-0" />}

        <DockIcon 
          app={{ id: "logout", route: "/logout", title: "Log out", icon: Power, color: "text-red-500" }} 
          mouseX={mouseX} 
          isOpen={false}
          isFocused={false}
          onClick={() => {
            logout();
          }}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
