/**
 * Currency formatting utilities with Indian Rupee support.
 * Follows Indian numbering system: lakhs and crores.
 */

const INR_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "INR";

/**
 * Format a number as Indian Rupee with ₹ symbol.
 * Example: 125000 → "₹1,25,000"
 */
export function formatINR(
  amount: number,
  options: {
    compact?: boolean;
    showDecimals?: boolean;
    currency?: string;
  } = {}
): string {
  const { compact = false, showDecimals = false, currency = DEFAULT_CURRENCY } = options;

  if (compact) {
    if (amount >= 10_000_000) {
      return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
    }
    if (amount >= 100_000) {
      return `₹${(amount / 100_000).toFixed(2)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat(INR_LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Format a plain number with Indian comma notation.
 * Example: 1234567 → "12,34,567"
 */
export function formatIndianNumber(amount: number): string {
  return new Intl.NumberFormat(INR_LOCALE).format(amount);
}

/**
 * Parse a currency string to a number.
 * Handles ₹, commas, and spaces.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate percentage change between two values.
 * Returns { value, isPositive, formatted }
 */
export function percentageChange(
  current: number,
  previous: number
): { value: number; isPositive: boolean; formatted: string } {
  if (previous === 0) {
    return { value: 0, isPositive: true, formatted: "N/A" };
  }
  const value = ((current - previous) / Math.abs(previous)) * 100;
  const isPositive = value >= 0;
  const formatted = `${isPositive ? "+" : ""}${value.toFixed(1)}%`;
  return { value, isPositive, formatted };
}

/**
 * GST rate options used in India
 */
export const GST_RATES = [0, 5, 12, 18, 28] as const;
export type GSTRate = (typeof GST_RATES)[number];

/**
 * Calculate GST breakdown (CGST + SGST for intra-state, IGST for inter-state)
 */
export function calculateGST(
  taxableAmount: number,
  gstRate: number,
  isInterState: boolean = false
): {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
} {
  const totalTax = (taxableAmount * gstRate) / 100;
  if (isInterState) {
    return { cgst: 0, sgst: 0, igst: totalTax, totalTax };
  }
  return { cgst: totalTax / 2, sgst: totalTax / 2, igst: 0, totalTax };
}
