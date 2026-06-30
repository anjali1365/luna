"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Send, Sparkles, AlertCircle, Compass, Smile } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const suggestions = [
  { text: "Help me calm my anxious thoughts", icon: AlertCircle, color: "text-purple-500" },
  { text: "I'm feeling completely overwhelmed right now", icon: Compass, color: "text-amber-500" },
  { text: "I just need a safe space to vent", icon: Smile, color: "text-brand-500" },
];

export default function ChatContainer() {
  const { messages: storeMessages, addMessage, setGenerating, toggleBreathing, selectedMood } = useChatStore();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    storeMessages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: new Date(m.timestamp),
    }))
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGenerating(isLoading);
  }, [isLoading, setGenerating]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    addMessage({ id: userMsg.id, role: "user", content: text, timestamp: Date.now() });
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const content = await res.text();
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: content || "I'm here for you. Could you tell me more?",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      addMessage({ id: assistantMsg.id, role: "assistant", content: assistantMsg.content, timestamp: Date.now() });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `asst-${Date.now()}`, role: "assistant", content: "Something went wrong. Please try again.", createdAt: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* Messages viewport */}
      <div ref={viewportRef} className="flex-1 overflow-y-auto min-h-0 px-4 py-4 md:px-5 scrollbar-hide">

        {messages.map((msg, i) => {
          const isAssistant = msg.role === "assistant";
          const isLast = i === messages.length - 1;
          const prevRole = messages[i - 1]?.role;
          const nextRole = messages[i + 1]?.role;
          const isGroupStart = prevRole !== msg.role;
          const isGroupEnd = nextRole !== msg.role;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} ${isGroupEnd ? "mb-3" : "mb-0.5"}`}
            >
              {/* Avatar dot removed */}

              <div
                className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 ${
                  isAssistant
                    ? `bg-white dark:bg-slate-900/80 text-slate-700 dark:text-cyan-50 border border-slate-100 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.1)] backdrop-blur-md
                       ${isGroupStart ? "rounded-t-2xl" : "rounded-t-lg"}
                       ${isGroupEnd ? "rounded-b-2xl rounded-bl-sm" : "rounded-b-lg"}`
                    : `backdrop-blur-md border shadow-lg transition-all
                       bg-gradient-to-br from-brand-500 to-brand-600 border-brand-400/50 text-white shadow-brand-500/20
                       dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-indigo-900/50 dark:border-purple-500/30 dark:shadow-[0_0_25px_rgba(168,85,247,0.2)] dark:text-purple-50
                       ${isGroupStart ? "rounded-t-2xl" : "rounded-t-lg"}
                       ${isGroupEnd ? "rounded-b-2xl rounded-br-sm" : "rounded-b-lg"}`
                }`}
              >
                {msg.content}
                {isAssistant && isLoading && isLast && (
                  <span className="inline-block w-0.5 h-3.5 bg-brand-400 ml-0.5 animate-pulse align-middle" />
                )}

                {isAssistant && msg.content.toLowerCase().includes("breathing") && (
                  <button
                    onClick={toggleBreathing}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-lg transition-all cursor-pointer border border-brand-200/30"
                  >
                    <Sparkles className="w-3 h-3" /> Start Breathing
                  </button>
                )}

                {isGroupEnd && (
                  <span className={`block text-[9px] mt-1 font-mono ${isAssistant ? "text-slate-400 dark:text-slate-500" : "text-white/50 text-right"}`}>
                    {msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start items-end mb-3">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-[bounce_1s_infinite] shadow-[0_0_5px_rgba(34,211,238,0.8)]" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-[bounce_1s_infinite] shadow-[0_0_5px_rgba(34,211,238,0.8)]" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-[bounce_1s_infinite] shadow-[0_0_5px_rgba(34,211,238,0.8)]" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="pt-4 space-y-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-widest uppercase text-center">
              Suggested reflections
            </p>
            <div className="grid grid-cols-1 gap-1.5 max-w-sm mx-auto">
              {suggestions.map((sug, idx) => {
                const Icon = sug.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => sendMessage(sug.text)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-brand-400 dark:hover:border-brand-500 text-left text-xs text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${sug.color}`} />
                    {sug.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 md:px-5 border-t border-slate-100 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-b-[2.5rem] relative z-20"
      >
        <div className="relative flex items-center gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Communicate with Luna..."
            className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 focus:border-brand-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-brand-400/15 dark:focus:ring-cyan-500/20 rounded-xl py-2.5 pl-4 pr-4 text-sm outline-none resize-none overflow-y-auto max-h-28 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-cyan-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 dark:from-cyan-600 dark:to-blue-700 dark:hover:from-cyan-500 dark:hover:to-blue-600 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white disabled:text-slate-400 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:shadow-none cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
          If you are in crisis, please seek immediate professional help.
        </p>
      </form>
    </div>
  );
}
