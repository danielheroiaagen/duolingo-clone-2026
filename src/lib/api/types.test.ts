import { describe, it, expect } from "vitest";
import { ok, err, getErrorMessage, API_ERROR_CODE, type ApiError } from "./types";

// ============================================
// RESULT PATTERN TESTS
// ============================================

describe("Result pattern", () => {
  describe("ok()", () => {
    it("should create a success result", () => {
      const result = ok({ id: 1, name: "Test" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1, name: "Test" });
      }
    });

    it("should work with primitive values", () => {
      const result = ok(42);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it("should work with arrays", () => {
      const result = ok([1, 2, 3]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3]);
      }
    });
  });

  describe("err()", () => {
    it("should create an error result", () => {
      const error: ApiError = {
        code: API_ERROR_CODE.NOT_FOUND,
        message: "Resource not found",
        status: 404,
      };
      const result = err(error);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual(error);
      }
    });
  });
});

// ============================================
// ERROR MESSAGE TESTS
// ============================================

describe("getErrorMessage", () => {
  it("should return Spanish message for UNAUTHORIZED", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.UNAUTHORIZED,
      message: "Not authenticated",
      status: 401,
    };

    expect(getErrorMessage(error)).toBe(
      "Por favor, inicia sesi\u00f3n para continuar."
    );
  });

  it("should return Spanish message for FORBIDDEN", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.FORBIDDEN,
      message: "Access denied",
      status: 403,
    };

    expect(getErrorMessage(error)).toBe(
      "No tienes permiso para realizar esta acci\u00f3n."
    );
  });

  it("should return Spanish message for NOT_FOUND", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.NOT_FOUND,
      message: "Not found",
      status: 404,
    };

    expect(getErrorMessage(error)).toBe(
      "No se encontr\u00f3 el recurso solicitado."
    );
  });

  it("should return custom message for VALIDATION_ERROR", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.VALIDATION_ERROR,
      message: "Email is invalid",
      status: 400,
    };

    expect(getErrorMessage(error)).toBe("Email is invalid");
  });

  it("should return Spanish message for NETWORK_ERROR", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.NETWORK_ERROR,
      message: "Failed to fetch",
      status: 0,
    };

    expect(getErrorMessage(error)).toBe(
      "Error de conexi\u00f3n. Verifica tu internet."
    );
  });

  it("should return generic message for unknown errors", () => {
    const error: ApiError = {
      code: API_ERROR_CODE.UNKNOWN,
      message: "Something went wrong",
      status: 500,
    };

    expect(getErrorMessage(error)).toBe(
      "Ocurri\u00f3 un error inesperado. Int\u00e9ntalo de nuevo."
    );
  });
});
