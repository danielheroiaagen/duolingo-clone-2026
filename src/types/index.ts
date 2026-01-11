// ============================================
// CONST TYPES PATTERN - Single source of truth
// ============================================

// Button variants
export const BUTTON_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINE: "outline",
  GHOST: "ghost",
} as const;

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

// Voice assistant status
export const VOICE_STATUS = {
  IDLE: "idle",
  LISTENING: "listening",
  PROCESSING: "processing",
  TRANSCRIBING: "transcribing",
  REASONING: "reasoning",
  SPEAKING: "speaking",
  ERROR: "error",
} as const;

export type VoiceStatus = (typeof VOICE_STATUS)[keyof typeof VOICE_STATUS];

// Exercise status
export const EXERCISE_STATUS = {
  IDLE: "idle",
  IN_PROGRESS: "in_progress",
  CHECKING: "checking",
  CORRECT: "correct",
  INCORRECT: "incorrect",
  COMPLETED: "completed",
} as const;

export type ExerciseStatus = (typeof EXERCISE_STATUS)[keyof typeof EXERCISE_STATUS];

// Module status
export const MODULE_STATUS = {
  LOCKED: "locked",
  AVAILABLE: "available",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type ModuleStatus = (typeof MODULE_STATUS)[keyof typeof MODULE_STATUS];

// Module position
export const MODULE_POSITION = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export type ModulePosition = (typeof MODULE_POSITION)[keyof typeof MODULE_POSITION];

// ============================================
// INTERFACES - Flat, one level depth
// ============================================

export interface Exercise {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Module {
  id: number;
  title: string;
  position: ModulePosition;
  status: ModuleStatus;
  progress: number;
  total: number;
}

export interface UserStats {
  xp: number;
  hearts: number;
  streak: number;
}

export interface VoiceAssistantState {
  status: VoiceStatus;
  transcript: string;
  aiReply: string;
  errorMessage: string | null;
}
