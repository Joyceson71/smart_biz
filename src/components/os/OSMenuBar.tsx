"use client";

import { useEffect, useState } from "react";
import { Wifi, Battery, Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function OSMenuBar() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format pathname to a clean app name (e.g. /customers -> Customers)
  const appName = pathname === "/dashboard" 
    ? "Overview" 
    : pathname.split("/")[1]
      ? pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1)
      : "SmartBiz OS";

  return (
    <div className="h-7 w-full neo-pressed bg-[#1e293b]/80 backdrop-blur-md flex items-center justify-between px-4 text-xs font-semibold text-slate-300 z-50 fixed top-0 select-none">
      <div className="flex items-center gap-4">
        <span className="text-blue-400 font-bold tracking-tight">SB</span>
        <span className="font-bold text-white tracking-wide">{appName}</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">File</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">Edit</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">View</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">Window</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">Help</span>
      </div>

      <div className="flex items-center gap-4">
        <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
        <Bell className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline-block">{date}</span>
        <span className="tabular-nums tracking-wide">{time}</span>
      </div>
    </div>
  );
}
