import { NextResponse } from "next/server";

// ============================================
// API ERROR HANDLING
// ============================================

export const API_ERROR = {
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ApiErrorCode = (typeof API_ERROR)[keyof typeof API_ERROR];

interface ApiErrorOptions {
  code: ApiErrorCode;
  message: string;
  status: number;
}

/**
 * Creates a standardized error response.
 * Never exposes internal implementation details.
 */
export function apiError({ code, message, status }: ApiErrorOptions): NextResponse {
  return NextResponse.json(
    {
      error: code,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Pre-built common errors
export const errors = {
  unauthorized: (message = "Authentication required") =>
    apiError({ code: API_ERROR.UNAUTHORIZED, message, status: 401 }),

  badRequest: (message = "Invalid request") =>
    apiError({ code: API_ERROR.BAD_REQUEST, message, status: 400 }),

  notFound: (message = "Resource not found") =>
    apiError({ code: API_ERROR.NOT_FOUND, message, status: 404 }),

  internal: (message = "Something went wrong") =>
    apiError({ code: API_ERROR.INTERNAL_ERROR, message, status: 500 }),

  rateLimited: (message = "Too many requests") =>
    apiError({ code: API_ERROR.RATE_LIMITED, message, status: 429 }),

  serviceUnavailable: (message = "Service temporarily unavailable") =>
    apiError({ code: API_ERROR.SERVICE_UNAVAILABLE, message, status: 503 }),
};
