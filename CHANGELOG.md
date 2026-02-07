# Changelog

## Unreleased

### Removed

- **Share Results button and all share-related code (2025-02-07)**: share API client, legacy URL builder, `?id=` and legacy query param loading. Cloudflare Worker to be decommissioned separately.
- **Expense name input placeholder**: Removed placeholder text from expense name input — section description already provides examples; empty fields improve usability per NN Group research.
- **Footer top border**: Removed for cleaner visual separation between main content and footer.
- **Deleted orphaned legacy icon assets (Hide.svg, Show.svg)**: No longer referenced; app uses Material Icons via the Icon component.
- **Moved QA_REPORT_V2.md to docs/historical/**: Keeps audit trail while decluttering root.

### Added

- **aria-describedby on calculator inputs with validation errors (2025-02-07)**: Added aria-describedby to all calculator inputs with validation errors — screen readers now announce error messages when inputs receive focus.
- **Validation error summary below Calculate button (2025-02-07)**: Added validation error summary below Calculate button — shows error count with tap-to-scroll to first error; uses role="alert" for screen reader announcement.
- **Scroll-to-first-error on validation failure (2025-02-07)**: Added scroll-to-first-error on validation failure — Calculate button now scrolls viewport to the first errored field and focuses the input for immediate correction.
- **Wire GA4 tracking for NavBar links, footer links, FAQ CTAs, and Buy Me a Coffee link**: NavBar fires `nav_link_clicked` (desktop/mobile/logo) and `nav_menu_opened` (menu open only); Footer uses `TrackedLink` with `footer_link_clicked`; FAQ page uses `TrackedLink` for "Try the calculator" and `TrackedAnchor` for Buy Me a Coffee with `faq_cta_clicked`.
- **GA4 navigation event constants and TrackedLink/TrackedAnchor**: Event names in `lib/analytics/events.ts` (nav_link_clicked, nav_menu_opened, footer_link_clicked, faq_cta_clicked); reusable `TrackedLink` (Next.js Link + GA4 on click) and `TrackedAnchor` (standard `<a>` + GA4 on click) for click tracking in nav, footer, and FAQ.
- **Redesigned navigation (Phase 2)**: Added Calculator and FAQ text links (desktop ≥640px), Menu dropdown (mobile <640px), active page states (`aria-current`, token-driven styling), conditional currency selector (visible on `/`, hidden on `/faq`).
- **FAQ page (Phase 1)**: Moved FAQ to dedicated `/faq` page with FAQPage JSON-LD structured data; replaced inline FAQ on calculator page with "How It Works" summary and link to `/faq`; updated FAQ content language to focus on couples (spouse, partner, couples budgeting).
- **Site title in nav**: Site title "Fair Share" in navigation bar, visible on viewports ≥ 420px (Phase 2e); link has `aria-label`, visible title has `aria-hidden` for consistent screen reader announcement (see DECISION_LOG).
- **dev:clean script**: `npm run dev:clean` runs `rm -rf .next && next dev`. Documented in CONVENTIONS (Development workflow): use after modifying globals.css, deleting files, or renaming exports to avoid stale .next cache; do not run `npm run build` while dev server is running.

### Changed

- **Docs: Updated validation error investigation with resolution notes and corrected metrics** (2025-02-07): Resolution (2025-02-07) section, blur-time data note, proposed next steps marked done/deferred/superseded; empty_expense_with_label confirmed dead; real blocker rate ~1.3%.
- **validation_error GA event now fires only on Calculate attempt (not on blur) with field-level detail (error_count, error_fields, error_types)** (2025-02-07): Removed blur-time validation_error from use-input-tracking; submit-time validation_error fires in calculator-client when validateForm returns errors, with error_count, comma-separated error_fields and error_types, and returning_user. Historical blur-time data is not comparable to post-deploy data.
- **Fixed: setTimeout cleanup in scrollToFirstError to prevent stale focus calls on unmount** (2025-02-07): scrollToFirstError now returns the timeout ID; CalculatorClient clears it on unmount.
- **Refreshed validation error copy to match conversational product tone (2025-02-07)**: Warmer, outcome-focused messages across salary, expense, and name validation.
- **Fixed error message truncation (2025-02-07)**: ErrorMessage now uses minHeight and allows text wrapping so messages are fully readable on narrow viewports.
- **Removed per-row validation error for label-only expense rows**: Label-only rows (e.g. "Rent" with no amount) are now silently ignored instead of showing "Please enter an expense amount"; global "at least one expense" check still catches all-empty / all-label-only cases.
- **Reduced expense row-to-row spacing from var(--space-4) to var(--space-2) for tighter visual grouping.**
- **Fixed inconsistent label-to-input spacing in Expenses section**: Header-to-first-row gap now uses var(--space-1) to match Income and Names sections.
- **Names section copy**: Removed redundant "optional" labels and placeholder text from Names section — asterisk convention handles required/optional distinction, empty fields improve usability per NN Group research.
- **Calculator: Added bottom spacing between main content and footer**: Mirrored `paddingTop` with `paddingBottom: var(--space-6)` for visual symmetry.
- **Back to top: Refactored into a reusable floating action button**: Fixed bottom-right, icon-only chevron-up (aria-label for screen readers), 400px scroll threshold (optional `threshold` prop), fade + slide animation, 48px touch target, primary button tokens and shadow; no longer uses shared Button component.
- **FAQ: Added per-FAQ tracked CTAs (secondary style) after key FAQ entries. Each CTA sends a unique source parameter to GA4 for conversion attribution.**
- **SEO: Expanded FAQ page from 5 to 10 entries targeting high-impression search queries. Updated meta title and description. Added mortgage, rent, household bills, currency, and income gap FAQs. Updated JSON-LD FAQPage schema to include all 10 Q&A pairs.**
- **SEO: Updated calculator page meta description, OG tags, and subtitle copy to focus on couples. Added metadataBase. Updated copyright year.**
- **Remove "How It Works" section from calculator page; convert FAQ "Try the calculator" links to branded buttons**: Calculator page no longer shows the "How It Works" h2 and paragraph; FAQ page CTAs are `<Link>` elements (later restyled to secondary with per-FAQ GA4 source), 48px touch target, href="/", label "Try the calculator →".
- **Redesign footer with two-group layout (nav + legal), WCAG AA contrast, 48px touch targets; refactor NavBar to consume shared site-links config**: Footer now has Site navigation (Calculator, FAQ) and Legal (Privacy Policy, Terms of Service) groups; desktop ≥640px: side-by-side centered; mobile: stacked vertically centered; link underline styles and hover states; 48px min-height touch targets; NavBar imports NAV_LINKS from `lib/constants/site-links` for both desktop and mobile links.
- **Add shared site-links config; fix footer contrast tokens for WCAG AA legibility**: Added `lib/constants/site-links.ts` (NAV_LINKS, LEGAL_LINKS) for nav/footer parity; updated footer tokens `--footer-text`, `--footer-link`, `--footer-link-hover` to `--text-on-primary`/`--color-white` and added `--footer-link-underline`, `--footer-link-hover-underline`, `--footer-gap-x`, `--footer-group-gap`.
- **Lowered nav title breakpoint from 480px to 420px (Phase 2e)**: New `--breakpoint-xs` token — "Fair Share" title now visible on more devices.
- **Fixed nav links appearing alongside menu button below 640px (Phase 2d)**: Removed `display: flex` from `.nav-links-centre` in `app/globals.css` so visibility is controlled only by `.nav-links-desktop` (hidden by default, `display: flex` at ≥640px). Below 640px only the Menu button is visible; at 640px+ only the centred Calculator/FAQ links are visible.
- **Nav fixes (Phase 2c)**: Menu button moved to far-right; right section order is now [CurrencySelector (on / only)] [Menu]. Auth UI hidden (preserved for re-enablement). Accessibility: nav `aria-label="Main navigation"`; Menu button `aria-haspopup="menu"`, `aria-controls="nav-mobile-menu"`; dropdown `id="nav-mobile-menu"`, `role="menu"`; links `role="menuitem"`; Escape closes menu and returns focus to Menu button; focus moves to first link on open and back to Menu button on close; arrow Up/Down navigation between menuitems.
- **Fixed nav layout (Phase 2b)**: Centred Calculator/FAQ links on desktop to prevent layout shift when CurrencySelector shows/hides between pages; increased nav link breakpoint to 640px; Menu button uses Button component for consistent styling.
- **Footer GA4 params and fallback**: Aligned API_REFERENCE.md `footer_link_clicked` `link` values with implementation (`"privacy"`, `"terms"`); hardened footer eventParams fallback to use `replace(/\s+/g, "_")` for unknown labels.
- **Fixed expense row alignment**: Delete button now aligns with input fields. Removed paddingTop from delete column (was compensating for FormField labels that don't exist in expense rows). Added ErrorMessage placeholder to label column for consistent column heights. Removed unused `--label-line-height` token.
- **Simplified IconButton to single 48px size, removed size prop**: IconButton no longer has sm/md variants; all instances use `--icon-button-size` (48px) and `--icon-button-icon-size` (20px). Fixed expense row delete button alignment with input fields (paddingTop from label + gap tokens so delete column aligns with top of inputs).
- **Consistent 48px touch target**: All interactive components (Button, Input, CurrencySelector, IconButton) enforce a minimum height of 48px via `--touch-target-min-height`. IconButton uses single size. Improves mobile usability and visual consistency.
- **Fixed inconsistent component heights**: All interactive elements (Button, Input, CurrencySelector, auth error link) now use `height: var(--touch-target-min-height)` instead of `minHeight`, so they render at exactly 48px. With `box-sizing: border-box`, padding and border are absorbed into the 48px box; previously min-height was ineffective because natural heights already exceeded 48px.
- **CurrencySelector**: Pill radius (`--radius-pill`), custom dropdown arrow via CSS background (`--currency-selector-arrow-size`), and logical padding tokens (`--currency-selector-padding-inline-start/end`) for consistent 48px height and appearance.

### Added

- **Dashboard design preview**: Route `/dashboard-preview` (temporary) renders the dashboard with hardcoded dummy data for design iteration without auth. No Supabase, no redirect. Metadata: `noindex`, `nofollow`. Query params: `?empty=true` (empty state), `?full=true` (10 configs, "10 of 10 saved"); default 5 configs. Banner: "Design Preview — actions won't work". Not in sitemap or nav; Load/Rename/Delete from cards will fail (expected).
- **Phase 6e — localStorage migration + currency sync**: Dashboard: on mount, if `fairshare_pending_save` is `'true'`, read `fairshare_form`, validate (name1/name2/salary1/salary2 present), map to `SaveConfigInput`, call `saveConfiguration`; on success re-fetch configs and show "Configuration saved from your calculator session."; on error show error snackbar; always remove `fairshare_pending_save`. Currency context: for logged-in users, after init from localStorage/locale, call `getCurrencyPreference()` and use DB value when it differs (DB is source of truth); on `setCurrency`, persist to localStorage and fire-and-forget `setCurrencyPreference(code)` when user is logged in.
- **Phase 6d — Save from results + load config**: Save button on results screen (visible to everyone): anonymous users get `fairshare_pending_save` set and redirect to `/login`; logged-in users call `saveConfiguration` with current form state (idle/saving/saved/error). Load saved config: dashboard "Load" goes to `/?config={id}`; `CalculatorClient` runs `getConfiguration(id)`, restores form and stays on input step, then removes `?config=` from URL. `?config=` takes precedence over `?id=`. ResultsFooter gains `onSave` and `saveState`; Save button (secondary) between Back to Edit and Share. No changes to server actions, dashboard, or use-calculator.
- **Phase 6c — Dashboard UI**: Dashboard page (`app/dashboard/page.tsx`) — server component: auth check, `listConfigurations()`, max-width container; heading "Your Configurations", subheading "{n} of 10 saved"; empty state with link to calculator when no configs. `DashboardClient` (`components/dashboard/dashboard-client.tsx`) — client state for config list and snackbar; maps configs to `ConfigCard`, handles onDeleted (remove from state + success snackbar) and onError (error snackbar). `ConfigCard` (`components/dashboard/config-card.tsx`) — Card with editable name (inline edit, blur/Enter save via `renameConfiguration`, Escape cancel), date (updatedAt), summary line (names, expense count, formatted total), Load (primary button → `/?config={id}`) and Delete (IconButton danger, `window.confirm`, `deleteConfiguration`, on success parent removes card). Reuses `--section-title-*`, `--section-description-*`, `--label-*`, `--summary-explanation-*`; no new tokens.
- **Phase 6b — Server Actions: configurations + currency preference**: `lib/actions/configurations.ts` — types `ConfigSummary`, `ConfigDetail`, `SaveConfigInput`, `ActionResult`; actions `saveConfiguration`, `listConfigurations`, `getConfiguration`, `renameConfiguration`, `deleteConfiguration` (soft delete). `lib/actions/user-preferences.ts` — `getCurrencyPreference`, `setCurrencyPreference`. All use `createClient()` from `@/lib/supabase/server`; auth via `getUser()` and household from `household_members`; errors logged, user-friendly messages returned; config limit (10) returns dedicated message on trigger `check_violation`. No UI changes.
- **Phase 6a — Schema: soft delete + currency pref**: Migration `supabase/migrations/002_soft_delete_and_currency_pref.sql`. Soft delete: `deleted_at TIMESTAMPTZ` on `configurations` and `expenses`; SELECT policies updated to exclude soft-deleted rows; INSERT/UPDATE/DELETE policies unchanged (soft delete via UPDATE `deleted_at`, hard DELETE for future purge). Partial index `idx_configurations_deleted_at_null` for non-deleted configs. Max configs: `public.check_config_limit()` trigger BEFORE INSERT on `configurations` (max 10 non-deleted per household). Currency: `households.currency` already exists — no new column.
- **Footer**: `Footer` component in `components/nav/footer.tsx`; token-driven styling (`--footer-*` in `globals.css`); links to Privacy Policy and Terms of Service; copyright notice; rendered in root layout below all content.
- **Privacy Policy**: `app/privacy/page.tsx` — server-rendered page with metadata; content covers data collection, use, third-party services, Google user data, retention, rights.
- **Terms of Service**: `app/terms/page.tsx` — server-rendered page with metadata; content covers acceptance, service description, accounts, acceptable use, liability, governing law.
- **Foundation DB schema (Phase 5b)**: Migration `supabase/migrations/001_foundation_schema.sql` — tables `households`, `household_members`, `configurations`, `expenses`; RLS on all; helper `user_household_ids(uuid)`; trigger `on_auth_user_created` (new user → one household + owner membership); `updated_at` triggers. Run manually in Supabase SQL Editor; no app CRUD on these tables yet.
- **Supabase Auth (Phase 5c)**: Google OAuth sign-in. Packages: `@supabase/supabase-js`, `@supabase/ssr`. Three Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (Server Components / Route Handlers), `lib/supabase/middleware.ts` (session refresh). Root `middleware.ts` refreshes session via `getUser()`, protects `/dashboard` (redirect to `/login`), redirects logged-in users from `/login` to `/dashboard`. No auth gate on `/` — calculator works anonymously.
- **Auth routes**: `GET /auth/callback` (code exchange → `/dashboard` or `/auth/error`), `/auth/error` (error message + link to sign in), `/login` (Continue with Google, link to calculator), `/dashboard` (protected; Your Configurations, config cards or empty state).
- **NavBar auth state**: Logged out → “Sign in” (navigates to `/login`). Logged in → avatar initial + sign-out IconButton; uses `getSession()` on mount and `onAuthStateChange`; sign-out calls `signOut()` then `router.refresh()`.
- **Card** (`components/ui/card.tsx`): optional `style?: React.CSSProperties` for layout (e.g. auth/dashboard pages).

### Changed

- **Save button gated by auth feature flag (Phase 6d-fix)**: When `NEXT_PUBLIC_AUTH_ENABLED` is not `'true'` (e.g. production), the Save Configuration button on the results screen is hidden. `CalculatorClient` passes `onSave` and `saveState` to `ResultsView` only when auth is enabled; `ResultsView`/`ResultsFooter` treat them as optional and only show the Save button when `onSave` is provided. Avoids redirecting anonymous users to `/login` when auth is disabled in production.
- **Favicon**: Layout icon path updated to use the correct directory (`/images/lotus.png`) for asset management.
- **Salary inputs**: IncomeSection salary fields use `type="text"` with `inputMode="numeric"` (not `type="number"`) for better security and visibility when toggling show/hide; styling for hidden state uses `WebkitTextSecurity: disc`, letterSpacing, and padding for the visibility toggle.
- **autoComplete="off"** on calculator input fields (ExpenseRow amount, IncomeSection salary inputs) to reduce distracting browser autofill suggestions.
- **.gitignore**: `.env.local` replaced with `.env*.local` to cover all env local files.

### Removed

- **STYLE_AUDIT_REPORT.md** — Debugging artifact removed from repo root.
- **lib/supabase/.gitkeep** (replaced by client, server, middleware modules).

---

### Added (earlier)

- **FormField** (`components/ui/form-field.tsx`): composite label + Input + ErrorMessage; optional `prefix`, `labelSuffix`. Used for consistent form layout.
- **Icon** (`components/ui/icon.tsx`): Material Symbols wrapper (`material-symbols-outlined`); props: name, size, color, aria-hidden.
- **IconButton** (`components/ui/icon-button.tsx`): accessible button with Icon; variants `ghost` | `danger`; single 48px size; tokens `--icon-button-*`.
- **Input prefix**: salary and expense amount inputs show currency symbol inside the field (e.g. `$`, `£`) via `Input` prop `prefix`; tokens and focus ring for prefixed wrapper in `globals.css`.
- Component inventory page: molecules section (FormField), atoms updated (Icon, IconButton); showcases all UI primitives for QA.
- Multi-currency support: user can select currency (USD, CAD, AUD, NZD, GBP, INR, PHP, SGD) via selector in nav. Currency is persisted in localStorage (`fairshare_currency`) and restored from `fairshare_form.currency` for backward compat. Share links and legacy URL params include and restore currency.
- Currency auto-detection from browser locale (`detectCurrencyFromLocale` in `lib/constants/currencies.ts`); used when no saved currency.
- Sticky nav bar: logo (link to home), currency selector, slot for future auth. Tokens: `--nav-*`, `--currency-selector-*` in `app/globals.css`.
- `CurrencyProvider` and `useCurrency()` in `lib/contexts/currency-context.tsx`; root layout wraps app with provider. Analytics: `currency_changed` on selector change.
- `CalculatorResult.currencySymbol` and `formatCurrency(num, symbol)`; results and share state use selected currency symbol/code.
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
- Calculator page: SSR shell, H1, CalculatorClient, JSON-LD (WebApplication), metadata (title, description, canonical, OG). FAQ content on dedicated `/faq` page; FAQ CTAs styled as primary buttons.
- Root layout: Josefin Sans + Assistant fonts, Material Symbols, metadata.

### Changed

- Calculator page: main layout uses `--space-6` gap between calculator shell and FAQ; FAQ section uses full width and stretch for correct flex layout.
- Root layout: `CurrencyProvider` and `NavBar` added; body content wrapped for currency context.
- Root layout: GA4, Hotjar, Clarity, AdSense scripts added (Next.js Script, afterInteractive).
- Documentation: API reference and conventions updated to match current code (env return shape, share API env override, logger, analytics, sitemap).

### Fixed

- **Auth error handling (Phase 5e)**: OAuth callback (`GET /auth/callback`) handler wrapped in try/catch — any thrown error (e.g. from `createClient` or `exchangeCodeForSession`) redirects to `/auth/error` instead of returning 500. Login page: `handleGoogleSignIn` in try/catch/finally; on failure shows "Sign-in failed. Please try again." via `ErrorMessage` below the button; loading reset in `finally`; error cleared when user clicks the button again.
- Nav bar on desktop now stretches full width; removed inner max-width (600px) constraint and `--nav-max-width` token.
- Next.js upgraded to patch security vulnerability (^15.5.12).

### Security

- Next.js dependency updated to address security advisory.

### Removed

- Static `public/sitemap.xml` (replaced by `app/sitemap.ts`).

