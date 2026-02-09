export interface SavePayloadExpenseInput {
  amount: string;
  label: string;
}

export interface SavePayloadExpense {
  label: string;
  amount: number;
}

function parsePositiveAmount(raw: string): number | null {
  const amount = Number.parseFloat(raw.replace(/,/g, "").trim());
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount;
}

/**
 * Build the expenses payload used by save flows.
 * Keep this aligned with calculator behavior:
 * - rows with valid amount are included
 * - blank labels default to "Expense"
 * - invalid/blank amounts are excluded
 */
export function buildExpensesPayload(
  expenses: SavePayloadExpenseInput[]
): SavePayloadExpense[] {
  return expenses.flatMap((expense) => {
    const amount = parsePositiveAmount(expense.amount);
    if (amount === null) return [];

    return [
      {
        label: expense.label.trim() || "Expense",
        amount,
      },
    ];
  });
}
