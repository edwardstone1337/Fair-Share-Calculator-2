/**
 * Maps validation field keys to DOM element IDs used by calculator form inputs.
 * Used to scroll to and focus the first errored field when validation fails on submit.
 */

const FIELD_TO_ID: Record<string, string> = {
  person1Salary: "person1-salary",
  person2Salary: "person2-salary",
  person1Name: "person1-name",
  person2Name: "person2-name",
};

const SCROLL_DELAY_MS = 400;

function fieldToElementId(field: string): string | null {
  const mapped = FIELD_TO_ID[field];
  if (mapped) return mapped;
  if (field === "expenses-global") return null; // special case: use querySelector fallback
  if (field.startsWith("expense-")) {
    const suffix = field.slice("expense-".length);
    return `expense-amount-${suffix}`;
  }
  return null;
}

/**
 * Scrolls the viewport to the first validation error and focuses that input.
 * Uses smooth scroll and a short delay before focus so the scroll can complete.
 * Fails silently if the element is not found.
 * Returns the timeout ID so callers can clear it on unmount; returns null if no timeout was scheduled.
 */
export function scrollToFirstError(
  errors: { field: string; message: string }[]
): ReturnType<typeof setTimeout> | null {
  if (typeof document === "undefined" || errors.length === 0) return null;

  const first = errors[0];
  const field = first.field;

  let element: HTMLElement | null = null;

  if (field === "expenses-global") {
    element = document.querySelector<HTMLElement>(
      '[id^="expense-amount-"]'
    );
  } else {
    const id = fieldToElementId(field);
    if (id) element = document.getElementById(id);
  }

  if (!element) return null;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
  const timeoutId = setTimeout(() => {
    element?.focus({ preventScroll: true });
  }, SCROLL_DELAY_MS);
  return timeoutId;
}
