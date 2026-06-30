"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { Sparkles, Activity, User, AlertCircle } from "lucide-react";
import AvatarCanvas from "./AvatarCanvas";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

interface MoodConfig {
  title: string;
  sub: string;
  colorClass: string;
  glowClass: string;
}

// Reusable 2D Zen Aura Graphic Component
function ZenAura({ config, isGenerating }: { config: MoodConfig; isGenerating: boolean }) {
  return (
    <motion.div
      key="2d-mesh"
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative w-36 h-36 md:w-68 md:h-68 flex items-center justify-center"
    >
      {/* Ambient blur backdrops */}
      <div className="absolute inset-0 bg-indigo-500/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />

      {/* Soft rotating outer rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-dashed border-slate-300/50 dark:border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] pointer-events-none"
      />

      {/* Breathing Inner Orbit */}
      <motion.div
        animate={{
          scale: isGenerating ? [1, 1.08, 1] : [1, 1.04, 1],
        }}
        transition={{
          duration: isGenerating ? 3 : 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative w-24 h-24 md:w-44 md:h-44 rounded-full bg-gradient-to-tr ${config.colorClass} shadow-xl dark:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center p-1`}
      >
        <div className="w-full h-full rounded-full bg-bg-base dark:bg-[#05050A] flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
          <motion.div
            animate={{
              y: isGenerating ? [-5, 5, -5] : [-12, 12, -12],
              x: isGenerating ? [5, -5, 5] : [-8, 8, -8],
            }}
            transition={{
              duration: isGenerating ? 2 : 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute w-16 h-16 md:w-28 md:h-28 rounded-full bg-gradient-to-bl ${config.colorClass} opacity-20 dark:opacity-35 blur-xl`}
          />

          {isGenerating ? (
            <img src="/icon-transparent.svg" alt="Luna Sakha" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse" />
          ) : (
            <img src="/icon-transparent.svg" alt="Luna Sakha" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function InteractiveAvatar() {
  const { isGenerating, selectedMood } = useChatStore();
  const [use3D, setUse3D] = useState(true);

  const getMoodConfig = (): MoodConfig => {
    switch (selectedMood) {
      case "stressed":
        return {
          title: "Soothe Helper",
          sub: "Absorbing stress... calming aura active",
          colorClass: "from-indigo-400 via-violet-500 to-purple-600",
          glowClass: "shadow-indigo-500/20",
        };
      case "anxious":
        return {
          title: "Steadying Companion",
          sub: "Emitting safe, warm resonance frequency",
          colorClass: "from-fuchsia-400 via-pink-500 to-rose-400",
          glowClass: "shadow-pink-500/20",
        };
      case "fatigued":
        return {
          title: "Nurturing Beacon",
          sub: "Replenishing energy... sit back and rest",
          colorClass: "from-amber-400 via-orange-400 to-yellow-500",
          glowClass: "shadow-amber-500/20",
        };
      case "calm":
        return {
          title: "Harmonizer",
          sub: "In complete sync with your serenity",
          colorClass: "from-brand-300 via-blue-400 to-cyan-500",
          glowClass: "shadow-brand-500/20",
        };
      case "inspired":
        return {
          title: "Creative Spark",
          sub: "Channelling vibrant, flow-state energies",
          colorClass: "from-yellow-300 via-amber-400 to-orange-500",
          glowClass: "shadow-yellow-500/20",
        };
      default:
        return {
          title: "Ambient Companion",
          sub: "Waiting to connect and support you",
          colorClass: "from-brand-400 via-indigo-400 to-violet-500",
          glowClass: "shadow-brand-500/10",
        };
    }
  };

  const config = getMoodConfig();

  // Custom fallback ui when GLB fails to fetch (offline sandbox mode)
  const renderFallbackUI = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <ZenAura config={config} isGenerating={isGenerating} />
      <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-semibold border border-amber-200/20">
        <AlertCircle className="w-3 h-3" />
        <span>3D offline. Aura fallback active.</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-3 md:p-6 text-center">
      {/* Upper controls bar */}
      <div className="w-full flex items-center justify-end z-10">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 text-[10px] md:text-xs font-semibold text-slate-700 dark:text-cyan-50 shadow-sm border border-slate-200/60 dark:border-white/10">
          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isGenerating ? "bg-amber-400 text-amber-400 animate-ping" : "bg-cyan-400 text-cyan-400 animate-pulse"}`} />
          <span>{isGenerating ? "Companion is thinking..." : "Connected & Listening"}</span>
        </div>
      </div>

      {/* Main visual core */}
      <div className="relative w-full flex items-center justify-center min-h-[140px] md:min-h-[220px] py-2 md:py-4 my-1 md:my-2 rounded-2xl">
        <AnimatePresence mode="wait">
          {use3D ? (
            <motion.div
              key="3d-canvas"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <CanvasErrorBoundary
                fallback={renderFallbackUI()}
                onError={() => setUse3D(false)}
              >
                <AvatarCanvas isSpeaking={isGenerating} />
              </CanvasErrorBoundary>
            </motion.div>
          ) : (
            <ZenAura config={config} isGenerating={isGenerating} />
          )}
        </AnimatePresence>
      </div>

      {/* Meta Text */}
      <div className="space-y-1.5 max-w-sm mt-2 z-10">
        <h4 className="text-lg md:text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
          {use3D ? "3D Empathetic Guide" : config.title}
        </h4>
        <p className="text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300">
          {use3D ? "Real-time interactive companion" : config.sub}
        </p>
      </div>
    </div>
  );
}
