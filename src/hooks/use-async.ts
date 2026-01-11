"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ApiError } from "@/lib/api/types";

// ============================================
// USE ASYNC HOOK
// Generic hook for handling async operations
// ============================================

interface UseAsyncState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<void>;
  reset: () => void;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<{ success: true; data: T } | { success: false; error: ApiError }>
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  // Track mounted state to prevent updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isSuccess: false,
        isError: false,
      }));

      const result = await asyncFn(...args);

      if (!isMounted.current) return;

      if (result.success) {
        setState({
          data: result.data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
      } else {
        setState({
          data: null,
          error: result.error,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return { ...state, execute, reset };
}
