"use client";

import * as React from "react";
import { ExpenseInput, FieldError } from "@/lib/calculator/types";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ExpenseRow } from "./expense-row";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ErrorMessage } from "@/components/ui/error-message";

export interface ExpensesSectionProps {
  expenses: ExpenseInput[];
  errors: FieldError[];
  globalError?: string;
  /** When true, expense inputs are treated as pre-filled (no input_started) */
  prefilledExpenses?: boolean;
  onAmountChange: (id: string, value: string) => void;
  onLabelChange: (id: string, value: string) => void;
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  onCalculate: () => void;
}

export function ExpensesSection({
  expenses,
  errors,
  globalError,
  prefilledExpenses = false,
  onAmountChange,
  onLabelChange,
  onAddExpense,
  onDeleteExpense,
  onCalculate,
}: ExpensesSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate();
    }
  };

  const getErrorForExpense = (id: string): string | undefined => {
    return errors.find((err) => err.field === `expense-${id}`)?.message;
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--card-gap)" }}>
        <SectionHeader
          title="Shared Bills & Expenses"
          description="Enter rent, utilities, groceries, or any shared bills to split based on income."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div
            className="flex flex-row"
            style={{
              gap: "var(--space-4)",
              fontSize: "var(--expense-header-font-size)",
              fontWeight: "var(--expense-header-font-weight)",
              color: "var(--expense-header-text)",
            }}
          >
            <div
              style={{
                flex: "1 1 0",
                minWidth: 0,
                maxWidth: "50%",
              }}
            >
              <span style={{ color: "var(--status-error)" }}>*</span> Amount
            </div>
            <div
              style={{
                flex: "1 1 0",
                minWidth: 0,
                maxWidth: "50%",
              }}
            >
              Expense
            </div>
            <div
              style={{
                width: "var(--space-8)",
                flexShrink: 0,
              }}
            />
          </div>
          {expenses.map((expense, index) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              index={index}
              error={getErrorForExpense(expense.id)}
              prefilled={prefilledExpenses}
              onAmountChange={(value) => onAmountChange(expense.id, value)}
              onLabelChange={(value) => onLabelChange(expense.id, value)}
              onDelete={() => onDeleteExpense(expense.id)}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
        <ErrorMessage
          id="expenses-global-error"
          message={globalError}
          visible={!!globalError}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={onAddExpense}
          style={{
            background: "var(--add-expense-bg)",
            border: "var(--border-width-default) solid var(--add-expense-border)",
            color: "var(--add-expense-text)",
            fontFamily: "var(--add-expense-font-family)",
            fontSize: "var(--add-expense-font-size)",
            fontWeight: "var(--add-expense-font-weight)",
            borderRadius: "var(--add-expense-radius)",
            padding: "var(--add-expense-padding-y) var(--add-expense-padding-x)",
          }}
          className="border-[var(--add-expense-border)] hover:border-[var(--add-expense-border-hover)] hover:bg-[var(--add-expense-bg-hover)]"
        >
          <Icon
            name="add"
            size="var(--font-size-lg)"
            style={{ marginRight: "var(--space-2)" }}
          />
          Add Expense
        </Button>
      </div>
    </Card>
  );
}
