// ============================================
// LESSONS SERVICE
// Handles all lesson-related API calls
// ============================================

import { apiClient } from "@/lib/api/client";
import type { Result, ApiError } from "@/lib/api/types";
import { ok, err } from "@/lib/api/types";

// ============================================
// TYPES
// ============================================

export interface LessonData {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
}

export interface ExerciseData {
  id: number;
  lessonId: number;
  type: string;
  question: string;
  options: string[];
  order: number;
}

export interface LessonWithExercises extends LessonData {
  exercises: ExerciseData[];
}

export interface AnswerPayload {
  lessonId: number;
  exerciseId: number;
  answer: string;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  xpEarned: number;
}

// ============================================
// SERVICE
// ============================================

export const lessonsService = {
  /**
   * Get all lessons (optionally filtered by module)
   */
  async getAll(
    moduleId?: number,
    signal?: AbortSignal
  ): Promise<Result<LessonData[]>> {
    const endpoint = moduleId ? `/lessons?moduleId=${moduleId}` : "/lessons";
    const { data, error } = await apiClient.get<{ lessons: LessonData[] }>(
      endpoint,
      signal
    );

    if (error) return err(error);
    return ok(data?.lessons ?? []);
  },

  /**
   * Get a lesson with its exercises
   */
  async getById(
    lessonId: number,
    signal?: AbortSignal
  ): Promise<Result<LessonWithExercises>> {
    const { data, error } = await apiClient.get<{ lesson: LessonWithExercises }>(
      `/lessons/${lessonId}`,
      signal
    );

    if (error) return err(error);
    if (!data?.lesson) {
      return err({
        code: "NOT_FOUND",
        message: "Lesson not found",
        status: 404,
      } as ApiError);
    }
    return ok(data.lesson);
  },

  /**
   * Submit an answer to an exercise
   */
  async submitAnswer(
    payload: AnswerPayload,
    signal?: AbortSignal
  ): Promise<Result<AnswerResult>> {
    const { data, error } = await apiClient.post<AnswerResult>(
      `/lessons/${payload.lessonId}/answer`,
      payload,
      signal
    );

    if (error) return err(error);
    if (!data) {
      return err({
        code: "SERVER_ERROR",
        message: "No response from server",
        status: 500,
      } as ApiError);
    }
    return ok(data);
  },
};
