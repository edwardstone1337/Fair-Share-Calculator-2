import Link from "next/link";
import { BackToTopButton } from "@/components/back-to-top-button";

const BUY_ME_A_COFFEE_IMG =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

export interface HomepageFaqItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQ_ITEMS: HomepageFaqItem[] = [
  {
    question: "How Do I Use the Income-Based Bill Split Calculator?",
    answer:
      "Enter both names to personalize the results. Type in your after-tax salaries for accurate income-based calculations. Enter rent, utilities, groceries, or any shared expenses you need to split. Hit Calculate and our calculator automatically determines fair splits based on income percentages. Get a clear breakdown showing exactly how much each person should pay. Go through the breakdown together with your roommates or partners for full transparency.",
  },
  {
    question: "How Is Income-Based Bill Splitting Calculated?",
    answer:
      "Our calculator ensures fair bill splitting based on income. Calculate your income percentage: Your Income ÷ (Your Income + Roommate's/Partner's Income) = Your Contribution Percentage. Then multiply each bill by your percentage to find your fair share. Example: You earn $60,000, roommate earns $40,000. Your percentage: 60%. Roommate's percentage: 40%. For $2,000 monthly rent: You pay $1,200, Roommate pays $800.",
  },
  {
    question: "Why Is Income-Based Bill Splitting Fair?",
    answer:
      "Income-based splitting ensures everyone contributes according to their financial ability. This approach is fairer than 50/50 splits when people have different incomes, reducing financial stress for lower earners while maintaining equity. Perfect for roommates, couples, or any shared living situation.",
  },
  {
    question:
      "Does the Bill Split Calculator Account for Deductions Like Insurance or Savings?",
    answer:
      "Currently, we use after-tax incomes for the most accurate bill splitting calculations. For even more precise results, you can enter your net income after insurance, retirement contributions, and other deductions. This ensures your bill split reflects your actual available income.",
  },
  {
    question: "How Can I Provide Feedback or Suggest Features?",
    answer:
      "We'd love to hear from you! Give us a rating and share your feedback via the widget somewhere on the screen. Your insights help us make the income-based bill split calculator even better.",
  },
];

export const HOMEPAGE_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOMEPAGE_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const sectionStyle = {
  width: "100%",
  alignSelf: "stretch",
  background: "var(--faq-bg)",
  color: "var(--faq-text)",
  paddingTop: "var(--space-16)",
} as const;

const contentStyle = {
  padding: "var(--faq-padding)",
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "var(--faq-max-width)",
} as const;

const h2Style = {
  fontSize: "var(--faq-title-size)",
  fontFamily: "var(--faq-title-family)",
  fontWeight: "var(--faq-title-weight)",
  color: "var(--faq-text)",
  marginBottom: "var(--space-4)",
} as const;

const h3Style = {
  fontSize: "var(--faq-h3-size)",
  fontFamily: "var(--faq-h3-family)",
  fontWeight: "var(--faq-h3-weight)",
  color: "var(--faq-text)",
  marginTop: "var(--space-5)",
  marginBottom: "var(--space-4)",
} as const;

const pStyle = {
  fontSize: "var(--faq-p-size)",
  color: "var(--faq-text)",
  fontFamily: "var(--font-family-body)",
  marginBottom: "var(--space-4)",
} as const;

const hrStyle = {
  border: "none",
  borderTop: "1px solid var(--faq-hr-color)",
  margin: "var(--space-5) 0",
} as const;

const listStyle = {
  listStyleType: "disc",
  paddingLeft: "var(--space-5)",
  marginBottom: "var(--space-4)",
} as const;

const liStyle = {
  marginBottom: "var(--space-2)",
} as const;

const faqLinkStyle = {
  color: "var(--text-heading)",
  textDecoration: "underline",
  fontFamily: "var(--font-family-body)",
} as const;

