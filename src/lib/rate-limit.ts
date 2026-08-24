import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if redis is configured to avoid crashes in local dev without Upstash
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = !!(url && token);
const redis = hasRedis ? new Redis({ url, token }) : ({} as Redis);

// Mock rate limiter if no redis is configured
const mockRateLimit = {
  limit: async () => ({ success: true, pending: Promise.resolve(), limit: 10, reset: 0, remaining: 10 })
};

export const chatRateLimit = hasRedis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "smartbiz:chat",
}) : mockRateLimit;

export const ocrRateLimit = hasRedis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "smartbiz:ocr",
}) : mockRateLimit;

export const authRateLimit = hasRedis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "smartbiz:auth",
}) : mockRateLimit;

export const apiRateLimit = hasRedis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  analytics: true,
  prefix: "smartbiz:api",
}) : mockRateLimit;
