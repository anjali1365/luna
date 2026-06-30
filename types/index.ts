export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  initialMood: string;
  finalMood?: string;
  summary?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "calm-nature" | "cosmic-dark";
  avatarModelUrl?: string;
  voiceGender?: "male" | "female" | "neutral";
  preferredExercises: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: number;
  preferences: UserPreferences;
}

export interface Memory {
  id: string;
  userId: string;
  textChunk: string;
  embedding?: number[];
  category: "preference" | "past_event" | "emotional_pattern" | "general";
  createdAt: number;
}
