import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  size?: string;
  color?: string;
  style?: CSSProperties;
  className?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  size,
  color,
  style,
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`.trim()}
      aria-hidden={ariaHidden}
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        userSelect: "none",
        ...style,
      }}
    >
      {name}
    </span>
  );
}
