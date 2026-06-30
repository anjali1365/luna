"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { X, Play, Pause, RotateCcw } from "lucide-react";

export default function BreathingSphere() {
  const { toggleBreathing } = useChatStore();
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
  const [timer, setTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (phase === "idle") return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === "inhale") {
            setPhase("hold");
            return 4; // Hold for 4s
          } else if (phase === "hold") {
            setPhase("exhale");
            return 4; // Exhale for 4s
          } else {
            setPhase("inhale");
            setCycleCount((c) => c + 1);
            return 4; // Inhale for 4s
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const startBreathing = () => {
    setPhase("inhale");
    setTimer(4);
    setCycleCount(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.6)] text-cyan-50";
      case "hold":
        return "bg-purple-500/20 border-purple-400/50 shadow-[0_0_40px_rgba(168,85,247,0.6)] text-purple-50";
      case "exhale":
        return "bg-indigo-500/20 border-indigo-400/50 shadow-[0_0_40px_rgba(99,102,241,0.6)] text-indigo-50";
      default:
        return "bg-slate-800/40 border-slate-600 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-slate-300";
    }
  };

  const getInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In Slowly";
      case "hold":
        return "Hold Gently";
      case "exhale":
        return "Release Completely";
      default:
        return "Find a comfortable position";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05050A]/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-[90%] max-w-md p-8 rounded-[2.5rem] flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-slate-900/60 backdrop-blur-3xl relative overflow-hidden"
      >
        <button
          onClick={toggleBreathing}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </button>

        <div className="text-center mb-8 mt-2">
          <h3 className="text-2xl font-serif font-bold text-brand-900 dark:text-brand-50">
            Guided Breathing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            4-4-4 Box Breathing Cycle
          </p>
        </div>

        {/* Breathing Sphere */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-10">
          {/* Animated glow backgrounds */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-breath blur-2xl pointer-events-none" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-white/20 pointer-events-none"
          />

          <motion.div
            animate={{
              scale: phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : phase === "exhale" ? 1.0 : 1.0,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
            className={`w-40 h-40 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-1000 ${getPhaseColor()}`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={phase + timer}
                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 1.2 }}
                className="text-4xl font-bold font-mono tracking-wider drop-shadow-[0_0_8px_currentColor]"
              >
                {phase !== "idle" ? timer : "•"}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="text-center h-16 flex flex-col justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-slate-800 dark:text-cyan-50 drop-shadow-sm"
            >
              {getInstructions()}
            </motion.p>
          </AnimatePresence>
          {phase !== "idle" && (
            <p className="text-xs text-brand-600 dark:text-purple-300 font-semibold mt-1">
              Cycle: {cycleCount}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {phase === "idle" ? (
            <button
              onClick={startBreathing}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Start Exercise
            </button>
          ) : (
            <>
              <button
                onClick={() => setPhase("idle")}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
              <button
                onClick={startBreathing}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
