/**
 * Security Utilities
 *
 * Security-related functions including sanitization and rate limiting.
 */

/**
 * Sanitize HTML content to prevent XSS
 * Uses regex-based sanitization for environments without DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=/gi, "data-removed=")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "");
}

/**
 * Sanitize plain text (remove HTML entirely)
 */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(options: { windowMs: number; maxRequests: number }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
  }

  /**
   * Check if request should be allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];

    // Filter out expired requests
    const validRequests = requests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter((time) => time > windowStart);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Get time until reset for a key
   */
  getResetTime(key: string): number {
    const requests = this.requests.get(key) || [];
    if (requests.length === 0) return 0;
    const oldestRequest = Math.min(...requests);
    return Math.max(0, oldestRequest + this.windowMs - Date.now());
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }),
  chat: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }),
  api: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 60 }),
  sensitive: new RateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 }),
};

/**
 * Check for prompt injection attempts
 */
export function detectPromptInjection(text: string): boolean {
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /disregard\s+(all\s+)?previous/i,
    /forget\s+(everything|all)/i,
    /new\s+instructions?:/i,
    /system\s*:\s*you\s+are/i,
    /\[system\]/i,
    /\[INST\]/i,
    /<\|im_start\|>/i,
    /pretend\s+you\s+are/i,
    /act\s+as\s+(if\s+you\s+are|a)/i,
    /jailbreak/i,
    /bypass\s+(your\s+)?restrictions/i,
  ];

  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return `sess_${generateSecureToken(24)}`;
}

/**
 * Hash a string using SHA-256
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ["password", "token", "secret", "apiKey", "key", "authorization"];

  const masked = { ...data };
  for (const key of Object.keys(masked)) {
    if (sensitiveFields.some((f) => key.toLowerCase().includes(f))) {
      masked[key] = "***REDACTED***";
    } else if (typeof masked[key] === "object" && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key] as Record<string, unknown>);
    }
  }

  return masked;
}
