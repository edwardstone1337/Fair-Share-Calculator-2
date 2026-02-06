# Decision Log

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

**Consequences**: Result is kept in a ref (not in reducer state) to avoid re-renders when only result changes; validation errors live in state so UI updates immediately.

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
