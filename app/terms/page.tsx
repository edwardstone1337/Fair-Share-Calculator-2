import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Fair Share Calculator",
  description: "Terms of Service for Fair Share Calculator.",
  alternates: { canonical: "https://www.fairsharecalculator.com/terms" },
};

export default function TermsPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "var(--surface-page)" }}
    >
      <div
        style={{
          maxWidth: "var(--faq-max-width)",
          margin: "0 auto",
          padding: "var(--faq-padding)",
          paddingTop: "var(--space-16)",
          background: "var(--faq-bg)",
          color: "var(--faq-text)",
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
          Terms of Service
        </h1>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-6)",
          }}
        >
          Last updated: February 2026
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          1. Acceptance of Terms
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          By accessing or using Fair Share Calculator at fairsharecalculator.com
          (&quot;the Service&quot;), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the
          Service.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          2. Description of Service
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Fair Share Calculator is a free online tool that helps couples and
          roommates split shared expenses based on income. The Service provides
          calculations for informational purposes only and does not constitute
          financial advice.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          3. Accounts
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          You may use the calculator without creating an account. If you choose
          to create an account via Google sign-in or magic link, you are
          responsible for maintaining the security of your account. You must
          provide accurate information when creating an account.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          4. Acceptable Use
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          You agree not to: use the Service for any unlawful purpose, attempt to
          gain unauthorised access to any part of the Service, interfere with or
          disrupt the Service or its infrastructure, or use automated systems to
          access the Service in a manner that exceeds reasonable use.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          5. Intellectual Property
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          The Service and its original content, features, and functionality are
          owned by Fair Share Calculator and are protected by applicable
          copyright and other intellectual property laws.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          6. Calculator Accuracy
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          While we strive to ensure our calculations are accurate, the Service
          is provided for informational purposes only. You should independently
          verify any calculations before making financial decisions. We are not
          responsible for any errors in calculations or any decisions made based
          on the Service&apos;s output.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          7. Advertisements
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          The Service may display third-party advertisements. We are not
          responsible for the content of these advertisements or any products or
          services they promote.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          8. Limitation of Liability
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied. In no event
          shall Fair Share Calculator be liable for any indirect, incidental,
          special, consequential, or punitive damages arising from your use of
          the Service.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          9. Account Termination
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          We reserve the right to suspend or terminate your account at our
          discretion, without notice, for conduct that we determine violates
          these Terms or is harmful to other users, us, or third parties, or for
          any other reason.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          10. Changes to Terms
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          We reserve the right to modify these Terms at any time. We will notify
          users of significant changes by updating the &quot;Last updated&quot;
          date. Continued use of the Service after changes constitutes
          acceptance of the new Terms.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          11. Governing Law
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          These Terms shall be governed by and construed in accordance with the
          laws of Australia, without regard to its conflict of law provisions.
        </p>

        <h2
          style={{
            fontSize: "var(--faq-h3-size)",
            fontFamily: "var(--faq-h3-family)",
            fontWeight: "var(--faq-h3-weight)",
            color: "var(--faq-text)",
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          12. Contact Us
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          If you have questions about these Terms, please contact us at{" "}
          <a
            href="mailto:support@fairsharecalculator.com"
            className="footer-link"
            style={{ color: "var(--footer-link)" }}
          >
            support@fairsharecalculator.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
