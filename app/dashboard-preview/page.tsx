"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import type { ConfigSummary } from "@/lib/actions/configurations";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

const CONFIG_LIMIT = 10;

const PREVIEW_CONFIGS_BASE: ConfigSummary[] = [
  {
    id: "preview-1",
    name: "February 2026 Budget",
    person1Name: "Alice",
    person2Name: "Bob",
    expenseCount: 3,
    totalExpenses: 3200,
    currency: "USD",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-06T12:00:00.000Z",
  },
  {
    id: "preview-2",
    name: "With Childcare",
    person1Name: "Alice",
    person2Name: "Bob",
    expenseCount: 5,
    totalExpenses: 5800,
    currency: "USD",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-02-03T14:00:00.000Z",
  },
  {
    id: "preview-3",
    name: "Bare Minimum",
    person1Name: "Alex",
    person2Name: "Sam",
    expenseCount: 1,
    totalExpenses: 1500,
    currency: "GBP",
    createdAt: "2026-01-25T08:00:00.000Z",
    updatedAt: "2026-01-30T11:00:00.000Z",
  },
  {
    id: "preview-4",
    name: "Holiday Planning",
    person1Name: "Alice",
    person2Name: "Bob",
    expenseCount: 4,
    totalExpenses: 4100,
    currency: "EUR",
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-23T16:00:00.000Z",
  },
  {
    id: "preview-5",
    name: "Trial Run",
    person1Name: "Jordan",
    person2Name: "Casey",
    expenseCount: 2,
    totalExpenses: 2000,
    currency: "AUD",
    createdAt: "2025-12-20T07:00:00.000Z",
    updatedAt: "2026-01-06T13:00:00.000Z",
  },
];

const PREVIEW_CONFIGS_EXTRA: ConfigSummary[] = [
  {
    id: "preview-6",
    name: "March 2026 Draft",
    person1Name: "Alice",
    person2Name: "Bob",
    expenseCount: 4,
    totalExpenses: 3500,
    currency: "USD",
    createdAt: "2026-02-05T10:00:00.000Z",
    updatedAt: "2026-02-05T18:00:00.000Z",
  },
  {
    id: "preview-7",
    name: "Rent Only",
    person1Name: "Alex",
    person2Name: "Sam",
    expenseCount: 1,
    totalExpenses: 2200,
    currency: "GBP",
    createdAt: "2026-01-20T09:00:00.000Z",
    updatedAt: "2026-01-28T10:00:00.000Z",
  },
  {
    id: "preview-8",
    name: "Summer Trip",
    person1Name: "Jordan",
    person2Name: "Casey",
    expenseCount: 6,
    totalExpenses: 4200,
    currency: "AUD",
    createdAt: "2026-01-12T11:00:00.000Z",
    updatedAt: "2026-01-18T15:00:00.000Z",
  },
  {
    id: "preview-9",
    name: "Weekly Groceries",
    person1Name: "Alice",
    person2Name: "Bob",
    expenseCount: 5,
    totalExpenses: 2800,
    currency: "EUR",
    createdAt: "2026-01-08T08:00:00.000Z",
    updatedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "preview-10",
    name: "New Year Reset",
    person1Name: "Jordan",
    person2Name: "Casey",
    expenseCount: 3,
    totalExpenses: 3100,
    currency: "AUD",
    createdAt: "2025-12-28T06:00:00.000Z",
    updatedAt: "2026-01-02T09:00:00.000Z",
  },
];

function DashboardPreviewContent() {
  const searchParams = useSearchParams();
  const empty = searchParams.get("empty") === "true";
  const full = searchParams.get("full") === "true";

  const configs = useMemo(() => {
    if (empty) return [];
    if (full) return [...PREVIEW_CONFIGS_BASE, ...PREVIEW_CONFIGS_EXTRA];
    return PREVIEW_CONFIGS_BASE;
  }, [empty, full]);

  const count = configs.length;
  const subheading = `${count} of ${CONFIG_LIMIT} saved`;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "var(--app-padding-y) var(--app-padding-x)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--app-max-width)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--summary-explanation-size)",
            color: "var(--summary-explanation-text)",
            textAlign: "center",
            padding: "var(--space-2)",
          }}
        >
          Design Preview — actions won&apos;t work
        </p>

        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--section-title-family)",
              fontSize: "var(--section-title-size)",
              fontWeight: "var(--section-title-weight)",
              color: "var(--text-primary)",
            }}
          >
            Your Configurations
          </h1>
          <p
            style={{
              fontFamily: "var(--font-family-body)",
              fontSize: "var(--section-description-size)",
              color: "var(--section-description-text)",
            }}
          >
            {subheading}
          </p>
        </header>

        {empty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-6)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-family-body)",
                fontSize: "var(--font-size-md)",
                color: "var(--text-secondary)",
              }}
            >
              No saved configurations yet.
            </p>
            <Link
              href="/"
              style={{
                color: "var(--interactive-default)",
                textDecoration: "underline",
                fontFamily: "var(--font-family-body)",
                fontSize: "var(--font-size-md)",
              }}
            >
              Go to calculator
            </Link>
          </div>
        ) : (
          <DashboardClient initialConfigs={configs} />
        )}
      </div>
    </main>
  );
}

export default function DashboardPreviewPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "var(--app-padding-y) var(--app-padding-x)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "var(--app-max-width)",
              padding: "var(--space-2)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-family-body)",
                fontSize: "var(--summary-explanation-size)",
                color: "var(--summary-explanation-text)",
              }}
            >
              Loading…
            </p>
          </div>
        </main>
      }
    >
      <DashboardPreviewContent />
    </Suspense>
  );
}
