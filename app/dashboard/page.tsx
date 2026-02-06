import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listConfigurations } from "@/lib/actions/configurations";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

const CONFIG_LIMIT = 10;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await listConfigurations();
  const configs = result.success ? result.data : [];
  const error = result.success ? null : result.error;

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
            {configs.length} of {CONFIG_LIMIT} saved
          </p>
        </header>

        {error ? (
          <p
            style={{
              fontFamily: "var(--font-family-body)",
              fontSize: "var(--font-size-md)",
              color: "var(--text-error)",
            }}
          >
            {error}
          </p>
        ) : configs.length === 0 ? (
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
