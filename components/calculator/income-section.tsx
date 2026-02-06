"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";

export interface IncomeSectionProps {
  person1Salary: string;
  person2Salary: string;
  person1SalaryVisible: boolean;
  person2SalaryVisible: boolean;
  person1Error?: string;
  person2Error?: string;
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
  onPerson1SalaryChange,
  onPerson2SalaryChange,
  onTogglePerson1Visibility,
  onTogglePerson2Visibility,
  onCalculate,
}: IncomeSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate();
    }
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--card-gap)" }}>
        <SectionHeader
          title="Income for Bill Splitting"
          description="Enter your after-tax income to calculate proportional bill splitting based on what each person earns."
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
                type={person1SalaryVisible ? "text" : "password"}
                inputMode="numeric"
                placeholder="0"
                value={person1Salary}
                onChange={(e) => onPerson1SalaryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                error={!!person1Error}
                style={
                  !person1SalaryVisible
                    ? { letterSpacing: "0.1em", paddingRight: "var(--space-10)" }
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Your salary"
              />
              <button
                type="button"
                onClick={onTogglePerson1Visibility}
                aria-label={person1SalaryVisible ? "Hide salary" : "Show salary"}
                style={{
                  position: "absolute",
                  right: "var(--space-2)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "var(--salary-toggle-size)",
                  height: "var(--salary-toggle-size)",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={person1SalaryVisible ? "/images/Hide.svg" : "/images/Show.svg"}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
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
                type={person2SalaryVisible ? "text" : "password"}
                inputMode="numeric"
                placeholder="0"
                value={person2Salary}
                onChange={(e) => onPerson2SalaryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                error={!!person2Error}
                style={
                  !person2SalaryVisible
                    ? { letterSpacing: "0.1em", paddingRight: "var(--space-10)" }
                    : { paddingRight: "var(--space-10)" }
                }
                aria-label="Their salary"
              />
              <button
                type="button"
                onClick={onTogglePerson2Visibility}
                aria-label={person2SalaryVisible ? "Hide salary" : "Show salary"}
                style={{
                  position: "absolute",
                  right: "var(--space-2)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "var(--salary-toggle-size)",
                  height: "var(--salary-toggle-size)",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={person2SalaryVisible ? "/images/Hide.svg" : "/images/Show.svg"}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
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
