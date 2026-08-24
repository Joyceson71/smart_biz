"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import { addInventoryItem } from "./actions";

// Shared geometries for performance optimization
const crateGeometry = new THREE.BoxGeometry(1, 1, 1);
const wireframeGeometry = new THREE.BoxGeometry(1.05, 1.05, 1.05);

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
  
  const { invalidate } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y = 0.2;
        meshRef.current.position.y = 0.7;
      } else {
        meshRef.current.rotation.y = 0;
        meshRef.current.position.y = 0.5;
      }
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
      <mesh ref={meshRef as React.RefObject<THREE.Mesh>} geometry={crateGeometry}>
        <meshStandardMaterial 
          color="#0f172a" 
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Holographic glowing wireframe */}
      <mesh geometry={wireframeGeometry} position={[0, 0, 0]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={isSelected ? 0.4 : 0.1} />
      </mesh>
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
          dpr={[1, 1.2]}
          frameloop="demand"
          gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
        >
          <fog attach="fog" args={['#020617', 5, 30]} />
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
            makeDefault
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.7} mipmapBlur intensity={1.0} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto w-full md:w-auto">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Package className="w-6 h-6 text-blue-500" />
              Virtual Warehouse
            </h1>
            <p className="text-xs text-blue-400 mt-1 font-mono uppercase tracking-widest">Real-time 3D inventory tracking</p>
          </div>

          <div className="relative pointer-events-auto w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search SKU or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-2xl"
            />
          </div>
        </div>

        {/* Selected Item Panel */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[90vw] sm:w-96 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 pointer-events-auto overflow-hidden"
            >
              {/* Subtle radial glow inside the panel */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-white text-2xl tracking-tight">{selectedItem.name}</h3>
                  <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mt-1">{selectedItem.sku}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  selectedItem.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 
                  selectedItem.status === 'Low' ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedItem.status === 'Healthy' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">In Stock</p>
                  <p className="text-4xl font-bold text-white tracking-tight">{selectedItem.stock}</p>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">Status</p>
                  <p className={`text-xl font-bold tracking-tight ${
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
                className="relative z-10 w-full mt-6 bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-widest py-3 rounded-xl transition-colors border border-white/10 hover:border-white/20"
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
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-[90vw] sm:w-[500px] max-h-[90vh] overflow-y-auto bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-white text-2xl tracking-tight">Add Stock Item</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Item Name</label>
                    <input name="name" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">SKU</label>
                    <input name="sku" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Purchase Price (₹)</label>
                    <input name="purchase_price" type="number" required defaultValue="0" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Selling Price (₹)</label>
                    <input name="selling_price" type="number" required defaultValue="0" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Quantity</label>
                    <input name="stock" type="number" required defaultValue="0" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Reorder Level</label>
                    <input name="min_stock" type="number" required defaultValue="10" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-widest text-sm py-3 rounded-xl transition-all mt-6 shadow-lg shadow-blue-500/25 disabled:opacity-50"
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
          className="absolute bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] pointer-events-auto transition-transform hover:scale-110"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
