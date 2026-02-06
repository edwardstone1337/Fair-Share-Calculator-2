# Decision Log

## [2025-02-06] - dev:clean script for cache hygiene

**Context**: After editing `globals.css`, deleting files, or renaming exports, Next.js can serve stale modules from `.next` until the cache is cleared, causing confusing build/runtime errors.

**Decision**: Add `dev:clean` script (`rm -rf .next && next dev`) and document in CONVENTIONS: use it after sessions that touch globals.css, file deletions, or export renames; do not run `npm run build` while the dev server is running.

**Rationale**: Single command avoids manual cache wipe + restart. Explicit convention prevents stale-cache debugging sessions.

**Consequences**: One extra npm script; CONVENTIONS.md has a "Development workflow" section for the rule.

---

## [2025-02-06] - Removed paddingTop from expense row delete column

**Context**: Expense row delete column had `paddingTop: calc(var(--label-line-height) * var(--label-font-size) + var(--space-1))` to align the delete button with inputs. Expense rows have no labels (unlike FormField layout), so this offset was compensating for non-existent label space.

**Decision**: Removed paddingTop from the delete column wrapper entirely. Added ErrorMessage placeholder to the label column with `visible={false}` so both input columns have consistent height (label column matches amount column’s ErrorMessage slot). Removed `--label-line-height` token from globals.css as it was only used for the removed paddingTop calc.

**Rationale**: Delete button should align with the top of the inputs; expense rows don’t use FormField, so no label offset is needed. ErrorMessage placeholder keeps column heights consistent when amount column shows an error.

**Consequences**: Delete button top-aligns with both inputs; spacer row (first row) aligns with inputs; error state grows row downward while alignment holds.

---

## [2025-02-06] - Switched from min-height to height for touch-target enforcement

**Context**: Touch targets were specified via `minHeight: var(--touch-target-min-height)` (48px). In practice, padding + content + border already exceeded 48px on Button, Input, and CurrencySelector, so min-height did nothing and rendered heights were inconsistent (e.g. Button ~56–58px, Input/CurrencySelector ~53px). Only IconButton was exactly 48px because it uses an explicit size token.

**Decision**: Switched from min-height to height for `--touch-target-min-height` enforcement on Button, Input (bare and prefixed wrapper), CurrencySelector, and the auth error "Back to sign in" link. IconButton unchanged (already 48px). With `box-sizing: border-box`, `height: 48px` gives exactly 48px including padding and border; flex centering (Button) and native input/select centering handle vertical alignment.

**Rationale**: Explicit height enforces consistent 48px across all interactive elements; min-height was ineffective when natural height already exceeded the floor.

**Consequences**: All interactive components now render at exactly 48px height. Padding tokens unchanged; padding is absorbed into the 48px box.

---

## [2025-02-06] - Collapsed IconButton to single 48px size

**Context**: IconButton sm and md were both 48px after touch-target standardization, making the size prop redundant.

**Decision**: Collapsed IconButton sm/md into a single size (48px). Removed the `size` prop from IconButton. All IconButtons are now touch-target compliant via a single `--icon-button-size` token (`var(--touch-target-min-height)`). Icon visual size standardized to 20px (`--icon-button-icon-size`). Removed `--icon-button-size-sm`, `--icon-button-size-md`, and the corresponding icon-size tokens from globals.css.

**Rationale**: One size simplifies the API and avoids confusion; top-alignment with inputs is correct intent for multi-line labels or varying error states.

**Consequences**: All IconButton consumers no longer pass `size`. Expense row delete column uses `--icon-button-size` and paddingTop from label tokens for alignment with input fields.

---

## [2025-02-06] - Standardized 48px touch target (interactive components)

**Context**: Mobile usability and visual consistency require a minimum touch-target height across all interactive elements.

**Decision**: Standardized 48px touch target across Button, Input, CurrencySelector, and IconButton via a single semantic token `--touch-target-min-height: var(--space-12)`. IconButton sm and md both use 48px for the hit area; icon sizes (18px / 20px) remain unchanged for visual hierarchy. Removed `--add-expense-padding-y` and `--add-expense-padding-x`; Add Expense button inherits standard Button min-height and padding.

**Rationale**: One token drives all interactive heights; WCAG and mobile best practices recommend ≥44–48px. Token-only approach keeps theming and future a11y overrides in one place.

**Consequences**: Expense row delete column widens from 32px to 48px (layout shift). FormField labelSuffix IconButton and nav CurrencySelector/IconButton now 48px; nav already has 56px min-height. Auth error "Back to sign in" link uses same height (48px) and flex centering (later decision switched all to `height` from min-height).

