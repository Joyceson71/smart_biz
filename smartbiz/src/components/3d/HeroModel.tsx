"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles, Sphere } from "@react-three/drei";
import * as THREE from "three";

export default function HeroModel() {
  const groupRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  // Smooth mouse tracking variables
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    // 1. Base constant rotation for life
    if (outerGlassRef.current) {
      outerGlassRef.current.rotation.x += delta * 0.1;
      outerGlassRef.current.rotation.y += delta * 0.15;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x -= delta * 0.2;
      innerCoreRef.current.rotation.y += delta * 0.3;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.05;
      ringsRef.current.rotation.x += delta * 0.1;
    }

    // 2. Buttery smooth mouse parallax
    // state.pointer is -1 to 1
    targetRotation.current.x = (state.pointer.y * Math.PI) / 3;
    targetRotation.current.y = (state.pointer.x * Math.PI) / 3;

    // Dampen the rotation for that expensive, heavy feel
    currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 3, delta);
    currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 3, delta);

    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;

      // Slight positional shift for extra 3D depth
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, state.pointer.x * 0.8, 2, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, state.pointer.y * 0.8, 2, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
        
        {/* Ambient floating dust particles */}
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.4} color="#60a5fa" />

        {/* Outer Complex Glass Shell */}
        <mesh ref={outerGlassRef} scale={1.8}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2.5}
            chromaticAberration={1.5} // Extremely high for that rainbow glass edge
            anisotropy={1.5}
            distortion={0.4}
            distortionScale={0.3}
            temporalDistortion={0.1}
            ior={1.33}
            color="#ffffff"
            transmission={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            roughness={0.05}
          />
        </mesh>

        {/* Inner Glowing Energy Core */}
        <mesh ref={innerCoreRef} scale={1.1}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#3b82f6" // Electric Blue
            emissive="#2563eb"
            emissiveIntensity={4}
            wireframe={true}
          />
        </mesh>
        
        {/* Solid Inner Diamond */}
        <mesh scale={0.7}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#a855f7" // Deep Purple
            emissive="#7e22ce"
            emissiveIntensity={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Orbiting Rings for Tech Vibe */}
        <group ref={ringsRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.8, 0.01, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
          </mesh>
          <mesh rotation={[0, Math.PI / 3, 0]}>
            <torusGeometry args={[3.2, 0.01, 16, 100]} />
            <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2} />
          </mesh>
        </group>

      </Float>
    </group>
  );
}
