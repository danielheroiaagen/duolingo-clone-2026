// ============================================
// PROGRESS SERVICE
// Handles user progress tracking
// ============================================

import { apiClient } from "@/lib/api/client";
import type { Result, ApiError } from "@/lib/api/types";
import { ok, err } from "@/lib/api/types";

// ============================================
// TYPES
// ============================================

export interface UserProgress {
  totalXp: number;
  streak: number;
  hearts: number;
  completedLessons: number;
  lastActivityAt: string | null;
}

export interface ModuleProgress {
  moduleId: number;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export interface LessonCompletion {
  lessonId: number;
  xpEarned: number;
  completedAt: string;
  newStreak: number;
}

// ============================================
// SERVICE
// ============================================

export const progressService = {
  /**
   * Get current user's overall progress
   */
  async getProgress(signal?: AbortSignal): Promise<Result<UserProgress>> {
    const { data, error } = await apiClient.get<UserProgress>(
      "/progress",
      signal
    );

    if (error) return err(error);
    if (!data) {
      return err({
        code: "NOT_FOUND",
        message: "Progress not found",
        status: 404,
      } as ApiError);
    }
    return ok(data);
  },

  /**
   * Get progress for all modules
   */
  async getModuleProgress(
    signal?: AbortSignal
  ): Promise<Result<ModuleProgress[]>> {
    const { data, error } = await apiClient.get<{ modules: ModuleProgress[] }>(
      "/progress/modules",
      signal
    );

    if (error) return err(error);
    return ok(data?.modules ?? []);
  },

  /**
   * Mark a lesson as completed
   */
  async completeLesson(
    lessonId: number,
    xpEarned: number,
    signal?: AbortSignal
  ): Promise<Result<LessonCompletion>> {
    const { data, error } = await apiClient.post<LessonCompletion>(
      "/progress/complete",
      { lessonId, xpEarned },
      signal
    );

    if (error) return err(error);
    if (!data) {
      return err({
        code: "SERVER_ERROR",
        message: "Failed to complete lesson",
        status: 500,
      } as ApiError);
    }
    return ok(data);
  },

  /**
   * Restore a heart (costs gems or wait)
   */
  async restoreHeart(signal?: AbortSignal): Promise<Result<{ hearts: number }>> {
    const { data, error } = await apiClient.post<{ hearts: number }>(
      "/progress/restore-heart",
      {},
      signal
    );

    if (error) return err(error);
    if (!data) {
      return err({
        code: "SERVER_ERROR",
        message: "Failed to restore heart",
        status: 500,
      } as ApiError);
    }
    return ok(data);
  },
};
