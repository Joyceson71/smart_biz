/**
 * formatCurrency — format a number as Indian Rupees (en-IN locale)
 */
export function formatCurrency(
  amount: number,
  options?: { maximumFractionDigits?: number }
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount);
}

/**
 * formatDate — format a date string or Date object to "MMM DD, YYYY"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * cn — merge Tailwind class names safely (re-exported from src/lib/utils.ts)
 */
export { cn } from "@/lib/utils";
