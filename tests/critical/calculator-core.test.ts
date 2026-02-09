import test from "node:test";
import assert from "node:assert/strict";
import { validateForm } from "../../lib/calculator/validation";
import { calculateShares } from "../../lib/calculator/compute";
import type { CalculatorFormState } from "../../lib/calculator/types";

function createBaseState(): CalculatorFormState {
  return {
    person1Name: "Alex",
    person2Name: "Sam",
    person1Salary: "4,000",
    person2Salary: "2,000",
    person1SalaryVisible: false,
    person2SalaryVisible: false,
    expenses: [{ id: "row-1", amount: "1,200", label: "" }],
    step: "input",
    validationErrors: [],
    result: null,
  };
}

test("validateForm accepts amount-only expense rows", () => {
  const state = createBaseState();
  const result = validateForm(state);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("validateForm rejects when there are no valid expense amounts", () => {
  const state = createBaseState();
  state.expenses = [{ id: "row-1", amount: "", label: "Rent" }];

  const result = validateForm(state);

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === "expenses-global"));
});

test("calculateShares keeps totals internally consistent", () => {
  const output = calculateShares(
    4000,
    2000,
    [
      { label: "Rent", amount: 1200 },
      { label: "Utilities", amount: 300 },
    ],
    "Alex",
    "Sam"
  );

  assert.equal(output.totalExpenses, 1500);
  assert.equal(output.person1TotalShare + output.person2TotalShare, 1500);
  assert.equal(output.person1Percentage + output.person2Percentage, 100);
  assert.equal(output.expenseBreakdown.length, 2);
});
