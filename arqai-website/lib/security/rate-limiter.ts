/**
 * ArqAI Rate Limiter
 * In-memory rate limiting with sliding window algorithm
 * For production, consider using Redis (Upstash) for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export const RATE_LIMIT_CONFIGS = {
  // Strict limit for auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Moderate limit for chat API
  chat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  },
  // Standard limit for general API
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  // Very strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
} as const;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const entry = rateLimitStore.get(key);

  // No existing entry or window expired
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Within window, check count
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Generate rate limit identifier from request
 */
export function getRateLimitIdentifier(
  request: Request,
  endpoint: string
): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return `${endpoint}:${ip}`;
}

/**
 * Apply rate limit and return headers
 */
export function applyRateLimit(
  request: Request,
  endpoint: string,
  configKey: keyof typeof RATE_LIMIT_CONFIGS
): { allowed: boolean; headers: Record<string, string> } {
  const identifier = getRateLimitIdentifier(request, endpoint);
  const config = RATE_LIMIT_CONFIGS[configKey];
  const result = checkRateLimit(identifier, config);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(config.maxRequests),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };

  if (!result.success && result.retryAfter) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return {
    allowed: result.success,
    headers,
  };
}
