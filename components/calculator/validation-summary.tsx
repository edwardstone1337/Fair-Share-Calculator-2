"use client";

export interface ValidationSummaryProps {
  errors: { field: string; message: string }[];
  onTap: () => void;
}

export function ValidationSummary({ errors, onTap }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  const label =
    errors.length === 1
      ? "1 error needs fixing"
      : `${errors.length} errors need fixing`;

  return (
    <div
      role="alert"
      style={{
        textAlign: "center",
        width: "100%",
        marginTop: "var(--space-2)",
      }}
    >
      <button
        type="button"
        onClick={onTap}
        aria-label="Scroll to first error"
        style={{
          padding: 0,
          margin: 0,
          border: "none",
          background: "none",
          font: "inherit",
          cursor: "pointer",
          color: "var(--error-text)",
          fontSize: "var(--error-font-size)",
          textDecoration: "underline",
        }}
      >
        {label}
      </button>
    </div>
  );
}
