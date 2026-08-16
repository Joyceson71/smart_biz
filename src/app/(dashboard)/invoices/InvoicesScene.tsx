"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, Plane } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, CreditCard, Clock, AlertCircle, X, Download, Plus } from "lucide-react";
import { addInvoice } from "./actions";

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  pos_x: number;
  pos_y: number;
  pos_z: number;
  customerName?: string;
}

function InvoiceDocument({ data, isSelected, onClick }: { data: Invoice, isSelected: boolean, onClick: (data: Invoice) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const color = data.status === 'Paid' ? '#10b981' : 
                data.status === 'Pending' ? '#f59e0b' : '#ef4444';
  
  const emissiveIntensity = isSelected ? 0.8 : 0.2;

  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + data.pos_x) * 0.002;
    }
    if (groupRef.current && isSelected) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  const customerName = data.customerName || "Unknown";

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={groupRef}
        position={new THREE.Vector3(data.pos_x, data.pos_y, data.pos_z)}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh>
          <boxGeometry args={[2, 2.8, 0.1]} />
          <meshStandardMaterial 
            color="#0f172a" 
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Holographic glowing edge */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[2.05, 2.85, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.6 : 0.2} />
        </mesh>
        
        <Text
          position={[0, 0.8, 0.06]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {data.invoice_number}
        </Text>
        
        <Text
          position={[0, 0.3, 0.06]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {customerName}
        </Text>

        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          ${data.amount.toFixed(2)}
        </Text>
      </group>
    </Float>
  );
}

function DataGrid() {
  return (
    <group position={[0, -4, 0]}>
      <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#020617" />
      </Plane>
      <gridHelper args={[40, 40, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />
    </group>
  );
}

export default function InvoicesScene({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter(inv => {
      const customerName = inv.customerName ? inv.customerName.toLowerCase() : "";
      return inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
             customerName.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, initialInvoices]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }} dpr={[1, 1.5]} frameloop="demand">
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
          
          <DataGrid />
          
          {filteredInvoices.map((inv) => (
            <InvoiceDocument 
              key={inv.id} 
              data={inv} 
              isSelected={selectedInvoice?.id === inv.id}
              onClick={setSelectedInvoice}
            />
          ))}
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2 - 0.1}
            minDistance={5}
            maxDistance={25}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <FileText className="w-6 h-6 text-indigo-500" />
              Financial Ledger
            </h1>
            <p className="text-xs text-indigo-400 mt-1 font-mono uppercase tracking-widest">Immersive 3D invoice tracking</p>
          </div>

          <div className="relative pointer-events-auto w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-2xl"
            />
          </div>
        </div>

        {/* Selected Invoice Panel */}
        <AnimatePresence>
          {selectedInvoice && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[90vw] sm:w-96 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 pointer-events-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 flex items-start justify-between mb-6 pr-10">
                <div>
                  <h3 className="font-extrabold text-white text-2xl tracking-tight">{selectedInvoice.invoice_number}</h3>
                  <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest mt-1">{selectedInvoice.customerName || 'Unknown'}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  selectedInvoice.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 
                  selectedInvoice.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 
                  'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {selectedInvoice.status === 'Paid' ? <CreditCard className="w-3 h-3" /> : 
                   selectedInvoice.status === 'Pending' ? <Clock className="w-3 h-3" /> : 
                   <AlertCircle className="w-3 h-3" />}
                  {selectedInvoice.status}
                </div>
              </div>

              <div className="relative z-10 bg-slate-900/50 rounded-2xl p-5 border border-white/5 mb-6 flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Issue Date</p>
                  <p className="text-sm font-bold text-white">{selectedInvoice.date || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Amount Due</p>
                  <p className="text-3xl font-bold tracking-tight text-white">${selectedInvoice.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="relative z-10 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Process Payment
                </button>
                <button className="w-14 bg-white/5 hover:bg-white/10 text-white rounded-xl flex justify-center items-center transition-all border border-white/10 hover:border-white/20">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Add Invoice Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 w-[90vw] sm:w-96 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-white text-2xl tracking-tight">Generate Invoice</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form 
                action={async (formData) => {
                  setIsSubmitting(true);
                  try {
                    await addInvoice(formData);
                    setShowAddForm(false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Amount ($)</label>
                  <input name="amount" type="number" step="0.01" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Due Date</label>
                  <input name="due_date" type="date" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <select name="status" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                    <option value="Pending" className="bg-slate-900">Pending</option>
                    <option value="Paid" className="bg-slate-900">Paid</option>
                    <option value="Overdue" className="bg-slate-900">Overdue</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold uppercase tracking-widest text-sm py-3 rounded-xl transition-all mt-6 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? "Generating..." : "Generate Spatial Invoice"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="absolute bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] pointer-events-auto transition-transform hover:scale-110"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
