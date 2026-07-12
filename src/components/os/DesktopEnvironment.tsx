"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { OSWindow } from "./Window";
import { AnimatePresence } from "framer-motion";

export function DesktopEnvironment() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      <AnimatePresence>
        {windows.map((w) => (
          <OSWindow key={w.id} windowData={w} />
        ))}
      </AnimatePresence>
    </div>
  );
}
