"use client";

import * as React from "react";
import type { CalculatorResult } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/compute";
import { SummaryCard } from "./summary-card";
import { BreakdownCard } from "./breakdown-card";
import { ExplanationCard } from "./explanation-card";
import { ResultsFooter } from "./results-footer";

export interface ResultsViewProps {
  result: CalculatorResult;
  onBackToEdit: () => void;
  onShare: () => void;
  resultsHeadingRef?: React.RefObject<HTMLHeadingElement | null>;
}

export function ResultsView({
  result,
  onBackToEdit,
  onShare,
  resultsHeadingRef,
}: ResultsViewProps) {
  const format = formatCurrency;
  const expenseCount = result.expenseBreakdown.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <SummaryCard
        person1Name={result.person1Name}
        person2Name={result.person2Name}
        person1TotalShare={result.person1TotalShare}
        person2TotalShare={result.person2TotalShare}
        person1Percentage={result.person1Percentage}
        person2Percentage={result.person2Percentage}
        totalExpenses={result.totalExpenses}
        expenseCount={expenseCount}
        formatCurrency={format}
        resultsHeadingRef={resultsHeadingRef}
      />
      <BreakdownCard
        person1Name={result.person1Name}
        person2Name={result.person2Name}
        expenseBreakdown={result.expenseBreakdown}
        formatCurrency={format}
      />
      <ExplanationCard
        person1Name={result.person1Name}
        person2Name={result.person2Name}
        person1Percentage={result.person1Percentage}
        person2Percentage={result.person2Percentage}
        person1Salary={result.person1Salary}
        person2Salary={result.person2Salary}
        combinedSalary={result.combinedSalary}
      />
      <ResultsFooter onBackToEdit={onBackToEdit} onShare={onShare} />
    </div>
  );
}
