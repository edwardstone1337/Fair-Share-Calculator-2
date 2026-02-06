import { CalculatorClient } from "@/components/calculator/calculator-client";
import { FaqSection } from "@/components/faq-section";

export default function CalculatorPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{
        background: "var(--surface-page)",
        gap: "var(--space-6)",
        paddingTop: "var(--space-6)",
      }}
    >
      {/* Calculator App Shell */}
      <div
        className="w-full"
        style={{
          maxWidth: "var(--app-max-width)",
          background: "var(--app-bg)",
          borderRadius: "var(--app-radius)",
          padding: "var(--app-padding-y) var(--app-padding-x)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "var(--space-2)", marginBottom: "var(--space-6)" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "var(--font-size-3xl)",
              fontWeight: "var(--font-weight-bold)",
              lineHeight: "var(--line-height-tight)",
              color: "var(--text-primary)",
            }}
          >
            Income-Based Bill Split Calculator
          </h1>
          <p style={{ fontSize: "var(--font-size-lg)", color: "var(--text-primary)" }}>
            Split bills, rent, and shared expenses fairly based on income.
            Perfect for roommates, couples, or any shared living situation.
          </p>
        </div>

        {/* Calculator */}
        <CalculatorClient />
      </div>

      {/* FAQ Section — outside the app shell, full width */}
      <FaqSection />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Income-Based Bill Split Calculator",
            alternateName: "Fair Share Calculator",
            description:
              "Free online calculator to split bills, rent, and shared expenses based on income. Perfect for roommates, couples, and shared living situations.",
            applicationCategory: "FinanceApplication",
            browserRequirements: "Requires JavaScript enabled",
            operatingSystem: "All",
            keywords:
              "bill split calculator, income based splitting, rent split calculator, fair share calculator, split bills based on income",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Split bills based on income",
              "Calculate proportional rent splitting",
              "Shared expense calculator",
              "Income-based bill splitting",
              "Free bill split calculator",
            ],
          }),
        }}
      />
    </main>
  );
}
