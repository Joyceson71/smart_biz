"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export function AICoreOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <div className="w-full h-full min-h-[250px] relative ai-glow rounded-full">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={4} color="#00E5FF" />
        <directionalLight position={[-2, -2, -2]} intensity={4} color="#B026FF" />
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#09090b"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            wireframe={true}
          />
        </Sphere>
      </Canvas>
    </div>
  );
}
