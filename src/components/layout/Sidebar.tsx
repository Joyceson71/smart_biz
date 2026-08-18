"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Bell,
  LineChart,
  Truck
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const NAVIGATION = [
  { group: "Overview", items: [
    { id: "dashboard", route: "/dashboard", title: "Overview", icon: LayoutDashboard },
    { id: "ai-core", route: "/ai-core", title: "AI Command Center", icon: Cpu },
    { id: "notifications", route: "/notifications", title: "Notifications", icon: Bell },
  ]},
  { group: "Operations", items: [
    { id: "employees", route: "/employees", title: "Organization", icon: Briefcase },
    { id: "inventory", route: "/inventory", title: "Inventory", icon: Package },
    { id: "stocks", route: "/stocks", title: "Stocks", icon: Package },
    { id: "categories", route: "/categories", title: "Categories", icon: Package },
  ]},
  { group: "Finance & Sales", items: [
    { id: "expenses", route: "/expenses", title: "Expenses", icon: Wallet },
    { id: "invoices", route: "/invoices", title: "Invoices", icon: FileText },
    { id: "cash-flow", route: "/cash-flow", title: "Cash Flow", icon: Wallet },
    { id: "customers", route: "/customers", title: "Customers", icon: Users },
  ]},
  { group: "Supply Chain", items: [
    { id: "vendors", route: "/vendors", title: "Vendors", icon: Truck },
    { id: "suppliers", route: "/suppliers", title: "Suppliers", icon: Truck },
  ]},
  { group: "Analytics", items: [
    { id: "reports", route: "/reports", title: "Reports", icon: LineChart },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">SmartBiz OS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {NAVIGATION.map((group) => (
          <div key={group.group}>
            <h3 className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.route;
                return (
                  <Link
                    key={item.id}
                    href={item.route}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-primary/10 text-primary dark:text-primary font-medium" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`} />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-medium" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Settings className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <span className="text-sm">Settings</span>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <Power className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
