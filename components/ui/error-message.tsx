import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ErrorMessageProps {
  message: string | undefined;
  id: string;
  visible?: boolean;
  className?: string;
}

export function ErrorMessage({
  message,
  id,
  visible = false,
  className,
}: ErrorMessageProps) {
  return (
    <div
      id={id}
      role="alert"
      className={cn(className)}
      style={{
        fontSize: "var(--error-font-size)",
        color: "var(--error-text)",
        height: "var(--space-4)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {message ?? "\u00A0"}
    </div>
  );
}
