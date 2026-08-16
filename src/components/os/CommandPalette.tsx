"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, Cpu, Package, Briefcase, Wallet, FileText, Users, Settings, Power, Command } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/(auth)/actions";

type Action = {
  id: string;
  title: string;
  icon: LucideIcon;
  shortcut?: string;
  onSelect: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Auto-focus and reset state when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // Small delay to allow framer-motion to mount the input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const actions: Action[] = [
    { id: "ai-core", title: "AI Command Center", icon: Cpu, onSelect: () => { router.push("/ai-core"); setOpen(false); } },
    { id: "dashboard", title: "Dashboard Overview", icon: LayoutDashboard, shortcut: "D", onSelect: () => { router.push("/dashboard"); setOpen(false); } },
    { id: "inventory", title: "Manage Inventory", icon: Package, shortcut: "I", onSelect: () => { router.push("/inventory"); setOpen(false); } },
    { id: "employees", title: "Organization", icon: Briefcase, onSelect: () => { router.push("/employees"); setOpen(false); } },
    { id: "stocks", title: "Stocks & Assets", icon: Package, onSelect: () => { router.push("/stocks"); setOpen(false); } },
    { id: "expenses", title: "Expenses", icon: Wallet, onSelect: () => { router.push("/expenses"); setOpen(false); } },
    { id: "invoices", title: "Invoices", icon: FileText, onSelect: () => { router.push("/invoices"); setOpen(false); } },
    { id: "customers", title: "Customers", icon: Users, onSelect: () => { router.push("/customers"); setOpen(false); } },
    { id: "settings", title: "System Settings", icon: Settings, shortcut: "S", onSelect: () => { router.push("/settings"); setOpen(false); } },
    { id: "logout", title: "Log Out", icon: Power, onSelect: () => { logout(); setOpen(false); } },
  ];

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredActions.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(filteredActions.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].onSelect();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredActions, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_30px_100px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden z-[201] flex flex-col"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <Search className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 text-lg font-medium"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500">ESC</span>
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="px-4 py-12 text-center text-slate-500">
                  <p>No results found for &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {filteredActions.map((action, index) => (
                    <div
                      key={action.id}
                      onClick={action.onSelect}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? "bg-blue-500 text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <action.icon className={`w-5 h-5 ${index === selectedIndex ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      
                      {/* Optional Shortcut Hint */}
                      {action.shortcut && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${index === selectedIndex ? "bg-white/20 text-white" : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 border border-slate-300/50 dark:border-slate-700/50"}`}>
                          <Command className="w-3 h-3" />
                          <span>{action.shortcut}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">↵</kbd> to select</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">↓</kbd><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">↑</kbd> to navigate</span>
              </div>
              <div className="font-semibold tracking-wider">SMARTBIZ OS</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
