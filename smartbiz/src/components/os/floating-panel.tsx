"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface FloatingPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingPanel({ children, className, delay = 0 }: FloatingPanelProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
      style={{
        perspective: 1200,
      }}
      className={cn("w-full h-full", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="os-panel w-full h-full p-6 relative group transition-colors hover:border-white/10"
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Content transformed forward to create depth */}
        <div style={{ transform: "translateZ(30px)" }} className="h-full flex flex-col">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