---

## [2025-02-06] - Dashboard design preview route (temporary)

**Context**: Need to iterate on dashboard layout and empty/full states without requiring auth or hitting real server actions.

**Decision**: Add `/dashboard-preview` as a client page that renders the same layout as `/dashboard` with hardcoded `ConfigSummary[]`. Metadata (noindex, nofollow) in a separate `layout.tsx` so the page can use `useSearchParams` (client). Query params: `?empty=true` (empty state), `?full=true` (10 configs); default 5 configs. No Supabase, no redirect. Not linked from sitemap or nav. Remove when design is locked.

**Rationale**: Designers and devs can preview all states (empty, 5, 10) without logging in. Load/Rename/Delete from cards call real actions and will fail; acceptable for visual-only iteration.

**Consequences**: One extra route; Suspense wrapper required for `useSearchParams` in Next.js static generation.

---

## [2025-02-06] - localStorage migration + currency DB sync (Phase 6e)

**Context**: Anonymous users who tap Save are sent to `/login` with `fairshare_pending_save` and form data in `fairshare_form`. After OAuth they land on `/dashboard` and need that data saved as a configuration. Separately, logged-in users should have currency preference in the DB so it follows them across devices.

**Decision**: (1) **Pending-save migration**: On mount, `DashboardClient` checks `fairshare_pending_save === 'true'`; if so, reads and validates `fairshare_form`, maps to `SaveConfigInput`, calls `saveConfiguration`; on success re-fetches configs and shows success snackbar; always removes the flag (success or failure). (2) **Currency sync**: In `CurrencyProvider`, after init from localStorage/locale, if user is logged in call `getCurrencyPreference()` and use DB value when it differs (DB is source of truth). On `setCurrency`, keep writing to localStorage and fire-and-forget `setCurrencyPreference(code)` when logged in.

**Rationale**: Migration on dashboard mount is the single place we know the user just completed OAuth and has a session; one-shot migration avoids polluting calculator or auth callback. Currency DB write is fire-and-forget so the UI never blocks on network; DB read on init ensures logged-in users see their saved preference.

**Consequences**: Dashboard mount effect is async (IIFE inside useEffect). If user hits config limit (10), migration fails and snackbar shows the limit message. Currency context uses browser client for `getUser()` and server actions for get/set preference.

---

## [2025-02-06] - Gate Save button behind auth feature flag (Phase 6d-fix)

**Context**: Auth is hidden in production via `NEXT_PUBLIC_AUTH_ENABLED` (set to `'true'` only in .env.local). The Save button on results redirects anonymous users to `/login`, which is a dead end when auth is disabled.

**Decision**: Gate Save behind the flag. In `CalculatorClient`, set `authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'`; pass `onSave` and `saveState` to `ResultsView` only when authEnabled (else `undefined` and `'idle'`). Make `onSave` and `saveState` optional on `ResultsView` and `ResultsFooter`; only pass them to the footer when both defined; only render the Save button when `onSave` is provided.

**Rationale**: When the flag is unset (production), the Save button does not render at all, so anonymous users never see it or hit the login redirect. No server or dashboard changes; single source of truth for “auth UI on/off” at the client boundary.

**Consequences**: Production builds without the env var have no Save button on results. Optional props on ResultsView/ResultsFooter keep types correct when Save is omitted.

---

## [2025-02-06] - Soft delete + config limit (Phase 6a)

**Context**: Need to support "delete" without losing referential integrity or enabling unbounded config growth per household.

**Decision**: Add `deleted_at TIMESTAMPTZ` to `configurations` and `expenses`; RLS SELECT policies exclude rows where `deleted_at IS NULL` is false. "Delete" in app = UPDATE setting `deleted_at = now()`. Enforce max 10 non-deleted configs per household via BEFORE INSERT trigger `check_config_limit()` (raises `check_violation` if count ≥ 10).

**Rationale**: Soft delete allows undo/recovery and keeps expense FKs valid. Limit of 10 keeps UI and storage predictable; hard DELETE remains for future purge jobs.

**Consequences**: Migration 002; app must use UPDATE … deleted_at for deletes. Listing queries only see non-deleted rows via RLS.

---

## [2025-02-06] - Salary/expense inputs: type="text" + inputMode="numeric"

**Context**: Salary and expense amount fields need numeric entry, optional show/hide (salary), and minimal browser autofill interference.

