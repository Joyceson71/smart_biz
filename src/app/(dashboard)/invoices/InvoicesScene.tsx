"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, Plane } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, CreditCard, Clock, AlertCircle, X, Download } from "lucide-react";

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  pos_x: number;
  pos_y: number;
  pos_z: number;
  customer?: { first_name: string; last_name: string }; // We might need to join this
}

function InvoiceDocument({ data, isSelected, onClick }: { data: Invoice, isSelected: boolean, onClick: (data: Invoice) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const color = data.status === 'Paid' ? '#10b981' : 
                data.status === 'Pending' ? '#f59e0b' : '#ef4444';
  
  const emissiveIntensity = isSelected ? 0.8 : 0.2;

  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      groupRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 2 + data.pos_x) * 0.002;
    }
    if (groupRef.current && isSelected) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  const customerName = data.customer ? `${data.customer.first_name} ${data.customer.last_name}` : "Unknown";

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

  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter(inv => {
      const customerName = inv.customer ? `${inv.customer.first_name} ${inv.customer.last_name}`.toLowerCase() : "";
      return inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
             customerName.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, initialInvoices]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }} dpr={[1, 1.5]}>
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
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl pointer-events-auto">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Financial Ledger
            </h1>
            <p className="text-sm text-slate-400 mt-1">Immersive 3D invoice tracking</p>
          </div>

          <div className="relative pointer-events-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Selected Invoice Panel */}
        <AnimatePresence>
          {selectedInvoice && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute left-1/2 bottom-8 -translate-x-1/2 w-96 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 pointer-events-auto"
            >
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-xl">{selectedInvoice.invoice_number}</h3>
                  <p className="text-sm text-slate-400 mt-1">{selectedInvoice.customer ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name}` : 'Unknown'}</p>
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

              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-sm font-medium text-slate-300">{selectedInvoice.date || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount Due</p>
                  <p className="text-2xl font-bold text-white">${selectedInvoice.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Process Payment
                </button>
                <button className="w-12 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex justify-center items-center transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
