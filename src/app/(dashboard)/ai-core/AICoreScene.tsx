"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { BlendFunction } from "postprocessing";

function AIBrain({ isThinking }: { isThinking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (materialRef.current) {
      // Pulse speed based on thinking state
      const targetSpeed = isThinking ? 5 : 1;
      const targetDistort = isThinking ? 0.6 : 0.3;
      
      if (materialRef.current) {
        materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed || 1, targetSpeed, 0.05);
        materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort || 0.3, targetDistort, 0.05);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[2, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          ref={materialRef}
          color={isThinking ? "#c084fc" : "#3b82f6"}
          emissive={isThinking ? "#a855f7" : "#2563eb"}
          emissiveIntensity={1.5}
          distort={0.3}
          speed={1}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </Sphere>
      
      {/* Inner solid core */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial 
          color="#000000" 
          emissive={isThinking ? "#4c1d95" : "#1e3a8a"} 
          emissiveIntensity={0.5} 
          roughness={0.1} 
        />
      </Sphere>
    </Float>
  );
}

export default function AICoreScene() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage({ content: input, role: "user" } as any);
    setInput("");
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full h-full relative flex rounded-xl overflow-hidden bg-slate-950">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#8b5cf6" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
          
          <AIBrain isThinking={isLoading} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Chat Interface */}
      <div className="absolute top-0 right-0 bottom-0 w-full md:w-[450px] bg-slate-900/40 backdrop-blur-3xl border-l border-slate-700/50 shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3 bg-slate-950/20">
          <div className="relative">
            <Bot className="w-6 h-6 text-purple-400" />
            {isLoading && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wider">AI COMMAND CENTER</h2>
            <p className="text-xs text-slate-400">System Online. Connected to Database.</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50"
              >
                <Sparkles className="w-12 h-12 text-slate-500" />
                <p className="text-slate-400 text-sm max-w-[250px]">
                  I am connected to your enterprise database. Ask me about inventory, customers, or revenue.
                </p>
              </motion.div>
            )}
            
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {messages.map((message: any) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-purple-600/30 border border-purple-500/50'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-300" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800/80 text-slate-200 rounded-tl-sm border border-slate-700/50'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-300 animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-800/80 text-slate-400 rounded-tl-sm border border-slate-700/50 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-950/40 border-t border-slate-700/50">
          <form onSubmit={handleSubmit} className="relative">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Query system..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
