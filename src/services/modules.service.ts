// ============================================
// MODULES SERVICE
// Handles all module-related API calls
// ============================================

import { apiClient } from "@/lib/api/client";
import type { Result, ApiError } from "@/lib/api/types";
import { ok, err } from "@/lib/api/types";

// ============================================
// TYPES
// ============================================

export interface ModuleData {
  id: number;
  title: string;
  description: string | null;
  order: number;
  imageUrl: string | null;
  lessonsCount: number;
  completedLessons: number;
}

export interface ModuleWithLessons extends ModuleData {
  lessons: {
    id: number;
    title: string;
    order: number;
    isCompleted: boolean;
  }[];
}

// ============================================
// SERVICE
// ============================================

export const modulesService = {
  /**
   * Get all modules for the current user
   */
  async getAll(signal?: AbortSignal): Promise<Result<ModuleData[]>> {
    const { data, error } = await apiClient.get<{ modules: ModuleData[] }>(
      "/modules",
      signal
    );

    if (error) return err(error);
    return ok(data?.modules ?? []);
  },

  /**
   * Get a single module with its lessons
   */
  async getById(
    moduleId: number,
    signal?: AbortSignal
  ): Promise<Result<ModuleWithLessons>> {
    const { data, error } = await apiClient.get<ModuleWithLessons>(
      `/modules/${moduleId}`,
      signal
    );

    if (error) return err(error);
    if (!data) {
      return err({
        code: "NOT_FOUND",
        message: "Module not found",
        status: 404,
      } as ApiError);
    }
    return ok(data);
  },
};
