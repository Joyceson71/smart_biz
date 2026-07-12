"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Html } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { DollarSign, Wallet, TrendingUp } from "lucide-react";
import * as THREE from "three";

// Generate mock data for a 3D bar chart (e.g. revenue over time for different product lines)
const DATA_SETS = {
  q1: [
    [2, 3, 1, 4],
    [5, 2, 3, 2],
    [1, 4, 2, 5]
  ],
  q2: [
    [4, 5, 2, 6],
    [3, 4, 5, 3],
    [2, 6, 3, 8]
  ]
};

function AnimatedBar({ position, height, color, label, val }: { position: [number, number, number], height: number, color: string, label: string, val: number }) {
  const [hovered, setHovered] = useState(false);
  
  const { scaleY, posY } = useSpring({
    scaleY: Math.max(0.1, height),
    posY: Math.max(0.1, height) / 2,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <a.mesh 
        position-y={posY} 
        scale-y={scaleY}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </a.mesh>
      
      {/* Base Grid Square */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {hovered && (
        <Html position={[0, height + 0.5, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
             <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</div>
             <div className="font-bold text-white text-lg">${(val * 10).toFixed(1)}k</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ChartScene({ dataSet }: { dataSet: number[][] }) {
  const colors = ["#00E5FF", "#B026FF", "#10b981"];
  const rows = dataSet.length;
  const cols = dataSet[0].length;

  return (
    <group position={[-cols / 2 + 0.5, 0, -rows / 2 + 0.5]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {dataSet.map((row, z) => 
        row.map((val, x) => (
          <AnimatedBar 
            key={`${x}-${z}`} 
            position={[x, 0, z]} 
            height={val} 
            color={colors[z % colors.length]} 
            label={`Category ${z + 1} - Month ${x + 1}`}
            val={val}
          />
        ))
      )}

      {/* Axis Lines */}
      <gridHelper args={[10, 10, "#ffffff", "#333333"]} position={[cols/2 -0.5, 0, rows/2 - 0.5]} />
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.2} 
      />
    </group>
  );
}

export default function SpatialFinance() {
  const [activeQuarter, setActiveQuarter] = useState<"q1" | "q2">("q1");

  return (
    <div className="relative w-full h-full bg-[#040406] flex flex-col">
      {/* 2D Overlay HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
               <TrendingUp className="text-emerald-400" /> Spatial Analytics
            </h2>
            <p className="text-white/60">3D Interactive Data Visualization.</p>
          </div>
          
          <div className="pointer-events-auto flex gap-3">
            <button 
              onClick={() => setActiveQuarter("q1")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeQuarter === 'q1' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Q1
            </button>
            <button 
              onClick={() => setActiveQuarter("q2")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeQuarter === 'q2' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Q2
            </button>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto max-w-3xl">
          {[
            { label: "Revenue", value: "$124.5k", color: "text-emerald-400" },
            { label: "Expenses", value: "$42.1k", color: "text-red-400" },
            { label: "Profit Margin", value: "66%", color: "text-[#00E5FF]" }
          ].map((kpi, i) => (
             <div key={i} className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col hover:border-white/30 transition-colors">
                <span className="text-xs text-white/50 uppercase tracking-widest mb-1">{kpi.label}</span>
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
             </div>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 cursor-move pt-[150px]">
        <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
           <ChartScene dataSet={DATA_SETS[activeQuarter]} />
        </Canvas>
      </div>
    </div>
  );
}
