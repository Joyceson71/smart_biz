"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function SpatialExperience() {
  const heroObjRef = useRef<THREE.Mesh>(null);
  const ocrObjRef = useRef<THREE.Group>(null);
  const aiObjRef = useRef<THREE.Mesh>(null);
  const cashObjRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Continuously animate the objects
    if (heroObjRef.current) {
      heroObjRef.current.rotation.x += delta * 0.2;
      heroObjRef.current.rotation.y += delta * 0.3;
    }
    if (ocrObjRef.current) {
      ocrObjRef.current.rotation.y += delta * 0.1;
    }
    if (aiObjRef.current) {
      aiObjRef.current.rotation.x -= delta * 0.2;
      aiObjRef.current.rotation.y += delta * 0.4;
    }
    if (cashObjRef.current) {
      cashObjRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      
      {/* ── STOP 1: Hero Section (Z = 0) ─────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* 3D Tracked HTML for perfect typography and responsiveness */}
        <Html position={[-3, 1, 0]} transform as="div" className="w-[300px] md:w-[500px] pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-xl leading-tight">
            Intelligent <br />
            <span className="text-cyan-400">Business.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 drop-shadow-md">
            Replace disconnected tools with an AI-driven spatial platform. 
            Scroll to enter.
          </p>
        </Html>

        <Float speed={3} rotationIntensity={1} floatIntensity={2}>
          <mesh ref={heroObjRef} position={[2, 0, -2]} scale={1.2}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <MeshTransmissionMaterial
              backside
              thickness={1.5}
              chromaticAberration={1}
              ior={1.4}
              color="#ec4899"
              transmission={1}
              roughness={0.1}
            />
          </mesh>
        </Float>
      </group>


      {/* ── STOP 2: OCR Invoicing (Z = -15) ──────────────────────────────── */}
      <group position={[0, 0, -15]}>
        <Html position={[1.5, 0, 0]} transform as="div" className="w-[300px] md:w-[400px] pointer-events-none">
          <h2 className="text-4xl font-bold text-white mb-3">OCR Invoicing</h2>
          <p className="text-base text-slate-300">
            Upload any invoice—PDF or photo. Our AI extracts all critical line-item data in seconds. Zero manual entry required.
          </p>
        </Html>

        {/* 3D Representation of a Document / Scanner */}
        <Float speed={4} rotationIntensity={2}>
          <group ref={ocrObjRef} position={[-2, 0, -2]}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[3, 4, 0.1]} />
              <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} />
            </mesh>
            {/* Holographic scanning line */}
            <mesh position={[0, 0, 0.1]}>
              <boxGeometry args={[3.2, 0.05, 0.1]} />
              <meshStandardMaterial color="#ffffff" emissive="#22d3ee" emissiveIntensity={2} />
            </mesh>
          </group>
        </Float>
      </group>


      {/* ── STOP 3: AI Assistant (Z = -30) ───────────────────────────────── */}
      <group position={[0, 0, -30]}>
        <Html position={[-4, 0, 0]} transform as="div" className="w-[300px] md:w-[400px] pointer-events-none text-right">
          <h2 className="text-4xl font-bold text-white mb-3">AI Assistant</h2>
          <p className="text-base text-slate-300">
            Chat with your business data in plain English. Ask "Who owes me money?" or "Show top expenses."
          </p>
        </Html>

        <Float speed={3} floatIntensity={2}>
          <mesh ref={aiObjRef} position={[2, 0, -2]} scale={1.2}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color="#a855f7" 
              emissive="#7e22ce" 
              emissiveIntensity={2}
              wireframe 
            />
            {/* Core */}
            <mesh scale={0.5}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
            </mesh>
          </mesh>
        </Float>
      </group>


      {/* ── STOP 4: Cash Flow Forecast (Z = -45) ─────────────────────────── */}
      <group position={[0, 0, -45]}>
        <Html position={[1.5, 0, 0]} transform as="div" className="w-[300px] md:w-[400px] pointer-events-none">
          <h2 className="text-4xl font-bold text-white mb-3">Cash Flow Forecast</h2>
          <p className="text-base text-slate-300">
            See exactly what's coming in and going out for the next 30 days. Never be surprised by cash gaps.
          </p>
        </Html>

        {/* 3D Representation of a Chart */}
        <Float speed={1} rotationIntensity={0.5}>
          <group ref={cashObjRef} position={[-2, -1, -2]}>
            <mesh position={[-1, 0.5, 0]}>
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color="#3b82f6" opacity={0.6} transparent />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[0.5, 2, 0.5]} />
              <meshStandardMaterial color="#8b5cf6" opacity={0.8} transparent />
            </mesh>
            <mesh position={[1, 1.5, 0]}>
              <boxGeometry args={[0.5, 3, 0.5]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} />
            </mesh>
          </group>
        </Float>
      </group>

    </group>
  );
}
