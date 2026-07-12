"use client";

import { useRef } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Preload } from "@react-three/drei";
import AIOrb from "@/components/marketing/ai-orb";
import HolographicGlobe from "@/components/marketing/holographic-globe";
import { ArrowRight, Bot, Command, Globe, Layers, Zap } from "lucide-react";

export default function CinematicLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero Parallax
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);

  // Section 2 (Problem/Solution) Parallax
  const s2Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.1, 0.2], [100, 0]);

  // Section 3 (Globe) Parallax
  const s3Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);

  return (
    <main ref={containerRef} className="relative w-full bg-[#040406] text-white selection:bg-brand-500/30">
      
      {/* ── Fixed Grid Background ───────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#040406] via-transparent to-[#040406]"></div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 mix-blend-difference pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            SB
          </div>
          <span className="font-semibold text-xl tracking-tight text-white">SmartBiz</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <Link href={ROUTES.LOGIN} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="text-sm bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:scale-105"
          >
            Start Free
          </Link>
        </div>
      </motion.nav>

      <div className="relative z-10 w-full h-[400vh]">
        
        {/* ── Hero Section (0% to 25% Scroll) ──────────────────────────────── */}
        <motion.section 
          style={{ opacity: heroOpacity, y: heroY }}
          className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Environment preset="city" />
              <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <AIOrb />
              </Float>
              <Preload all />
            </Canvas>
          </div>
          
          <div className="relative z-10 text-center max-w-4xl px-6 pointer-events-none mt-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                <span className="text-sm font-medium text-white/80">The Next Gen Business OS</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
                Intelligence for <br/>
                <span className="text-gradient-ai">Modern Business.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl mx-auto mb-10">
                Not a dashboard. Not an ERP. An intelligent operating system designed to run your entire company.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Problem/Solution Story (25% to 50% Scroll) ───────────────────── */}
        <motion.section
          style={{ opacity: s2Opacity, y: s2Y }}
          className="sticky top-0 h-screen flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Break out of the <span className="text-white/40">dashboard matrix.</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed mb-8">
                Traditional software traps you in rigid tables and disconnected tools. SmartBiz introduces a spatial workspace where your data lives, breathes, and connects.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Command, text: "Global Command Palette" },
                  { icon: Layers, text: "Floating Spatial Windows" },
                  { icon: Zap, text: "60FPS Native Performance" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-white/80">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon size={18} className="text-[#00E5FF]" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square rounded-3xl os-panel overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-[#B026FF]/20 opacity-30" />
               <div className="text-center p-8">
                 <Bot size={64} className="mx-auto mb-6 text-[#7C4DFF]" />
                 <h3 className="text-2xl font-bold mb-2">JARVIS for Business</h3>
                 <p className="text-white/50">Ask questions, get insights, automate tasks.</p>
               </div>
            </div>
          </div>
        </motion.section>

        {/* ── Holographic Globe (50% to 75% Scroll) ────────────────────────── */}
        <motion.section
          style={{ opacity: s3Opacity }}
          className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        >
           <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <HolographicGlobe />
              </Float>
            </Canvas>
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6 pointer-events-none bg-black/40 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 shadow-2xl">
            <Globe className="mx-auto mb-6 text-[#00E5FF]" size={48} />
            <h2 className="text-5xl font-bold mb-6">Global Scale, <br/>Local Precision.</h2>
            <p className="text-xl text-white/60 mb-8">
              Map your supply chain, track international invoices, and visualize your business network in real-time 3D.
            </p>
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex pointer-events-auto items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-all"
            >
              Explore Network <ArrowRight size={18} />
            </Link>
          </div>
        </motion.section>
      </div>

      {/* ── Static Footer ────────────────────────────────────────────────── */}
      <footer className="relative z-20 py-32 px-6 md:px-12 border-t border-white/10 bg-[#040406] text-center">
        <h2 className="text-5xl font-bold mb-8">Experience the Future.</h2>
        <Link
          href={ROUTES.REGISTER}
          className="inline-block px-12 py-5 bg-white text-black hover:scale-105 transition-transform rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          Launch OS Workspace
        </Link>
      </footer>
    </main>
  );
}
