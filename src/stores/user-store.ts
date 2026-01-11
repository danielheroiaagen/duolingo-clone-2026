import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserStats } from "@/types";

// ============================================
// USER STORE - Persisted to localStorage
// ============================================

interface UserStore extends UserStats {
  // Actions
  addXp: (amount: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  reset: () => void;
}

const INITIAL_STATE: UserStats = {
  xp: 0,
  hearts: 5,
  streak: 0,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      addXp: (amount) =>
        set((state) => ({
          xp: state.xp + amount,
        })),

      loseHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
        })),

      resetHearts: () =>
        set({ hearts: 5 }),

      incrementStreak: () =>
        set((state) => ({
          streak: state.streak + 1,
        })),

      resetStreak: () =>
        set({ streak: 0 }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "duolingo-user-progress",
    }
  )
);
