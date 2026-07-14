import { describe, it, expect } from "vitest";
import { isPublicPath, isProtectedPath } from "@/lib/auth/path-utils";

describe("isPublicPath", () => {
  it("allows /login", () => expect(isPublicPath("/login")).toBe(true));
  it("allows /register", () => expect(isPublicPath("/register")).toBe(true));
  it("allows /forgot-password", () => expect(isPublicPath("/forgot-password")).toBe(true));
  it("allows /reset-password", () => expect(isPublicPath("/reset-password")).toBe(true));
  it("allows /verify-email", () => expect(isPublicPath("/verify-email")).toBe(true));
  it("allows /api/health", () => expect(isPublicPath("/api/health")).toBe(true));
  it("allows /api/auth/callback", () => expect(isPublicPath("/api/auth/callback")).toBe(true));
  it("allows /api/webhooks/stripe", () => expect(isPublicPath("/api/webhooks/stripe")).toBe(true));
  it("blocks /dashboard", () => expect(isPublicPath("/dashboard")).toBe(false));
  it("blocks /customers", () => expect(isPublicPath("/customers")).toBe(false));
  it("blocks /inventory", () => expect(isPublicPath("/inventory")).toBe(false));
  it("blocks /invoices", () => expect(isPublicPath("/invoices")).toBe(false));
  it("blocks /api/chat", () => expect(isPublicPath("/api/chat")).toBe(false));
});

describe("isProtectedPath (inverse)", () => {
  it("is true for /customers", () => expect(isProtectedPath("/customers")).toBe(true));
  it("is false for /login", () => expect(isProtectedPath("/login")).toBe(false));
});
