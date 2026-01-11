import { create } from "zustand";
import { VOICE_STATUS, type VoiceStatus } from "@/types";

// ============================================
// VOICE ASSISTANT STORE
// ============================================

interface VoiceStore {
  // State
  status: VoiceStatus;
  transcript: string;
  aiReply: string;
  errorMessage: string | null;

  // Actions
  setStatus: (status: VoiceStatus) => void;
  setTranscript: (transcript: string) => void;
  setAiReply: (reply: string) => void;
  setError: (message: string) => void;
  clearError: () => void;
  reset: () => void;
}

const INITIAL_STATE = {
  status: VOICE_STATUS.IDLE as VoiceStatus,
  transcript: "",
  aiReply: "",
  errorMessage: null as string | null,
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  ...INITIAL_STATE,

  setStatus: (status) => set({ status }),

  setTranscript: (transcript) => set({ transcript }),

  setAiReply: (aiReply) => set({ aiReply }),

  setError: (message) =>
    set({
      status: VOICE_STATUS.ERROR,
      errorMessage: message,
    }),

  clearError: () =>
    set({
      status: VOICE_STATUS.IDLE,
      errorMessage: null,
    }),

  reset: () => set(INITIAL_STATE),
}));

// ============================================
// SELECTORS
// ============================================

export const selectIsRecording = (state: VoiceStore) =>
  state.status === VOICE_STATUS.LISTENING;

export const selectIsProcessing = (state: VoiceStore) =>
  state.status === VOICE_STATUS.PROCESSING ||
  state.status === VOICE_STATUS.TRANSCRIBING ||
  state.status === VOICE_STATUS.REASONING ||
  state.status === VOICE_STATUS.SPEAKING;

export const selectStatusLabel = (state: VoiceStore): string => {
  const labels: Record<VoiceStatus, string> = {
    [VOICE_STATUS.IDLE]: "",
    [VOICE_STATUS.LISTENING]: "Escuchando...",
    [VOICE_STATUS.PROCESSING]: "Procesando...",
    [VOICE_STATUS.TRANSCRIBING]: "Transcribiendo...",
    [VOICE_STATUS.REASONING]: "Razonando (o1)...",
    [VOICE_STATUS.SPEAKING]: "Hablando...",
    [VOICE_STATUS.ERROR]: "Error",
  };
  return labels[state.status];
};
