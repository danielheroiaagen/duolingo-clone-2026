// ============================================
// API ERROR TYPES
// ============================================

export const API_ERROR_CODE = {
  // Client errors
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  
  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  ABORTED: "ABORTED",
  
  // Unknown
  UNKNOWN: "UNKNOWN",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

// ============================================
// RESULT PATTERN
// Type-safe way to handle success/error
// ============================================

export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// USER ERROR MESSAGES
// Translate API errors to user-friendly messages
// ============================================

export function getErrorMessage(error: ApiError): string {
  switch (error.code) {
    case API_ERROR_CODE.UNAUTHORIZED:
      return "Por favor, inicia sesi\u00f3n para continuar.";
    case API_ERROR_CODE.FORBIDDEN:
      return "No tienes permiso para realizar esta acci\u00f3n.";
    case API_ERROR_CODE.NOT_FOUND:
      return "No se encontr\u00f3 el recurso solicitado.";
    case API_ERROR_CODE.VALIDATION_ERROR:
      return error.message || "Los datos proporcionados no son v\u00e1lidos.";
    case API_ERROR_CODE.NETWORK_ERROR:
      return "Error de conexi\u00f3n. Verifica tu internet.";
    case API_ERROR_CODE.TIMEOUT:
      return "La solicitud tard\u00f3 demasiado. Int\u00e9ntalo de nuevo.";
    case API_ERROR_CODE.SERVICE_UNAVAILABLE:
      return "El servicio no est\u00e1 disponible. Int\u00e9ntalo m\u00e1s tarde.";
    default:
      return "Ocurri\u00f3 un error inesperado. Int\u00e9ntalo de nuevo.";
  }
}
