# Code Conventions

## File Structure

```
app/
  (calculator)/page.tsx     # Calculator page (SSR shell + client calculator + JSON-LD)
  faq/page.tsx              # FAQ page (server-rendered; content + FAQPage JSON-LD; token-driven)
  auth/callback/route.ts    # GET; OAuth code exchange
  auth/error/page.tsx      # Auth error message + link to sign in
  login/page.tsx            # Continue with Google, link to calculator
  dashboard/page.tsx       # Protected; listConfigurations, config cards or empty state (DashboardClient, ConfigCard)
  dashboard-preview/       # Temporary: layout.tsx (metadata), page.tsx (client, dummy data, ?empty/?full); not in sitemap/nav
  privacy/page.tsx          # Privacy Policy (server-rendered, token-driven)
  terms/page.tsx            # Terms of Service (server-rendered, token-driven)
  layout.tsx                # Root layout, metadata, fonts, analytics scripts, NavBar, Footer
  sitemap.ts                # Dynamic sitemap (MetadataRoute.Sitemap)
  globals.css               # All design tokens (Layer 1–3)

components/
  back-to-top-button.tsx   # Reusable floating back-to-top FAB (fixed bottom-right, icon-only, optional threshold); used on FAQ
  nav/                      # NavBar (logo + title ≥420px; Calculator/FAQ centred at ≥640px; right section [CurrencySelector on /] [Menu]; auth UI hidden, preserved), Footer (Privacy, Terms, copyright)
  ui/                       # Atoms: Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar, CurrencySelector, Icon, IconButton. Molecules: FormField. Analytics: TrackedLink, TrackedAnchor
  calculator/               # Calculator organisms (IncomeSection, ExpensesSection, …)
  dashboard/                # DashboardClient, ConfigCard (saved config list, rename, delete, load)

lib/
  calculator/               # compute.ts, types.ts, validation.ts, scroll-to-error.ts (pure, no React)
  constants/                # currencies.ts, site-links.ts (NAV_LINKS, LEGAL_LINKS)
  contexts/                 # currency-context.tsx (CurrencyProvider, useCurrency)
  hooks/                    # use-calculator.ts, use-input-tracking.ts
  utils/                    # cn.ts, format.ts, logger.ts
  env.ts                    # getServerEnv (server-only env; Supabase URL/anon key optional for client)
  actions/                  # Server Actions: configurations.ts, user-preferences.ts
  analytics/                # gtag.ts, events.ts (GA4 event name constants)
  supabase/                 # client.ts (browser), server.ts (Server/Route Handler), middleware.ts (session refresh)

middleware.ts               # Root: session refresh, /dashboard protect, /login redirect

supabase/
  migrations/               # SQL migrations (e.g. 001_foundation_schema.sql); run manually in Supabase

docs/
  historical/               # Archived reports (e.g. QA_REPORT_V2.md); audit trail, not actively referenced
  issues/                   # Issue investigations and ad-hoc notes
```

## Naming

- **Components**: PascalCase (`CalculatorClient`, `IncomeSection`).
- **Hooks**: `use` prefix, camelCase (`useCalculator`).
- **Utilities**: camelCase (`formatWithCommas`, `sanitizeInput`).
- **Reducer actions**: UPPER_SNAKE (`SET_PERSON1_SALARY`, `ADD_EXPENSE`).
- **CSS variables**: kebab-case in `globals.css` (`--text-primary`, `--card-gap`).
- **Files**: kebab-case for multi-word components (`calculator-client.tsx`, `section-header.tsx`).

## TypeScript

- Strict mode. No `any`; use `unknown` if needed.
- Prefer interfaces for object shapes. Export types from `lib/calculator/types.ts` for shared use.
- Server-only code (e.g. env) can use `getServerEnv()`; do not expose secrets to client.

## Styling

- **Tokens only**: Use CSS variables for color, spacing, typography, radius, shadow. No magic numbers in components.
- **Media queries**: CSS custom properties do not work in `@media`; use raw px values and add a comment referencing the token (e.g. `420px` for `--breakpoint-xs`, `480px` for `--breakpoint-sm`, `640px` for `--breakpoint-md`).
- **Touch target**: All interactive elements (buttons, inputs, selects, icon buttons, link-as-button) must render at exactly 48px via `height: var(--touch-target-min-height)` (with `box-sizing: border-box` so padding/border are included). IconButton uses explicit size (48px via `--icon-button-size`). Ensures consistent tap targets for accessibility and mobile usability.
- **Tailwind**: Use for layout (flex, grid, gap, display). Do not use Tailwind for colors/fonts that have tokens.
- **Inline styles**: Acceptable for one-off token references (e.g. `style={{ gap: "var(--space-4)" }}`) when Tailwind doesn’t map to a token.

## Components

- **Default**: Server Components. Use `"use client"` only when needed (state, hooks, event handlers).
- **Calculator**: Client boundary at `CalculatorClient`; sections are client components that receive props and callbacks.
- **Props**: Explicit interfaces (e.g. `IncomeSectionProps`); no inline only types for public components.
- **Form fields**: Use `FormField` for label + input + error when layout is standard; use `Input` with `prefix` for currency-prefixed fields. Icon-only actions: use `IconButton` with required `aria-label`. Calculator salary and expense amount inputs: use `type="text"` with `inputMode="numeric"` (not `type="number"`) for security and visibility when toggling; use `autoComplete="off"` to reduce browser autofill suggestions.

