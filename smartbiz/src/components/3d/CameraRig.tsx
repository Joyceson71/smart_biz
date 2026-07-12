"use client";

import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

export default function CameraRig() {
  const scroll = useScroll();

  useFrame((state, delta) => {
    // scroll.offset is 0 at top, 1 at bottom
    // We want to fly the camera from Z=5 deep into Z=-38 (so we don't crash into the final object at Z=-45)
    const targetZ = THREE.MathUtils.lerp(5, -38, scroll.offset);
    
    // We also want the camera to slightly drift with the mouse
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    // Smoothly move the camera along the Z axis based on scroll
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);
    
    // Smoothly apply mouse tracking to camera X and Y position for parallax
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mouseX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, mouseY, 4, delta);

    // Look slightly towards the center
    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });

  return null; // This component just controls the camera
}
