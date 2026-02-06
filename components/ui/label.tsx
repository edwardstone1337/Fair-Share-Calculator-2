import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Label({
  htmlFor,
  required = false,
  children,
  className,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(className)}
      style={{
        fontSize: "var(--label-font-size)",
        fontWeight: "var(--label-font-weight)",
        color: "var(--label-text)",
      }}
    >
      {required && (
        <span
          style={{
            color: "var(--status-error)",
            fontWeight: "bold",
            paddingRight: "var(--space-1)",
          }}
        >
          *
        </span>
      )}
      {children}
    </label>
  );
}
