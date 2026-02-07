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
  person1Name?: string;
  person2Name?: string;
  person1NameError?: string;
  person2NameError?: string;
  person1Salary: string;
  person2Salary: string;
  person1SalaryVisible: boolean;
  person2SalaryVisible: boolean;
  person1Error?: string;
  person2Error?: string;
  /** When true, inputs are treated as pre-filled (no input_started) */
  prefilledSalaries?: boolean;
  /** When true, name inputs are treated as pre-filled (no input_started) */
  prefilledNames?: boolean;
  onPerson1NameChange?: (value: string) => void;
  onPerson2NameChange?: (value: string) => void;
  onPerson1SalaryChange: (value: string) => void;
  onPerson2SalaryChange: (value: string) => void;
  onTogglePerson1Visibility: () => void;
  onTogglePerson2Visibility: () => void;
  onCalculate: () => void;
}

export function IncomeSection({
  person1Name = "",
  person2Name = "",
  person1NameError,
  person2NameError,
  person1Salary,
  person2Salary,
  person1SalaryVisible,
  person2SalaryVisible,
  person1Error,
  person2Error,
  prefilledSalaries = false,
  prefilledNames = false,
  onPerson1NameChange = () => {},
  onPerson2NameChange = () => {},
  onPerson1SalaryChange,
  onPerson2SalaryChange,
  onTogglePerson1Visibility,
  onTogglePerson2Visibility,
  onCalculate,
}: IncomeSectionProps) {
  const { currency } = useCurrency();
  const nameTracking1 = useInputTracking({
    fieldId: "person1-name",
    fieldType: "name",
    prefilled: prefilledNames,
  });
  const nameTracking2 = useInputTracking({
    fieldId: "person2-name",
    fieldType: "name",
    prefilled: prefilledNames,
  });
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
          title="Your Incomes"
          description="Enter names and after-tax salaries to split bills proportionally based on income."
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
            <Label htmlFor="person1-name">Your name</Label>
            <div style={{ marginTop: "var(--space-1)" }}>
              <Input
                id="person1-name"
                type="text"
                value={person1Name}
                onChange={(e) => {
                  const v = e.target.value;
                  onPerson1NameChange?.(v);
                  nameTracking1.onInput(v);
                }}
                onFocus={nameTracking1.onFocus}
                onBlur={nameTracking1.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person1NameError}
                aria-describedby={person1NameError ? "person1-name-error" : undefined}
                maxLength={50}
                aria-label="Your name"
              />
            </div>
            <ErrorMessage
              id="person1-name-error"
              message={person1NameError}
              visible={!!person1NameError}
            />
          </div>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <Label htmlFor="person2-name">Their name</Label>
            <div style={{ marginTop: "var(--space-1)" }}>
              <Input
                id="person2-name"
                type="text"
                value={person2Name}
                onChange={(e) => {
                  const v = e.target.value;
                  onPerson2NameChange?.(v);
                  nameTracking2.onInput(v);
                }}
                onFocus={nameTracking2.onFocus}
                onBlur={nameTracking2.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person2NameError}
                aria-describedby={person2NameError ? "person2-name-error" : undefined}
                maxLength={50}
                aria-label="Their name"
              />
            </div>
            <ErrorMessage
              id="person2-name-error"
              message={person2NameError}
              visible={!!person2NameError}
            />
          </div>
        </div>
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
                type="text"
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
                aria-describedby={person1Error ? "person1-salary-error" : undefined}
                style={
                  !person1SalaryVisible
                    ? ({
                        letterSpacing: "0.1em",
                        paddingRight: "var(--space-10)",
                        WebkitTextSecurity: "disc",
                      } as React.CSSProperties)
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Your salary"
              />
              <IconButton
                icon={person1SalaryVisible ? "visibility_off" : "visibility"}
                variant="ghost"
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
                type="text"
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
                aria-describedby={person2Error ? "person2-salary-error" : undefined}
                style={
                  !person2SalaryVisible
                    ? ({
                        letterSpacing: "0.1em",
                        paddingRight: "var(--space-10)",
                        WebkitTextSecurity: "disc",
                      } as React.CSSProperties)
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Their salary"
              />
              <IconButton
                icon={person2SalaryVisible ? "visibility_off" : "visibility"}
                variant="ghost"
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
