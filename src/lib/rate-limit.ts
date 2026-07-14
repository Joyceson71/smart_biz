/**
 * Simple in-memory rate limiter using a sliding window approach.
 * Note: In a true serverless environment (like Vercel Edge/Serverless functions),
 * memory is not shared across instances. This provides basic protection per instance.
 * For true distributed rate limiting, use Redis/Upstash.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, reset: resetAt };
  }

  // Window still active
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  entry.count += 1;
  store.set(identifier, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}
