# System Architecture

## Overview

Fair Share Calculator is an income-based bill split calculator for couples and roommates. This codebase is the V2 rebuild: Next.js (App Router) + TypeScript + Tailwind, with the calculator ported, localStorage for anonymous users, and Supabase Auth (Google OAuth) wired. Saved configurations and dashboard features are planned (see `SYSTEM-ARCHITECTURE.md`).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15.5.x (App Router); keep on patched line for security |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + CSS variables in `app/globals.css` |
| **State** | React (useReducer in `useCalculator`) — no external state library |
| **Persistence** | localStorage (anonymous); Supabase Auth + DB for logged-in users |

## Data Model

### Anonymous (in-memory + localStorage)

- **Calculator form state** — `CalculatorFormState` in `lib/calculator/types.ts`: person names, salaries (strings), expenses array, step (`input` | `results`), validation errors, result (last calculation or null).
- **Saved form data** — `SavedFormData`: names, salary strings, expenses (amount + label), optional `currency` (ISO code). Stored under key `fairshare_form`. V1 backward compat: also reads legacy keys `name1`, `name2`, `salary1`, `salary2`, `expenses`.
- **Currency** — Not in form state. Held in React context (`CurrencyProvider`); persisted in `fairshare_currency` and optionally in `fairshare_form.currency`. Share state and URL params include `currency` for restore.

### Authenticated (Supabase)

Schema in `supabase/migrations/001_foundation_schema.sql` (run manually in Supabase SQL Editor). App uses anon key only; no CRUD on these tables yet (Phase 5c is auth-only).

- **households** — id, name, currency, created_at, updated_at. One created per user on signup via trigger.
- **household_members** — household_id, user_id (auth.users), role (`owner` | `partner`). RLS: members can read; owners can insert/update/delete members.
- **configurations** — household_id, name, person_1_name, person_2_name, person_1_salary, person_2_salary, currency, timestamps. Full CRUD for household members.
- **expenses** — configuration_id, label, amount, sort_order, timestamps. Full CRUD via configuration’s household membership.

**Entity relationships**: `auth.users` → (trigger) → new household + household_members row (owner). households → household_members (many); households → configurations (many); configurations → expenses (many). Helper `user_household_ids(uuid)` used by RLS.

## Request Flow

- **`/`** — Root layout wraps with `CurrencyProvider` and renders sticky `NavBar` (logo, currency selector, auth slot). Server-rendered calculator page (H1, `CalculatorClient`, FAQ, JSON-LD). Client: `CalculatorClient` uses `useCalculator()` and `useCurrency()`; reducer + localStorage restore on mount; currency from context, persisted in `fairshare_currency`. URL hash (`#results`, `#input`) syncs step; URL params (`?id=`, `name1`, `salary1`, `currency`, etc.) restore share links. **No auth gate** — calculator works for everyone.
- **Middleware** — `middleware.ts` calls `lib/supabase/middleware.ts` `createClient(request)`; `supabase.auth.getUser()` refreshes session. Protects `/dashboard` (redirect to `/login` if unauthenticated); redirects authenticated users from `/login` to `/dashboard`. Matcher excludes static assets, images, robots, sitemap, ads.txt, verification file.
- **Auth flow** — `/login`: client uses `lib/supabase/client.ts`, `signInWithOAuth({ provider: 'google', options: { redirectTo: origin/auth/callback } })`; wrapped in try/catch/finally — on throw shows inline error via `ErrorMessage`, resets loading in finally; error cleared on retry. `GET /auth/callback`: server client `exchangeCodeForSession(code)`; redirect to `/dashboard` or `/auth/error`; entire handler in try/catch so any unhandled exception also redirects to `/auth/error`. `/dashboard`: server client `getUser()`; redirect to `/login` if no user.
- **Calculation** — Pure sync flow: `validateForm(state)` → `calculateShares(...)` in `lib/calculator/compute.ts`. No server round-trip.
- **Share** — `shareViaBackend(state)` POSTs to Cloudflare Worker; returns short URL `?id=...`. Fallback: `buildLegacyShareUrl()` query-param URL. Load: `loadFromShareId(id)` GET fetches share by ID.

## Design System

- **Tokens** — Three layers in `app/globals.css`: Layer 1 `@theme` (primitives), Layer 2 `:root` (semantic), Layer 3 component tokens (including `--nav-*`, `--currency-selector-*`). 8px spacing grid.
- **Components** — Layout: `NavBar` in `components/nav/` (sticky, full-width nav; logo, `CurrencySelector`). Atoms in `components/ui/` (Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar, CurrencySelector, Icon, IconButton). Molecules: `FormField` (label + Input + ErrorMessage; optional prefix, labelSuffix). Calculator organisms in `components/calculator/` (IncomeSection, ExpensesSection, NamesSection, CalculatorClient, ResultsView, SummaryCard, BreakdownCard, ExplanationCard, ResultsFooter). FAQ: `FaqSection`. Input supports `prefix` (e.g. currency symbol) with token-driven focus ring.
- **Rule** — No magic numbers in components; use CSS variables. Tailwind for layout (flex, grid); tokens for color, typography, spacing, radius.

