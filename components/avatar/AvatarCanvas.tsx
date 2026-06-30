"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import ThreeAvatar from "./ThreeAvatar";
import { Loader2 } from "lucide-react";

interface AvatarCanvasProps {
  modelUrl?: string;
  isSpeaking: boolean;
}

export default function AvatarCanvas({ modelUrl = "/avatar.glb", isSpeaking }: AvatarCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-600 dark:text-brand-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase">Loading 3D Companion...</span>
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          className="w-full h-full bg-transparent"
        >
          {/* Studio Lights */}
          <ambientLight intensity={1.8} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.5}
          />
          <pointLight position={[0, -2, 2]} intensity={0.8} />

          {/* 3D Loaded Avatar */}
          <ThreeAvatar url={modelUrl} isSpeaking={isSpeaking} />

          {/* Smooth Controls restricted so the camera cannot flip upside down */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.3}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
