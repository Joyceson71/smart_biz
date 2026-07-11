"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { motion } from "framer-motion";
import Scene from "@/components/3d/Scene";
import HeroModel from "@/components/3d/HeroModel";

export default function LandingPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 font-sans overflow-hidden">
      
      {/* ── Subtle Background Grid for Tech Vibe ── */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* ── Fixed 3D Background (Pointer Events active to track mouse) ── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene>
          <HeroModel />
        </Scene>
      </div>
      
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 md:px-16 pointer-events-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            SB
          </div>
          <span className="font-semibold text-xl tracking-tight text-white/90">SmartBiz</span>
        </div>
        <div className="flex items-center gap-8 pointer-events-auto">
          <Link href={ROUTES.LOGIN} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Log In
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="relative overflow-hidden group text-sm bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full hover:scale-105 transition-all duration-300 font-medium backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-blue-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>
      </motion.nav>

      {/* ── Asymmetrical Dribbble Layout ─────────────────────────────────── */}
      <div className="relative z-10 w-full h-screen pointer-events-none flex flex-col justify-between p-8 md:p-16">
        
        {/* Top Left Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 max-w-sm"
        >
          <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
            Next-Gen Platform
          </p>
          <p className="text-lg text-white/50 leading-relaxed font-light">
            An entire suite of AI-driven tools wrapped in one beautiful interface. OCR invoicing, conversational data analysis, and predictive cash flow.
          </p>
        </motion.div>

        {/* Massive Center-Right Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 text-right"
        >
          <h1 className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-[0.85] select-none">
            <span className="block text-white/90 drop-shadow-2xl">Intelligent.</span>
            <span className="block font-light italic bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Business.
            </span>
          </h1>
        </motion.div>

        {/* Bottom Floating Glass Cards (Features) */}
        <div className="flex flex-col md:flex-row items-end justify-between w-full gap-8 pointer-events-auto">
          
          <div className="flex gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group w-44 h-44 md:w-56 md:h-56 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-blue-500/50 hover:bg-blue-900/20 transition-all duration-500 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:bg-blue-500/20 transition-transform">
                01
              </div>
              <div>
                <h3 className="font-semibold text-white/90 text-lg md:text-xl">OCR Invoicing</h3>
                <p className="text-sm text-white/40 mt-1 font-light">Zero manual entry</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group w-44 h-44 md:w-56 md:h-56 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:bg-purple-900/20 transition-all duration-500 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:bg-purple-500/20 transition-transform">
                02
              </div>
              <div>
                <h3 className="font-semibold text-white/90 text-lg md:text-xl">AI Assistant</h3>
                <p className="text-sm text-white/40 mt-1 font-light">Chat with your data</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1, type: "spring" }}
            className="hidden md:block"
          >
            <Link
              href={ROUTES.REGISTER}
              className="group relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.8)]"
            >
              <div className="absolute inset-1 rounded-full bg-black/20 backdrop-blur-sm group-hover:bg-black/0 transition-colors duration-500" />
              <span className="relative z-10 text-sm font-semibold tracking-wider uppercase group-hover:rotate-12 transition-transform duration-500">
                Explore
              </span>
            </Link>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
