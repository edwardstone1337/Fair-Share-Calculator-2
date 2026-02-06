# Changelog

## Unreleased

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

