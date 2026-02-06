"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { ErrorMessage } from "@/components/ui/error-message";
import { trackEvent } from "@/lib/analytics/gtag";
import { useInputTracking } from "@/lib/hooks/use-input-tracking";
import { useCurrency } from "@/lib/contexts/currency-context";

export interface IncomeSectionProps {
  person1Salary: string;
  person2Salary: string;
  person1SalaryVisible: boolean;
  person2SalaryVisible: boolean;
  person1Error?: string;
  person2Error?: string;
  /** When true, inputs are treated as pre-filled (no input_started) */
  prefilledSalaries?: boolean;
  onPerson1SalaryChange: (value: string) => void;
  onPerson2SalaryChange: (value: string) => void;
  onTogglePerson1Visibility: () => void;
  onTogglePerson2Visibility: () => void;
  onCalculate: () => void;
}

export function IncomeSection({
  person1Salary,
  person2Salary,
  person1SalaryVisible,
  person2SalaryVisible,
  person1Error,
  person2Error,
  prefilledSalaries = false,
  onPerson1SalaryChange,
  onPerson2SalaryChange,
  onTogglePerson1Visibility,
  onTogglePerson2Visibility,
  onCalculate,
}: IncomeSectionProps) {
  const { currency } = useCurrency();
  const tracking1 = useInputTracking({
    fieldId: "person1-salary",
    fieldType: "salary",
    prefilled: prefilledSalaries,
  });
  const tracking2 = useInputTracking({
    fieldId: "person2-salary",
    fieldType: "salary",
    prefilled: prefilledSalaries,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate();
    }
  };

  const handleToggle1 = () => {
    trackEvent("salary_toggle", {
      field_id: "salary1",
      visibility_state: person1SalaryVisible ? "hidden" : "visible",
    });
    onTogglePerson1Visibility();
  };

  const handleToggle2 = () => {
    trackEvent("salary_toggle", {
      field_id: "salary2",
      visibility_state: person2SalaryVisible ? "hidden" : "visible",
    });
    onTogglePerson2Visibility();
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--card-gap)" }}>
        <SectionHeader
          title="Income for Bill Splitting"
          description="Enter your after-tax income to calculate proportional bill splitting based on income."
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <Label htmlFor="person1-salary" required>
              Your salary
            </Label>
            <div
              style={{
                position: "relative",
                marginTop: "var(--space-1)",
              }}
            >
              <Input
                id="person1-salary"
                prefix={currency.symbol}
                type={person1SalaryVisible ? "text" : "password"}
                inputMode="numeric"
                placeholder="0"
                autoComplete="off"
                value={person1Salary}
                onChange={(e) => {
                  const v = e.target.value;
                  onPerson1SalaryChange(v);
                  tracking1.onInput(v);
                }}
                onFocus={tracking1.onFocus}
                onBlur={tracking1.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person1Error}
                style={
                  !person1SalaryVisible
                    ? { letterSpacing: "0.1em", paddingRight: "var(--space-10)" }
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Your salary"
              />
              <IconButton
                icon={person1SalaryVisible ? "visibility_off" : "visibility"}
                variant="ghost"
                size="sm"
                onClick={handleToggle1}
                aria-label={person1SalaryVisible ? "Hide salary" : "Show salary"}
                style={{
                  position: "absolute",
                  right: "var(--space-2)",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <ErrorMessage
              id="person1-salary-error"
              message={person1Error}
              visible={!!person1Error}
            />
          </div>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <Label htmlFor="person2-salary" required>
              Their salary
            </Label>
            <div
              style={{
                position: "relative",
                marginTop: "var(--space-1)",
              }}
            >
              <Input
                id="person2-salary"
                prefix={currency.symbol}
                type={person2SalaryVisible ? "text" : "password"}
                inputMode="numeric"
                placeholder="0"
                autoComplete="off"
                value={person2Salary}
                onChange={(e) => {
                  const v = e.target.value;
                  onPerson2SalaryChange(v);
                  tracking2.onInput(v);
                }}
                onFocus={tracking2.onFocus}
                onBlur={tracking2.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person2Error}
                style={
                  !person2SalaryVisible
                    ? { letterSpacing: "0.1em", paddingRight: "var(--space-10)" }
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Their salary"
              />
              <IconButton
                icon={person2SalaryVisible ? "visibility_off" : "visibility"}
                variant="ghost"
                size="sm"
                onClick={handleToggle2}
                aria-label={person2SalaryVisible ? "Hide salary" : "Show salary"}
                style={{
                  position: "absolute",
                  right: "var(--space-2)",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <ErrorMessage
              id="person2-salary-error"
              message={person2Error}
              visible={!!person2Error}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
