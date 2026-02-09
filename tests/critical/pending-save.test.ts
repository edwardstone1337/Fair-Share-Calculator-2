import test from "node:test";
import assert from "node:assert/strict";
import { buildPendingSaveInput } from "../../lib/calculator/pending-save";
import type { SavedFormData } from "../../lib/calculator/types";

function createBaseForm(): SavedFormData {
  return {
    name1: "Alex",
    name2: "Sam",
    salary1: "4,000",
    salary2: "2,000",
    expenses: [{ amount: "1,200", label: "" }],
    currency: "usd",
  };
}

test("buildPendingSaveInput accepts valid data and normalizes defaults", () => {
  const input = buildPendingSaveInput(createBaseForm());

  assert.deepEqual(input, {
    person1Name: "Alex",
    person2Name: "Sam",
    person1Salary: 4000,
    person2Salary: 2000,
    expenses: [{ amount: 1200, label: "Expense" }],
    currency: "USD",
  });
});

test("buildPendingSaveInput rejects invalid salaries", () => {
  const form = createBaseForm();
  form.salary1 = "";

  const input = buildPendingSaveInput(form);

  assert.equal(input, null);
});

test("buildPendingSaveInput rejects when there are no valid expenses", () => {
  const form = createBaseForm();
  form.expenses = [
    { amount: "", label: "Rent" },
    { amount: "abc", label: "Utilities" },
  ];

  const input = buildPendingSaveInput(form);

  assert.equal(input, null);
});
