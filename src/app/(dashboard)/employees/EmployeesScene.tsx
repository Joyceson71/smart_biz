"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Float, Ring } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Zap, X, Search } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  productivity: number; // 0 to 1
  pos_x: number;
  pos_y: number;
  pos_z: number;
  parent_id: string | null;
}

function EmployeeNode({ data, isSelected, onClick }: { data: Employee, isSelected: boolean, onClick: (data: Employee) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Colors based on department
  const color = data.department === 'Executive' ? '#f59e0b' : 
                data.department === 'Engineering' ? '#3b82f6' : '#10b981';
  
  const emissiveIntensity = isSelected ? 1 : 0.4;
  const scale = isSelected ? 1.2 : 1;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (0.2 + data.productivity * 0.5);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={new THREE.Vector3(data.pos_x, data.pos_y, data.pos_z)}>
        <mesh 
          ref={meshRef} 
          scale={scale}
          onClick={(e) => { e.stopPropagation(); onClick(data); }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Productivity Ring */}
        <Ring 
          args={[0.8 * scale, 0.9 * scale, 32, 1, 0, Math.PI * 2 * data.productivity]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
        </Ring>
        {/* Background Ring */}
        <Ring 
          args={[0.8 * scale, 0.9 * scale, 32]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color="#1e293b" side={THREE.DoubleSide} transparent opacity={0.3} />
        </Ring>
      </group>
    </Float>
  );
}

function OrgConnections({ nodes }: { nodes: Employee[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (!node.parent_id) return null;
        const parent = nodes.find(n => n.id === node.parent_id);
        if (!parent) return null;
        
        return (
          <Line 
            key={i} 
            points={[
              [parent.pos_x, parent.pos_y, parent.pos_z], 
              [node.pos_x, node.pos_y, node.pos_z]
            ]} 
            color="#334155" 
            opacity={0.4} 
            transparent 
            lineWidth={2} 
          />
        );
      })}
    </>
  );
}

export default function EmployeesScene({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialEmployees]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 15], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -5, -10]} color="#3b82f6" intensity={0.5} />
          
          <OrgConnections nodes={initialEmployees} />
          
          {filteredEmployees.map((emp) => (
            <EmployeeNode 
              key={emp.id} 
              data={emp} 
              isSelected={selectedEmployee?.id === emp.id}
              onClick={setSelectedEmployee}
            />
          ))}
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={30}
          />
        </Canvas>
      </div>

      {/* Glassmorphic Overlay UI */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl pointer-events-auto">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Organization Graph
            </h1>
            <p className="text-sm text-slate-400 mt-1">Interactive 3D hierarchical structure</p>
          </div>

          <div className="relative pointer-events-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Selected Node Panel */}
        <AnimatePresence>
          {selectedEmployee && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="absolute right-6 bottom-6 w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 pointer-events-auto"
            >
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-inner border-2 ${
                  selectedEmployee.department === 'Executive' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                  selectedEmployee.department === 'Engineering' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                }`}>
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg leading-tight">{selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-400">{selectedEmployee.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-white">{selectedEmployee.department}</span> Division
                </div>
                
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Productivity
                    </span>
                    <span className="text-sm font-bold text-white">{(selectedEmployee.productivity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${selectedEmployee.productivity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
