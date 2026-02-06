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
      message: "Name must be 50 characters or less",
    });
  }
  if (state.person2Name.trim().length > MAX_NAME_LENGTH) {
    errors.push({
      field: "person2Name",
      message: "Name must be 50 characters or less",
    });
  }

  // --- Salaries (required, must be positive number ≤ max) ---
  const salary1 = parseSalary(state.person1Salary);
  if (isNaN(salary1) || salary1 <= 0 || salary1 > MAX_SALARY) {
    errors.push({
      field: "person1Salary",
      message: "Please enter a valid salary amount",
    });
  }

  const salary2 = parseSalary(state.person2Salary);
  if (isNaN(salary2) || salary2 <= 0 || salary2 > MAX_SALARY) {
    errors.push({
      field: "person2Salary",
      message: "Please enter a valid salary amount",
    });
  }

  // --- Expenses ---
  // V1 rules:
  //   - Empty amount + empty label = skip (OK)
  //   - Amount + empty label = OK (label defaults to "Expense")
  //   - Empty amount + label present = ERROR (needs amount)
  //   - Amount + label = OK
  //   - Amount must be > 0 and ≤ max
  //   - At least one valid expense required

  let validExpenseCount = 0;

  state.expenses.forEach((expense) => {
    const rawAmount = expense.amount.replace(/,/g, "").trim();
    const label = expense.label.trim();

    if (rawAmount === "" && label === "") {
      // Skip — both empty is OK
      return;
    }

    if (rawAmount === "" && label !== "") {
      // Label present but no amount — error
      errors.push({
        field: `expense-${expense.id}`,
        message: "Please enter an expense amount",
      });
      return;
    }

    const amount = parseExpenseAmount(expense.amount);
    if (isNaN(amount) || amount <= 0 || amount > MAX_EXPENSE) {
      errors.push({
        field: `expense-${expense.id}`,
        message: "Please enter a valid expense amount",
      });
      return;
    }

    validExpenseCount++;
  });

  if (validExpenseCount === 0) {
    errors.push({
      field: "expenses-global",
      message:
        "Please enter at least one expense amount to calculate",
    });
  }

  return { valid: errors.length === 0, errors };
}
