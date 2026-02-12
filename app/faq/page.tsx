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
      name: "How Do I Use the Fair Share Calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator works in four simple steps: 1. Enter both incomes — type in your after-tax salaries. The calculator uses these to work out each person's proportional share. 2. Add your shared expenses — enter rent, utilities, groceries, or any bills you split together. You can add as many expenses as you need. 3. Add your names (optional) — personalise the results, or leave blank to use the defaults. 4. Hit Calculate — you'll see a clear breakdown showing exactly how much each person pays for every expense. The calculator supports 8 currencies including USD, GBP, AUD, and CAD, and will automatically detect yours based on your location. You can change the currency at any time using the selector at the top of the page.",
      },
    },
    {
      "@type": "Question",
      name: "How Is the Income-Based Split Calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator uses a simple proportional formula: 1. Add both incomes together to get your combined household income. 2. Calculate each person's percentage by dividing each income by the combined total. 3. Apply that percentage to every shared expense. Example: You earn £3,500/month, your partner earns £2,500/month. Combined income: £6,000. Your share: 58%. Your partner's share: 42%. For a £1,200 rent payment: you pay £700, your partner pays £500. The same percentage applies to every expense you add, whether that's rent, utilities, groceries, or anything else you share.",
      },
    },
    {
      "@type": "Question",
      name: "How Do Couples Split Household Bills Fairly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There's no single \"right\" way. It depends on what works for your relationship. But income-based splitting is one of the most popular approaches for couples with different salaries because it's transparent and easy to agree on. The idea is simple: instead of splitting everything down the middle, each person contributes a percentage of shared costs that matches their percentage of the household income. The partner who earns more pays a larger share in absolute terms, but both partners give up the same proportion of their income. This works well for rent, utilities, mortgage payments, groceries, and other recurring household costs. Some couples split everything this way; others use it just for the big shared expenses and handle personal spending separately. The key is having an open conversation about what feels fair to both of you. Having clear numbers to work from makes that conversation much easier.",
      },
    },
    {
      "@type": "Question",
      name: "Is Income-Based Splitting Fairer Than 50/50?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your situation. If you and your partner earn similar amounts, a 50/50 split might work perfectly well. But when there's a meaningful income gap, splitting everything equally can leave the lower earner with a much tighter budget while the higher earner has more to spare. Income-based splitting adjusts for that difference. Both partners contribute the same proportion of their income, so the financial impact feels more balanced. For example, if one partner earns £60,000 and the other earns £30,000, a 50/50 split on £2,000 of bills means the lower earner spends a much larger share of their take-home pay. Neither approach is objectively \"better.\" It's about what feels right for your relationship. Many couples find that proportional splitting reduces money-related stress and makes shared finances feel like a team effort rather than a source of tension.",
      },
    },
    {
      "@type": "Question",
      name: "How Do You Split Rent Based on Income?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rent is usually the biggest shared expense for couples, so getting it right matters. The process is the same as splitting any other bill: the calculator divides your rent payment based on each person's share of the combined income. Example: Partner A earns $5,000/month, Partner B earns $3,000/month. Combined income: $8,000. Partner A's share: 62.5%. Partner B's share: 37.5%. For $2,200 monthly rent: Partner A pays $1,375, Partner B pays $825. You can enter rent alongside all your other shared expenses (utilities, internet, groceries) and the calculator will apply the same proportional split to everything. That way you get one clear picture of what each person owes across all your shared costs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I Use This to Split Mortgage Payments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The calculator works for any shared expense, including mortgage payments. Enter your monthly mortgage payment as an expense, and the calculator will split it proportionally based on your incomes, just like rent or utilities. Enter the amount you actually pay each month (principal plus interest). If your payment includes insurance or council tax/property tax held in escrow, you can either include the full amount or enter them as separate expenses. The calculator splits the payment amount. It doesn't account for equity, ownership percentages, or legal obligations. If the split of ownership matters for your situation, it's worth speaking to a financial advisor. You can add your mortgage alongside other household expenses to see a complete picture of how your shared costs break down.",
      },
    },
    {
      "@type": "Question",
      name: "What If One Partner Earns Significantly More Than the Other?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This is one of the most common reasons couples look for an income-based calculator, and it's a completely normal situation. Very few couples earn exactly the same amount, and income gaps can shift over time as careers change, someone studies, takes parental leave, or moves between roles. Income-based splitting handles this naturally. The formula doesn't care whether the gap is small or large. It simply calculates each person's share of the combined income and applies that percentage to your shared expenses. Example with a larger gap: Partner A earns $8,000/month, Partner B earns $3,000/month. Partner A pays 73% of shared expenses. Partner B pays 27%. For $3,000 in total shared bills: Partner A pays $2,190, Partner B pays $810. The result is that both partners keep a similar proportion of their income for personal spending, savings, or individual expenses. It's not about one person subsidising the other. It's about contributing fairly relative to what each person earns. What matters most is that you and your partner talk about it and agree on an approach that works for you both.",
      },
    },
    {
      "@type": "Question",
      name: "What Does a 60/40 or 70/30 Split Look Like?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The split ratio depends entirely on your incomes. Examples: Your income $5,000/mo, Partner's income $5,000/mo — Your share 50%, Their share 50%. Your income $6,000/mo, Partner's income $4,000/mo — Your share 60%, Their share 40%. Your income $7,000/mo, Partner's income $3,000/mo — Your share 70%, Their share 30%. Your income $8,000/mo, Partner's income $2,000/mo — Your share 80%, Their share 20%. What 60/40 looks like in practice: For $2,500 in monthly shared expenses, a 60/40 split means one partner pays $1,500 and the other pays $1,000. What 70/30 looks like: For the same $2,500, one partner pays $1,750 and the other pays $750. You don't need to pick a ratio yourself. Just enter your actual incomes and the calculator works out the exact percentages. The examples above are rounded for simplicity; your real split might be 63/37 or 71/29 depending on your actual salaries.",
      },
    },
    {
      "@type": "Question",
      name: "Should I Use Gross or Net Income for Bill Splitting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend using your net (after-tax) income: the amount that actually hits your bank account each month. This gives you the most accurate split because it reflects what each person genuinely has available to spend. If you want to be even more precise, you can enter your income after all regular deductions: tax, national insurance or social security, pension contributions, health insurance, and any other automatic deductions from your pay. The calculator takes whatever number you enter and uses it directly. It doesn't apply any tax calculations or deductions automatically. That means you're in full control of how precise you want to be. Quick guide: Good enough for most couples — use your monthly take-home pay (after tax). More precise — subtract regular deductions like pension, insurance, and loan repayments first. Keep it consistent — whatever method you choose, make sure both partners calculate their income the same way.",
      },
    },
    {
      "@type": "Question",
      name: "Does the Calculator Work With Different Currencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The calculator supports 8 currencies: USD ($), GBP (£), CAD (C$), AUD (A$), NZD (NZ$), INR (₹), PHP (₱), and SGD (S$). Your currency is automatically detected based on your browser's location settings, but you can change it at any time using the currency selector at the top of the page. Your preference is saved so you won't need to set it again next time. The currency setting affects how amounts are displayed. The underlying calculation works the same way regardless of which currency you choose.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "How to Split Bills Based on Income — Fair Share Calculator FAQ",
  description:
    "How to split bills fairly as a couple when you earn different amounts. Step-by-step guide to income-based bill splitting for rent, utilities, mortgage, and shared expenses.",
  openGraph: {
    title: "How to Split Bills Based on Income — Fair Share Calculator FAQ",
    description:
      "How to split bills fairly as a couple when you earn different amounts. Step-by-step guide to income-based bill splitting for rent, utilities, mortgage, and shared expenses.",
    url: "https://www.fairsharecalculator.com/faq",
  },
  alternates: {
    canonical: "https://www.fairsharecalculator.com/faq",
  },
};

