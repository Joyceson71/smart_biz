"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  CreditCard, 
  PieChart, 
  Settings,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Invoices",
    icon: Receipt,
    href: "/invoices",
    color: "text-violet-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-pink-700",
  },
  {
    label: "Vendors",
    icon: Store,
    href: "/vendors",
    color: "text-orange-700",
  },
  {
    label: "Expenses",
    icon: CreditCard,
    href: "/expenses",
    color: "text-emerald-500",
  },
  {
    label: "Reports",
    icon: PieChart,
    href: "/reports",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            SmartBiz
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition",
                pathname === route.href 
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" 
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
