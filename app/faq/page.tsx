import type { Metadata } from "next";
import { TrackedLink } from "@/components/ui/tracked-link";
import { TrackedAnchor } from "@/components/ui/tracked-anchor";
import { BackToTopButton } from "@/components/back-to-top-button";
import { FAQ_CTA_CLICKED } from "@/lib/analytics/events";

const BUY_ME_A_COFFEE_IMG =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How Do I Use the Income-Based Bill Split Calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter both names, enter your after-tax incomes, add shared bills (rent, utilities, groceries), then hit Calculate. The calculator shows a clear breakdown of how much each person should pay. You can share the results link with your partner for transparency.",
      },
    },
    {
      "@type": "Question",
      name: "How Is Income-Based Bill Splitting Calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your contribution percentage is your income divided by the total of both incomes. Each bill is multiplied by that percentage to get your fair share. Example: You earn $60,000, your partner earns $40,000 — your share is 60%, theirs is 40%. For $2,000 rent, you pay $1,200 and your partner pays $800.",
      },
    },
    {
      "@type": "Question",
      name: "Why Is Income-Based Bill Splitting Fair?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Income-based splitting means each person contributes according to their financial ability. It's fairer than 50/50 when you and your partner earn different amounts, reducing stress for the lower earner while keeping things equitable. Great for couples and shared finances.",
      },
    },
    {
      "@type": "Question",
      name: "Does the Bill Split Calculator Account for Deductions Like Insurance or Savings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator uses after-tax incomes for accurate splits. For more precision, you can enter your net income after insurance, retirement, and other deductions so the split reflects what you actually have available.",
      },
    },
    {
      "@type": "Question",
      name: "How Can I Provide Feedback or Suggest Features?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We'd love to hear from you. Use the rating and feedback widget on the site — your input helps us improve the calculator.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "FAQ — Fair Share Calculator",
  description:
    "How to split bills with your spouse or partner. Income-based bill splitting for couples: split rent, utilities, and shared expenses fairly. FAQs and step-by-step guide.",
  openGraph: {
    title: "FAQ — Fair Share Calculator",
    description:
      "How to split bills with your spouse or partner. Income-based bill splitting for couples. FAQs and guide.",
    url: "https://www.fairsharecalculator.com/faq",
  },
  alternates: {
    canonical: "https://www.fairsharecalculator.com/faq",
  },
};

