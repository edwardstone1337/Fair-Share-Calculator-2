"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export interface NamesSectionProps {
  person1Name: string;
  person2Name: string;
  person1Error?: string;
  person2Error?: string;
  onPerson1NameChange: (value: string) => void;
  onPerson2NameChange: (value: string) => void;
  onCalculate: () => void;
}

export function NamesSection({
  person1Name,
  person2Name,
  person1Error,
  person2Error,
  onPerson1NameChange,
  onPerson2NameChange,
  onCalculate,
}: NamesSectionProps) {
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
          title="Names (Optional)"
          description="Add names to personalize your results, or leave blank to use \"Person 1\" and \"Person 2\"."
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
                placeholder="e.g. Alex (optional)"
                value={person1Name}
                onChange={(e) => onPerson1NameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                error={!!person1Error}
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
                placeholder="e.g. Jordan (optional)"
                value={person2Name}
                onChange={(e) => onPerson2NameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                error={!!person2Error}
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
      </div>
    </Card>
  );
}
