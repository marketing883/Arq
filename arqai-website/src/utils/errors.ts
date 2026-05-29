/**
 * Error Utilities
 *
 * Custom error types and error handling utilities.
 */

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message, "VALIDATION_ERROR", 400);
    this.errors = errors;
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with ID "${id}" not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, "AUTHORIZATION_ERROR", 403);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super("Rate limit exceeded", "RATE_LIMIT_ERROR", 429);
    this.retryAfter = retryAfter;
  }
}

/**
 * External service error
 */
export class ExternalServiceError extends AppError {
  public readonly service: string;

  constructor(service: string, message: string) {
    super(`${service}: ${message}`, "EXTERNAL_SERVICE_ERROR", 502);
    this.service = service;
  }
}

/**
 * API response type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Create success response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

/**
 * Create error response
 */
export function errorResponse(
  error: Error | AppError,
  details?: unknown
): ApiResponse<never> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details,
      },
    };
  }

  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: error.message || "An unexpected error occurred",
      details,
    },
  };
}

/**
 * Handle async errors in API routes
 */
export function withErrorHandler<T>(
  fn: () => Promise<T>
): Promise<ApiResponse<T>> {
  return fn()
    .then((data) => successResponse(data))
    .catch((error) => {
      console.error("API Error:", error);
      return errorResponse(error);
    });
}

/**
 * Assert condition or throw error
 */
export function assert(
  condition: boolean,
  message: string,
  ErrorClass: typeof AppError = AppError
): asserts condition {
  if (!condition) {
    throw new ErrorClass(message);
  }
}

/**
 * Assert value is defined
 */
export function assertDefined<T>(
  value: T | undefined | null,
  message: string
): asserts value is T {
  if (value === undefined || value === null) {
    throw new NotFoundError(message);
  }
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}
