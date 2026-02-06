"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      setErrorMessage("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
          Sign in to Fair Share Calculator
        </h1>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing in…" : "Continue with Google"}
        </Button>

        <ErrorMessage
          id="login-error"
          message={errorMessage ?? undefined}
          visible={errorMessage !== null}
        />

        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
          }}
        >
          No account needed to use the{" "}
          <Link
            href="/"
            style={{
              color: "var(--interactive-default)",
              textDecoration: "underline",
            }}
          >
            calculator
          </Link>
          .
        </p>
      </Card>
    </main>
  );
}
