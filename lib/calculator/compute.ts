import { ExpenseResult, CalculatorResult } from "./types";

/**
 * Parse a salary string (may contain commas) to a number.
 * Returns NaN if invalid.
 */
export function parseSalary(raw: string): number {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "") return NaN;
  return parseFloat(cleaned);
}

/**
 * Parse an expense amount string to a number.
 * Returns NaN if invalid.
 */
export function parseExpenseAmount(raw: string): number {
  return parseSalary(raw); // Same logic
}

/**
 * Core calculation: given two salaries and a list of valid expenses,
 * compute proportional shares.
 *
 * IMPORTANT: This must match V1 exactly:
 *   share1 = (salary1 / (salary1 + salary2)) * expense
 *   share2 = (salary2 / (salary1 + salary2)) * expense
 *   percentage = Math.round((totalShare / totalExpenses) * 100)
 */
/** Result of calculateShares without currency (hook adds currencySymbol). */
export type CalculateSharesResult = Omit<CalculatorResult, "currencySymbol">;

export function calculateShares(
  person1Salary: number,
  person2Salary: number,
  expenses: { amount: number; label: string }[],
  person1Name: string = "Person 1",
  person2Name: string = "Person 2"
): CalculateSharesResult {
  const combinedSalary = person1Salary + person2Salary;

  const expenseBreakdown: ExpenseResult[] = expenses.map((exp) => ({
    label: exp.label || "Expense",
    amount: exp.amount,
    person1Share: (person1Salary / combinedSalary) * exp.amount,
    person2Share: (person2Salary / combinedSalary) * exp.amount,
  }));

  const person1TotalShare = expenseBreakdown.reduce(
    (sum, e) => sum + e.person1Share,
    0
  );
  const person2TotalShare = expenseBreakdown.reduce(
    (sum, e) => sum + e.person2Share,
    0
  );
  const totalExpenses = person1TotalShare + person2TotalShare;

  return {
    person1Name: person1Name || "Person 1",
    person2Name: person2Name || "Person 2",
    person1TotalShare,
    person2TotalShare,
    person1Percentage: Math.round((person1TotalShare / totalExpenses) * 100),
    person2Percentage: Math.round((person2TotalShare / totalExpenses) * 100),
    totalExpenses,
    expenseBreakdown,
    person1Salary,
    person2Salary,
    combinedSalary,
  };
}

/**
 * Format a number for display with currency symbol.
 * e.g. formatCurrency(1234.5, '$') → "$1,234.50"
 * Symbol defaults to '$' for backward compatibility.
 */
export function formatCurrency(num: number, symbol: string = '$'): string {
  const formatted = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return `${symbol}${formatted}`;
}
