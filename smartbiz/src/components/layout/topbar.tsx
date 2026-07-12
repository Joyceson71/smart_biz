"use client";

import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

interface TopbarProps {
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function Topbar({ title, breadcrumb }: TopbarProps) {
  const { toggleSidebar, openGlobalSearch } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 lg:h-24 bg-transparent flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-20 transition-all duration-300">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="size-5" />
      </Button>

      {/* Breadcrumb / Title */}
      <div className="flex-1">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">/</span>}
                {item.href ? (
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="font-semibold text-lg">{title}</h1>
        )}
      </div>

      {/* Search button (Cmd+K) */}
      <Button
        variant="outline"
        className="hidden md:flex items-center gap-2 text-muted-foreground w-64 justify-start font-normal"
        onClick={openGlobalSearch}
      >
        <Search className="size-4" />
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted-foreground"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative text-muted-foreground" asChild>
        <Link href={ROUTES.NOTIFICATIONS}>
          <Bell className="size-5" />
          {/* Unread count badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>
      </Button>
    </header>
  );
}
