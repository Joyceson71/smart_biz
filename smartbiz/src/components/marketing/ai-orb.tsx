"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function AIOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      {/* Core glow */}
      <pointLight position={[0, 0, 0]} intensity={50} color="#B026FF" distance={10} />
      <pointLight position={[2, 2, 2]} intensity={20} color="#00E5FF" distance={10} />
      
      {/* Outer distorted sphere */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#000000"
          emissive="#7C4DFF"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Inner solid sphere */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={1}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </group>
  );
}
