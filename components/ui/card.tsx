import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(className)}
      style={{
        background: "var(--card-bg)",
        border: "var(--border-width-default) solid var(--card-border)",
        borderRadius: "var(--card-radius)",
        padding: "var(--card-padding) var(--card-padding-x)",
      }}
    >
      {children}
    </div>
  );
}
