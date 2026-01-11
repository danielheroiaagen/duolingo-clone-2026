import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { EXERCISE_STATUS, type Exercise, type ExerciseStatus } from "@/types";

// ============================================
// EXERCISE STORE - With Immer for mutations
// ============================================

interface ExerciseStore {
  // State
  exercises: Exercise[];
  currentIndex: number;
  selectedOption: string | null;
  status: ExerciseStatus;

  // Computed (via selectors)
  // Actions
  setExercises: (exercises: Exercise[]) => void;
  selectOption: (option: string) => void;
  checkAnswer: () => boolean;
  nextExercise: () => boolean;
  reset: () => void;
}

const INITIAL_STATE = {
  exercises: [] as Exercise[],
  currentIndex: 0,
  selectedOption: null as string | null,
  status: EXERCISE_STATUS.IDLE as ExerciseStatus,
};

export const useExerciseStore = create<ExerciseStore>()(
  immer((set, get) => ({
    ...INITIAL_STATE,

    setExercises: (exercises) =>
      set((state) => {
        state.exercises = exercises;
        state.currentIndex = 0;
        state.selectedOption = null;
        state.status = EXERCISE_STATUS.IN_PROGRESS;
      }),

    selectOption: (option) =>
      set((state) => {
        state.selectedOption = option;
      }),

    checkAnswer: () => {
      const { exercises, currentIndex, selectedOption } = get();
      const current = exercises[currentIndex];
      const isCorrect = selectedOption === current?.correctAnswer;

      set((state) => {
        state.status = isCorrect ? EXERCISE_STATUS.CORRECT : EXERCISE_STATUS.INCORRECT;
      });

      return isCorrect;
    },

    nextExercise: () => {
      const { exercises, currentIndex } = get();
      const hasMore = currentIndex < exercises.length - 1;

      set((state) => {
        if (hasMore) {
          state.currentIndex += 1;
          state.selectedOption = null;
          state.status = EXERCISE_STATUS.IN_PROGRESS;
        } else {
          state.status = EXERCISE_STATUS.COMPLETED;
        }
      });

      return hasMore;
    },

    reset: () => set(INITIAL_STATE),
  }))
);

// ============================================
// SELECTORS - Prevent unnecessary re-renders
// ============================================

export const selectCurrentExercise = (state: ExerciseStore) =>
  state.exercises[state.currentIndex];

export const selectProgress = (state: ExerciseStore) => ({
  current: state.currentIndex,
  total: state.exercises.length,
  percentage: state.exercises.length > 0
    ? (state.currentIndex / state.exercises.length) * 100
    : 0,
});

export const selectIsCompleted = (state: ExerciseStore) =>
  state.status === EXERCISE_STATUS.COMPLETED;
