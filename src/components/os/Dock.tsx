"use client";

import { motion, useMotionValue, useTransform, useSpring, MotionValue, AnimatePresence } from "framer-motion";

import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Cpu,
  Power,
  Wallet,
  Settings,
  Package,
  Briefcase,
  MoreHorizontal,
  Bell,
  LineChart,
  Truck
} from "lucide-react";
import { useRef, useTransition, useEffect, useState } from "react";
import { logout } from "@/app/(auth)/actions";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

const APPS = [
  { id: "ai-core", route: "/ai-core", title: "AI Command Center", icon: Cpu, color: "text-purple-500" },
  { id: "dashboard", route: "/dashboard", title: "Overview", icon: LayoutDashboard, color: "text-blue-500" },
  { id: "employees", route: "/employees", title: "Organization", icon: Briefcase, color: "text-purple-400" },
  { id: "inventory", route: "/inventory", title: "Inventory", icon: Package, color: "text-amber-500" },
  { id: "stocks", route: "/stocks", title: "Stocks", icon: Package, color: "text-orange-500" },
  { id: "expenses", route: "/expenses", title: "Expenses", icon: Wallet, color: "text-emerald-500" },
  { id: "invoices", route: "/invoices", title: "Invoices", icon: FileText, color: "text-indigo-500" },
  { id: "customers", route: "/customers", title: "Customers", icon: Users, color: "text-blue-400" },
  { id: "settings", route: "/settings", title: "Settings", icon: Settings, color: "text-slate-500" },
];

const MORE_APPS = [
  { id: "vendors", route: "/vendors", title: "Vendors", icon: Truck, color: "text-amber-600" },
  { id: "suppliers", route: "/suppliers", title: "Suppliers", icon: Truck, color: "text-orange-400" },
  { id: "categories", route: "/categories", title: "Categories", icon: Package, color: "text-blue-400" },
  { id: "reports", route: "/reports", title: "Reports", icon: LineChart, color: "text-rose-500" },
  { id: "notifications", route: "/notifications", title: "Notifications", icon: Bell, color: "text-yellow-500" },
  { id: "cash-flow", route: "/cash-flow", title: "Cash Flow", icon: Wallet, color: "text-emerald-400" },
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
  const [isPending, startTransition] = useTransition();

  // Distance from mouse to the center of the icon
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate size based on distance
  const sizeTransform = useTransform(distance, [-150, 0, 150], [40, 64, 40]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const handleClick = () => {
    startTransition(() => {
      onClick();
    });
  };

  return (
    <div className={`relative group flex flex-col items-center justify-end ${isMobile ? 'h-14 w-14 shrink-0' : 'h-20'}`}>
      {/* Tooltip */}
      {!isMobile && (
        <div className="absolute -top-12 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 z-50">
          {app.title}
        </div>
      )}
      
      <motion.button
        ref={ref}
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
        style={isMobile ? { width: 48, height: 48 } : { width: size, height: size }}
        className={`relative flex items-center justify-center rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800 backdrop-blur-md overflow-hidden transition-colors duration-200 ${isOpen ? 'ring-1 ring-white/40 dark:ring-white/20 bg-white/30 dark:bg-slate-800/80 shadow-2xl' : 'group-hover:bg-white/20 dark:group-hover:bg-slate-800/60 shadow-lg'}`}
      >
        <app.icon className={`w-1/2 h-1/2 ${app.color} drop-shadow-md transition-transform duration-200 ${isOpen && !isMobile ? 'scale-110' : ''} ${isPending ? 'opacity-30' : ''}`} strokeWidth={1.5} />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-1/3 h-1/3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Active Indicator */}
      <div className="h-1 mt-2 flex items-center justify-center">
        {isOpen && (
          <motion.div layoutId="active-indicator" className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-slate-800 dark:bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-400 dark:bg-slate-600'}`} />
        )}
      </div>
    </div>
  );
}

export function Dock() {
  const pathname = usePathname();
  const router = useRouter();
  const mouseX = useMotionValue(Infinity);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMoreAppsOpen, setIsMoreAppsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Prefetch routes for zero-latency navigation
  useEffect(() => {
    APPS.forEach((app) => router.prefetch(app.route));
  }, [router]);

  return (
    <div 
      className={`fixed z-[100] ${isMobile ? 'bottom-0 left-0 right-0' : 'bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-32 pb-4 flex items-end justify-center'}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false);
          mouseX.set(Infinity);
        }
      }}
    >
      <AnimatePresence>
        {isMoreAppsOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-50 grid grid-cols-2 gap-3"
          >
            {MORE_APPS.map(app => (
              <button 
                key={app.id} 
                onClick={() => {
                  router.push(app.route);
                  setIsMoreAppsOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <app.icon className={`w-6 h-6 ${app.color}`} />
                <span className="text-[10px] font-medium text-white">{app.title}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
        initial={{ y: 100 }}
        animate={{ y: isHovered || isMobile ? 0 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`flex items-end gap-2 sm:gap-4 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl border-t sm:border-white/30 sm:dark:border-slate-800/50 shadow-2xl ${
          isMobile ? 'px-4 py-3 h-20 w-full justify-start overflow-x-auto [&::-webkit-scrollbar]:hidden border-t border-slate-200/50 dark:border-slate-800/50' : 'px-5 py-2 h-20 rounded-3xl border border-white/30 dark:border-slate-800/50'
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
        <DockIcon 
          app={{ id: "more", route: "#", title: "More", icon: MoreHorizontal, color: "text-slate-400" }} 
          mouseX={mouseX} 
          isOpen={isMoreAppsOpen}
          isFocused={isMoreAppsOpen}
          onClick={() => setIsMoreAppsOpen(!isMoreAppsOpen)}
          isMobile={isMobile}
        />

        {!isMobile && <div className="w-[1px] h-10 bg-slate-300/50 dark:bg-slate-700 self-center mx-1 shrink-0" />}

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
      </motion.div>
    </div>
  );
}
