"use client";

import { useFetch } from "./use-fetch";
import { useAsync } from "./use-async";
import {
  lessonsService,
  type LessonWithExercises,
  type AnswerResult,
} from "@/services";

// ============================================
// USE LESSON HOOK
// Fetch lesson with exercises and submit answers
// ============================================

interface UseLessonOptions {
  enabled?: boolean;
}

export function useLesson(lessonId: number, options: UseLessonOptions = {}) {
  const { enabled = true } = options;

  const query = useFetch<LessonWithExercises>(
    `lesson-${lessonId}`,
    (signal) => lessonsService.getById(lessonId, signal),
    { enabled: enabled && lessonId > 0 }
  );

  const submitAnswer = useAsync<AnswerResult, [number, string]>(
    async (exerciseId: number, answer: string) => {
      return lessonsService.submitAnswer({ lessonId, exerciseId, answer });
    }
  );

  return {
    lesson: query.data,
    exercises: query.data?.exercises ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    submitAnswer: submitAnswer.execute,
    isSubmitting: submitAnswer.isLoading,
    answerResult: submitAnswer.data,
    answerError: submitAnswer.error,
  };
}
