import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { modulesService } from "./modules.service";

// ============================================
// MODULES SERVICE TESTS
// ============================================

describe("modulesService", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("getAll", () => {
    it("should return modules on success", async () => {
      const mockModules = [
        { id: 1, title: "Basics", description: null, order: 1, imageUrl: null, lessonsCount: 5, completedLessons: 3 },
        { id: 2, title: "Greetings", description: null, order: 2, imageUrl: null, lessonsCount: 4, completedLessons: 0 },
      ];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ modules: mockModules }),
      });

      const result = await modulesService.getAll();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].title).toBe("Basics");
      }
    });

    it("should return empty array when no modules", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ modules: [] }),
      });

      const result = await modulesService.getAll();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it("should return error on API failure", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ code: "SERVER_ERROR", message: "Internal error" }),
      });

      const result = await modulesService.getAll();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SERVER_ERROR");
      }
    });

    it("should support abort signal", async () => {
      const controller = new AbortController();
      controller.abort();

      global.fetch = vi.fn().mockImplementation(() => {
        const error = new Error("Aborted");
        error.name = "AbortError";
        return Promise.reject(error);
      });

      const result = await modulesService.getAll(controller.signal);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ABORTED");
      }
    });
  });

  describe("getById", () => {
    it("should return module with lessons", async () => {
      const mockModule = {
        id: 1,
        title: "Basics",
        description: "Learn the basics",
        order: 1,
        imageUrl: null,
        lessonsCount: 2,
        completedLessons: 1,
        lessons: [
          { id: 1, title: "Lesson 1", order: 1, isCompleted: true },
          { id: 2, title: "Lesson 2", order: 2, isCompleted: false },
        ],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockModule),
      });

      const result = await modulesService.getById(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Basics");
        expect(result.data.lessons).toHaveLength(2);
      }
    });

    it("should return NOT_FOUND when module doesn't exist", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(null),
      });

      const result = await modulesService.getById(999);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });
});
