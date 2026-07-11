"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/stores/ui-store";
import { ROUTES } from "@/lib/constants/routes";
import {
  LayoutDashboard, FileText, CreditCard, TrendingUp, BarChart3,
  Users, Building2, Settings, Bell, Zap, ChevronLeft, ChevronRight,
  LogOut, X, Bot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  permission?: string;
  adminOnly?: boolean;
  ownerOnly?: boolean;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "AI Assistant", href: ROUTES.AI_ASSISTANT, icon: Bot },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Invoices", href: ROUTES.INVOICES, icon: FileText },
      { label: "Expenses", href: ROUTES.EXPENSES, icon: CreditCard },
      { label: "Cash Flow", href: ROUTES.CASH_FLOW, icon: TrendingUp },
      { label: "Reports", href: ROUTES.REPORTS, icon: BarChart3 },
    ],
  },
  {
    title: "Contacts",
    items: [
      { label: "Customers", href: ROUTES.CUSTOMERS, icon: Users },
      { label: "Vendors", href: ROUTES.VENDORS, icon: Building2 },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: Bell },
      { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed, sidebarOpen, setSidebarOpen } = useUIStore();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Mobile Overlay ──────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-[260px]",
          // Mobile: off-canvas
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className={cn(
          "flex items-center border-b border-border h-16 px-4",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!sidebarCollapsed && (
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                S
              </div>
              <span className="font-bold text-lg tracking-tight">SmartBiz</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              S
            </div>
          )}

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={toggleSidebarCollapsed}
          >
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>

          {/* Mobile close */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              {!sidebarCollapsed && (
                <p className="px-2 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all group relative",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          sidebarCollapsed && "justify-center px-2"
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <item.icon className={cn("shrink-0", sidebarCollapsed ? "size-5" : "size-4.5")} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-[10px] justify-center">
                                {item.badge > 99 ? "99+" : item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {!sidebarCollapsed && <div className="mt-3 border-t border-border/50" />}
            </div>
          ))}
        </nav>

        {/* ── User Footer ─────────────────────────────────────────────────── */}
        <div className={cn(
          "border-t border-border p-3",
          sidebarCollapsed && "flex justify-center"
        )}>
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                R
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Rajesh Kumar</p>
                <p className="text-xs text-muted-foreground truncate">Owner</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" asChild>
                <Link href="/api/auth/logout">
                  <LogOut className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
              <Link href="/api/auth/logout">
                <LogOut className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
