"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Wallet,
  Settings,
  UserCircle,
  Bot
} from "lucide-react";
import { useState } from "react";

const DOCK_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/dashboard", color: "text-blue-400" },
  { id: "customers", label: "Customers", icon: Users, href: "/customers", color: "text-purple-400" },
  { id: "inventory", label: "Inventory", icon: Package, href: "/inventory", color: "text-emerald-400" },
  { id: "ai-core", label: "JARVIS Core", icon: Bot, href: "/ai-core", color: "text-cyan-400" },
  { id: "invoices", label: "Invoices", icon: FileText, href: "/invoices", color: "text-amber-400" },
  { id: "expenses", label: "Expenses", icon: Wallet, href: "/expenses", color: "text-red-400" },
  { id: "employees", label: "Team", icon: UserCircle, href: "/employees", color: "text-indigo-400" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", color: "text-slate-400" },
];

export function OSDock() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="clay-card px-4 py-3 flex items-center gap-2 rounded-3xl border border-white/5 bg-[#1e293b]/80 backdrop-blur-xl shadow-2xl">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const isHovered = hovered === item.id;
          
          return (
            <Link key={item.id} href={item.href}>
              <div 
                className="relative group"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  animate={{
                    scale: isHovered ? 1.3 : isActive ? 1.1 : 1,
                    y: isHovered ? -10 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors ${
                    isActive ? "neo-pressed bg-white/5" : "hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-6 h-6 transition-all ${isHovered || isActive ? item.color : "text-slate-400"}`} />
                </motion.div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`}
                    style={{ boxShadow: '0 0 8px currentColor', color: 'inherit' }}
                  />
                )}
                
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 border border-white/10 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                  >
                    {item.label}
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
