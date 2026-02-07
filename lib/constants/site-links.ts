export interface SiteLink {
  label: string;
  href: string;
}

/** Primary navigation links (Calculator, FAQ) */
export const NAV_LINKS: SiteLink[] = [
  { label: "Calculator", href: "/" },
  { label: "FAQ", href: "/faq" },
];

/** Legal/policy links */
export const LEGAL_LINKS: SiteLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
