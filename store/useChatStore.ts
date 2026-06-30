import { create } from "zustand";
import { Message, Session } from "@/types";

interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  currentSession: Session | null;
  avatarActive: boolean;
  breathingActive: boolean;
  moodSelectionOpen: boolean;
  selectedMood: string | null;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setGenerating: (status: boolean) => void;
  setCurrentSession: (session: Session | null) => void;
  toggleAvatar: () => void;
  toggleBreathing: () => void;
  setMoodSelectionOpen: (open: boolean) => void;
  setSelectedMood: (mood: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isGenerating: false,
  currentSession: null,
  avatarActive: true,
  breathingActive: false,
  moodSelectionOpen: false,
  selectedMood: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setCurrentSession: (currentSession) => set({ currentSession }),

  toggleAvatar: () => set((state) => ({ avatarActive: !state.avatarActive })),

  toggleBreathing: () =>
    set((state) => ({ breathingActive: !state.breathingActive })),

  setMoodSelectionOpen: (moodSelectionOpen) => set({ moodSelectionOpen }),

  setSelectedMood: (selectedMood) => set({ selectedMood }),

  clearChat: () => set({ messages: [], currentSession: null, selectedMood: null }),
}));
