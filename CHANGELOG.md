# Changelog

## Unreleased

### Added

- Analytics: GA4 (G-TQZ0HGB3MT), Hotjar, Microsoft Clarity, Google AdSense in root layout (Next.js Script, afterInteractive).
- Analytics module `lib/analytics/gtag.ts`: `trackEvent()`, `bucketExpenseAmount()`, `bucketSplitRatio()`; silent no-op if gtag unavailable.
- Event tracking: calculate_clicked, calculate_attempt (success/error + error_type), results_viewed, share_results, data_restored (localStorage + share link), add/delete expense, salary_toggle, back_to_edit_clicked, input_started, input_completed, validation_error (blur).
- `useInputTracking` hook: per-field input_started/input_completed/validation_error; optional `prefilled` to skip input_started for restored data.
- `useCalculator` option `onDataRestored`: callback when state is restored from localStorage (used for prefilled UX and returning-user analytics).
- Prefilled props: `prefilledSalaries`, `prefilledNames`, `prefilledExpenses` on Income/Names/Expenses sections and `prefilled` on ExpenseRow when data comes from share link or localStorage.
- Dynamic sitemap: `app/sitemap.ts` (single URL, monthly changeFrequency, priority 1.0); removed static `public/sitemap.xml`.
- Income-based bill split calculator: two salaries, multiple expenses, proportional split.
- Income section (two salary inputs, show/hide toggles, Calculate CTA).
- Expenses section (add/remove rows, amount + label; at least one expense required).
- Names section (optional person names; Calculate CTA).
- Pure calculation module: `calculateShares`, `parseSalary`, `parseExpenseAmount`, `formatCurrency` (V1 parity).
- Form validation: salaries required and valid, expense rules and global “at least one expense” error.
- `useCalculator` hook: reducer state, localStorage persist/restore, V1 localStorage key backward compatibility.
- Results step: full UI — SummaryCard, BreakdownCard, ExplanationCard, ResultsFooter; Edit details and Share CTAs.
- Design system: three-layer tokens in `app/globals.css` (primitives, semantic, component); 8px grid.
- Share: Cloudflare Worker backend (POST /share, GET /share/:id); copy link to clipboard; Snackbar feedback; legacy query-param URL fallback.
- URL hash sync: `#results` / `#input` for step; browser back/forward support.
- URL param loading: `?id=` fetches share from backend; `name1`, `salary1`, etc. restore legacy share links.
- UI components: Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar.
- FAQ section below calculator (expandable accordion).
- Calculator page: SSR shell, H1, FaqSection, JSON-LD (WebApplication), metadata (title, description, canonical, OG).
- Root layout: Josefin Sans + Assistant fonts, Material Symbols, metadata.

### Changed

- Root layout: GA4, Hotjar, Clarity, AdSense scripts added (Next.js Script, afterInteractive).
- Documentation: API reference and conventions updated to match current code (env return shape, share API env override, logger, analytics, sitemap).

### Fixed

- Next.js upgraded to patch security vulnerability (^15.5.12).

### Security

- Next.js dependency updated to address security advisory.

### Removed

- Static `public/sitemap.xml` (replaced by `app/sitemap.ts`).

