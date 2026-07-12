"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, AlertTriangle, CheckCircle } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  status: string;
  pos: [number, number, number];
}

// Mock Inventory Data
const INVENTORY = [
  { id: 1, name: "Premium Widget A", sku: "WGT-001", stock: 145, status: "Healthy", pos: [-3, 0, -2] },
  { id: 2, name: "Standard Gizmo", sku: "GZM-102", stock: 12, status: "Low", pos: [0, 0, -2] },
  { id: 3, name: "Enterprise Server Rack", sku: "SRV-X9", stock: 4, status: "Critical", pos: [3, 0, -2] },
  { id: 4, name: "Optical Switch", sku: "OPT-44", stock: 89, status: "Healthy", pos: [-3, 0, 2] },
  { id: 5, name: "Copper Cable (100m)", sku: "CBL-CU", stock: 210, status: "Healthy", pos: [0, 0, 2] },
  { id: 6, name: "Power Supply Unit", sku: "PSU-850", stock: 8, status: "Low", pos: [3, 0, 2] },
];

function InventoryCrate({ data, isSelected, onClick }: { data: InventoryItem, isSelected: boolean, onClick: (data: InventoryItem) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Colors based on status
  const color = data.status === 'Healthy' ? '#10b981' : data.status === 'Low' ? '#f59e0b' : '#ef4444';
  const emissiveIntensity = isSelected ? 0.8 : 0.3;

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={meshRef} 
        position={new THREE.Vector3(...data.pos)}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={0.9}
        />
        {/* Wireframe outline for tech aesthetic */}
        <Box args={[1.55, 1.55, 1.55]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={isSelected ? 0.6 : 0.2} />
        </Box>
        
        {/* Holographic label */}
        {isSelected && (
          <Html position={[0, 1.2, 0]} center className="pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-white whitespace-nowrap shadow-xl">
              {data.sku}
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="#0f172a" transparent opacity={0.8} />
      <gridHelper args={[50, 50, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />
    </mesh>
  );
}

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = useMemo(() => {
    return INVENTORY.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
          
          <GridFloor />
          
          {filteredInventory.map((item) => (
            <InventoryCrate 
              key={item.id} 
              data={item} 
              isSelected={selectedItem?.id === item.id}
              onClick={setSelectedItem}
            />
          ))}
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2 - 0.1}
            minDistance={4}
            maxDistance={25}
          />
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl pointer-events-auto">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Virtual Warehouse
            </h1>
            <p className="text-sm text-slate-400 mt-1">Real-time 3D inventory tracking</p>
          </div>

          <div className="relative pointer-events-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search SKU or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Selected Item Panel */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute left-1/2 bottom-8 -translate-x-1/2 w-96 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 pointer-events-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedItem.name}</h3>
                  <p className="text-sm font-mono text-slate-400">{selectedItem.sku}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  selectedItem.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 
                  selectedItem.status === 'Low' ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedItem.status === 'Healthy' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">In Stock</p>
                  <p className="text-3xl font-bold text-white">{selectedItem.stock}</p>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className={`text-lg font-medium ${
                    selectedItem.status === 'Healthy' ? 'text-emerald-400' : 
                    selectedItem.status === 'Low' ? 'text-amber-400' : 
                    'text-red-400'
                  }`}>
                    {selectedItem.status}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Close Details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
