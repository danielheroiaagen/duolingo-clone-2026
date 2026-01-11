import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient } from "./client";
import { API_ERROR_CODE } from "./types";

// ============================================
// API CLIENT TESTS
// ============================================

describe("apiClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("successful requests", () => {
    it("should return data on successful GET request", async () => {
      const mockData = { id: 1, name: "Test" };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockData),
      });

      const result = await apiClient.get<typeof mockData>("/test");

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should send body on POST request", async () => {
      const requestBody = { name: "New Item" };
      const mockResponse = { id: 1, ...requestBody };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post<typeof mockResponse>("/items", requestBody);

      expect(result.data).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "/api/items",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe("error handling", () => {
    it("should return error on 401 response", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ code: "UNAUTHORIZED", message: "Not authenticated" }),
      });

      const result = await apiClient.get("/protected");

      expect(result.data).toBeNull();
      expect(result.error).toEqual({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
        status: 401,
        details: undefined,
      });
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network failed"));

      const result = await apiClient.get("/test");

      expect(result.data).toBeNull();
      expect(result.error?.code).toBe(API_ERROR_CODE.NETWORK_ERROR);
    });

    it("should handle abort errors", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      global.fetch = vi.fn().mockRejectedValueOnce(abortError);

      const result = await apiClient.get("/test");

      expect(result.error?.code).toBe(API_ERROR_CODE.ABORTED);
    });

    it("should handle non-JSON responses", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "text/html" }),
      });

      const result = await apiClient.get("/test");

      expect(result.error?.code).toBe(API_ERROR_CODE.SERVER_ERROR);
    });
  });

  describe("HTTP methods", () => {
    it("should support PUT method", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ updated: true }),
      });

      await apiClient.put("/items/1", { name: "Updated" });

      expect(fetch).toHaveBeenCalledWith(
        "/api/items/1",
        expect.objectContaining({ method: "PUT" })
      );
    });

    it("should support PATCH method", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ patched: true }),
      });

      await apiClient.patch("/items/1", { name: "Patched" });

      expect(fetch).toHaveBeenCalledWith(
        "/api/items/1",
        expect.objectContaining({ method: "PATCH" })
      );
    });

    it("should support DELETE method", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ deleted: true }),
      });

      await apiClient.delete("/items/1");

      expect(fetch).toHaveBeenCalledWith(
        "/api/items/1",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });
});
