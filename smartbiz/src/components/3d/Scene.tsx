"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, ReactNode } from "react";

interface SceneProps {
  children: ReactNode;
  className?: string;
}

export default function Scene({ children, className = "" }: SceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          
          <ambientLight intensity={0.2} color="#0f172a" />
          
          <directionalLight position={[5, 5, 5]} intensity={4} color="#3b82f6" />
          <directionalLight position={[-5, -5, 5]} intensity={3} color="#a855f7" />
          <directionalLight position={[0, 5, -5]} intensity={2} color="#ec4899" />
          
          {children}

        </Suspense>
      </Canvas>
    </div>
  );
}
