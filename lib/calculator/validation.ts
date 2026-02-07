import {
  CalculatorFormState,
  FieldError,
  ValidationResult,
} from "./types";
import { parseSalary, parseExpenseAmount } from "./compute";

const MAX_SALARY = 999_999_999;
const MAX_EXPENSE = 999_999_999;
const MAX_NAME_LENGTH = 50;

export function validateForm(state: CalculatorFormState): ValidationResult {
  const errors: FieldError[] = [];

  // --- Names (optional, but length-limited) ---
  if (state.person1Name.trim().length > MAX_NAME_LENGTH) {
    errors.push({
      field: "person1Name",
      message: "Keep names to 50 characters or fewer",
    });
  }
  if (state.person2Name.trim().length > MAX_NAME_LENGTH) {
    errors.push({
      field: "person2Name",
      message: "Keep names to 50 characters or fewer",
    });
  }

  // --- Salaries (required, must be positive number ≤ max) ---
  const salary1 = parseSalary(state.person1Salary);
  if (isNaN(salary1) || salary1 <= 0 || salary1 > MAX_SALARY) {
    errors.push({
      field: "person1Salary",
      message: "Enter a take-home salary to get started",
    });
  }

  const salary2 = parseSalary(state.person2Salary);
  if (isNaN(salary2) || salary2 <= 0 || salary2 > MAX_SALARY) {
    errors.push({
      field: "person2Salary",
      message: "Enter a take-home salary to get started",
    });
  }

  // --- Expenses ---
  // Expense row rules:
  //   - Empty amount = skip (label-only or both empty; row silently ignored)
  //   - Amount + empty label = OK (label defaults to "Expense")
  //   - Amount + label = OK
  //   - Amount must be > 0 and ≤ max
  //   - At least one valid expense required (validExpenseCount === 0 → global error)

  let validExpenseCount = 0;

  state.expenses.forEach((expense) => {
    const rawAmount = expense.amount.replace(/,/g, "").trim();

    if (rawAmount === "") {
      return; // Skip — no amount: row ignored (label-only or both empty)
    }

    const amount = parseExpenseAmount(expense.amount);
    if (isNaN(amount) || amount <= 0 || amount > MAX_EXPENSE) {
      errors.push({
        field: `expense-${expense.id}`,
        message: "Enter an expense amount",
      });
      return;
    }

    validExpenseCount++;
  });

  if (validExpenseCount === 0) {
    errors.push({
      field: "expenses-global",
      message:
        "Add at least one expense to see your split",
    });
  }

  return { valid: errors.length === 0, errors };
}
