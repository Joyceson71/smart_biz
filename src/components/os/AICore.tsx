"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function HolographicOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Pulse the orb slightly
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </Sphere>
      <Sphere scale={1.6}>
        <meshBasicMaterial color="#93c5fd" wireframe transparent opacity={0.1} />
      </Sphere>
    </Float>
  );
}

export function AICore() {
  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white rounded-b-xl overflow-hidden">
      <div className="h-64 relative w-full bg-gradient-to-b from-slate-900 to-slate-950">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <HolographicOrb />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
        
        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
          <p className="text-xs text-blue-400 font-mono uppercase tracking-[0.2em] animate-pulse">
            System Online • Memory Active
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-300">
          <p className="mb-2"><strong className="text-white">JARVIS:</strong> Hello. I am analyzing your business metrics.</p>
          <p>Sales are up 20% this week. However, 43 invoices are currently overdue. Would you like me to send automated reminders?</p>
        </div>
        
        <div className="mt-auto relative">
          <input 
            type="text" 
            placeholder="Ask anything about your business..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
