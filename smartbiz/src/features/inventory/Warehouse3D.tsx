"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, RoundedBox, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Plus, Package } from "lucide-react";

// Mock Data
const INVENTORY_DATA = [
  { id: "SKU-9901", name: "Quantum Processor", stock: 12, threshold: 20, value: "$14,400" },
  { id: "SKU-9902", name: "Neural Engine X1", stock: 45, threshold: 10, value: "$22,500" },
  { id: "SKU-9903", name: "Holographic Display", stock: 4, threshold: 15, value: "$3,200" },
  { id: "SKU-9904", name: "Power Cell", stock: 89, threshold: 20, value: "$4,500" },
  { id: "SKU-9905", name: "Titanium Casing", stock: 0, threshold: 50, value: "$0" },
  { id: "SKU-9906", name: "Optical Sensor", stock: 120, threshold: 30, value: "$1,200" },
  { id: "SKU-9907", name: "Cooling Array", stock: 15, threshold: 15, value: "$4,500" },
  { id: "SKU-9908", name: "Flux Capacitor", stock: 2, threshold: 5, value: "$1M" },
];

function BoxItem({ item, position }: { item: typeof INVENTORY_DATA[0], position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const isCritical = item.stock === 0;
  const isLow = item.stock > 0 && item.stock <= item.threshold;
  
  const boxColor = isCritical ? "#ef4444" : isLow ? "#eab308" : "#10b981";
  const emissiveColor = hovered ? boxColor : (isCritical ? "#ff0000" : "#000000");

  useFrame((state) => {
    if (hovered && meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + 0.2, 0.1);
      meshRef.current.rotation.y += 0.01;
    } else if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.8, 0.8, 0.8]} // Width, height, depth
        radius={0.05}
        smoothness={4}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => { e.stopPropagation(); /* Could trigger edit modal here */ }}
      >
        <meshStandardMaterial 
          color="#222" 
          metalness={0.8}
          roughness={0.2}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.5 : (isCritical ? 0.8 : 0)}
        />
        {/* Glowing edge highlight for status */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
          <lineBasicMaterial attach="material" color={boxColor} transparent opacity={0.5} />
        </lineSegments>
      </RoundedBox>

      {hovered && (
        <Html position={[0, 0.8, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
             <div className="text-xs text-white/50 font-mono mb-1">{item.id}</div>
             <div className="font-bold text-white mb-2">{item.name}</div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Stock:</span>
                <span className={`font-bold ${isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {item.stock}
                </span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Value:</span>
                <span className="text-white">{item.value}</span>
             </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function WarehouseScene() {
  // Calculate grid positions for boxes
  const gridPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const cols = 4;
    INVENTORY_DATA.forEach((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      pos.push([(col - 1.5) * 1.5, 0.4, (row - 1) * -1.5]); // Centered grid
    });
    return pos;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      
      {/* Interactive Boxes */}
      {INVENTORY_DATA.map((item, i) => (
        <BoxItem key={item.id} item={item} position={gridPositions[i]} />
      ))}

      {/* Futuristic Floor Grid */}
      <gridHelper args={[20, 20, "#B026FF", "#333333"]} position={[0, 0, 0]} />
      
      {/* Contact Shadows for depth */}
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={3} 
        maxDistance={10} 
      />
    </>
  );
}

export default function Warehouse3D() {
  return (
    <div className="relative w-full h-full bg-[#040406] flex flex-col">
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <Package className="text-[#00E5FF]" /> Virtual Warehouse
          </h2>
          <p className="text-white/60">Interactive 3D spatial inventory representation.</p>
        </div>
        
        {/* Action Buttons (Pointer events enabled) */}
        <div className="pointer-events-auto flex gap-3">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex gap-4 text-sm text-white/60">
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Healthy</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"/> Low</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"/> Critical</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
            <Plus size={16} /> Add Shipment
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 cursor-move">
        <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
           <WarehouseScene />
        </Canvas>
      </div>
    </div>
  );
}
