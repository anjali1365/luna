"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";

const moods = [
  {
    id: "stressed",
    emoji: "🌧️",
    label: "Stressed",
    sub: "or Sad",
    gradient: "from-blue-500/20 via-indigo-500/10 to-blue-400/5 dark:from-blue-600/30 dark:via-indigo-900/20",
    ring: "ring-blue-400/60 dark:ring-blue-500/80",
    glow: "shadow-blue-400/30 dark:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    dot: "bg-blue-400",
  },
  {
    id: "anxious",
    emoji: "🌀",
    label: "Anxious",
    sub: "or Overwhelmed",
    gradient: "from-purple-500/20 via-fuchsia-500/10 to-purple-400/5 dark:from-purple-600/30 dark:via-fuchsia-900/20",
    ring: "ring-purple-400/60 dark:ring-purple-500/80",
    glow: "shadow-purple-400/30 dark:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    dot: "bg-purple-400",
  },
  {
    id: "fatigued",
    emoji: "🍂",
    label: "Fatigued",
    sub: "or Confused",
    gradient: "from-amber-500/20 via-orange-400/10 to-amber-300/5 dark:from-amber-600/30 dark:via-orange-900/20",
    ring: "ring-amber-400/60 dark:ring-amber-500/80",
    glow: "shadow-amber-400/30 dark:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    dot: "bg-amber-400",
  },
  {
    id: "calm",
    emoji: "🌿",
    label: "Calm",
    sub: "or Content",
    gradient: "from-emerald-500/20 via-teal-400/10 to-emerald-300/5 dark:from-cyan-600/30 dark:via-teal-900/20",
    ring: "ring-emerald-400/60 dark:ring-cyan-500/80",
    glow: "shadow-emerald-400/30 dark:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    dot: "bg-emerald-400",
  },
  {
    id: "inspired",
    emoji: "✨",
    label: "Inspired",
    sub: "or Energetic",
    gradient: "from-yellow-400/20 via-amber-300/10 to-yellow-200/5 dark:from-yellow-500/30 dark:via-amber-900/20",
    ring: "ring-yellow-400/60 dark:ring-yellow-500/80",
    glow: "shadow-yellow-400/30 dark:shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    dot: "bg-yellow-400",
  },
];

export default function MoodSelector() {
  const { setSelectedMood, setCurrentSession, addMessage } = useChatStore();

  const handleSelectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setCurrentSession({ id: `session_${Date.now()}`, userId: "guest", startTime: Date.now(), initialMood: moodId });

    const greetings: Record<string, string> = {
      stressed: "I'm so sorry to hear you're feeling stressed today. Take a deep breath — I'm right here with you. What's on your mind?",
      anxious: "You are safe here. There's a lot going on, and that's okay. Let's take it one step at a time. Tell me what's causing this overwhelm.",
      fatigued: "Mental exhaustion is very heavy. You don't have to explain anything perfectly — just share what you can, or we can start with a short breath.",
      calm: "I'm glad you're feeling calm! It's a beautiful state to be in. What would you like to reflect on or explore today?",
      inspired: "That energy is wonderful! Inspiration is such a beautiful spark. I'd love to hear what's lighting you up today!",
    };

    addMessage({
      id: "system-welcome",
      role: "assistant",
      content: greetings[moodId] ?? "Hello! I'm Luna Sakha, your mental wellness companion. How are you feeling today?",
      timestamp: Date.now(),
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12"
      >

        <h2 className="text-4xl md:text-5xl font-serif text-slate-800 dark:text-white mb-4 leading-tight drop-shadow-md">
          How is your heart<br />feeling right now?
        </h2>
        <p className="text-slate-500 dark:text-cyan-100/70 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
          Let's tune in together. Your mood helps me adapt my tone to what you need most.
        </p>
      </motion.div>

      {/* Mood Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
        {moods.map((mood, idx) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + idx * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMood(mood.id)}
            className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl
              bg-gradient-to-br ${mood.gradient}
              border border-white/60 dark:border-white/10
              backdrop-blur-xl
              shadow-xl ${mood.glow}
              hover:ring-2 ${mood.ring} hover:bg-white/60 dark:hover:bg-white/5
              transition-all duration-300 cursor-pointer overflow-hidden`}
          >
            {/* Background shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 rounded-3xl" />

            {/* Emoji orb */}
            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-[#05050A]/60 border dark:border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl select-none drop-shadow-md">{mood.emoji}</span>
            </div>

            {/* Label */}
            <div className="text-center">
              <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight group-hover:text-brand-700 dark:group-hover:text-cyan-50 transition-colors">{mood.label}</p>
              <p className="text-xs text-slate-500 dark:text-cyan-200/50 mt-0.5">{mood.sub}</p>
            </div>

            {/* Bottom dot indicator */}
            <div className={`w-1.5 h-1.5 rounded-full ${mood.dot} opacity-60 group-hover:opacity-100 transition-opacity`} />
          </motion.button>
        ))}
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 text-xs text-slate-400 dark:text-slate-600 text-center"
      >
        Your responses are private and never stored
      </motion.p>
    </div>
  );
}
