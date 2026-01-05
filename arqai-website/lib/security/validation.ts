/**
 * ArqAI Input Validation
 * Comprehensive input validation using Zod
 */

import { z } from "zod";

// ============================================
// Common Validation Schemas
// ============================================

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(254, "Email too long")
  .transform((val) => val.toLowerCase().trim());

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const sessionIdSchema = z
  .string()
  .uuid("Invalid session ID")
  .or(z.string().regex(/^[a-f0-9-]{36}$/i, "Invalid session ID format"));

// ============================================
// API Request Schemas
// ============================================

export const adminLoginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Password is required").max(128),
});

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(4000, "Message too long")
    .transform((val) => val.trim()),
  sessionId: z.string().optional(),
  userInfo: z
    .object({
      name: z.string().max(100).optional(),
      email: emailSchema.optional(),
      company: z.string().max(200).optional(),
    })
    .optional(),
  pageContext: z
    .object({
      path: z.string().max(500).optional(),
      title: z.string().max(200).optional(),
    })
    .optional(),
  // Also accept 'context' field from frontend (alternative naming)
  context: z
    .object({
      currentPage: z.string().max(500).optional(),
      userName: z.string().max(100).optional(),
      userEmail: z.string().max(254).optional(),
      userCompany: z.string().max(200).optional(),
    })
    .optional(),
  userContext: z.string().max(10000).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(10000),
  })).optional(),
}).passthrough();

export const consentSchema = z.object({
  consent_given: z.boolean(),
  consent_categories: z.array(z.string().max(50)).max(10).optional(),
});

export const leadFilterSchema = z.object({
  intent_category: z.string().max(50).optional(),
  company_size: z.string().max(50).optional(),
  urgency: z.string().max(50).optional(),
  qualification_status: z.string().max(50).optional(),
});

// ============================================
// Sanitization Functions
// ============================================

/**
 * Strip potential XSS content from string
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else if (value && typeof value === "object") {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

// ============================================
// Validation Helper
// ============================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ path: string; message: string }>;
}

/**
 * Validate input against a schema
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  try {
    const data = schema.parse(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }
    return { success: false, error: "Invalid input" };
  }
}
