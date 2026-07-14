import { test, expect } from "@playwright/test";

/**
 * E2E test: Auth Guard
 *
 * Verifies that the default-deny middleware correctly redirects unauthenticated
 * users away from every protected route to /login.
 *
 * This test does NOT require a seeded user — it tests the public-facing redirect behavior.
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/customers",
  "/invoices",
  "/inventory",
  "/vendors",
  "/expenses",
  "/settings",
  "/reports",
  "/ai-assistant",
  "/cash-flow",
  "/notifications",
  "/employees",
];

test.describe("Auth Guard — unauthenticated user", () => {
  // Each protected route must redirect to /login
  for (const route of PROTECTED_ROUTES) {
    test(`GET ${route} → redirects to /login`, async ({ page }) => {
      // Ensure no stored session by clearing storage
      await page.context().clearCookies();

      const response = await page.goto(route, { waitUntil: "networkidle" });

      // Must end up on /login (after redirect chain)
      expect(page.url()).toContain("/login");

      // The final status code of the landed page must be 200 (login page rendered)
      expect(response?.status()).toBeLessThan(400);
    });
  }

  test("GET /api/health is publicly accessible (no redirect)", async ({ request }) => {
    const res = await request.get("/api/health");
    // Health endpoint must be reachable without auth and return JSON
    expect(res.status()).toBeLessThan(500);
    const body = await res.json();
    expect(body).toHaveProperty("status");
  });

  test("GET /login is accessible without a session", async ({ page }) => {
    await page.context().clearCookies();
    const response = await page.goto("/login", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/login");
  });
});
