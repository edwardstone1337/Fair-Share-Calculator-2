import test from "node:test";
import assert from "node:assert/strict";
import { buildExpensesPayload } from "../../lib/calculator/save-payload";

test("buildExpensesPayload includes amount-only rows and defaults label", () => {
  const payload = buildExpensesPayload([
    { amount: "1,200", label: "" },
    { amount: "250.50", label: "Internet" },
  ]);

  assert.deepEqual(payload, [
    { amount: 1200, label: "Expense" },
    { amount: 250.5, label: "Internet" },
  ]);
});

test("buildExpensesPayload excludes rows with blank or invalid amounts", () => {
  const payload = buildExpensesPayload([
    { amount: "", label: "Rent" },
    { amount: "abc", label: "Utilities" },
    { amount: "-10", label: "Invalid negative" },
    { amount: "300", label: "Groceries" },
  ]);

  assert.deepEqual(payload, [{ amount: 300, label: "Groceries" }]);
});