function FaqCtaLink({ source }: { source?: string }) {
  return (
    <TrackedLink
      href="/"
      eventName={FAQ_CTA_CLICKED}
      eventParams={source ? { cta: "try_calculator", source } : { cta: "try_calculator" }}
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
        background: "var(--button-secondary-bg-default)",
        border: "var(--border-width-default) solid var(--button-secondary-border)",
        color: "var(--button-secondary-text)",
        textDecoration: "none",
      }}
    >
      Try the calculator →
    </TrackedLink>
  );
}

const h2Style = {
  fontSize: "var(--faq-h3-size)",
  fontFamily: "var(--faq-h3-family)",
  fontWeight: "var(--faq-h3-weight)",
  color: "var(--faq-text)",
  marginTop: "var(--space-5)",
  marginBottom: "var(--space-2)",
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
} as const;

const ulStyle = {
  listStyleType: "disc",
  paddingLeft: "var(--space-5)",
} as const;

const liStyle = { marginBottom: "var(--space-2)" } as const;

const hrStyle = {
  border: "none",
  borderTop: "1px solid var(--faq-hr-color)",
  margin: "var(--space-5) 0",
} as const;

const inlineAnchorStyle = {
  color: "var(--text-heading)",
  textDecoration: "underline",
} as const;

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
          <p style={pStyle}>
            Our income-based bill split calculator helps you and your partner
            divide shared expenses fairly. Whether you&apos;re splitting rent,
            managing household bills, or working out mortgage contributions
            together, the calculator makes sure each person pays a proportional
            share based on what they earn.
          </p>

          <h2 style={h2Style}>Common Use Cases for Income-Based Bill Splitting</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong>Rent:</strong> Split rent fairly when you and your partner
              earn different salaries
            </li>
            <li style={liStyle}>
              <strong>Mortgage payments:</strong> Calculate proportional mortgage
              contributions as a couple
            </li>
            <li style={liStyle}>
              <strong>Utility bills:</strong> Divide electricity, water, and
              internet based on income
            </li>
            <li style={liStyle}>
              <strong>Groceries and household costs:</strong> Split shared
              day-to-day expenses proportionally
            </li>
            <li style={liStyle}>
              <strong>Couples budgeting:</strong> Create a fair system for
              managing shared finances together
            </li>
          </ul>

          <h2 style={h2Style}>Why Split Bills Based on Income?</h2>
          <p style={pStyle}>
            When one partner earns more than the other, splitting everything
            50/50 can put uneven pressure on the lower earner. Income-based
            splitting means each person contributes according to what they can
            afford, so both partners keep a similar proportion of their income
            after shared costs. It&apos;s a straightforward way to keep things
            fair without overcomplicating your finances.
          </p>

          <hr style={hrStyle} />

          <h2
            style={{
              ...h2Style,
              fontSize: "var(--faq-title-size)",
              fontFamily: "var(--faq-title-family)",
              fontWeight: "var(--faq-title-weight)",
              marginTop: 0,
            }}
          >
            Frequently Asked Questions
          </h2>

          <hr style={hrStyle} />

          <h3 style={h3Style}>How Do I Use the Fair Share Calculator?</h3>
          <p style={pStyle}>The calculator works in four simple steps:</p>
          <ol
            style={{
              ...ulStyle,
              listStyleType: "decimal",
              paddingLeft: "var(--space-6)",
            }}
          >
            <li style={liStyle}>
              <strong>Enter both incomes</strong> — type in your after-tax
              salaries. The calculator uses these to work out each person&apos;s
              proportional share.
            </li>
            <li style={liStyle}>
              <strong>Add your shared expenses</strong> — enter rent, utilities,
              groceries, or any bills you split together. You can add as many
              expenses as you need.
            </li>
            <li style={liStyle}>
              <strong>Add your names</strong> (optional) — personalise the
              results, or leave blank to use the defaults.
            </li>
            <li style={liStyle}>
              <strong>Hit Calculate</strong> — you&apos;ll see a clear breakdown
              showing exactly how much each person pays for every expense.
            </li>
          </ol>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The calculator supports 8 currencies including USD, GBP, AUD, and
            CAD, and will automatically detect yours based on your location. You
            can change the currency at any time using the selector at the top of
            the page.
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_how_to_use" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>How Is the Income-Based Split Calculated?</h3>
          <p style={pStyle}>
            The calculator uses a simple proportional formula:
          </p>
          <ol
            style={{
              ...ulStyle,
              listStyleType: "decimal",
              paddingLeft: "var(--space-6)",
            }}
          >
            <li style={liStyle}>
              <strong>Add both incomes together</strong> to get your combined
              household income.
            </li>
            <li style={liStyle}>
              <strong>Calculate each person&apos;s percentage</strong> by
              dividing each income by the combined total.
            </li>
            <li style={liStyle}>
              <strong>Apply that percentage to every shared expense.</strong>
            </li>
          </ol>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>Example:</strong>
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              You earn £3,500/month, your partner earns £2,500/month.
            </li>
            <li style={liStyle}>Combined income: £6,000.</li>
            <li style={liStyle}>
              Your share: 58%. Your partner&apos;s share: 42%.
            </li>
            <li style={liStyle}>
              For a £1,200 rent payment: you pay £700, your partner pays £500.
            </li>
          </ul>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The same percentage applies to every expense you add, whether
            that&apos;s rent, utilities, groceries, or anything else you share.
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_how_calculated" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>How Do Couples Split Household Bills Fairly?</h3>
          <p style={pStyle}>
            There&apos;s no single &quot;right&quot; way. It depends on what
            works for your relationship. But income-based splitting is one of the
            most popular approaches for couples with different salaries because
            it&apos;s transparent and easy to agree on.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The idea is simple: instead of splitting everything down the middle,
            each person contributes a percentage of shared costs that matches
            their percentage of the household income. The partner who earns more
            pays a larger share in absolute terms, but both partners give up the
            same proportion of their income.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            This works well for rent, utilities, mortgage payments, groceries,
            and other recurring household costs. Some couples split everything
            this way; others use it just for the big shared expenses and handle
            personal spending separately.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The key is having an open conversation about what feels fair to both
            of you. Having clear numbers to work from makes that conversation
            much easier.
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_household_bills" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>Is Income-Based Splitting Fairer Than 50/50?</h3>
          <p style={pStyle}>
            It depends on your situation. If you and your partner earn similar
            amounts, a 50/50 split might work perfectly well. But when
            there&apos;s a meaningful income gap, splitting everything equally
            can leave the lower earner with a much tighter budget while the
            higher earner has more to spare.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            Income-based splitting adjusts for that difference. Both partners
            contribute the same proportion of their income, so the financial
            impact feels more balanced. For example, if one partner earns
            £60,000 and the other earns £30,000, a 50/50 split on £2,000 of
            bills means the lower earner spends a much larger share of their
            take-home pay.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            Neither approach is objectively &quot;better.&quot; It&apos;s about
            what feels right for your relationship. Many couples find that
            proportional splitting reduces money-related stress and makes shared
            finances feel like a team effort rather than a source of tension.
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>How Do You Split Rent Based on Income?</h3>
          <p style={pStyle}>
            Rent is usually the biggest shared expense for couples, so getting
            it right matters. The process is the same as splitting any other
            bill: the calculator divides your rent payment based on each
            person&apos;s share of the combined income.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>Example:</strong>
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              Partner A earns $5,000/month, Partner B earns $3,000/month.
            </li>
            <li style={liStyle}>Combined income: $8,000.</li>
            <li style={liStyle}>
              Partner A&apos;s share: 62.5%. Partner B&apos;s share: 37.5%.
            </li>
            <li style={liStyle}>
              For $2,200 monthly rent: Partner A pays $1,375, Partner B pays
              $825.
            </li>
          </ul>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            You can enter rent alongside all your other shared expenses
            (utilities, internet, groceries) and the calculator will apply the
            same proportional split to everything. That way you get one clear
            picture of what each person owes across all your shared costs.
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_rent" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>Can I Use This to Split Mortgage Payments?</h3>
          <p style={pStyle}>
            Yes. The calculator works for any shared expense, including mortgage
            payments. Enter your monthly mortgage payment as an expense, and the
            calculator will split it proportionally based on your incomes, just
            like rent or utilities.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>A few things to keep in mind:</strong>
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              Enter the amount you actually pay each month (principal plus
              interest). If your payment includes insurance or council
              tax/property tax held in escrow, you can either include the full
              amount or enter them as separate expenses.
            </li>
            <li style={liStyle}>
              The calculator splits the payment amount. It doesn&apos;t account
              for equity, ownership percentages, or legal obligations. If the
              split of ownership matters for your situation, it&apos;s worth
              speaking to a financial advisor.
            </li>
            <li style={liStyle}>
              You can add your mortgage alongside other household expenses to
              see a complete picture of how your shared costs break down.
            </li>
          </ul>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_mortgage" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>
            What If One Partner Earns Significantly More Than the Other?
          </h3>
          <p style={pStyle}>
            This is one of the most common reasons couples look for an
            income-based calculator, and it&apos;s a completely normal situation.
            Very few couples earn exactly the same amount, and income gaps can
            shift over time as careers change, someone studies, takes parental
            leave, or moves between roles.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            Income-based splitting handles this naturally. The formula
            doesn&apos;t care whether the gap is small or large. It simply
            calculates each person&apos;s share of the combined income and
            applies that percentage to your shared expenses.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>Example with a larger gap:</strong>
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              Partner A earns $8,000/month, Partner B earns $3,000/month.
            </li>
            <li style={liStyle}>
              Partner A pays 73% of shared expenses. Partner B pays 27%.
            </li>
            <li style={liStyle}>
              For $3,000 in total shared bills: Partner A pays $2,190, Partner B
              pays $810.
            </li>
          </ul>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The result is that both partners keep a similar proportion of their
            income for personal spending, savings, or individual expenses.
            It&apos;s not about one person subsidising the other. It&apos;s about
            contributing fairly relative to what each person earns.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            What matters most is that you and your partner talk about it and
            agree on an approach that works for you both.
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>What Does a 60/40 or 70/30 Split Look Like?</h3>
          <p style={pStyle}>
            The split ratio depends entirely on your incomes. Here are a few
            examples showing how different income gaps translate into
            proportional splits:
          </p>
          <div className="overflow-x-auto">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "var(--space-4)",
                marginBottom: "var(--space-4)",
                fontSize: "var(--faq-p-size)",
                fontFamily: "var(--font-family-body)",
                color: "var(--faq-text)",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "2px solid var(--faq-hr-color)",
                      fontWeight: "var(--faq-h3-weight)",
                    }}
                  >
                    Your income
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "2px solid var(--faq-hr-color)",
                      fontWeight: "var(--faq-h3-weight)",
                    }}
                  >
                    Partner&apos;s income
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "2px solid var(--faq-hr-color)",
                      fontWeight: "var(--faq-h3-weight)",
                    }}
                  >
                    Your share
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "2px solid var(--faq-hr-color)",
                      fontWeight: "var(--faq-h3-weight)",
                    }}
                  >
                    Their share
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $5,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $5,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    50%
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    50%
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $6,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $4,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    60%
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    40%
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $7,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $3,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    70%
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    30%
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $8,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    $2,000/mo
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    80%
                  </td>
                  <td
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderBottom: "1px solid var(--faq-hr-color)",
                    }}
                  >
                    20%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>What 60/40 looks like in practice:</strong>
            <br />
            For $2,500 in monthly shared expenses, a 60/40 split means one
            partner pays $1,500 and the other pays $1,000.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>What 70/30 looks like:</strong>
            <br />
            For the same $2,500, one partner pays $1,750 and the other pays
            $750.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            You don&apos;t need to pick a ratio yourself. Just enter your actual
            incomes and the calculator works out the exact percentages. The
            examples above are rounded for simplicity; your real split might be
            63/37 or 71/29 depending on your actual salaries.
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_60_40" />
          </p>

          <hr style={hrStyle} />

          <h3 style={h3Style}>
            Should I Use Gross or Net Income for Bill Splitting?
          </h3>
          <p style={pStyle}>
            We recommend using your <strong>net (after-tax) income</strong>: the
            amount that actually hits your bank account each month. This gives
            you the most accurate split because it reflects what each person
            genuinely has available to spend.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            If you want to be even more precise, you can enter your income after
            all regular deductions: tax, national insurance or social security,
            pension contributions, health insurance, and any other automatic
            deductions from your pay.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The calculator takes whatever number you enter and uses it directly.
            It doesn&apos;t apply any tax calculations or deductions
            automatically. That means you&apos;re in full control of how precise
            you want to be.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            <strong>Quick guide:</strong>
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong>Good enough for most couples:</strong> Use your monthly
              take-home pay (after tax).
            </li>
            <li style={liStyle}>
              <strong>More precise:</strong> Subtract regular deductions like
              pension, insurance, and loan repayments first.
            </li>
            <li style={liStyle}>
              <strong>Keep it consistent:</strong> Whatever method you choose,
              make sure both partners calculate their income the same way.
            </li>
          </ul>

          <hr style={hrStyle} />

          <h3 style={h3Style}>
            Does the Calculator Work With Different Currencies?
          </h3>
          <p style={pStyle}>Yes. The calculator supports 8 currencies:</p>
          <p style={{ ...pStyle, marginTop: "var(--space-2)" }}>
            <strong>
              USD ($), GBP (£), CAD (C$), AUD (A$), NZD (NZ$), INR (₹), PHP (₱),
              and SGD (S$).
            </strong>
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            Your currency is automatically detected based on your browser&apos;s
            location settings, but you can change it at any time using the
            currency selector at the top of the page. Your preference is saved
            so you won&apos;t need to set it again next time.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            The currency setting affects how amounts are displayed. The
            underlying calculation works the same way regardless of which
            currency you choose.
          </p>

          <hr style={hrStyle} />

          <p style={pStyle}>
            By keeping things simple and transparent, we hope the calculator
            helps you and your partner find balance in shared expenses. Whether
            you&apos;re splitting rent, mortgage payments, utilities, or
            everyday household costs, income-based splitting means you both
            contribute your fair share.
          </p>

          <p style={{ marginTop: "var(--space-4)" }}>
            <FaqCtaLink source="faq_closing" />
          </p>

          <hr style={hrStyle} />

          <h2
            style={{
              ...h2Style,
              fontSize: "var(--faq-title-size)",
              fontFamily: "var(--faq-title-family)",
              fontWeight: "var(--faq-title-weight)",
              marginTop: 0,
            }}
          >
            About This Site
          </h2>

          <hr style={hrStyle} />

          <h3 style={h3Style}>
            Is there anything I can do to support this site?
          </h3>
          <p style={pStyle}>
            That&apos;s really kind of you to ask! Just using the site and
            finding it helpful is support enough for us. We built this because we
            wanted it to exist, and knowing other couples are getting use out of
            it is pretty awesome.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            But if you&apos;re feeling generous and want to buy us a coffee (or
            tea, we&apos;re not picky!), you can do that at{" "}
            <TrackedAnchor
              href="https://www.buymeacoffee.com/edthedesigner"
              target="_blank"
              rel="noopener noreferrer"
              eventName={FAQ_CTA_CLICKED}
              eventParams={{ cta: "buy_me_a_coffee" }}
              style={inlineAnchorStyle}
            >
              buymeacoffee.com/edthedesigner
            </TrackedAnchor>
            . It helps keep the site running and fuels our late-night coding
            sessions when we&apos;re adding new features or fixing bugs.
          </p>
          <p style={{ ...pStyle, marginTop: "var(--space-4)" }}>
            Most importantly though, if you know another couple who&apos;s been
            struggling with how to split bills fairly, maybe send them our way.
            That&apos;s the best kind of support there is!
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

          <hr style={hrStyle} />

          <h3 style={h3Style}>Is there a way to give feedback?</h3>
          <p style={pStyle}>
            We&apos;d love to hear from you! If you have suggestions, spotted a
            bug, or just want to tell us what you think, you can{" "}
            <TrackedAnchor
              href="https://surveys.hotjar.com/75994e9b-1ee0-4dae-a644-0609ee4c4ecf"
              target="_blank"
              rel="noopener noreferrer"
              eventName={FAQ_CTA_CLICKED}
              eventParams={{ cta: "feedback_survey" }}
              style={inlineAnchorStyle}
            >
              share your feedback here
            </TrackedAnchor>
            .
          </p>
          <p style={{ marginTop: "var(--space-4)" }}>
            <TrackedAnchor
              href="https://surveys.hotjar.com/75994e9b-1ee0-4dae-a644-0609ee4c4ecf"
              target="_blank"
              rel="noopener noreferrer"
              eventName={FAQ_CTA_CLICKED}
              eventParams={{ cta: "feedback_survey_button" }}
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
                background: "var(--button-secondary-bg-default)",
                border: "var(--border-width-default) solid var(--button-secondary-border)",
                color: "var(--button-secondary-text)",
                textDecoration: "none",
              }}
            >
              Give us feedback
            </TrackedAnchor>
          </p>

          <hr style={hrStyle} />

          <BackToTopButton />
        </div>
      </main>
    </>
  );
}
