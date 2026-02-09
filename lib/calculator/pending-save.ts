import { parseSalary } from "./compute";
import { buildExpensesPayload, type SavePayloadExpense } from "./save-payload";
import type { SavedFormData } from "./types";

export interface PendingSaveInput {
  person1Name: string;
  person2Name: string;
  person1Salary: number;
  person2Salary: number;
  expenses: SavePayloadExpense[];
  currency: string;
}

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function normalizeCurrency(raw: unknown): string {
  if (typeof raw !== "string") return "USD";
  const normalized = raw.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "USD";
}

/**
 * Convert localStorage form data into a safe pending-save payload.
 * Returns null when critical fields are invalid.
 */
export function buildPendingSaveInput(
  form: SavedFormData
): PendingSaveInput | null {
  const person1Salary = parseSalary(form.salary1 ?? "");
  const person2Salary = parseSalary(form.salary2 ?? "");
  if (!isPositiveNumber(person1Salary) || !isPositiveNumber(person2Salary)) {
    return null;
  }

  const expenses = buildExpensesPayload(form.expenses ?? []);
  if (expenses.length === 0) {
    return null;
  }

  return {
    person1Name: (form.name1 ?? "").trim() || "Person 1",
    person2Name: (form.name2 ?? "").trim() || "Person 2",
    person1Salary,
    person2Salary,
    expenses,
    currency: normalizeCurrency(form.currency),
  };
}
