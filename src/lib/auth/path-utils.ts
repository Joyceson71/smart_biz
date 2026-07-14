/**
 * Shared auth path utilities.
 * Used by:
 *   - src/lib/supabase/middleware.ts (Next.js middleware)
 *   - tests/unit/auth-paths.test.ts (unit tests)
 *
 * Keep this file free of any Next.js-specific imports so it can run
 * in both the Edge runtime (middleware) and the test environment (jsdom/node).
 */

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth/callback",
  "/api/health",
] as const;

const PUBLIC_PREFIXES = ["/api/webhooks/"] as const;

/**
 * Returns true if the given pathname is publicly accessible without a session.
 * Everything else is considered protected (default-deny).
 */
export function isPublicPath(pathname: string): boolean {
  if ((PUBLIC_PATHS as readonly string[]).includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return false;
}

/**
 * Returns true if the given pathname requires an authenticated session.
 */
export function isProtectedPath(pathname: string): boolean {
  return !isPublicPath(pathname);
}
