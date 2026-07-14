"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import { addInventoryItem } from "./actions";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  status: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
}

function InventoryCrate({ data, isSelected, onClick }: { data: InventoryItem, isSelected: boolean, onClick: (data: InventoryItem) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Colors based on status
  const color = data.stock < 10 ? '#ef4444' : 
                data.stock < 50 ? '#f59e0b' : '#10b981';
  
  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 2 + data.pos_x) * 0.1;
    }
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group 
      position={[data.pos_x, 0.5, data.pos_z]}
      onClick={(e) => { e.stopPropagation(); onClick(data); }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Base Crate */}
      <Box ref={meshRef} args={[1, 1, 1]}>
        <meshStandardMaterial 
          color="#0f172a" 
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Box>
      
      {/* Holographic glowing wireframe */}
      <Box args={[1.05, 1.05, 1.05]} position={[0, 0, 0]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={isSelected ? 0.4 : 0.1} />
      </Box>
    </group>
  );
}

function WarehouseFloor() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Dark Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#020617" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Sci-Fi Grid Line Overlay */}
      <gridHelper args={[50, 50, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />
    </group>
  );
}

export default function InventoryScene({ initialInventory }: { initialInventory: InventoryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredInventory = useMemo(() => {
    return initialInventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialInventory]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 5, 12], fov: 45 }} 
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
          
          <WarehouseFloor />
          
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

          <EffectComposer>
            <Bloom luminanceThreshold={0.7} mipmapBlur intensity={1.0} />
          </EffectComposer>
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
        {/* Add Inventory Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-lg">Add Stock Item</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form 
                action={async (formData) => {
                  setIsSubmitting(true);
                  try {
                    await addInventoryItem(formData);
                    setShowAddForm(false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Item Name</label>
                    <input name="name" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">SKU</label>
                    <input name="sku" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Purchase Price (₹)</label>
                    <input name="purchase_price" type="number" required defaultValue="0" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Selling Price (₹)</label>
                    <input name="selling_price" type="number" required defaultValue="0" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Quantity</label>
                    <input name="quantity" type="number" required defaultValue="0" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Reorder Level</label>
                    <input name="reorder_level" type="number" required defaultValue="10" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add to Warehouse"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="absolute bottom-6 left-6 w-12 h-12 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 pointer-events-auto transition-transform hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
