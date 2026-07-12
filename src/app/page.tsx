"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sphere, MeshDistortMaterial, Stars, Grid } from "@react-three/drei";
import Link from "next/link";
import { useRef } from "react";
import * as THREE from "three";
import { ArrowRight, Activity, Globe, Zap } from "lucide-react";

function HeroOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 128, 128]} scale={1.2} position={[0, -1, -3]}>
      <MeshDistortMaterial
        color="#0ea5e9"
        emissive="#0284c7"
        emissiveIntensity={1}
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.9}
        wireframe={true}
      />
    </Sphere>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <HeroOrb />
          <Grid infiniteGrid fadeDistance={20} cellColor="#1e293b" sectionColor="#334155" position={[0, -2, 0]} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SmartBiz</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
              Log in
            </Link>
            <Link href="/register" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.main 
          style={{ y, opacity }}
          className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Introducing the Business Operating System
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-2xl"
          >
            One Platform.<br />Infinite Scale.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl font-light leading-relaxed"
          >
            Not a dashboard. Not a CRM. An intelligent operating system that manages, analyzes, and grows your enterprise using autonomous AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Link 
              href="/register" 
              className="group flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-950 font-medium text-lg hover:bg-blue-50 transition-colors"
            >
              Enter the Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.main>

        {/* Feature Highlights */}
        <div className="bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "Global Intelligence", desc: "Real-time sync across your entire supply chain." },
                { icon: Activity, title: "Predictive Analytics", desc: "Forecast revenue drops before they happen." },
                { icon: Zap, title: "Neural Automation", desc: "Automate invoice chasing and expense tracking." },
              ].map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  key={i} 
                  className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/30 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
