"use client";

import * as React from "react";
import { ExpenseInput } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { ErrorMessage } from "@/components/ui/error-message";
import { useInputTracking } from "@/lib/hooks/use-input-tracking";
import { useCurrency } from "@/lib/contexts/currency-context";

export interface ExpenseRowProps {
  expense: ExpenseInput;
  index: number;
  error?: string;
  /** When true, inputs are treated as pre-filled (no input_started) */
  prefilled?: boolean;
  onAmountChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onDelete: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ExpenseRow({
  expense,
  index,
  error,
  prefilled = false,
  onAmountChange,
  onLabelChange,
  onDelete,
  onKeyDown,
}: ExpenseRowProps) {
  const { currency } = useCurrency();
  const amountId = `expense-amount-${expense.id}`;
  const labelId = `expense-label-${expense.id}`;
  const showDelete = index > 0;

  const amountTracking = useInputTracking({
    fieldId: amountId,
    fieldType: "expense_amount",
    prefilled,
  });
  const labelTracking = useInputTracking({
    fieldId: labelId,
    fieldType: "expense_label",
    prefilled,
  });

  return (
    <div
      className="flex flex-row items-start"
      style={{ gap: "var(--space-4)" }}
    >
      <div className="flex-1 flex flex-col" style={{ minWidth: 0, maxWidth: "50%" }}>
        <Input
          id={amountId}
          prefix={currency.symbol}
          type="text"
          inputMode="numeric"
          placeholder="0"
          autoComplete="off"
          value={expense.amount}
          onChange={(e) => {
            const v = e.target.value;
            onAmountChange(v);
            amountTracking.onInput(v);
          }}
          onFocus={amountTracking.onFocus}
          onBlur={amountTracking.onBlur}
          onKeyDown={onKeyDown}
          error={!!error}
          aria-label="Expense amount"
        />
        <ErrorMessage
          id={`${amountId}-error`}
          message={error}
          visible={!!error}
        />
      </div>
      <div className="flex-1 flex flex-col" style={{ minWidth: 0, maxWidth: "50%" }}>
        <Input
          id={labelId}
          type="text"
          placeholder="e.g. Rent, Groceries"
          value={expense.label}
          onChange={(e) => {
            const v = e.target.value;
            onLabelChange(v);
            labelTracking.onInput(v);
          }}
          onFocus={labelTracking.onFocus}
          onBlur={labelTracking.onBlur}
          onKeyDown={onKeyDown}
          aria-label="Expense label"
        />
        <ErrorMessage
          id={`${labelId}-error`}
          message=""
          visible={false}
        />
      </div>
      <div
        style={{
          width: "var(--icon-button-size)",
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {showDelete ? (
          <IconButton
            icon="remove"
            variant="danger"
            onClick={onDelete}
            aria-label="Remove expense"
          />
        ) : (
          <div
            role="presentation"
            style={{
              width: "var(--icon-button-size)",
              height: "var(--icon-button-size)",
              minWidth: "var(--icon-button-size)",
              minHeight: "var(--icon-button-size)",
            }}
          />
        )}
      </div>
    </div>
  );
}
