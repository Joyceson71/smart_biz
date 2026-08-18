"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  
  // Create a nice title based on the pathname
  const segments = pathname.split("/").filter(Boolean);
  let title = "Dashboard";
  
  if (segments.length > 0) {
    const section = segments[0];
    title = section.charAt(0).toUpperCase() + section.slice(1).replace("-", " ");
  }

  return (
    <header className="h-16 bg-white dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search anywhere..."
            className="pl-9 bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </Button>

        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner cursor-pointer hover:bg-primary/30 transition-colors">
          JD
        </div>
      </div>
    </header>
  );
}
