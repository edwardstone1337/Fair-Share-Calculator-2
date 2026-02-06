# Changelog

## Unreleased

### Added

- **Foundation DB schema (Phase 5b)**: Migration `supabase/migrations/001_foundation_schema.sql` — tables `households`, `household_members`, `configurations`, `expenses`; RLS on all; helper `user_household_ids(uuid)`; trigger `on_auth_user_created` (new user → one household + owner membership); `updated_at` triggers. Run manually in Supabase SQL Editor; no app CRUD on these tables yet.
- **Supabase Auth (Phase 5c)**: Google OAuth sign-in. Packages: `@supabase/supabase-js`, `@supabase/ssr`. Three Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (Server Components / Route Handlers), `lib/supabase/middleware.ts` (session refresh). Root `middleware.ts` refreshes session via `getUser()`, protects `/dashboard` (redirect to `/login`), redirects logged-in users from `/login` to `/dashboard`. No auth gate on `/` — calculator works anonymously.
- **Auth routes**: `GET /auth/callback` (code exchange → `/dashboard` or `/auth/error`), `/auth/error` (error message + link to sign in), `/login` (Continue with Google, link to calculator), `/dashboard` (protected placeholder; welcome + “Back to calculator”).
- **NavBar auth state**: Logged out → “Sign in” (navigates to `/login`). Logged in → avatar initial + sign-out IconButton; uses `getSession()` on mount and `onAuthStateChange`; sign-out calls `signOut()` then `router.refresh()`.
- **Card** (`components/ui/card.tsx`): optional `style?: React.CSSProperties` for layout (e.g. auth/dashboard pages).

### Changed

- **autoComplete="off"** on calculator input fields (ExpenseRow amount, IncomeSection salary inputs) to reduce distracting browser autofill suggestions.
- **.gitignore**: `.env.local` replaced with `.env*.local` to cover all env local files.

### Removed

- **lib/supabase/.gitkeep** (replaced by client, server, middleware modules).

---

### Added (earlier)

- **FormField** (`components/ui/form-field.tsx`): composite label + Input + ErrorMessage; optional `prefix`, `labelSuffix`. Used for consistent form layout.
- **Icon** (`components/ui/icon.tsx`): Material Symbols wrapper (`material-symbols-outlined`); props: name, size, color, aria-hidden.
- **IconButton** (`components/ui/icon-button.tsx`): accessible button with Icon; variants `ghost` | `danger`, sizes `sm` | `md`; tokens `--icon-button-*`.
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
- Calculator page: SSR shell, H1, FaqSection, JSON-LD (WebApplication), metadata (title, description, canonical, OG).
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

