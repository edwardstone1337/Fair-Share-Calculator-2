"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isPrimary = variant === "primary";
    return (
      <button
        ref={ref}
        type="button"
        data-button-variant={variant}
        className={cn(
          "flex justify-center items-center focus:outline-none border-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]",
          fullWidth && "w-full"
        )}
        style={{
          padding: "var(--button-padding-y) var(--button-padding-x)",
          borderRadius: "var(--button-radius)",
          fontFamily: "var(--button-font-family)",
          fontSize: "var(--button-font-size)",
          fontWeight: "var(--button-font-weight)",
          ...(isPrimary
            ? {
                background: "var(--button-bg-default)",
                color: "var(--button-text)",
              }
            : {
                background: "var(--button-secondary-bg-default)",
                border: "var(--border-width-default) solid var(--button-secondary-border)",
                color: "var(--button-secondary-text)",
              }),
          ...(fullWidth ? { width: "100%" } : {}),
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
