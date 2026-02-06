"use client";

import * as React from "react";

export interface SummaryCardProps {
  person1Name: string;
  person2Name: string;
  person1TotalShare: number;
  person2TotalShare: number;
  person1Percentage: number;
  person2Percentage: number;
  totalExpenses: number;
  expenseCount: number;
  formatCurrency: (n: number) => string;
  resultsHeadingRef?: React.RefObject<HTMLHeadingElement | null>;
}

export function SummaryCard({
  person1Name,
  person2Name,
  person1TotalShare,
  person2TotalShare,
  person1Percentage,
  person2Percentage,
  totalExpenses,
  expenseCount,
  formatCurrency,
  resultsHeadingRef,
}: SummaryCardProps) {
  const displayName1 = person1Name.trim() || "Person 1";
  const displayName2 = person2Name.trim() || "Person 2";

  return (
    <article
      style={{
        background: "var(--summary-card-bg)",
        border: "var(--summary-contribution-divider-width) solid var(--summary-card-border)",
        borderRadius: "var(--summary-card-radius)",
        padding: "var(--summary-card-padding-y) var(--summary-card-padding-x)",
      }}
    >
      <h2
        ref={resultsHeadingRef}
        tabIndex={-1}
        style={{
          fontSize: "var(--summary-title-size)",
          fontWeight: "var(--summary-title-weight)",
          fontFamily: "var(--summary-title-family)",
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        Your Fair Share Breakdown
      </h2>

      <div
        className="summary-contribution-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "var(--summary-person-name-size)",
              fontWeight: "var(--summary-person-name-weight)",
              color: "var(--summary-person-name-text)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {displayName1}
          </span>
          <span
            style={{
              fontSize: "var(--summary-amount-size)",
              fontWeight: "var(--summary-amount-weight)",
              fontFamily: "var(--summary-amount-family)",
              color: "var(--text-primary)",
            }}
          >
            {formatCurrency(person1TotalShare)}
          </span>
          <span
            style={{
              fontSize: "var(--summary-percentage-size)",
              fontWeight: "var(--summary-percentage-weight)",
              color: "var(--summary-percentage-text)",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {person1Percentage}% of total
          </span>
        </div>

        <div
          className="summary-divider-vertical"
          style={{
            width: "var(--summary-contribution-divider-width)",
            height: "var(--summary-contribution-divider-height)",
            background: "var(--summary-contribution-divider-color)",
            flexShrink: 0,
          }}
          aria-hidden
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "var(--summary-person-name-size)",
              fontWeight: "var(--summary-person-name-weight)",
              color: "var(--summary-person-name-text)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {displayName2}
          </span>
          <span
            style={{
              fontSize: "var(--summary-amount-size)",
              fontWeight: "var(--summary-amount-weight)",
              fontFamily: "var(--summary-amount-family)",
              color: "var(--text-primary)",
            }}
          >
            {formatCurrency(person2TotalShare)}
          </span>
          <span
            style={{
              fontSize: "var(--summary-percentage-size)",
              fontWeight: "var(--summary-percentage-weight)",
              color: "var(--summary-percentage-text)",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {person2Percentage}% of total
          </span>
        </div>
      </div>

      <div
        style={{
          height: "var(--summary-contribution-divider-width)",
          width: "100%",
          background: "var(--summary-divider-color)",
          marginTop: "var(--space-6)",
          marginBottom: "var(--space-6)",
        }}
        aria-hidden
      />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "var(--summary-total-label-size)",
            fontWeight: "var(--summary-total-label-weight)",
            color: "var(--summary-total-label-text)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Total Shared Expenses
        </div>
        <div
          style={{
            fontSize: "var(--summary-total-amount-size)",
            fontWeight: "var(--summary-total-amount-weight)",
            fontFamily: "var(--summary-total-amount-family)",
            color: "var(--text-primary)",
          }}
        >
          {formatCurrency(totalExpenses)}
        </div>
        <div
          style={{
            fontSize: "var(--summary-explanation-size)",
            color: "var(--summary-explanation-text)",
            marginTop: "var(--space-1)",
          }}
        >
          {expenseCount} expense{expenseCount !== 1 ? "s" : ""} combined
        </div>
      </div>

    </article>
  );
}
