"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Grid } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00E5FF"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

export function OSCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 15], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={["#09090b"]} />
        <ambientLight intensity={0.5} />
        
        <ParticleField />
        
        {/* Infinite Grid fading into the distance */}
        <Grid
          position={[0, -5, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#00E5FF"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#B026FF"
          fadeDistance={40}
          fadeStrength={1}
        />
        
        <fog attach="fog" args={["#09090b", 10, 35]} />
      </Canvas>
    </div>
  );
}
