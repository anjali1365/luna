"use client";

import { useChatStore } from "@/store/useChatStore";
import MoodSelector from "@/components/ui/MoodSelector";
import BreathingSphere from "@/components/ui/BreathingSphere";
import ChatContainer from "@/components/chat/ChatContainer";
import InteractiveAvatar from "@/components/avatar/InteractiveAvatar";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { GlowCard } from "@/components/ui/GlowCard";
import { Wind, Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { currentSession, breathingActive, toggleBreathing, clearChat } = useChatStore();
  const [darkMode, setDarkMode] = useState(true);

  // Sync document class with state
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const toggleDark = () => setDarkMode(!darkMode);

  return (
    <main className="h-screen flex flex-col relative bg-bg-base dark:bg-bg-dark transition-colors duration-500 overflow-hidden">

      {/* Dynamic Galaxy Background */}
      <StarsBackground />

      {/* Navbar — floating glass pill */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 rounded-full z-50 transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/icon.svg" alt="Luna Sakha" className="w-8 h-8 md:w-9 md:h-9 rounded-xl shadow-lg shadow-brand-500/30" />
            <span className="text-lg md:text-xl font-serif font-bold text-slate-800 dark:text-slate-100">Luna Sakha</span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-sans px-2.5 py-0.5 rounded-full font-bold border border-brand-200/50 dark:border-brand-700/50 whitespace-nowrap">AI Companion</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {currentSession && (
            <button onClick={toggleBreathing} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 md:px-4 md:py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full transition-all cursor-pointer border border-brand-100/30">
              <Wind className="w-3.5 h-3.5" /> <span className="hidden md:inline">Breath Exercise</span>
            </button>
          )}
          <button onClick={toggleDark} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {currentSession && (
            <button onClick={clearChat} className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 dark:text-rose-400 transition-all cursor-pointer" title="End session">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Content — takes remaining height, never overflows */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center pt-28 pb-4 px-4 md:px-6 w-full max-w-7xl mx-auto z-30">
        <AnimatePresence mode="wait">
          {!currentSession ? (
            <motion.div
              key="mood-selector"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex justify-center py-4 md:py-10 overflow-y-auto scrollbar-hide"
            >
              <MoodSelector />
            </motion.div>
          ) : (
            <motion.div
              key="main-layout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0 relative"
            >
              {/* Top/Left: Avatar (Hidden on mobile for more chat space) */}
              <GlowCard
                className="hidden lg:block w-full lg:w-5/12 h-auto shrink-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/40 z-10 transition-all duration-500 hover:shadow-brand-500/10"
                glowColor="rgba(168, 85, 247, 0.8)" /* Purple glow for avatar */
              >
                <InteractiveAvatar />
              </GlowCard>

              {/* Bottom/Right: Chat */}
              <GlowCard
                className="w-full lg:w-7/12 flex-1 shadow-none lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/50 min-h-0 z-20 transition-all duration-500"
                glowColor="rgba(6, 182, 212, 0.8)" /* Cyan glow for chat */
                transparentOnMobile={true}
              >
                <ChatContainer />
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {breathingActive && <BreathingSphere />}
      </AnimatePresence>

    </main>
  );
}
