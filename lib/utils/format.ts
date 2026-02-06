/**
 * Format a numeric input string with comma grouping.
 * Only allows digits, commas, and periods.
 * Used for live formatting as user types.
 *
 * V1 logic:
 *   value.replace(/[^\d.,]/g, "")
 *   .replace(/,/g, "")
 *   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
 */
export function formatWithCommas(value: string): string {
  const digitsOnly = value.replace(/[^\d.,]/g, "").replace(/,/g, "");
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Sanitize a text input: remove dangerous characters, limit length.
 * Replicates V1's sanitizeInput().
 */
export function sanitizeInput(
  input: string,
  maxLength: number = 1000
): string {
  if (typeof input !== "string") return "";
  const trimmed =
    input.length > maxLength ? input.substring(0, maxLength) : input;
  return trimmed.replace(/[<>"'&]/g, "");
}
