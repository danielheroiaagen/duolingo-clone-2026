import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAsync } from "./use-async";
import { ok, err, type ApiError } from "@/lib/api/types";

// ============================================
// USE ASYNC HOOK TESTS
// ============================================

describe("useAsync", () => {
  it("should start with initial state", () => {
    const asyncFn = vi.fn();
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("should handle successful execution", async () => {
    const mockData = { id: 1, name: "Test" };
    const asyncFn = vi.fn().mockResolvedValue(ok(mockData));

    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("should handle failed execution", async () => {
    const mockError: ApiError = {
      code: "NOT_FOUND",
      message: "Not found",
      status: 404,
    };
    const asyncFn = vi.fn().mockResolvedValue(err(mockError));

    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
    expect(result.current.isSuccess).toBe(false);
  });

  it("should set isLoading during execution", async () => {
    let resolvePromise: (value: unknown) => void;
    const asyncFn = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const { result } = renderHook(() => useAsync(asyncFn));

    act(() => {
      result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!(ok({ done: true }));
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should pass arguments to async function", async () => {
    const asyncFn = vi.fn().mockResolvedValue(ok({ result: "done" }));

    const { result } = renderHook(() =>
      useAsync<{ result: string }, [string, number]>(asyncFn)
    );

    await act(async () => {
      await result.current.execute("test", 42);
    });

    expect(asyncFn).toHaveBeenCalledWith("test", 42);
  });

  it("should reset state", async () => {
    const mockData = { id: 1 };
    const asyncFn = vi.fn().mockResolvedValue(ok(mockData));

    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isSuccess).toBe(false);
  });
});
