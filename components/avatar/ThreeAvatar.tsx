"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ThreeAvatarProps {
  url: string;
  isSpeaking: boolean;
}

export default function ThreeAvatar({ url, isSpeaking }: ThreeAvatarProps) {
  const avatarUrl = url || "/avatar.glb";
  const { scene } = useGLTF(avatarUrl);
  const avatarRef = useRef<THREE.Group>(null);
  
  // Keep track of bones for idle breathing
  const headRef = useRef<THREE.Object3D | null>(null);
  const spineRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!scene) return;
    
    // Traverse the scene to find key bones
    scene.traverse((child) => {
      if (child.name.toLowerCase().includes("head") && !headRef.current) {
        headRef.current = child;
      }
      if (child.name.toLowerCase().includes("spine") && !spineRef.current) {
        spineRef.current = child;
      }
      
      // Shadow support
      if ((child as THREE.SkinnedMesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Center and scale the avatar
    scene.position.set(0, -3.2, 0);
    scene.scale.set(1.9, 1.9, 1.9);
  }, [scene]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Idle breathing animation (gentle neck/spine sway)
    if (spineRef.current) {
      spineRef.current.rotation.x = Math.sin(time * 1.5) * 0.015;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.04;
      headRef.current.rotation.x = Math.cos(time * 1.2) * 0.01;
    }

    // 2. Empirical viseme lip-sync mimic when assistant is active
    scene.traverse((child) => {
      const mesh = child as THREE.SkinnedMesh;
      if (mesh.isMesh && mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
        // Ready Player Me ARKit morph targets: jawOpen, mouthOpen, mouthClose, etc.
        const jawOpenIdx = mesh.morphTargetDictionary["jawOpen"];
        const mouthOpenIdx = mesh.morphTargetDictionary["mouthOpen"];
        
        if (jawOpenIdx !== undefined) {
          mesh.morphTargetInfluences[jawOpenIdx] = isSpeaking
            ? Math.abs(Math.sin(time * 12)) * 0.45 // Rapid natural talking jaw flutter
            : 0;
        }
        
        if (mouthOpenIdx !== undefined) {
          mesh.morphTargetInfluences[mouthOpenIdx] = isSpeaking
            ? Math.abs(Math.cos(time * 10)) * 0.3
            : 0;
        }
      }
    });
  });

  return <primitive ref={avatarRef} object={scene} />;
}
