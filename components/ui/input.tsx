"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  error?: boolean;
  id: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, id, className, style, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const borderColor = error
      ? "var(--input-border-error)"
      : isFocused
        ? "var(--input-border-focus)"
        : isHovered
          ? "var(--input-border-hover)"
          : "var(--input-border)";

    return (
      <input
        ref={ref}
        id={id}
        className={cn(
          "block w-full focus:outline-none transition-[border-color,outline] duration-150 placeholder:[color:var(--input-placeholder)]",
          className
        )}
        style={{
          background: "var(--input-bg)",
          color: "var(--input-text)",
          border: "var(--border-width-default) solid " + borderColor,
          borderRadius: "var(--input-radius)",
          padding: "var(--input-padding-y) var(--input-padding-x)",
          fontFamily: "var(--input-font-family)",
          fontSize: "var(--input-font-size)",
          ...(isFocused && !error
            ? {
                outline: "var(--focus-ring-width) solid var(--input-border-focus)",
                outlineOffset: "var(--focus-ring-offset)",
              }
            : { outline: "none" }),
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
