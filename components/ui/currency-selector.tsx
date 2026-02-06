"use client";

import { CURRENCIES } from "@/lib/constants/currencies";

interface CurrencySelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select currency"
      style={{
        background: "var(--currency-selector-bg)",
        border: "1px solid var(--currency-selector-border)",
        borderRadius: "var(--currency-selector-radius)",
        color: "var(--currency-selector-text)",
        fontSize: "var(--currency-selector-font-size)",
        fontFamily: "var(--currency-selector-font-family)",
        padding:
          "var(--currency-selector-padding-y) var(--currency-selector-padding-x)",
        cursor: "pointer",
      }}
      className="currency-selector"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
