/**
 * GA4 event tracking utility.
 * Wraps window.gtag with type safety and error handling.
 * Silent no-op if gtag is not loaded (e.g. during SSR or if blocked by ad blocker).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = "G-TQZ0HGB3MT";

/**
 * Send a custom event to GA4.
 * Fails silently if gtag is not available.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, params);
    }
  } catch {
    // Never let tracking break the app
  }
}

/**
 * Bucket an expense total into a privacy-safe range.
 * Matches V1 bucketing exactly.
 */
export function bucketExpenseAmount(total: number): string {
  if (total < 100) return "0-100";
  if (total < 250) return "100-250";
  if (total < 500) return "250-500";
  if (total < 1000) return "500-1000";
  return "1000+";
}

/**
 * Bucket a salary ratio into a privacy-safe label.
 * Matches V1 bucketing exactly.
 */
export function bucketSplitRatio(salary1: number, salary2: number): string {
  const ratio = salary1 / (salary1 + salary2);
  if (ratio >= 0.45 && ratio < 0.55) return "50-50";
  if (ratio >= 0.55 && ratio < 0.65) return "60-40";
  if (ratio >= 0.65 && ratio < 0.75) return "70-30";
  if (ratio >= 0.75 && ratio < 0.85) return "80-20";
  return "other";
}
