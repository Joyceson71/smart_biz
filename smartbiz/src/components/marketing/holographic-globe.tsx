"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

export default function HolographicGlobe() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random points on a sphere
  const [positions, colors] = useMemo(() => {
    const numPoints = 2000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    
    const colorA = new THREE.Color("#00E5FF");
    const colorB = new THREE.Color("#B026FF");
    
    for (let i = 0; i < numPoints; i++) {
      // Random point on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      const r = 2; // radius
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions.set([x, y, z], i * 3);
      
      // Interpolate color based on y position
      const mixedColor = colorA.clone().lerp(colorB, (y + r) / (2 * r));
      colors.set([mixedColor.r, mixedColor.g, mixedColor.b], i * 3);
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group>
      {/* Outer Point Cloud */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          vertexColors
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Inner faint grid/wireframe */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.05}
        />
      </Sphere>
    </group>
  );
}