**Decision**: Use `type="text"` with `inputMode="numeric"` (and `autoComplete="off"`) for salary and expense amount inputs. Do not use `type="number"`.

**Rationale**: `type="number"` can trigger unwanted autofill, inconsistent styling when hidden (e.g. with WebkitTextSecurity), and spinner UI. `type="text"` + `inputMode="numeric"` gives numeric keyboard on mobile, full control over formatting and visibility styling, and no browser number quirks. Validation is done in app (parseSalary, parseExpenseAmount).

**Consequences**: All monetary inputs in the calculator follow this pattern; FormField/Input support the props. No change to validation or calculation logic.

---

## [2025-02-06] - Auth error handling (Phase 5e)

**Context**: Callback and login could throw (e.g. missing env, network, Supabase failure), leading to 500 or stuck loading with no user feedback.

**Decision**: (1) Wrap entire `GET /auth/callback` handler in try/catch; on any error redirect to `/auth/error`. (2) Wrap `handleGoogleSignIn` on login page in try/catch/finally; on catch set error state ("Sign-in failed. Please try again."), in finally call `setLoading(false)`; show error with existing `ErrorMessage` below the button; clear error when user clicks the button again.

**Rationale**: No unhandled exceptions from auth paths; users always get a redirect or inline message. Reusing ErrorMessage keeps styling consistent and avoids new tokens.

**Consequences**: Callback never returns 500 for auth failures; login always resets loading and surfaces failure so user can retry.

---

## [2025-02-06] - Foundation schema (Phase 5b)

**Context**: Need a DB model for saved configurations and future multi-user households without blocking auth-only Phase 5c.

**Decision**: Single migration `001_foundation_schema.sql`: household-centric tables (households, household_members, configurations, expenses), RLS on all, helper `user_household_ids(uuid)`, trigger on auth.users INSERT to create one household and one owner membership per user. Run manually in Supabase SQL Editor; app uses anon key only and does not yet perform CRUD on these tables.

**Rationale**: Schema is ready for Phase 6 (save/load configurations); RLS and trigger ensure every new user gets a household and correct permissions. Manual run keeps deployment simple and avoids migration runner dependency.

**Consequences**: Migrations live in repo; any schema change is a new migration file. App remains auth-only until Server Actions use these tables.

---

## [2025-02-06] - Supabase Auth integration (Phase 5c)

**Context**: Need Google OAuth and session handling without blocking the anonymous calculator or adding auth to `/`.

**Decision**: Use `@supabase/ssr` with three clients: (1) browser client for Client Components (login, NavBar); (2) server client with `cookies()` from `next/headers` (async `createClient()`, `getAll`/`setAll`, try/catch on `setAll` for read-only Server Component contexts); (3) middleware client that takes `NextRequest`, returns `{ supabase, response }`, and syncs cookies to both request and response. Root middleware calls `getUser()` to refresh session; protects `/dashboard` (redirect to `/login`); redirects authenticated users from `/login` to `/dashboard`. No middleware or auth check on `/`.

**Rationale**: Session must be refreshed on every request or tokens expire silently; middleware is the only place that can write cookies for the whole request. Calculator remains the hero; auth is optional. Anon key only; no service-role client in app code for Phase 5c.

**Consequences**: New auth routes and NavBar auth slot. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `lib/env.ts` kept for server-only vars (e.g. `SUPABASE_SERVICE_ROLE_KEY`). Card atom extended with optional `style` for auth/dashboard layout.

---

## [2025-02-06] - Currency in context, not in calculator state

**Context**: Users need to choose display currency (e.g. GBP, CAD); currency should persist and travel with share links.

**Decision**: Currency lives in React context (`CurrencyProvider` / `useCurrency`), persisted in `fairshare_currency` (and read from `fairshare_form.currency` for backward compat). Calculator reducer and form state do not hold currency. `CalculatorResult` gets `currencySymbol` from context in the client when rendering results. Share state and legacy URL params include optional `currency`; loading a share link or legacy params restores currency via `setCurrency(code)`.

**Rationale**: Currency is a global display preference, not part of the calculation input. Keeping it out of the reducer avoids syncing two persistence layers and keeps share/localStorage restore simple (one place to set currency on load). Locale-based default (`detectCurrencyFromLocale`) used when no saved preference.

**Consequences**: Any component that formats money must have access to currency (context or prop). New currencies: add to `lib/constants/currencies.ts` and optionally to locale map.

---

## [2025-02-06] - Analytics: GA4 + Hotjar + Clarity + AdSense

**Context**: Need product analytics and optional ads without blocking render or breaking on ad blockers.