## Key Files

| Path | Purpose |
|------|---------|
| `app/(calculator)/page.tsx` | Calculator page: header, H1, `CalculatorClient`, `FaqSection`, JSON-LD |
| `app/components-inventory/page.tsx` | Dev/QA: showcases all atoms, molecules, organisms and calculator components |
| `app/layout.tsx` | Root layout: CurrencyProvider, NavBar, fonts, metadata, canonical, OG, GA4/Hotjar/Clarity/AdSense scripts |
| `app/sitemap.ts` | Dynamic sitemap (single URL, monthly, priority 1.0) |
| `app/globals.css` | Design tokens (all 3 layers) |
| `lib/calculator/compute.ts` | Pure calculation + parse + formatCurrency(num, symbol) |
| `lib/calculator/validation.ts` | validateForm (salaries, expenses, names) |
| `lib/calculator/types.ts` | Form state, result, validation types |
| `lib/hooks/use-calculator.ts` | Reducer, localStorage, calculate(), getError/hasError, onDataRestored option |
| `lib/hooks/use-input-tracking.ts` | Per-field analytics: input_started, input_completed, validation_error; prefilled opt-out |
| `lib/analytics/gtag.ts` | trackEvent, bucketExpenseAmount, bucketSplitRatio; GA4 wrapper |
| `components/calculator/calculator-client.tsx` | Orchestrates sections, step (input vs results), URL hash/params, share, snackbar, analytics events |
| `lib/calculator/share.ts` | shareViaBackend, buildLegacyShareUrl, loadFromShareId (Cloudflare Worker); ShareState includes optional currency |
| `lib/contexts/currency-context.tsx` | CurrencyProvider, useCurrency(); persist fairshare_currency; locale detection fallback |
| `lib/constants/currencies.ts` | CURRENCIES list, DEFAULT_CURRENCY, detectCurrencyFromLocale, getCurrencyByCode |
| `components/nav/nav-bar.tsx` | Sticky nav: logo, CurrencySelector, auth (Sign in / avatar + sign out) |
| `lib/supabase/client.ts` | Browser Supabase client (`createBrowserClient`) |
| `lib/supabase/server.ts` | Server Supabase client (`createServerClient`, cookies getAll/setAll) |
| `lib/supabase/middleware.ts` | Middleware client (returns `{ supabase, response }`, cookies on request + response) |
| `middleware.ts` | Session refresh, `/dashboard` protection, `/login` redirect |
| `app/auth/callback/route.ts` | GET; code exchange → `/dashboard` or `/auth/error` |
| `app/auth/error/page.tsx` | Auth error message + link to sign in |
| `app/login/page.tsx` | Continue with Google, link to calculator |
| `app/dashboard/page.tsx` | Protected; welcome + “Back to calculator” (placeholder) |

## Authentication & Backend

- **Supabase Auth**: Google OAuth. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client/server/middleware); `SUPABASE_SERVICE_ROLE_KEY` (server-only, not used in Phase 5c). `lib/env.ts` remains for server-only env (e.g. service role).
- **Clients**: Browser (`lib/supabase/client.ts`) for Client Components; server (`lib/supabase/server.ts`, async `createClient()`, `await cookies()`) for Server Components, Server Actions, Route Handlers; middleware (`lib/supabase/middleware.ts`) for session refresh with cookies on request and response.
- **Session**: Middleware calls `getUser()` every request to refresh tokens; cookies updated via `setAll`. No auth gate on `/`.
- **Routes**: `/login` (public), `/auth/callback` (code exchange), `/auth/error` (public), `/dashboard` (protected). See `SYSTEM-ARCHITECTURE.md` for full schema, RLS, and triggers.

## Dependencies & External Services

- **Cloudflare Worker** — Share backend: `POST /share` (store state, return id), `GET /share/:id` (fetch state). Read-only share links; no auth.
- **Vercel** — Hosting (live; auto-deploy from `main`).
- **Supabase** — Live. PostgreSQL + Auth (Google OAuth). Schema deployed (households, household_members, configurations, expenses, RLS, `on_auth_user_created` trigger). App uses anon key only; service role not used in Phase 5c.
- **Analytics / Ads** — GA4 (G-TQZ0HGB3MT), Hotjar (hjid 4934822), Microsoft Clarity (kyx62gpbw4), Google AdSense (ca-pub-4075743460011014). Scripts in root layout via Next.js `Script` (strategy `afterInteractive`). Events via `lib/analytics/gtag.ts`; silent no-op if gtag unavailable.

## Deployment

Current: local dev (`next dev`). Production deployment and DNS strategy described in `SYSTEM-ARCHITECTURE.md`.
