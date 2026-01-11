"use client";

import { useFetch } from "./use-fetch";
import { modulesService, type ModuleData } from "@/services";

// ============================================
// USE MODULES HOOK
// Fetch all modules with progress
// ============================================

interface UseModulesOptions {
  enabled?: boolean;
}

export function useModules(options: UseModulesOptions = {}) {
  const { enabled = true } = options;

  const result = useFetch<ModuleData[]>(
    "modules",
    (signal) => modulesService.getAll(signal),
    { enabled }
  );

  return {
    modules: result.data ?? [],
    ...result,
  };
}
