"use client";

import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/icon";

interface IconButtonProps {
  icon: string;
  variant: "ghost" | "danger";
  onClick: () => void;
  "aria-label": string;
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export function IconButton({
  icon,
  variant,
  onClick,
  "aria-label": ariaLabel,
  size = "md",
  className,
  style,
}: IconButtonProps) {
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <button
      type="button"
      data-icon-button-variant={variant}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "focus:outline-none focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-[var(--focus-ring-color)]",
        className
      )}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `var(--icon-button-size-${size})`,
        height: `var(--icon-button-size-${size})`,
        minWidth: `var(--icon-button-size-${size})`,
        minHeight: `var(--icon-button-size-${size})`,
        borderRadius: isDanger
          ? "var(--icon-button-radius-danger)"
          : "var(--icon-button-radius-ghost)",
        border: "none",
        cursor: "pointer",
        padding: 0,
        background: isDanger
          ? "var(--icon-button-bg-danger)"
          : "var(--icon-button-bg-ghost)",
        color: isDanger
          ? "var(--icon-button-color-danger)"
          : "var(--icon-button-color-ghost)",
        transition: "opacity 150ms ease",
        ...style,
      }}
    >
      <Icon
        name={icon}
        size={`var(--icon-button-icon-size-${size})`}
      />
    </button>
  );
}
