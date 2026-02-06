import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Fair Share Calculator",
  description:
    "Privacy Policy for Fair Share Calculator. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "https://www.fairsharecalculator.com/privacy" },
};

export default function PrivacyPage() {
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
          Privacy Policy
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
          1. Introduction
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Fair Share Calculator (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          operates fairsharecalculator.com. This Privacy Policy explains how we
          collect, use, and protect your information when you use our website.
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
          2. Information We Collect
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-2)",
          }}
        >
          <strong>Information you provide:</strong> When you create an account
          using Google sign-in or magic link, we collect your email address and
          display name. When you use the calculator, you enter income figures and
          expense amounts — if you have an account, these may be saved to our
          servers.
        </p>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          <strong>Information collected automatically:</strong> We use cookies
          and similar technologies to collect analytics data including pages
          visited, browser type, device type, and general location. We also store
          your currency preference in your browser&apos;s local storage.
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
          3. How We Use Your Information
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          We use your information to: provide and maintain the calculator
          service, save your calculator configurations if you have an account,
          remember your currency preference, analyse usage patterns to improve
          the service, and display relevant advertisements.
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
          4. Third-Party Services
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-2)",
          }}
        >
          We use the following third-party services that may collect data:
        </p>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "var(--space-5)",
            marginBottom: "var(--space-4)",
          }}
        >
          <li style={{ marginBottom: "var(--space-2)" }}>
            Google Analytics (GA4) — usage analytics
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            Hotjar — heatmaps and session recordings
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            Microsoft Clarity — session recordings and heatmaps
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            Google AdSense — advertising
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            Supabase — authentication and data storage
          </li>
          <li style={{ marginBottom: "var(--space-2)" }}>
            Google OAuth — account sign-in
          </li>
        </ul>

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
          5. Google User Data
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          When you sign in with Google, we access your basic profile information
          (name and email address) solely to create and manage your account. We
          do not access any other Google account data. We do not sell, share, or
          transfer your Google user data to third parties. Fair Share
          Calculator&apos;s use and transfer of information received from Google
          APIs adheres to the Google API Services User Data Policy, including
          the Limited Use requirements.
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
          6. Data Storage and Security
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Your data is stored securely using Supabase (hosted on AWS). We
          implement row-level security policies to ensure you can only access
          your own data. Calculator data entered without an account is stored
          only in your browser&apos;s local storage and never sent to our
          servers.
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
          7. Data Retention and Deletion
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          We retain your account data for as long as your account is active. You
          may request deletion of your account and all associated data at any
          time by contacting us at the email below. Upon account deletion, all
          your saved configurations and personal data are permanently removed
          from our servers. Browser local storage data can be cleared through
          your browser settings at any time.
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
          8. Your Rights
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          You have the right to: access the personal data we hold about you,
          request correction of inaccurate data, request deletion of your data,
          and withdraw consent for data processing at any time.
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
          9. Children&apos;s Privacy
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          Our service is not directed to children under 13. We do not knowingly
          collect personal information from children under 13.
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
          10. Changes to This Policy
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by updating the &quot;Last updated&quot; date at the
          top of this page.
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
          11. Contact Us
        </h2>
        <p
          style={{
            fontSize: "var(--faq-p-size)",
            color: "var(--faq-text)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-4)",
          }}
        >
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:privacy@fairsharecalculator.com"
            className="footer-link"
            style={{ color: "var(--footer-link)" }}
          >
            privacy@fairsharecalculator.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
