"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Package, Users, Wallet, FileText, Settings, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">SB</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              SmartBiz
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            {MAIN_NAV.map((item) => {
              const isActive = pathname.startsWith(item.route);
              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <div className="relative hidden lg:flex w-full max-w-sm items-center space-x-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="h-9 md:w-[200px] lg:w-[300px] pl-8 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <div className="h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center text-xs font-semibold cursor-pointer ml-2 hover:bg-accent transition-colors">
              JD
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