function FaqCtaLink() {
  return (
    <TrackedLink
      href="/"
      eventName={FAQ_CTA_CLICKED}
      eventParams={{ cta: "try_calculator" }}
      className="flex justify-center items-center focus:outline-none border-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]"
      style={{
        minHeight: "var(--touch-target-min-height)",
        height: "var(--touch-target-min-height)",
        padding: "var(--button-padding-y) var(--button-padding-x)",
        borderRadius: "var(--button-radius)",
        fontFamily: "var(--button-font-family)",
        fontSize: "var(--button-font-size)",
        fontWeight: "var(--button-font-weight)",
        lineHeight: 1.25,
        background: "var(--button-bg-default)",
        color: "var(--button-text)",
        textDecoration: "none",
      }}
    >
      Try the calculator →
    </TrackedLink>
  );
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "var(--faq-bg)",
          color: "var(--faq-text)",
          paddingTop: "var(--space-16)",
          paddingBottom: "var(--space-16)",
        }}
      >
        <div
          style={{
            padding: "var(--faq-padding)",
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            maxWidth: "var(--faq-max-width)",
            gap: "var(--space-4)",
          }}
        >
          <h1
            style={{
              fontSize: "var(--faq-title-size)",
              fontFamily: "var(--faq-title-family)",
              fontWeight: "var(--faq-title-weight)",
              color: "var(--faq-text)",
              marginBottom: "var(--space-2)",
            }}
          >
            How to Split Bills Based on Income
          </h1>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Our income-based bill split calculator helps you and your partner
            divide shared expenses fairly. Whether you&apos;re splitting rent,
            sharing bills, or managing household costs together, the tool ensures
            each of you pays a fair share based on what you earn.
          </p>

          <h2
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-2)",
            }}
          >
            Common Use Cases for Income-Based Bill Splitting
          </h2>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "var(--space-5)",
            }}
          >
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Rent:</strong> Split rent fairly when you and your partner
              earn different salaries
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Utility Bill Splitting:</strong> Divide electricity, water,
              and internet proportionally
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Shared Grocery Costs:</strong> Split food expenses based
              on income levels
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Joint Savings Goals:</strong> Calculate proportional
              contributions to shared savings
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Couples Budgeting:</strong> Fair expense sharing when
              partners have different incomes
            </li>
          </ul>

          <h2
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-2)",
            }}
          >
            Why Split Bills Based on Income?
          </h2>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Income-based bill splitting ensures financial fairness. Instead of
            splitting everything 50/50, each person contributes based on their
            ability to pay. This approach reduces financial stress and creates
            more equitable living arrangements for you and your partner.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h2
            style={{
              fontSize: "var(--faq-title-size)",
              fontFamily: "var(--faq-title-family)",
              fontWeight: "var(--faq-title-weight)",
              color: "var(--faq-text)",
              marginBottom: "var(--space-4)",
            }}
          >
            Frequently Asked Questions
          </h2>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h3
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-4)",
            }}
          >
            How Do I Use the Income-Based Bill Split Calculator?
          </h3>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "var(--space-5)",
            }}
          >
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Enter Your Names:</strong> Add both names to personalize
              the results.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Enter Both Incomes:</strong> Type in your after-tax
              salaries for accurate calculations.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Add Shared Bills:</strong> Enter rent, utilities,
              groceries, or any shared expenses you need to split.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Hit Calculate:</strong> The calculator determines fair
              splits based on income percentages.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>See Your Results:</strong> Get a clear breakdown showing
              how much each person should pay.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Share Results:</strong> Send the link to your partner for
              transparency.
            </li>
          </ul>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink />
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h3
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-4)",
            }}
          >
            How Is Income-Based Bill Splitting Calculated?
          </h3>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            The calculator uses your combined incomes to work out fair shares.
            Here&apos;s how it works:
          </p>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "var(--space-5)",
            }}
          >
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Calculate Income Percentages:</strong> Your Income ÷ (Your
              Income + Partner&apos;s Income) = Your Contribution Percentage
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Apply to Bills:</strong> Multiply each bill by your
              percentage to find your fair share.
            </li>
          </ul>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
              marginTop: "var(--space-4)",
            }}
          >
            <strong>Rent Split Example:</strong>
          </p>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "var(--space-5)",
            }}
          >
            <li style={{ marginBottom: "var(--space-2)" }}>
              You earn <strong>$60,000</strong>, your partner earns{" "}
              <strong>$40,000</strong>.
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Your Percentage:</strong> 60%
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              <strong>Partner&apos;s Percentage:</strong> 40%
            </li>
            <li style={{ marginBottom: "var(--space-2)" }}>
              For <strong>$2,000</strong> monthly rent: You pay{" "}
              <strong>$1,200</strong>, your partner pays <strong>$800</strong>.
            </li>
          </ul>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h3
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-4)",
            }}
          >
            Why Is Income-Based Bill Splitting Fair?
          </h3>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Income-based splitting ensures each person contributes according to
            their financial ability. This approach is fairer than 50/50 when you
            and your partner have different incomes, reducing financial stress
            for the lower earner while keeping things equitable. Perfect for
            couples and shared living.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h3
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-4)",
            }}
          >
            Does the Bill Split Calculator Account for Deductions Like Insurance
            or Savings?
          </h3>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Currently, we use <strong>after-tax incomes</strong> for the most
            accurate bill splitting. For even more precise results, you can enter
            your net income after insurance, retirement contributions, and other
            deductions. That way the split reflects your actual available
            income.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <h3
            style={{
              fontSize: "var(--faq-h3-size)",
              fontFamily: "var(--faq-h3-family)",
              fontWeight: "var(--faq-h3-weight)",
              color: "var(--faq-text)",
              marginTop: "var(--space-5)",
              marginBottom: "var(--space-4)",
            }}
          >
            How Can I Provide Feedback or Suggest Features?
          </h3>
          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            We&apos;d love to hear from you! Give us a rating and share your
            feedback via the widget on the site. Your input helps us make the
            income-based bill split calculator even better.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <p
            style={{
              fontSize: "var(--faq-p-size)",
              color: "var(--faq-text)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            By keeping things simple and transparent, we hope the calculator
            helps you and your partner find balance in shared expenses. Whether
            you&apos;re splitting rent, utilities, or groceries, income-based
            splitting ensures you both pay your fair share.
          </p>

          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink />
          </p>

          <TrackedAnchor
            href="https://www.buymeacoffee.com/edthedesigner"
            target="_blank"
            rel="noopener noreferrer"
            eventName={FAQ_CTA_CLICKED}
            eventParams={{ cta: "buy_me_a_coffee" }}
            style={{ display: "block", marginTop: "var(--space-6)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BUY_ME_A_COFFEE_IMG}
              alt="Buy me a coffee"
              style={{ border: "none", maxWidth: "100%" }}
            />
          </TrackedAnchor>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--faq-hr-color)",
              margin: "var(--space-5) 0",
            }}
          />

          <BackToTopButton />
        </div>
      </main>
    </>
  );
}
