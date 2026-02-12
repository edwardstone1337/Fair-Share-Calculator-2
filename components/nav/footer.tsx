import { TrackedLink } from "@/components/ui/tracked-link";
import { TrackedAnchor } from "@/components/ui/tracked-anchor";
import { NAV_LINKS, LEGAL_LINKS } from "@/lib/constants/site-links";
import { FOOTER_LINK_CLICKED } from "@/lib/analytics/events";

const FEEDBACK_SURVEY_URL =
  "https://surveys.hotjar.com/75994e9b-1ee0-4dae-a644-0609ee4c4ecf";

import styles from "./footer.module.css";

const FOOTER_LINK_KEYS: Record<string, string> = {
  "Calculator": "calculator",
  "FAQ": "faq",
  "Privacy Policy": "privacy",
  "Terms of Service": "terms",
};

export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        background: "var(--footer-bg)",
      }}
    >
      <div className={styles.footerInner}>
        <div className={styles.footerLinks}>
          <nav aria-label="Site navigation" className={styles.footerNav}>
            {NAV_LINKS.map((link) => (
              <TrackedLink
                key={link.href}
                href={link.href}
                className={styles.footerLink}
                eventName={FOOTER_LINK_CLICKED}
                eventParams={{ link: FOOTER_LINK_KEYS[link.label] ?? link.label.toLowerCase().replace(/\s+/g, "_") }}
              >
                {link.label}
              </TrackedLink>
            ))}
          </nav>
          <nav aria-label="Legal" className={styles.footerNav}>
            {LEGAL_LINKS.map((link) => (
              <TrackedLink
                key={link.href}
                href={link.href}
                className={styles.footerLink}
                eventName={FOOTER_LINK_CLICKED}
                eventParams={{ link: FOOTER_LINK_KEYS[link.label] ?? link.label.toLowerCase().replace(/\s+/g, "_") }}
              >
                {link.label}
              </TrackedLink>
            ))}
            <TrackedAnchor
              href={FEEDBACK_SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
              eventName={FOOTER_LINK_CLICKED}
              eventParams={{ link: "give_us_feedback" }}
            >
              Give Us Feedback
            </TrackedAnchor>
          </nav>
        </div>
        <p className={styles.footerCopyright}>© 2025–2026 Fair Share Calculator</p>
      </div>
    </footer>
  );
}
