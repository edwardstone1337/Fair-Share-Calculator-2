import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
          Welcome, {user.email}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--font-size-md)",
            color: "var(--text-secondary)",
          }}
        >
          Your dashboard is coming soon. Saved configurations and more will
          appear here.
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
          Back to calculator
        </Link>
      </Card>
    </main>
  );
}
