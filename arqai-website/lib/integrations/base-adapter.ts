/**
 * Base Service Adapter
 *
 * Abstract base class for all external service integrations.
 * Provides graceful degradation when services are not configured.
 *
 * SECURITY: All API keys are validated and never exposed to clients.
 * RELIABILITY: All external calls have timeouts and fallbacks.
 */

export interface AdapterConfig {
  name: string;
  envKeyName: string;
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}

export interface AdapterResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached: boolean;
  source: string;
  fetchTimeMs: number;
}

export abstract class BaseServiceAdapter<T> {
  protected readonly name: string;
  protected readonly isConfigured: boolean;
  protected readonly apiKey: string | undefined;
  protected readonly timeoutMs: number;
  protected readonly retryCount: number;
  protected readonly retryDelayMs: number;

  constructor(config: AdapterConfig) {
    this.name = config.name;
    this.apiKey = process.env[config.envKeyName];
    this.isConfigured = !!this.apiKey && this.apiKey.length > 0;
    this.timeoutMs = config.timeoutMs ?? 10000;
    this.retryCount = config.retryCount ?? 2;
    this.retryDelayMs = config.retryDelayMs ?? 1000;
  }

  /**
   * Check if the service is configured and available
   */
  public getStatus(): { configured: boolean; name: string } {
    return {
      configured: this.isConfigured,
      name: this.name,
    };
  }

  /**
   * Main entry point - tries service, falls back gracefully
   */
  public async execute(input: unknown): Promise<AdapterResult<T>> {
    const startTime = Date.now();

    if (!this.isConfigured) {
      const fallbackResult = await this.fallback(input);
      return {
        success: !!fallbackResult,
        data: fallbackResult ?? undefined,
        cached: false,
        source: `${this.name}-fallback`,
        fetchTimeMs: Date.now() - startTime,
      };
    }

    // Check cache first
    const cached = await this.getFromCache(input);
    if (cached) {
      return {
        success: true,
        data: cached,
        cached: true,
        source: `${this.name}-cache`,
        fetchTimeMs: Date.now() - startTime,
      };
    }

    // Try service with retries
    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const result = await this.callServiceWithTimeout(input);

        // Cache successful result
        if (result) {
          await this.saveToCache(input, result);
        }

        return {
          success: true,
          data: result ?? undefined,
          cached: false,
          source: this.name,
          fetchTimeMs: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.retryCount) {
          await this.delay(this.retryDelayMs * Math.pow(2, attempt));
        }
      }
    }

    // Service failed, try fallback
    console.error(`${this.name} service failed after ${this.retryCount + 1} attempts:`, lastError?.message);

    const fallbackResult = await this.fallback(input);
    return {
      success: !!fallbackResult,
      data: fallbackResult ?? undefined,
      error: lastError?.message,
      cached: false,
      source: `${this.name}-fallback`,
      fetchTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Call service with timeout protection
   */
  private async callServiceWithTimeout(input: unknown): Promise<T | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const result = await this.callService(input, controller.signal);
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Abstract methods to implement in subclasses
   */

  /**
   * Main service call - implement API call logic here
   */
  protected abstract callService(input: unknown, signal: AbortSignal): Promise<T | null>;

  /**
   * Fallback when service is unavailable or not configured
   */
  protected abstract fallback(input: unknown): Promise<T | null>;

  /**
   * Get cached result (optional - return null if no caching)
   */
  protected async getFromCache(_input: unknown): Promise<T | null> {
    return null;
  }

  /**
   * Save result to cache (optional - no-op if no caching)
   */
  protected async saveToCache(_input: unknown, _result: T): Promise<void> {
    // Override in subclass for caching
  }
}

/**
 * Simple in-memory cache for adapters
 */
export class AdapterCache<T> {
  private cache = new Map<string, { data: T; expiresAt: number }>();
  private readonly defaultTtlMs: number;

  constructor(defaultTtlMs: number = 3600000) { // 1 hour default
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Rate limiter for external API calls
 */
export class AdapterRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    this.cleanup();
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  private cleanup(): void {
    const cutoff = Date.now() - this.windowMs;
    this.requests = this.requests.filter(t => t > cutoff);
  }

  getWaitTime(): number {
    if (this.canMakeRequest()) return 0;
    const oldestRequest = this.requests[0];
    if (!oldestRequest) return 0;
    return Math.max(0, oldestRequest + this.windowMs - Date.now());
  }
}
