"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Package, Users, Wallet, FileText, Settings, LayoutDashboard } from "lucide-react";

const MAIN_NAV = [
  { id: "dashboard", route: "/dashboard", title: "Overview", icon: LayoutDashboard },
  { id: "customers", route: "/customers", title: "Customers", icon: Users },
  { id: "employees", route: "/employees", title: "Team", icon: Users },
  { id: "inventory", route: "/inventory", title: "Inventory", icon: Package },
  { id: "invoices", route: "/invoices", title: "Invoices", icon: FileText },
  { id: "expenses", route: "/expenses", title: "Expenses", icon: Wallet },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full mb-6 py-4">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center px-6 clay-card rounded-3xl">
          <div className="mr-8 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-xl neo-flat flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-sm font-bold text-blue-400">SB</span>
              </div>
              <span className="hidden font-bold sm:inline-block text-slate-200 text-lg">
                SmartBiz
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2 text-sm font-medium hidden lg:flex flex-1">
            {MAIN_NAV.map((item) => {
              const isActive = pathname.startsWith(item.route);
              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                    isActive 
                      ? "neo-pressed text-blue-400" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end space-x-4 ml-auto">
            <nav className="flex items-center space-x-3">
              <div className="relative hidden xl:flex w-full max-w-sm items-center space-x-2 mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-10 w-[250px] pl-10 pr-4 neo-pressed rounded-xl border-none outline-none text-sm text-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-transparent"
                />
              </div>
              
              <button className="h-10 w-10 flex items-center justify-center neo-flat rounded-xl text-slate-400 hover:text-blue-400 transition-colors active:neo-pressed">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </button>
              
              <Link href="/settings" className="h-10 w-10 flex items-center justify-center neo-flat rounded-xl text-slate-400 hover:text-blue-400 transition-colors active:neo-pressed">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
              
              <div className="h-10 w-10 rounded-xl neo-flat flex items-center justify-center text-sm font-bold text-slate-300 cursor-pointer ml-2 hover:text-blue-400 transition-colors active:neo-pressed">
                JD
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
