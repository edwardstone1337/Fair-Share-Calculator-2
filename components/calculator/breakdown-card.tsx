"use client";

import type { ExpenseResult } from "@/lib/calculator/types";

export interface BreakdownCardProps {
  person1Name: string;
  person2Name: string;
  expenseBreakdown: ExpenseResult[];
  formatCurrency: (n: number) => string;
}

export function BreakdownCard({
  person1Name,
  person2Name,
  expenseBreakdown,
  formatCurrency,
}: BreakdownCardProps) {
  const displayName1 = person1Name.trim() || "Person 1";
  const displayName2 = person2Name.trim() || "Person 2";

  return (
    <article
      style={{
        background: "var(--breakdown-card-bg)",
        border: "1px solid var(--breakdown-card-border)",
        borderRadius: "var(--breakdown-card-radius)",
        padding: "var(--breakdown-card-padding-y) var(--breakdown-card-padding-x)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "var(--space-3)",
          marginBottom: "var(--space-5)",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "var(--breakdown-icon-size)",
            color: "var(--breakdown-icon-color)",
          }}
          aria-hidden
        >
          receipt_long
        </span>
        <h2
          style={{
            fontSize: "var(--breakdown-title-size)",
            fontWeight: "var(--breakdown-title-weight)",
            fontFamily: "var(--breakdown-title-family)",
            color: "var(--text-primary)",
          }}
        >
          Expense Breakdown
        </h2>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {expenseBreakdown.map((expense, index) => (
          <div
            key={`${expense.label}-${index}`}
            style={{
              background: "var(--breakdown-item-bg)",
              borderRadius: "var(--breakdown-item-radius)",
              border: "1px solid var(--breakdown-item-border)",
              padding: "var(--breakdown-item-padding)",
            }}
          >
            <div
              className="breakdown-expense-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-3)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--breakdown-expense-name-size)",
                  fontWeight: "var(--breakdown-expense-name-weight)",
                  color: "var(--breakdown-expense-name-text)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {expense.label}
              </span>
              <span
                style={{
                  fontSize: "var(--breakdown-expense-total-size)",
                  fontWeight: "var(--breakdown-expense-total-weight)",
                  color: "var(--breakdown-expense-total-text)",
                  textAlign: "right",
                }}
              >
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div
              className="breakdown-shares-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-2)",
              }}
            >
              <span
                className="breakdown-share-amount-mobile"
                style={{
                  fontSize: "var(--breakdown-share-amount-size)",
                  fontWeight: "var(--breakdown-share-amount-weight)",
                  fontFamily: "var(--breakdown-share-amount-family)",
                  color: "var(--breakdown-share-amount-text)",
                  textAlign: "left",
                }}
              >
                {formatCurrency(expense.person1Share)}
              </span>
              <span
                className="breakdown-share-amount-mobile"
                style={{
                  fontSize: "var(--breakdown-share-amount-size)",
                  fontWeight: "var(--breakdown-share-amount-weight)",
                  fontFamily: "var(--breakdown-share-amount-family)",
                  color: "var(--breakdown-share-amount-text)",
                  textAlign: "right",
                }}
              >
                {formatCurrency(expense.person2Share)}
              </span>
            </div>
            <div
              className="breakdown-names-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "var(--breakdown-person-name-size)",
                  fontWeight: "var(--breakdown-person-name-weight)",
                  color: "var(--breakdown-person-name-text)",
                  letterSpacing: "0.3px",
                  textTransform: "uppercase",
                }}
              >
                {displayName1}
              </span>
              <span
                style={{
                  fontSize: "var(--breakdown-person-name-size)",
                  fontWeight: "var(--breakdown-person-name-weight)",
                  color: "var(--breakdown-person-name-text)",
                  letterSpacing: "0.3px",
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                {displayName2}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
