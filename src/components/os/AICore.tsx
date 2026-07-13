"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Send } from 'lucide-react';

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
          color="#8b5cf6"
          emissive="#a78bfa"
          emissiveIntensity={0.6}
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
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.1} />
      </Sphere>
    </Float>
  );
}

export function AICore() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello. I am analyzing your business metrics.\n\nSales are up 20% this week. However, 43 invoices are currently overdue. Would you like me to send automated reminders?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    const currentInput = input;
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've registered your request: "${currentInput}". I am executing the necessary background tasks across the business modules.`
      }]);
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white rounded-b-xl overflow-hidden shadow-[inset_0_0_100px_rgba(139,92,246,0.1)]">
      <div className="h-48 sm:h-64 relative w-full bg-gradient-to-b from-slate-900 to-slate-950 flex-shrink-0 border-b border-purple-500/10">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <HolographicOrb />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
        
        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
          <p className="text-xs text-purple-400 font-mono uppercase tracking-[0.2em] animate-pulse">
            Neural Core Active • Syncing Data
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-500/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="mb-2 text-xs font-bold text-purple-400 tracking-wider">JARVIS</div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSend} className="mt-auto relative flex-shrink-0 pt-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your business..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 mt-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 p-2 rounded-full text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
