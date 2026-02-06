"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  error?: boolean;
  id: string;
  /** Non-editable text shown inside the input on the left (e.g. "$", "£") */
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, id, className, style, prefix, ...restProps }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const borderColor = error
      ? "var(--input-border-error)"
      : isFocused
        ? "var(--input-border-focus)"
        : isHovered
          ? "var(--input-border-hover)"
          : "var(--input-border)";

    const focusHandlers = {
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        restProps.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        restProps.onBlur?.(e);
      },
    };

    const hoverHandlers = {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    };

    if (prefix) {
      return (
        <div
          data-input-wrapper
          style={{
            display: "flex",
            alignItems: "center",
            height: "var(--touch-target-min-height)",
            background: "var(--input-bg)",
            border: `var(--border-width-default) solid ${borderColor}`,
            borderRadius: "var(--input-radius)",
            overflow: "hidden",
          }}
          {...hoverHandlers}
        >
          <span
            style={{
              paddingLeft: "var(--input-padding-x)",
              color: "var(--input-placeholder)",
              fontSize: "var(--input-font-size)",
              fontFamily: "var(--input-font-family)",
              userSelect: "none",
              pointerEvents: "none",
              flexShrink: 0,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            {prefix}
          </span>
          <input
            ref={ref}
            id={id}
            className={cn(
              "block w-full focus:outline-none transition-[border-color,outline] duration-150 placeholder:[color:var(--input-placeholder)]",
              className
            )}
            style={{
              background: "transparent",
              color: "var(--input-text)",
              border: "none",
              paddingTop: "var(--input-padding-y)",
              paddingBottom: "var(--input-padding-y)",
              paddingLeft: "var(--space-1)",
              paddingRight: "var(--input-padding-x)",
              fontFamily: "var(--input-font-family)",
              fontSize: "var(--input-font-size)",
              outline: "none",
              flex: 1,
              width: "100%",
              minWidth: 0,
              borderRadius: 0,
              ...style,
            }}
            {...focusHandlers}
            aria-invalid={error ? true : undefined}
            {...restProps}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        id={id}
        className={cn(
          "block w-full focus:outline-none transition-[border-color,outline] duration-150 placeholder:[color:var(--input-placeholder)]",
          className
        )}
        style={{
          height: "var(--touch-target-min-height)",
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
        {...hoverHandlers}
        {...focusHandlers}
        aria-invalid={error ? true : undefined}
        {...restProps}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
