"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { useInputTracking } from "@/lib/hooks/use-input-tracking";
import { ValidationSummary } from "./validation-summary";

export interface NamesSectionProps {
  person1Name: string;
  person2Name: string;
  person1Error?: string;
  person2Error?: string;
  /** When true, inputs are treated as pre-filled (no input_started) */
  prefilledNames?: boolean;
  validationErrors?: { field: string; message: string }[];
  onValidationSummaryTap?: () => void;
  onPerson1NameChange: (value: string) => void;
  onPerson2NameChange: (value: string) => void;
  onCalculate: () => void;
}

export function NamesSection({
  person1Name,
  person2Name,
  person1Error,
  person2Error,
  prefilledNames = false,
  validationErrors,
  onValidationSummaryTap,
  onPerson1NameChange,
  onPerson2NameChange,
  onCalculate,
}: NamesSectionProps) {
  const tracking1 = useInputTracking({
    fieldId: "person1-name",
    fieldType: "name",
    prefilled: prefilledNames,
  });
  const tracking2 = useInputTracking({
    fieldId: "person2-name",
    fieldType: "name",
    prefilled: prefilledNames,
  });

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
          title="Names"
          description={'Personalize your results, or leave blank for "Person 1" and "Person 2".'}
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
                  onPerson1NameChange(v);
                  tracking1.onInput(v);
                }}
                onFocus={tracking1.onFocus}
                onBlur={tracking1.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person1Error}
                aria-describedby={person1Error ? "person1-name-error" : undefined}
                maxLength={50}
                aria-label="Your name"
              />
            </div>
            <ErrorMessage
              id="person1-name-error"
              message={person1Error}
              visible={!!person1Error}
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
                  onPerson2NameChange(v);
                  tracking2.onInput(v);
                }}
                onFocus={tracking2.onFocus}
                onBlur={tracking2.onBlur}
                onKeyDown={handleKeyDown}
                error={!!person2Error}
                aria-describedby={person2Error ? "person2-name-error" : undefined}
                maxLength={50}
                aria-label="Their name"
              />
            </div>
            <ErrorMessage
              id="person2-name-error"
              message={person2Error}
              visible={!!person2Error}
            />
          </div>
        </div>
        <Button type="button" variant="primary" fullWidth onClick={onCalculate}>
          Calculate
        </Button>
        <ValidationSummary
          errors={validationErrors ?? []}
          onTap={onValidationSummaryTap ?? (() => {})}
        />
      </div>
    </Card>
  );
}
