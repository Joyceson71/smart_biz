"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["⌘", "K"],       desc: "Open Command Palette" },
  { keys: ["?"],             desc: "Open this help modal" },
  { keys: ["⌘", "B"],       desc: "Toggle sidebar / dock" },
  { keys: ["Esc"],           desc: "Close modal / panel" },
  { keys: ["⌘", "N"],       desc: "New Invoice" },
  { keys: ["⌘", "E"],       desc: "Log Expense" },
  { keys: ["⌘", "Shift","R"], desc: "Refresh current data" },
];

export function ShortcutHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") setOpen(prev => !prev);
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-semibold">Keyboard Shortcuts</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-slate-300">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="px-2 py-0.5 text-xs bg-slate-800 border border-white/10 rounded-md text-slate-300 font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Press <kbd className="px-1 bg-slate-800 rounded font-mono">?</kbd> to toggle</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
