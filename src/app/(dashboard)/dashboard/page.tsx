"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Activity, DollarSign, Users, CreditCard } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.3} />
        {/* Core */}
        <Sphere args={[1.9, 32, 32]}>
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
        </Sphere>
      </mesh>
    </Float>
  );
}

function FloatingChartBars() {
  const groupRef = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 12 }, () => Math.random() * 2 + 0.5), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {bars.map((height, i) => {
        const angle = (i / bars.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.5}>
            <Box args={[0.3, height, 0.3]} position={[x, height / 2, z]}>
              <meshStandardMaterial 
                color={height > 2 ? "#10b981" : "#3b82f6"} 
                emissive={height > 2 ? "#059669" : "#2563eb"}
                emissiveIntensity={0.5}
                roughness={0.2}
                transparent
                opacity={0.8}
              />
            </Box>
          </Float>
        );
      })}
    </group>
  );
}

const STATS = [
  { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-950/30 border-emerald-500/20" },
  { label: "Active Nodes", value: "2,350", icon: Users, color: "text-blue-400", bg: "bg-blue-950/30 border-blue-500/20" },
  { label: "Outstanding", value: "124", icon: CreditCard, color: "text-orange-400", bg: "bg-orange-950/30 border-orange-500/20" },
  { label: "System Health", value: "99.9%", icon: Activity, color: "text-purple-400", bg: "bg-purple-950/30 border-purple-500/20" }
];

function DesktopCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
        
        <Globe />
        <FloatingChartBars />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.2} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 3}
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
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
            Command Center
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-1 uppercase tracking-widest">
            System Status: Nominal • Location: Alpha Base
          </p>
        </motion.div>

        {/* Floating Metrics HUD */}
        <div className="grid grid-cols-4 gap-6 mt-auto pointer-events-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className={`p-6 rounded-2xl backdrop-blur-xl border ${stat.bg} shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-900/50 shadow-inner ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
