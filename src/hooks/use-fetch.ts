"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ApiError } from "@/lib/api/types";

// ============================================
// USE FETCH HOOK
// Declarative data fetching with caching
// ============================================

interface UseFetchOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
}

interface UseFetchReturn<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<{ success: true; data: T } | { success: false; error: ApiError }>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { enabled = true, refetchOnMount = true, refetchInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefetching, setIsRefetching] = useState(false);

  // Track if this is the initial fetch
  const hasFetched = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (isRefetch = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }

      const result = await fetcher(controller.signal);

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }

      setIsLoading(false);
      setIsRefetching(false);
      hasFetched.current = true;
    },
    [fetcher]
  );

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;
    if (hasFetched.current && !refetchOnMount) return;

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key, enabled, refetchOnMount, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [enabled, refetchInterval, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { data, error, isLoading, isRefetching, refetch };
}
