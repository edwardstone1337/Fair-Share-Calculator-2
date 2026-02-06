import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6)",
      }}
    >
      <Card
        style={{
          maxWidth: "var(--app-max-width)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--text-primary)",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--font-size-md)",
            color: "var(--text-secondary)",
          }}
        >
          We couldn&apos;t sign you in. Please try again.
        </p>
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "var(--touch-target-min-height)",
            padding: "var(--button-padding-y) var(--button-padding-x)",
            borderRadius: "var(--button-radius)",
            fontFamily: "var(--button-font-family)",
            fontSize: "var(--button-font-size)",
            fontWeight: "var(--button-font-weight)",
            background: "var(--button-bg-default)",
            color: "var(--button-text)",
            textDecoration: "none",
          }}
        >
          Back to sign in
        </Link>
      </Card>
    </main>
  );
}