export function HomepageFaqSection() {
  return (
    <section aria-labelledby="homepage-faq-heading" style={sectionStyle}>
      <div style={contentStyle}>
        <h2 id="homepage-faq-heading" style={h2Style}>
          How to Split Bills Based on Income
        </h2>
        <p style={pStyle}>
          Our income-based bill split calculator helps you divide shared
          expenses fairly. Whether you&apos;re splitting rent with roommates,
          sharing bills with a partner, or managing shared living costs, our
          tool ensures everyone pays their fair share based on what they earn.
          Also known as a split bill calculator or bill splitter, it shows you
          how to split household bills fairly when you and your partner earn
          different amounts.
        </p>

        <h3 style={h3Style}>
          Common Use Cases for Income-Based Bill Splitting:
        </h3>
        <ul style={listStyle}>
          <li style={liStyle}>
            <strong>Rent Split Calculator:</strong> Split rent based on income
            when roommates have different salaries
          </li>
          <li style={liStyle}>
            <strong>Utility Bill Splitting:</strong> Divide electricity, water,
            and internet bills proportionally
          </li>
          <li style={liStyle}>
            <strong>Shared Grocery Costs:</strong> Split food expenses based on
            income levels
          </li>
          <li style={liStyle}>
            <strong>Joint Savings Goals:</strong> Calculate proportional
            contributions to shared savings
          </li>
          <li style={liStyle}>
            <strong>Couples Budgeting:</strong> Fair expense sharing for
            partners with different incomes
          </li>
          <li style={liStyle}>
            <strong>Roommate Expenses:</strong> Split household costs fairly
            among roommates
          </li>
          <li style={liStyle}>
            <strong>Custom Split Ratios:</strong> Works for any ratio &mdash;
            60/40, 70/30, or 80/20 &mdash; not just an even 50/50 money split
          </li>
        </ul>

        <h3 style={h3Style}>Why Split Bills Based on Income?</h3>
        <p style={pStyle}>
          Income-based bill splitting ensures financial fairness. Instead of
          splitting everything 50/50, each person contributes based on their
          ability to pay. This approach reduces financial stress and creates
          more equitable living arrangements.
        </p>

        <hr style={hrStyle} />

        <h2 style={h2Style}>Frequently Asked Questions</h2>

        <hr style={hrStyle} />

        <h3 style={h3Style}>
          How Do I Use the Income-Based Bill Split Calculator?
        </h3>
        <ul style={listStyle}>
          <li style={liStyle}>
            <strong>Enter Your Names:</strong> Add both names to personalize
            the bill splitting results.
          </li>
          <li style={liStyle}>
            <strong>Enter Both Incomes:</strong> Type in your after-tax
            salaries for accurate income-based calculations.
          </li>
          <li style={liStyle}>
            <strong>Add Shared Bills:</strong> Enter rent, utilities,
            groceries, or any shared expenses you need to split.
          </li>
          <li style={liStyle}>
            <strong>Hit Calculate:</strong> Our calculator automatically
            determines fair splits based on income percentages.
          </li>
          <li style={liStyle}>
            <strong>See Your Results:</strong> Get a clear breakdown showing
            exactly how much each person should pay.
          </li>
          <li style={liStyle}>
            <strong>Review Results Together:</strong> Go through the
            breakdown with your roommates or partners for full transparency.
          </li>
        </ul>

        <hr style={hrStyle} />

        <h3 style={h3Style}>
          How Is Income-Based Bill Splitting Calculated?
        </h3>
        <p style={pStyle}>
          Our calculator ensures fair bill splitting based on income.
          Here&apos;s how the calculation works:
        </p>
        <ul style={listStyle}>
          <li style={liStyle}>
            <strong>Calculate Income Percentages:</strong>
            <ul style={listStyle}>
              <li style={liStyle}>
                Your Income ÷ (Your Income + Roommate&apos;s/Partner&apos;s
                Income) = Your Contribution Percentage
              </li>
            </ul>
          </li>
          <li style={liStyle}>
            <strong>Apply to Bills:</strong>
            <ul style={listStyle}>
              <li style={liStyle}>
                Multiply each bill by your percentage to find your fair share.
              </li>
            </ul>
          </li>
        </ul>
        <p style={pStyle}>
          <strong>Rent Split Example:</strong>
        </p>
        <ul style={listStyle}>
          <li style={liStyle}>
            You earn <strong>$60,000</strong>, roommate earns{" "}
            <strong>$40,000</strong>.
          </li>
          <li style={liStyle}>
            <strong>Your Percentage:</strong> 60%
          </li>
          <li style={liStyle}>
            <strong>Roommate&apos;s Percentage:</strong> 40%
          </li>
          <li style={liStyle}>
            For <strong>$2,000</strong> monthly rent:
            <ul style={listStyle}>
              <li style={liStyle}>
                <strong>You Pay:</strong> $1,200
              </li>
              <li style={liStyle}>
                <strong>Roommate Pays:</strong> $800
              </li>
            </ul>
          </li>
        </ul>

        <hr style={hrStyle} />

        <h3 style={h3Style}>Why Is Income-Based Bill Splitting Fair?</h3>
        <p style={pStyle}>
          Income-based splitting ensures everyone contributes according to
          their financial ability. This approach is fairer than 50/50 splits
          when people have different incomes, reducing financial stress for
          lower earners while maintaining equity. Perfect for roommates,
          couples, or any shared living situation.
        </p>

        <hr style={hrStyle} />

        <h3 style={h3Style}>
          Does the Bill Split Calculator Account for Deductions Like Insurance
          or Savings?
        </h3>
        <p style={pStyle}>
          Currently, we use <strong>after-tax incomes</strong> for the most
          accurate bill splitting calculations. For even more precise results,
          you can enter your net income after insurance, retirement
          contributions, and other deductions. This ensures your bill split
          reflects your actual available income.
        </p>

        <hr style={hrStyle} />

        <h3 style={h3Style}>
          How Can I Provide Feedback or Suggest Features?
        </h3>
        <p style={pStyle}>
          We&apos;d love to hear from you! Give us a rating and share your
          feedback via the widget somewhere on the screen. Your insights help
          us make the income-based bill split calculator even better.
        </p>

        <hr style={hrStyle} />

        <p style={pStyle}>
          By keeping things simple and transparent, we hope our bill split
          calculator helps you and your roommates or partners find balance in
          shared expenses. Whether you&apos;re splitting rent, utilities, or
          groceries, income-based splitting ensures everyone pays their fair
          share!
        </p>

        <a
          href="https://www.buymeacoffee.com/edthedesigner"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", marginBottom: "var(--space-4)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BUY_ME_A_COFFEE_IMG}
            alt="Buy me a coffee"
            style={{ border: "none", maxWidth: "100%" }}
          />
        </a>

        <hr style={hrStyle} />

        <p style={pStyle}>
          Want more detail on specific topics?{" "}
          <Link href="/faq" style={faqLinkStyle}>
            Visit our detailed FAQ page for couples.
          </Link>
        </p>

        <BackToTopButton />
      </div>
    </section>
  );
}
