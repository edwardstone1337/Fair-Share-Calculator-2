"use client";

import { Icon } from "@/components/ui/icon";

export interface ExplanationCardProps {
  person1Name: string;
  person2Name: string;
  person1Percentage: number;
  person2Percentage: number;
  person1Salary: number;
  person2Salary: number;
  combinedSalary: number;
  currencySymbol: string;
}

export function ExplanationCard({
  person1Name,
  person2Name,
  person1Percentage,
  person2Percentage,
  person1Salary,
  person2Salary,
  combinedSalary,
  currencySymbol,
}: ExplanationCardProps) {
  const name1 = person1Name.trim() || "Person 1";
  const name2 = person2Name.trim() || "Person 2";
  const combinedFormatted = combinedSalary.toLocaleString();
  const salary1Formatted = person1Salary.toLocaleString();
  const salary2Formatted = person2Salary.toLocaleString();

  const noteText = `We divide costs based on how much each of you contributes to your combined income. ${name1} earns ${currencySymbol}${salary1Formatted} and ${name2} earns ${currencySymbol}${salary2Formatted}, which adds up to ${currencySymbol}${combinedFormatted}. That means ${name1} earns ${person1Percentage}% of the total and ${name2} earns ${person2Percentage}%, so for each expense ${name1} pays ${person1Percentage}% and ${name2} pays ${person2Percentage}%.`;

  return (
    <article
      style={{
        background: "var(--explanation-card-bg)",
        border: "1px solid var(--explanation-card-border)",
        borderRadius: "var(--explanation-card-radius)",
        padding: "var(--explanation-card-padding-y) var(--explanation-card-padding-x)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        <Icon
          name="lightbulb"
          size="var(--explanation-icon-size)"
          color="var(--explanation-icon-color)"
        />
        <h2
          style={{
            fontSize: "var(--explanation-title-size)",
            fontWeight: "var(--explanation-title-weight)",
            fontFamily: "var(--explanation-title-family)",
            color: "var(--text-primary)",
          }}
        >
          How Fair Share Works
        </h2>
      </header>

      <p
        style={{
          fontSize: "var(--explanation-text-size)",
          color: "var(--explanation-text-color)",
          lineHeight: "var(--explanation-text-line-height)",
          marginBottom: "var(--space-4)",
        }}
      >
        We look at what each person earns and work out a fair percentage.
      </p>

      <div
        style={{
          background: "var(--explanation-example-bg)",
          borderRadius: "var(--explanation-example-radius)",
          padding: "var(--explanation-example-padding)",
          margin: "var(--space-4) 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          <span
            style={{
              fontSize: "var(--explanation-label-size)",
              fontWeight: "var(--explanation-label-weight)",
              color: "var(--explanation-label-text)",
            }}
          >
            {name1} pays:
          </span>
          <span
            style={{
              fontSize: "var(--explanation-math-size)",
              fontWeight: "var(--explanation-math-weight)",
              color: "var(--explanation-math-text)",
              background: "var(--explanation-math-bg)",
              borderRadius: "var(--explanation-math-radius)",
              padding: "var(--explanation-math-padding-y) var(--explanation-math-padding-x)",
            }}
          >
            {person1Percentage}% of each expense
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "var(--explanation-label-size)",
              fontWeight: "var(--explanation-label-weight)",
              color: "var(--explanation-label-text)",
            }}
          >
            {name2} pays:
          </span>
          <span
            style={{
              fontSize: "var(--explanation-math-size)",
              fontWeight: "var(--explanation-math-weight)",
              color: "var(--explanation-math-text)",
              background: "var(--explanation-math-bg)",
              borderRadius: "var(--explanation-math-radius)",
              padding: "var(--explanation-math-padding-y) var(--explanation-math-padding-x)",
            }}
          >
            {person2Percentage}% of each expense
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: "var(--explanation-note-size)",
          color: "var(--explanation-note-text)",
          fontStyle: "italic",
          marginTop: "var(--space-4)",
        }}
      >
        {noteText}
      </p>
    </article>
  );
}
