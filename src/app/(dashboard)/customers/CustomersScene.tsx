"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Phone, DollarSign, Activity, X, Plus } from "lucide-react";
import { addCustomer } from "./actions";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  ltv: number;
  status: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
}

function CustomerNode({ data, isSelected, onClick }: { data: Customer, isSelected: boolean, onClick: (data: Customer) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = data.status === 'Active' ? '#10b981' : data.status === 'New' ? '#3b82f6' : '#64748b';
  const emissiveIntensity = isSelected ? 1 : 0.4;
  const scale = isSelected ? 1.5 : (0.8 + (data.ltv / 10000));

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh 
        ref={meshRef} 
        position={new THREE.Vector3(data.pos_x, data.pos_y, data.pos_z)} 
        scale={scale}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={isSelected ? 1 : 0.8}
        />
        {/* Glow halo */}
        <Sphere scale={1.2}>
          <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.3 : 0.1} wireframe />
        </Sphere>
      </mesh>
    </Float>
  );
}

function Connections({ nodes }: { nodes: Customer[] }) {
  // Draw lines from a central virtual point to all nodes
  const centerPos: [number, number, number] = [0, 0, 0];
  
  return (
    <>
      {nodes.map((node, i) => (
        <Line 
          key={i} 
          points={[centerPos, [node.pos_x, node.pos_y, node.pos_z]]} 
          color="#334155" 
          opacity={0.3} 
          transparent 
          lineWidth={1} 
        />
      ))}
    </>
  );
}

export default function CustomersScene({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter(c => 
      c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, initialCustomers]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]} frameloop="demand">
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          
          <Connections nodes={initialCustomers} />
          
          {filteredCustomers.map((customer) => (
            <CustomerNode 
              key={customer.id} 
              data={customer} 
              isSelected={selectedCustomer?.id === customer.id}
              onClick={setSelectedCustomer}
            />
          ))}
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxDistance={20}
            minDistance={3}
            autoRotate={false}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Activity className="w-6 h-6 text-emerald-500" />
              Customer Nexus
            </h1>
            <p className="text-xs text-emerald-400 mt-1 font-mono uppercase tracking-widest">Interactive relationship matrix</p>
          </div>

          <div className="relative pointer-events-auto w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-2xl"
            />
          </div>
        </div>

        {/* Selected Node Panel */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="absolute right-8 bottom-8 w-80 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 pointer-events-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 to-transparent pointer-events-none" />
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner border ${
                  selectedCustomer.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20' :
                  selectedCustomer.status === 'New' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/20' :
                  'bg-slate-700/20 text-slate-400 border-slate-600 shadow-slate-900/50'
                }`}>
                  {selectedCustomer.first_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-xl tracking-tight">{selectedCustomer.first_name} {selectedCustomer.last_name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mt-1 inline-block ${
                    selectedCustomer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    selectedCustomer.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-slate-700/20 text-slate-400 border border-slate-600/50'
                  }`}>
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5 shadow-inner">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  {selectedCustomer.email || 'No email provided'}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5 shadow-inner">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {selectedCustomer.phone || 'No phone provided'}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold tracking-tight text-white bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  LTV: ${selectedCustomer.ltv.toLocaleString()}
                </div>
              </div>
            </motion.div>
          )}

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-96 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-white text-2xl tracking-tight">Add New Node</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form 
                action={async (formData) => {
                  setIsSubmitting(true);
                  try {
                    await addCustomer(formData);
                    setShowAddForm(false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">First Name</label>
                    <input name="first_name" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Last Name</label>
                    <input name="last_name" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Email</label>
                  <input name="email" type="email" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Phone</label>
                  <input name="phone" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Initial LTV ($)</label>
                  <input name="ltv" type="number" defaultValue="0" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold uppercase tracking-widest text-sm py-3 rounded-xl transition-all mt-6 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? "Initializing..." : "Initialize Node"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="absolute bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] pointer-events-auto transition-transform hover:scale-110"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