**Decision**: Root layout loads GA4, Hotjar, Clarity, AdSense via Next.js `Script` with `strategy="afterInteractive"`. All event calls go through `lib/analytics/gtag.ts`; `trackEvent()` is a no-op if `window.gtag` is missing. Privacy: expense totals and split ratios sent as bucketed values (e.g. `bucketExpenseAmount`, `bucketSplitRatio`) to match V1.

**Rationale**: afterInteractive keeps LCP unaffected; central wrapper ensures tracking never throws. Bucketing avoids sending raw numbers.

**Consequences**: New events must use `trackEvent()`; bucketing logic must stay in sync with any reporting.

---

## [2025-02-06] - Input tracking and prefilled flag

**Context**: Analytics should distinguish first-time vs returning (restored) form state; avoid firing "input_started" when user didn’t type.

**Decision**: `useInputTracking` hook per field (name, salary, expense_amount, expense_label); optional `prefilled`. When `prefilled` is true, skip `input_started`. Calculator client sets `dataRestored` from `onDataRestored` (localStorage) and share-link restore, and passes prefilled* props to sections so restored data doesn’t count as "user started typing."

**Rationale**: Returning-user and funnel metrics stay accurate; one hook keeps logic in one place.

**Consequences**: Any new form section that uses input tracking must accept and forward a prefilled prop when data can be restored.

---

## [2025-02-06] - Dynamic sitemap

**Context**: SEO and crawlers expect a sitemap; static file was manual.

**Decision**: Replace `public/sitemap.xml` with `app/sitemap.ts` (Next.js dynamic sitemap). Single entry: homepage, changeFrequency monthly, priority 1.0.

**Rationale**: One source of truth; easy to add routes later; Next handles XML and route.

**Consequences**: Static sitemap removed; deploy must serve sitemap from app route.

---

## [2025-02-06] - Share via Cloudflare Worker

**Context**: Users need to share calculation links; no DB yet.

**Decision**: Cloudflare Worker for share backend: POST `/share` stores state, returns short id; GET `/share/:id` fetches. Fallback: `buildLegacyShareUrl()` query-param URL when backend fails. Client copies link to clipboard; Snackbar confirms.

**Rationale**: Worker keeps share logic off Next.js; read-only links, no auth. Legacy fallback ensures sharing works even if Worker is down.

**Consequences**: Share URLs can be long for legacy mode; backend Worker must be deployed and maintained.

---

## [2025-02-06] - Reducer + localStorage for Calculator State

**Context**: Need predictable form state and persistence without a DB for Phase 2.

**Decision**: Single `useReducer` in `useCalculator` with typed actions; localStorage under key `fairshare_form`; debounced save (100ms) on state change; restore on mount once.

**Rationale**: Keeps state transitions explicit, avoids prop drilling; localStorage gives anonymous users continuity; V1 used localStorage so we preserve that and add backward compat for legacy keys.

**Consequences**: Result is kept in reducer state (`state.result`); validation errors live in state so UI updates immediately. Re-renders when result or validation changes.

---

## [2025-02-06] - V1 Calculation Parity

**Context**: Existing users and SEO depend on identical split math.

**Decision**: `calculateShares` in `lib/calculator/compute.ts` matches V1: `share_i = (salary_i / (salary1 + salary2)) * expense`; percentage = `Math.round((totalShare / totalExpenses) * 100)`. Validation rules (at least one expense, empty amount + label = skip, etc.) match V1.

**Rationale**: No behavior change for users; share links and comparisons must stay consistent.

**Consequences**: Any change to formula or validation must be explicitly justified and documented.

---

## [2025-02-06] - Design Tokens Only in globals.css

**Context**: Consistent look and future theming.

**Decision**: All tokens (primitives, semantic, component) live in `app/globals.css`. Components use CSS variables only; no hard-coded colors, spacing, or font sizes in component files.

**Rationale**: Single source of truth; tokens can be swapped for themes or a11y without touching components.

**Consequences**: New UI values require adding or reusing tokens in globals.css first.

---

## [2025-02-06] - Pure Calculator Module (no React)

**Context**: Same logic needed for client form, future server share rendering, and tests.

**Decision**: `lib/calculator/compute.ts` and `validation.ts` are pure TypeScript: no React, no DOM, no hooks. Input/output via types in `types.ts`.

**Rationale**: Testable without React; share page and API can reuse without pulling in client bundle.

**Consequences**: Form state (strings, visibility toggles) is normalized to numbers/objects only at the boundary (validate + calculate).
