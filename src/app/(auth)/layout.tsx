"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden selection:bg-blue-500/30 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="clay-card p-6 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 neo-flat rounded-2xl flex items-center justify-center">
              <span className="text-blue-500 font-bold text-3xl">S</span>
            </div>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
