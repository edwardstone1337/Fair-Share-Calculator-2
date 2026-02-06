import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        background: "var(--footer-bg)",
        borderTop: "1px solid var(--footer-divider)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--footer-max-width)",
          margin: "0 auto",
          padding: "var(--footer-padding-y) var(--footer-padding-x)",
          gap: "var(--space-2)",
        }}
        className="flex flex-col items-center text-center"
      >
        <nav
          className="flex flex-wrap items-center justify-center"
          aria-label="Footer navigation"
        >
          <Link
            href="/privacy"
            className="footer-link"
            style={{
              color: "var(--footer-link)",
              fontSize: "var(--footer-font-size)",
            }}
          >
            Privacy Policy
          </Link>
          <span
            style={{
              color: "var(--footer-text)",
              fontSize: "var(--footer-font-size)",
            }}
            aria-hidden
          >
            {" "}
            |{" "}
          </span>
          <Link
            href="/terms"
            className="footer-link"
            style={{
              color: "var(--footer-link)",
              fontSize: "var(--footer-font-size)",
            }}
          >
            Terms of Service
          </Link>
        </nav>
        <p
          style={{
            color: "var(--footer-text)",
            fontSize: "var(--footer-font-size)",
          }}
        >
          © 2025 Fair Share Calculator
        </p>
      </div>
    </footer>
  );
}
