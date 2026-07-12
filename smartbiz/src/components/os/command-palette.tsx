"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Calculator, Calendar, FileText, Settings, Bot, Users } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useWindowStore } from "@/stores/useWindowStore";

export function CommandPalette() {
  const { globalSearchOpen, closeGlobalSearch, toggleGlobalSearch } = useUIStore();
  const { openWindow } = useWindowStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleGlobalSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleGlobalSearch]);

  if (!globalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={closeGlobalSearch}>
      <Command 
        className="w-full max-w-2xl bg-[#0f0f11] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="w-5 h-5 text-white/40 mr-3" />
          <Command.Input 
            autoFocus
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent py-4 outline-none text-white placeholder:text-white/40 font-medium"
          />
          <div className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">ESC</div>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="p-6 text-center text-white/50">No results found.</Command.Empty>

          <Command.Group heading={<div className="px-2 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Spatial Modules</div>}>
            <Command.Item 
              onSelect={() => { openWindow("finance", "Spatial Analytics", "SpatialFinance"); closeGlobalSearch(); }}
              className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-[#00E5FF]/10 aria-selected:text-[#00E5FF] text-white/80 transition-colors"
            >
              <Calculator className="w-4 h-4 mr-3" /> Spatial Analytics
            </Command.Item>
            <Command.Item 
              onSelect={() => { openWindow("inventory", "Virtual Warehouse", "Warehouse3D"); closeGlobalSearch(); }}
              className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-[#10b981]/10 aria-selected:text-[#10b981] text-white/80 transition-colors"
            >
              <FileText className="w-4 h-4 mr-3" /> Virtual Warehouse
            </Command.Item>
            <Command.Item 
              onSelect={() => { openWindow("customers", "Business Network", "CustomerNetwork3D"); closeGlobalSearch(); }}
              className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white/80 transition-colors"
            >
              <Users className="w-4 h-4 mr-3" /> Business Network
            </Command.Item>
            <Command.Item 
              onSelect={() => { openWindow("ai-core", "AI Command Center", "AICore"); closeGlobalSearch(); }}
              className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-[#B026FF]/20 aria-selected:text-[#B026FF] text-white/80 transition-colors"
            >
              <Bot className="w-4 h-4 mr-3" /> JARVIS AI Core
            </Command.Item>
          </Command.Group>

          <Command.Group heading={<div className="px-2 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider mt-4">Quick Actions</div>}>
            <Command.Item className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white/80 transition-colors">
              <FileText className="w-4 h-4 mr-3" /> Create new Invoice
            </Command.Item>
            <Command.Item className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white/80 transition-colors">
              <Calendar className="w-4 h-4 mr-3" /> Schedule Report
            </Command.Item>
            <Command.Item className="flex items-center px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white/80 transition-colors">
              <Settings className="w-4 h-4 mr-3" /> System Preferences
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
