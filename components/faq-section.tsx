import { BackToTopButton } from "@/components/back-to-top-button";

const BUY_ME_A_COFFEE_IMG =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

export function FaqSection() {
  return (
    <section
      style={{
        width: "100%",
        alignSelf: "stretch",
        background: "var(--faq-bg)",
        color: "var(--faq-text)",
        paddingTop: "var(--space-16)",
      }}
    >
      <div
        style={{
          padding: "var(--faq-padding)",
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          maxWidth: "var(--faq-max-width)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--faq-title-size)",
            fontFamily: "var(--faq-title-family)",
            fontWeight: "var(--faq-title-weight)",
            color: "var(--faq-text)",
            marginBottom: "var(--space-4)",
          }}
        >
          How to Split Bills Based on Income
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Our income-based bill split calculator helps you divide shared
          expenses fairly. Whether you&apos;re splitting rent with roommates,
          sharing bills with a partner, or managing shared living costs, our
          tool ensures everyone pays their fair share based on what they earn.
        </p>

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
          Common Use Cases for Income-Based Bill Splitting:
        </h3>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Rent Split Calculator:</strong> Split rent based on income
            when roommates have different salaries
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Utility Bill Splitting:</strong> Divide electricity, water,
            and internet bills proportionally
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
            <strong>Couples Budgeting:</strong> Fair expense sharing for
            partners with different incomes
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Roommate Expenses:</strong> Split household costs fairly
            among roommates
          </li>
        </ul>

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
          Why Split Bills Based on Income?
        </h3>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Income-based bill splitting ensures financial fairness. Instead of
          splitting everything 50/50, each person contributes based on their
          ability to pay. This approach reduces financial stress and creates
          more equitable living arrangements.
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
            marginBottom: "var(--space-4)",
          }}
        >
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Enter Your Names:</strong> Add both names to personalize
            the bill splitting results.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Enter Both Incomes:</strong> Type in your after-tax
            salaries for accurate income-based calculations.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Add Shared Bills:</strong> Enter rent, utilities,
            groceries, or any shared expenses you need to split.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Hit Calculate:</strong> Our calculator automatically
            determines fair splits based on income percentages.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>See Your Results:</strong> Get a clear breakdown showing
            exactly how much each person should pay.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Share Results:</strong> Send the calculation link to
            roommates or partners for transparency.
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
          How Is Income-Based Bill Splitting Calculated?
        </h3>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Our calculator ensures fair bill splitting based on income.
          Here&apos;s how the calculation works:
        </p>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Calculate Income Percentages:</strong>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "var(--space-5)",
                marginBottom: "var(--space-4)",
              }}
            >
              <li style={{ marginBottom: "var(--space-2)" }}>
                Your Income ÷ (Your Income + Roommate&apos;s/Partner&apos;s
                Income) = Your Contribution Percentage
              </li>
            </ul>
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Apply to Bills:</strong>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "var(--space-5)",
                marginBottom: "var(--space-4)",
              }}
            >
              <li style={{ marginBottom: "var(--space-2)" }}>
                Multiply each bill by your percentage to find your fair share.
              </li>
            </ul>
          </li>
        </ul>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          <strong>Rent Split Example:</strong>
        </p>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          <li style={{ marginBottom: "var(--space-2)" }}>
            You earn <strong>$60,000</strong>, roommate earns{" "}
            <strong>$40,000</strong>.
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Your Percentage:</strong> 60%
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            <strong>Roommate&apos;s Percentage:</strong> 40%
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            For <strong>$2,000</strong> monthly rent:
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "var(--space-5)",
                marginBottom: "var(--space-4)",
              }}
            >
              <li style={{ marginBottom: "var(--space-2)" }}>
                <strong>You Pay:</strong> $1,200
              </li>
              <li style={{ marginBottom: "var(--space-2)" }}>
                <strong>Roommate Pays:</strong> $800
              </li>
            </ul>
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
            marginBottom: "var(--space-4)",
          }}
        >
          Income-based splitting ensures everyone contributes according to
          their financial ability. This approach is fairer than 50/50 splits
          when people have different incomes, reducing financial stress for
          lower earners while maintaining equity. Perfect for roommates,
          couples, or any shared living situation.
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
            marginBottom: "var(--space-4)",
          }}
        >
          Currently, we use <strong>after-tax incomes</strong> for the most
          accurate bill splitting calculations. For even more precise
          results, you can enter your net income after insurance, retirement
          contributions, and other deductions. This ensures your bill split
          reflects your actual available income.
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
            marginBottom: "var(--space-4)",
          }}
        >
          We&apos;d love to hear from you! Give us a rating and share your
          feedback via the widget somewhere on the screen. Your insights
          help us make the income-based bill split calculator even better.
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
            marginBottom: "var(--space-4)",
          }}
        >
          By keeping things simple and transparent, we hope our bill split
          calculator helps you and your roommates or partners find balance
          in shared expenses. Whether you&apos;re splitting rent, utilities,
          or groceries, income-based splitting ensures everyone pays their
          fair share!
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

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--faq-hr-color)",
            margin: "var(--space-5) 0",
          }}
        />

        <BackToTopButton />
      </div>
    </section>
  );
}
