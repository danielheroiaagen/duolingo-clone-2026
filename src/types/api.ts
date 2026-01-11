// ============================================
// API RESPONSE TYPES
// ============================================

import type { Exercise, ModuleStatus, ModulePosition } from "./index";

// Module response from /api/modules
export interface ModuleResponse {
  id: number;
  title: string;
  description: string | null;
  position: ModulePosition;
  totalLessons: number;
  completedLessons: number;
  status: ModuleStatus;
}

export interface ModulesApiResponse {
  modules: ModuleResponse[];
}

// Lesson response from /api/lessons
export interface LessonSummary {
  id: number;
  moduleId: number;
  moduleName: string | null;
  title: string;
  description: string | null;
  xpReward: number;
  exerciseCount: number;
}

export interface LessonsApiResponse {
  lessons: LessonSummary[];
}

// Lesson detail from /api/lessons/[id]
export interface LessonDetail {
  id: number;
  title: string;
  description: string | null;
  xpReward: number;
}

export interface ExerciseResponse extends Exercise {
  type: string;
  explanation: string | null;
  order: number;
}

export interface LessonDetailApiResponse {
  lesson: LessonDetail;
  exercises: ExerciseResponse[];
}

// Progress response from /api/progress
export interface ProgressStats {
  xp: number;
  streak: number;
  hearts: number;
}

export interface LessonProgress {
  completed: boolean;
  score: number;
  attempts: number;
}

export interface ProgressApiResponse {
  stats: ProgressStats;
  progress: Record<number, LessonProgress>;
}

// Progress update request
export interface UpdateProgressRequest {
  lessonId: number;
  score: number;
  completed: boolean;
}

export interface UpdateProgressResponse {
  success: boolean;
  xpAwarded: number;
  message: string;
}
