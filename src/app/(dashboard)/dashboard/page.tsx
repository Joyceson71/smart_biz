"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Activity, DollarSign, Users, CreditCard } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[0, -0.5, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.15} />
        {/* Core */}
        <Sphere args={[1.9, 32, 32]}>
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
        </Sphere>
        {/* Outer Atmosphere */}
        <Sphere args={[2.1, 32, 32]}>
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.03} />
        </Sphere>
      </mesh>
    </Float>
  );
}

function FloatingChartBars() {
  const groupRef = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 12 }, () => Math.random() * 2.5 + 0.5), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {bars.map((height, i) => {
        const angle = (i / bars.length) * Math.PI * 2;
        const radius = 3.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Box args={[0.2, height, 0.2]} position={[x, height / 2, z]}>
              <meshStandardMaterial 
                color={height > 2 ? "#10b981" : "#8b5cf6"} 
                emissive={height > 2 ? "#059669" : "#6d28d9"}
                emissiveIntensity={0.8}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </Box>
          </Float>
        );
      })}
    </group>
  );
}

const STATS = [
  { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]" },
  { label: "Active Nodes", value: "2,350", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]" },
  { label: "Outstanding", value: "124", icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]" },
  { label: "System Health", value: "99.9%", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]" }
];

function DesktopCanvas() {
  return (
    <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Canvas camera={{ position: [0, 3, 10], fov: 45 }} dpr={[1, 1.5]} frameloop="demand">
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#e0f2fe" />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />
        
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Globe />
        <FloatingChartBars />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
          makeDefault
        />
      </Canvas>
    </div>
  );
}

export default function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Background - Hidden on Mobile */}
      {!isMobile && <DesktopCanvas />}

      {/* Holographic Overlay UI */}
      <div className="relative z-10 p-8 pointer-events-none flex flex-col h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 drop-shadow-2xl">
            Command Center
          </h1>
          <p className="text-blue-400 font-mono text-xs mt-2 uppercase tracking-[0.2em]">
            System Status: Nominal <span className="text-slate-500 mx-2">•</span> Location: Alpha Base
          </p>
        </motion.div>

        {/* Floating Metrics HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-auto pointer-events-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative overflow-hidden p-6 rounded-2xl bg-slate-900/40 backdrop-blur-2xl border ${stat.border} ${stat.glow} transition-all duration-300 cursor-pointer group`}
            >
              {/* Animated Gradient Background on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-500/10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-xl bg-slate-950/50 shadow-inner border border-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex h-2 w-2 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stat.bg.replace('/10', '')}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${stat.bg.replace('/10', '')}`}></span>
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
