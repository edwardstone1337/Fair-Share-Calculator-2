import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(className)}>
      <h2
        style={{
          fontFamily: "var(--section-title-family)",
          fontSize: "var(--section-title-size)",
          fontWeight: "var(--section-title-weight)",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: "var(--section-description-size)",
            color: "var(--section-description-text)",
            marginTop: "var(--space-stack-sm)",
          }}
        >
          {description}
        </p>
      )}
    </header>
  );
}
