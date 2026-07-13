"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden selection:bg-blue-500/30">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
        </Canvas>
        {/* Glow effect behind the login card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
