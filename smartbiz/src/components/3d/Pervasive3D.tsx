"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

interface Pervasive3DProps {
  scrollYProgress: MotionValue<number>;
}

export default function Pervasive3D({ scrollYProgress }: Pervasive3DProps) {
  // References for the 3 distinct 3D moments
  const heroRef = useRef<THREE.Group>(null);
  const bentoRef = useRef<THREE.Group>(null);
  const footerRef = useRef<THREE.Group>(null);
  
  // Meshes for rotation
  const heroKnotRef = useRef<THREE.Mesh>(null);
  const aiCoreRef = useRef<THREE.Mesh>(null);
  const cashBarRef = useRef<THREE.Mesh>(null);
  const footerCoreRef = useRef<THREE.Mesh>(null);

  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const scroll = scrollYProgress.get(); // 0 to 1

    // 1. Mouse Parallax (Global)
    targetRotation.current.x = (state.pointer.y * Math.PI) / 4;
    targetRotation.current.y = (state.pointer.x * Math.PI) / 4;
    currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 3, delta);
    currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 3, delta);

    // ── HERO OBJECT (0.0 to 0.3) ──
    if (heroRef.current && heroKnotRef.current) {
      heroKnotRef.current.rotation.x += delta * 0.2;
      heroKnotRef.current.rotation.y += delta * 0.3;

      // Base position at right side. As scroll increases to 0.3, it flies UP and scales DOWN.
      const heroY = THREE.MathUtils.lerp(0, 10, scroll * 3);
      const heroScale = THREE.MathUtils.lerp(1, 0, Math.min(scroll * 3, 1));
      
      heroRef.current.position.y = THREE.MathUtils.damp(heroRef.current.position.y, heroY, 4, delta);
      heroRef.current.scale.setScalar(THREE.MathUtils.damp(heroRef.current.scale.x, heroScale, 4, delta));
      heroRef.current.rotation.x = currentRotation.current.x;
      heroRef.current.rotation.y = currentRotation.current.y;
    }

    // ── BENTO OBJECTS (0.3 to 0.7) ──
    if (bentoRef.current && aiCoreRef.current && cashBarRef.current) {
      aiCoreRef.current.rotation.y += delta * 0.5;
      aiCoreRef.current.rotation.z += delta * 0.2;
      cashBarRef.current.rotation.y -= delta * 0.3;

      // They start low (Y=-10) and rise into view around scroll 0.4
      let bentoY = -10;
      if (scroll > 0.2 && scroll < 0.8) {
        // Peak visibility at scroll 0.5
        bentoY = THREE.MathUtils.lerp(-5, 5, (scroll - 0.2) / 0.6); 
      } else if (scroll >= 0.8) {
        bentoY = 10; // Fly away up
      }

      bentoRef.current.position.y = THREE.MathUtils.damp(bentoRef.current.position.y, bentoY, 3, delta);
      bentoRef.current.rotation.x = currentRotation.current.x * 0.5;
      bentoRef.current.rotation.y = currentRotation.current.y * 0.5;
    }

    // ── FOOTER OBJECT (0.7 to 1.0) ──
    if (footerRef.current && footerCoreRef.current) {
      footerCoreRef.current.rotation.x += delta * 0.1;
      footerCoreRef.current.rotation.y += delta * 0.4;
      
      // Pulse effect based on time
      const scaleBase = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Rises from bottom (Y=-10) to center (Y=0) at scroll 0.9+
      let footerY = -10;
      if (scroll > 0.7) {
        footerY = THREE.MathUtils.lerp(-10, 0, (scroll - 0.7) / 0.3);
      }

      footerRef.current.position.y = THREE.MathUtils.damp(footerRef.current.position.y, footerY, 2, delta);
      footerRef.current.scale.setScalar(scaleBase);
    }
  });

  return (
    <group>
      {/* ── Moment 1: Hero (Right side) ── */}
      <group ref={heroRef} position={[3, 0, -2]}>
        <Float speed={3} rotationIntensity={1} floatIntensity={2}>
          <mesh ref={heroKnotRef}>
            <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
            <MeshTransmissionMaterial
              backside
              thickness={1.5}
              chromaticAberration={1.2}
              ior={1.4}
              color="#3b82f6" // Blue
              transmission={1}
              roughness={0.05}
            />
          </mesh>
        </Float>
      </group>

      {/* ── Moment 2: Bento Features (Left and Right) ── */}
      <group ref={bentoRef} position={[0, -10, -5]}>
        {/* AI Core (Left) */}
        <Float speed={2} floatIntensity={1.5} position={[-4, 0, 0]}>
          <mesh ref={aiCoreRef} scale={1.2}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={2} wireframe />
            <mesh scale={0.5}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
            </mesh>
          </mesh>
        </Float>
        
        {/* Cashflow Chart (Right) */}
        <Float speed={1.5} floatIntensity={1} position={[4, -1, 0]}>
          <mesh ref={cashBarRef}>
            <boxGeometry args={[1, 3, 1]} />
            <meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={1.5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[-1.5, -0.5, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.5} />
          </mesh>
        </Float>
      </group>

      {/* ── Moment 3: Footer Final CTA (Center) ── */}
      <group ref={footerRef} position={[0, -10, -3]}>
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={footerCoreRef}>
            <sphereGeometry args={[2, 64, 64]} />
            <MeshTransmissionMaterial
              backside
              thickness={3}
              chromaticAberration={2} // Very high prism effect
              ior={1.5}
              color="#ffffff"
              transmission={1}
              roughness={0}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.2}
            />
            {/* Inner intense light */}
            <mesh scale={0.8}>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={5} wireframe />
            </mesh>
          </mesh>
        </Float>
      </group>

    </group>
  );
}
