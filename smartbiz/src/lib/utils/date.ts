import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/** Format a date to display string (e.g., "12 Jan 2024") */
export function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd MMM yyyy");
}

/** Format a date to ISO string (YYYY-MM-DD) */
export function formatDateISO(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd");
}

/** Format a datetime to display string */
export function formatDateTime(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd MMM yyyy, hh:mm a");
}

/** Format as relative time (e.g., "3 days ago") */
export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

/** Get financial year label for Indian FY (Apr–Mar) */
export function getFinancialYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-based
  if (month >= 4) {
    return `FY ${year}–${(year + 1).toString().slice(2)}`;
  }
  return `FY ${year - 1}–${year.toString().slice(2)}`;
}

/** Get start of Indian financial year for a given date */
export function getFYStart(date: Date = new Date()): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 4) {
    return new Date(year, 3, 1); // April 1 this year
  }
  return new Date(year - 1, 3, 1); // April 1 last year
}

/** Check if invoice is overdue */
export function isOverdue(dueDate: Date | string): boolean {
  const d = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return isValid(d) && d < new Date();
}

/** Days until due (negative means overdue) */
export function daysUntilDue(dueDate: Date | string): number {
  const d = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  if (!isValid(d)) return 0;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
