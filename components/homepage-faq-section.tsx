import Link from "next/link";

export interface HomepageFaqItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQ_ITEMS: HomepageFaqItem[] = [
  {
    question: "Why Split Bills Based on Income?",
    answer:
      "When one partner earns more than the other, splitting everything 50/50 can put uneven pressure on the lower earner. Income-based splitting means each person contributes according to what they can afford, so both partners keep a similar proportion of their income after shared costs. It's a straightforward way to keep things fair without overcomplicating your finances.",
  },
  {
    question: "How Is the Income-Based Split Calculated?",
    answer:
      "The calculator uses a simple proportional formula: 1. Add both incomes together to get your combined household income. 2. Calculate each person's percentage by dividing each income by the combined total. 3. Apply that percentage to every shared expense. Example: You earn GBP 3,500/month, your partner earns GBP 2,500/month. Combined income: GBP 6,000. Your share: 58%. Your partner's share: 42%. For a GBP 1,200 rent payment: you pay GBP 700, your partner pays GBP 500. The same percentage applies to every expense you add, whether that's rent, utilities, groceries, or anything else you share.",
  },
  {
    question: "How Do Couples Split Household Bills Fairly?",
    answer:
      "There's no single right way. It depends on what works for your relationship. But income-based splitting is one of the most popular approaches for couples with different salaries because it's transparent and easy to agree on. The idea is simple: instead of splitting everything down the middle, each person contributes a percentage of shared costs that matches their percentage of the household income. The partner who earns more pays a larger share in absolute terms, but both partners give up the same proportion of their income. This works well for rent, utilities, mortgage payments, groceries, and other recurring household costs. Some couples split everything this way; others use it just for the big shared expenses and handle personal spending separately. The key is having an open conversation about what feels fair to both of you. Having clear numbers to work from makes that conversation much easier.",
  },
  {
    question: "Is Income-Based Splitting Fairer Than 50/50?",
    answer:
      "It depends on your situation. If you and your partner earn similar amounts, a 50/50 split might work perfectly well. But when there's a meaningful income gap, splitting everything equally can leave the lower earner with a much tighter budget while the higher earner has more to spare. Income-based splitting adjusts for that difference. Both partners contribute the same proportion of their income, so the financial impact feels more balanced. For example, if one partner earns GBP 60,000 and the other earns GBP 30,000, a 50/50 split on GBP 2,000 of bills means the lower earner spends a much larger share of their take-home pay. Neither approach is objectively better. It's about what feels right for your relationship. Many couples find that proportional splitting reduces money-related stress and makes shared finances feel like a team effort rather than a source of tension.",
  },
  {
    question: "How Do You Split Rent Based on Income?",
    answer:
      "Rent is usually the biggest shared expense for couples, so getting it right matters. The process is the same as splitting any other bill: the calculator divides your rent payment based on each person's share of the combined income. Example: Partner A earns $5,000/month, Partner B earns $3,000/month. Combined income: $8,000. Partner A's share: 62.5%. Partner B's share: 37.5%. For $2,200 monthly rent: Partner A pays $1,375, Partner B pays $825. You can enter rent alongside all your other shared expenses (utilities, internet, groceries) and the calculator will apply the same proportional split to everything. That way you get one clear picture of what each person owes across all your shared costs.",
  },
  {
    question: "What Does a 60/40 or 70/30 Split Look Like?",
    answer:
      "The split ratio depends entirely on your incomes. Examples: Your income $5,000/mo, Partner's income $5,000/mo - Your share 50%, Their share 50%. Your income $6,000/mo, Partner's income $4,000/mo - Your share 60%, Their share 40%. Your income $7,000/mo, Partner's income $3,000/mo - Your share 70%, Their share 30%. Your income $8,000/mo, Partner's income $2,000/mo - Your share 80%, Their share 20%. What 60/40 looks like in practice: For $2,500 in monthly shared expenses, a 60/40 split means one partner pays $1,500 and the other pays $1,000. What 70/30 looks like: For the same $2,500, one partner pays $1,750 and the other pays $750. You don't need to pick a ratio yourself. Just enter your actual incomes and the calculator works out the exact percentages. The examples above are rounded for simplicity; your real split might be 63/37 or 71/29 depending on your actual salaries.",
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
  paddingTop: "var(--space-8)",
  paddingBottom: "var(--space-8)",
} as const;

const contentStyle = {
  padding: "var(--faq-padding)",
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "var(--faq-max-width)",
  gap: "var(--space-4)",
} as const;

const h2Style = {
  fontSize: "var(--faq-title-size)",
  fontFamily: "var(--faq-title-family)",
  fontWeight: "var(--faq-title-weight)",
  color: "var(--faq-text)",
} as const;

const h3Style = {
  fontSize: "var(--faq-h3-size)",
  fontFamily: "var(--faq-h3-family)",
  fontWeight: "var(--faq-h3-weight)",
  color: "var(--faq-text)",
} as const;

const pStyle = {
  fontSize: "var(--faq-p-size)",
  color: "var(--faq-text)",
  fontFamily: "var(--font-family-body)",
  lineHeight: "var(--line-height-relaxed)",
  marginTop: "var(--space-2)",
} as const;

const hrStyle = {
  border: "none",
  borderTop: "var(--border-width-default) solid var(--faq-hr-color)",
  margin: "var(--space-2) 0",
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
          Frequently Asked Questions
        </h2>

        <hr style={hrStyle} />

        {HOMEPAGE_FAQ_ITEMS.map((item) => (
          <article key={item.question}>
            <h3 style={h3Style}>{item.question}</h3>
            <p style={pStyle}>{item.answer}</p>
          </article>
        ))}

        <p style={pStyle}>
          Need more detail?{" "}
          <Link href="/faq" style={faqLinkStyle}>
            Read the full FAQ.
          </Link>
        </p>
      </div>
    </section>
  );
}
