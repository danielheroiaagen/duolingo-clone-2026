// Re-export all stores for easy imports
export { useUserStore } from "./user-store";
export {
  useExerciseStore,
  selectCurrentExercise,
  selectProgress,
  selectIsCompleted
} from "./exercise-store";
export {
  useVoiceStore,
  selectIsRecording,
  selectIsProcessing,
  selectStatusLabel
} from "./voice-store";
