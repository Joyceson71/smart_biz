"use client";

import { usePathname } from "next/navigation";
import { DraggableWindow } from "./DraggableWindow";

export function OSContentArea({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="flex-1 w-full h-full relative">
      <DraggableWindow key={pathname}>
        {children}
      </DraggableWindow>
    </main>
  );
}
