import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

describe("cn (class name merger)", () => {
  it("merges class names without duplicates", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const active = true;
    expect(cn("base", active && "active")).toBe("base active");
  });

  it("handles undefined/null gracefully", () => {
    expect(cn("base", undefined, null, false)).toBe("base");
  });
});

describe("formatCurrency", () => {
  it("formats zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
    expect(result).toContain("₹");
  });

  it("formats a positive integer", () => {
    const result = formatCurrency(1000);
    expect(result).toContain("₹");
    expect(result).toContain("1,000");
  });

  it("formats a large number in Indian system (lakhs)", () => {
    const result = formatCurrency(100000);
    expect(result).toContain("₹");
    // In en-IN locale, 100000 formats as 1,00,000
    expect(result).toContain("1,00,000");
  });

  it("respects maximumFractionDigits option", () => {
    const result = formatCurrency(1234.567, { maximumFractionDigits: 0 });
    expect(result).not.toContain(".");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("2024");
    expect(result).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
  });

  it("formats a Date object", () => {
    const date = new Date("2024-06-01");
    const result = formatDate(date);
    expect(result).toContain("2024");
    expect(result).toContain("Jun");
  });

  it("handles different months correctly", () => {
    const dec = formatDate("2023-12-25");
    expect(dec).toContain("Dec");
  });
});
