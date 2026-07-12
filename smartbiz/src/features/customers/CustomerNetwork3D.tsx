"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { Users, Filter } from "lucide-react";

const NODES = [
  { id: "me", label: "SmartBiz HQ", type: "core", pos: [0, 0, 0], value: "$0" },
  { id: "c1", label: "Acme Corp", type: "customer", pos: [3, 1, 2], value: "$145k" },
  { id: "c2", label: "Stark Ind.", type: "customer", pos: [-2, -1, 3], value: "$890k" },
  { id: "c3", label: "Wayne Ent.", type: "customer", pos: [1, 2, -3], value: "$22k" },
  { id: "s1", label: "Global Mfg", type: "supplier", pos: [-3, 1, -2], value: "$50k" },
  { id: "s2", label: "Cyberdyne", type: "supplier", pos: [0, -2, -2], value: "$1.2M" },
];

const EDGES = [
  { source: "me", target: "c1", flow: 0.5 },
  { source: "me", target: "c2", flow: 0.8 },
  { source: "me", target: "c3", flow: 0.2 },
  { source: "s1", target: "me", flow: 0.6 },
  { source: "s2", target: "me", flow: 1.0 },
];

function Node({ data }: { data: typeof NODES[0] }) {
  const [hovered, setHovered] = useState(false);
  
  const color = data.type === "core" ? "#00E5FF" : data.type === "customer" ? "#10b981" : "#B026FF";
  const size = data.type === "core" ? 0.6 : 0.3;

  return (
    <group position={data.pos as [number, number, number]}>
      <Sphere 
        args={[size, 32, 32]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Ring indicator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size + 0.1, size + 0.12, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {hovered && (
        <Html position={[0, size + 0.2, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
             <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{data.type}</div>
             <div className="font-bold text-white mb-1">{data.label}</div>
             <div className="text-sm font-medium text-[#00E5FF]">{data.value}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function AnimatedEdge({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  const lineRef = useRef<any>(null);
  const materialRef = useRef<THREE.LineDashedMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.dashOffset -= 0.02;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={color}
      lineWidth={2}
      dashed={true}
    >
      <lineDashedMaterial ref={materialRef} color={color} dashSize={0.2} gapSize={0.2} transparent opacity={0.5} />
    </Line>
  );
}

function NetworkScene() {
  const nodeMap = useMemo(() => {
    const map = new Map();
    NODES.forEach(n => map.set(n.id, new THREE.Vector3(...n.pos)));
    return map;
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00E5FF" />
      
      {/* Nodes */}
      {NODES.map(node => (
        <Node key={node.id} data={node} />
      ))}

      {/* Edges */}
      {EDGES.map((edge, i) => {
        const start = nodeMap.get(edge.source);
        const end = nodeMap.get(edge.target);
        if (!start || !end) return null;
        
        return (
          <AnimatedEdge 
            key={i} 
            start={start} 
            end={end} 
            color={edge.source === "me" ? "#10b981" : "#B026FF"} 
          />
        );
      })}

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  );
}

export default function CustomerNetwork3D() {
  return (
    <div className="relative w-full h-full bg-[#040406] flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <Users className="text-[#B026FF]" /> Business Network
          </h2>
          <p className="text-white/60">Spatial representation of cash flow and entities.</p>
        </div>
        
        <div className="pointer-events-auto flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
            <Filter w={14} h={14} /> Filter Connections
          </button>
        </div>
      </div>

      <div className="flex-1 cursor-move">
        <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
           <NetworkScene />
        </Canvas>
      </div>
    </div>
  );
}
