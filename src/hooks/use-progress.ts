"use client";

import { useFetch } from "./use-fetch";
import { useAsync } from "./use-async";
import {
  progressService,
  type UserProgress,
  type LessonCompletion,
} from "@/services";

// ============================================
// USE PROGRESS HOOK
// Track user progress and complete lessons
// ============================================

interface UseProgressOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useProgress(options: UseProgressOptions = {}) {
  const { enabled = true, refetchInterval } = options;

  const query = useFetch<UserProgress>(
    "user-progress",
    (signal) => progressService.getProgress(signal),
    { enabled, refetchInterval }
  );

  const completeLesson = useAsync<LessonCompletion, [number, number]>(
    async (lessonId: number, xpEarned: number) => {
      return progressService.completeLesson(lessonId, xpEarned);
    }
  );

  const restoreHeart = useAsync<{ hearts: number }, []>(async () => {
    return progressService.restoreHeart();
  });

  return {
    progress: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    // Complete lesson
    completeLesson: completeLesson.execute,
    isCompletingLesson: completeLesson.isLoading,
    completionResult: completeLesson.data,
    // Restore heart
    restoreHeart: restoreHeart.execute,
    isRestoringHeart: restoreHeart.isLoading,
  };
}
