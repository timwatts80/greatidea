import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "./kv";

/**
 * Sliding-window rate limit, backed by Vercel KV (Upstash Redis under the hood).
 * Default: 5 requests / 10 minutes per identifier (typically the client IP).
 */
let _contactLimiter: Ratelimit | null = null;

export function contactLimiter() {
  if (!_contactLimiter) {
    _contactLimiter = new Ratelimit({
      redis: kv(),
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "rl:contact",
    });
  }
  return _contactLimiter;
}

/**
 * Limiter for the guided idea-intake endpoint. Each visitor makes several
 * calls per conversation (one per beat), so the window is more generous
 * than the contact form's.
 */
let _intakeLimiter: Ratelimit | null = null;

export function intakeLimiter() {
  if (!_intakeLimiter) {
    _intakeLimiter = new Ratelimit({
      redis: kv(),
      limiter: Ratelimit.slidingWindow(90, "10 m"),
      analytics: true,
      prefix: "rl:intake",
    });
  }
  return _intakeLimiter;
}

/** Extract a stable client identifier from the request. Prefers CF/Vercel headers. */
export function clientId(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}
