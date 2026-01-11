// ============================================
// API CLIENT - Type-safe fetch wrapper
// ============================================

import { ApiError, API_ERROR_CODE } from "./types";

// ============================================
// TYPES
// ============================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// ============================================
// API CLIENT CLASS
// ============================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, signal } = config;

    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal,
        credentials: "include",
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        if (!response.ok) {
          return {
            data: null,
            error: {
              code: API_ERROR_CODE.SERVER_ERROR,
              message: "Server returned non-JSON response",
              status: response.status,
            },
          };
        }
        return { data: null, error: null };
      }

      const json = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: json.code || API_ERROR_CODE.SERVER_ERROR,
            message: json.message || json.error || "An error occurred",
            status: response.status,
            details: json.details,
          },
        };
      }

      return { data: json as T, error: null };
    } catch (error) {
      // Handle network errors
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            data: null,
            error: {
              code: API_ERROR_CODE.ABORTED,
              message: "Request was cancelled",
              status: 0,
            },
          };
        }

        return {
          data: null,
          error: {
            code: API_ERROR_CODE.NETWORK_ERROR,
            message: error.message || "Network error",
            status: 0,
          },
        };
      }

      return {
        data: null,
        error: {
          code: API_ERROR_CODE.UNKNOWN,
          message: "An unknown error occurred",
          status: 0,
        },
      };
    }
  }

  // Convenience methods
  get<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "GET", signal });
  }

  post<T>(endpoint: string, body: unknown, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "POST", body, signal });
  }

  put<T>(endpoint: string, body: unknown, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "PUT", body, signal });
  }

  patch<T>(endpoint: string, body: unknown, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "PATCH", body, signal });
  }

  delete<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "DELETE", signal });
  }
}

// Export singleton instance
export const apiClient = new ApiClient("/api");
export type { ApiResponse, RequestConfig };