## Analytics (GA4 click tracking)

- **Event names**: `lib/analytics/events.ts` (e.g. `NAV_LINK_CLICKED`, `FOOTER_LINK_CLICKED`, `FAQ_CTA_CLICKED`). Use constants; do not hardcode event strings.
- **Server components**: For internal links that need click tracking use `TrackedLink` from `@/components/ui/tracked-link` (props: `eventName`, `eventParams`). For external links use `TrackedAnchor` from `@/components/ui/tracked-anchor`.
- **Client components**: Use `trackEvent(eventName, params)` from `@/lib/analytics/gtag` in `onClick` handlers (e.g. NavBar). No need to wrap in TrackedLink when the component already has access to hooks.
- **Params**: Match API_REFERENCE.md Navigation Events table (e.g. footer `link` is label lowercased with spaces → `_`). FAQ "Try the calculator" CTAs: pass optional `source` (e.g. `faq_rent`, `faq_closing`) via `eventParams` for per-CTA attribution.

## State & Data Flow

- Calculator: single source of truth in `useCalculator` (reducer state). Dispatch actions; no direct localStorage in UI.
- Currency: global UI preference in React context (`useCurrency`), not in calculator reducer. Persisted in `fairshare_currency` (and optionally in `fairshare_form.currency`). Logged-in users: DB (`households.currency`) is source of truth on load; `setCurrency` also persists to DB (fire-and-forget). Share links and URL params carry currency; restore via `setCurrency(code)` when loading share.
- Validation: run at Calculate time; errors stored in state and read via `getError(field)` / `hasError(field)`.
- Prefilled: when state is restored (localStorage or share link), parent sets `dataRestored` and passes `prefilledSalaries` / `prefilledNames` / `prefilledExpenses` to sections so `useInputTracking` does not fire `input_started` for pre-filled fields.

## Error Handling

- **Deferred operations (setTimeout/setInterval)**: Functions that schedule timeouts should return the ID so callers can clear on unmount. Callers store the ID in a ref and clear it in `useEffect` cleanup. Example: `scrollToFirstError` returns `ReturnType<typeof setTimeout> | null`; `CalculatorClient` uses `scrollToErrorTimeoutRef` and clears in effect cleanup.
- Validation: return `ValidationResult` with `errors` array; UI shows per-field messages.
- localStorage: save/load in hook; failures are silent (no user-facing error for full/disabled storage).
- **Auth**: OAuth callback route handler wrapped in try/catch; on any error redirect to `/auth/error`. Login page: `signInWithOAuth` in try/catch/finally; set error state on catch, `setLoading(false)` in finally; display error with `ErrorMessage` below button; clear error when user clicks sign-in again.

## Analytics

- All GA4 events via `trackEvent(eventName, params)` from `lib/analytics/gtag.ts`. Never throw; no-op if gtag missing.
- **validation_error**: Fires only on Calculate attempt (in calculator-client when validateForm returns errors), with field-level params (error_count, error_fields, error_types). Not fired on blur; use-input-tracking no longer emits it.
- New form sections with inputs: use `useInputTracking` and accept a `prefilled*` prop when data can be restored; pass to hook so restored data doesn’t fire `input_started`.

## Database

- **Migrations**: `supabase/migrations/` (e.g. `001_foundation_schema.sql`). Run manually in Supabase SQL Editor; no automated runner in app.
- **RLS**: All public tables have RLS enabled. Policies use `auth.uid()` and `public.user_household_ids()`; never bypass with service role in app code.
- **CRUD**: Server Actions in `lib/actions/` (configurations, user-preferences) perform CRUD via anon key + RLS; no service role in app code.

## Auth (Supabase)

- **Client choice**: Use `lib/supabase/client.ts` in Client Components; `lib/supabase/server.ts` (async `createClient()`) in Server Components, Server Actions, Route Handlers; `lib/supabase/middleware.ts` only inside root `middleware.ts`. Never use service role key in app code.
- **Session**: Middleware refreshes session via `getUser()`; do not skip or cookies go stale. Protected routes: enforce in middleware (redirect); optional page-level `getUser()` + redirect for safety.
- **No auth on `/`**: Calculator page has no auth check; anonymous and logged-in users both get full calculator.
- **Auth feature flag**: `NEXT_PUBLIC_AUTH_ENABLED === 'true'` enables auth-dependent UI (e.g. Save Configuration on results). Set only in .env.local for dev; when unset (production), do not pass `onSave` (or pass `undefined`) so components like `ResultsFooter` do not render the Save button—avoids redirecting anonymous users to `/login` when auth is disabled.

## Development workflow

- Use `npm run dev:clean` after any session that modifies `globals.css`, deletes files, or renames exports. This clears the `.next` cache and prevents stale module errors. Do not run `npm run build` while the dev server is running.

## New Features

- New UI token → add to Layer 3 (or Layer 2) in `globals.css`, then use in component.
- New calculator rule → update `validation.ts` and document in API_REFERENCE.md.
- New route → add under `app/` and document in ARCHITECTURE.md (and SYSTEM-ARCHITECTURE.md if part of V2 plan).
- New analytics event → use `trackEvent()`; document event name and params in API_REFERENCE or ARCHITECTURE if significant.
