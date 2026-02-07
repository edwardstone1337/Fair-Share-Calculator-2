# Decision Log

## [2025-02-07] - Floating back-to-top: icon-only FAB (convention over text)

**Context**: Back-to-top control was inline at bottom of FAQ with "↑ Back to Top" text. We wanted a reusable pattern that matches user expectation and doesn’t clutter content.

**Decision**: Refactor `BackToTopButton` into a standalone floating action button: fixed bottom-right (z-index below nav), circular 48px, icon-only chevron-up. Use `aria-label="Back to top"` for screen readers. Appears after 400px scroll with fade+slide animation; optional `threshold` prop for reuse. Do not use the shared `Button` component; style with same design tokens. Reusable anywhere; currently only rendered on FAQ.

**Rationale**: A floating ↑ in the bottom-right is the learned pattern (Material Design, major CMS themes, Wikipedia mobile). Text on a floating control would be unexpected; "don’t make me think" favours convention. Accessibility covered by aria-label.

**Consequences**: ARCHITECTURE, API_REFERENCE, CONVENTIONS document the component and its placement; CHANGELOG notes the refactor.

---

## [2025-02-07] - Per-FAQ CTA tracking and secondary style (Phase 2b)

**Context**: FAQ page had a single "Try the calculator" CTA pattern. We wanted conversion attribution by FAQ entry (which content drives users to the calculator) and a secondary visual style so CTAs don’t compete with primary actions.

**Decision**: Add optional `source` prop to `FaqCtaLink`; pass to `TrackedLink` as `eventParams.source`. Place CTAs after FAQs 1, 2, 3, 5, 6, 8 and in the closing section with distinct sources (`faq_how_to_use`, `faq_how_calculated`, `faq_household_bills`, `faq_rent`, `faq_mortgage`, `faq_60_40`, `faq_closing`). Restyle `FaqCtaLink` from primary to secondary button tokens (`--button-secondary-bg-default`, `--button-secondary-border`, `--button-secondary-text`). No CTAs after FAQs 4, 7, 9, 10.

**Rationale**: GA4 can segment conversions by `source`; secondary style keeps CTAs visible without dominating the page. Only key conversion-driving FAQs get a CTA.

**Consequences**: API_REFERENCE and ARCHITECTURE document `source` and secondary styling; CONVENTIONS note optional source for FAQ CTAs.

---

## [2025-02-07] - Wire GA4 tracking into NavBar, Footer, FAQ (Phase 2)

**Context**: Phase 1 added `lib/analytics/events.ts`, `TrackedLink`, and `TrackedAnchor`. We needed to wire tracking into the three surfaces without changing visuals or converting server components to client unnecessarily.

**Decision**: NavBar (already client): call `trackEvent` directly in onClick for desktop links (`nav_link_clicked`, source `desktop`), mobile menu links (source `mobile_menu`), logo/home (link `home`, source `logo`), and menu open button (`nav_menu_opened` on open only). Footer (server): replace `Link` with `TrackedLink`, `eventName` `FOOTER_LINK_CLICKED`, `eventParams` from label lowercased + spaces → `_`. FAQ page (server): replace CTA `Link` with `TrackedLink` and coffee `<a>` with `TrackedAnchor`, both using `FAQ_CTA_CLICKED` with `cta` param.

**Rationale**: Client components can use trackEvent directly; server components need a client boundary for gtag, so TrackedLink/TrackedAnchor keep the page server-rendered while adding tracking. Single source of truth for event names and param shapes in events.ts and API_REFERENCE.

**Consequences**: NavBar, Footer, FAQ all emit GA4 events for nav/footer/CTA clicks. API_REFERENCE and CONVENTIONS document the pattern for future tracked links.

---

## [2025-02-07] - Remove How It Works from calculator page; FAQ CTAs as primary buttons

**Context**: After Phase 1, the calculator page had a "How It Works" summary + link to `/faq`; FAQ page had text-styled "Try the calculator →" links. We wanted a leaner calculator page and clearer CTAs on the FAQ page.

**Decision**: Remove the entire "How It Works" section (h2 + paragraph + wrapper) from `app/(calculator)/page.tsx`. On the FAQ page, convert "Try the calculator" links to `<Link>` elements styled as primary buttons (same tokens as `Button` variant="primary"), 48px touch target, href="/", label "Try the calculator →". No changes to globals.css, footer, or NavBar.

**Rationale**: Calculator page stays focused on the tool; nav and footer already provide wayfinding to FAQ. Button-styled CTAs on FAQ improve visibility and consistency with the design system (link-as-button pattern, 48px target).

**Consequences**: Calculator page is app shell + JSON-LD only. FAQ CTAs use `FaqCtaLink` component with token-only styles. All docs updated to drop "How It Works" references and note FAQ CTA styling.

---

## [2025-02-07] - Shared link config for NavBar and Footer

**Context**: Footer redesign and nav link parity require a single source of truth for Calculator/FAQ and legal links to prevent label or URL drift between NavBar and Footer.

**Decision**: Create `lib/constants/site-links.ts` with `SiteLink` interface, `NAV_LINKS` (Calculator, FAQ), and `LEGAL_LINKS` (Privacy Policy, Terms of Service). NavBar and Footer will consume this config in Phase 2.

**Rationale**: Same pattern as `lib/constants/currencies.ts`; one place to update labels/hrefs; nav and footer stay in sync.

**Consequences**: New file; Phase 2 will wire NavBar and Footer to import from site-links.

---

## [2025-02-07] - Nav title breakpoint lowered to 420px (Phase 2e)

**Context**: Nav title "Fair Share" was visible at ≥480px (`--breakpoint-sm`). We wanted the title visible on more narrow viewports (e.g. small phones in portrait).

**Decision**: Add `--breakpoint-xs: 420px`. Change `.nav-title` media query from `min-width: 480px` to `min-width: 420px`; update comment to reference `--breakpoint-xs`. No change to nav links or menu (still 640px).

**Rationale**: Single token and one media query; 420px captures more devices without crowding the nav. CONVENTIONS already require raw px in `@media` with a comment referencing the token.

**Consequences**: New token `--breakpoint-xs`; ARCHITECTURE, CONVENTIONS, and CHANGELOG updated to describe title at ≥420px.

---

## [2025-02-07] - Nav final fixes: reorder, hide auth, accessibility (Phase 2c)

**Context**: Nav needed element reorder (Menu far-right on mobile), auth removed from UI for now, and accessibility gaps closed (ARIA, focus, keyboard).

**Decision**: Reorder right section to [CurrencySelector (when pathname === '/')] [Menu] so Menu is far-right. Comment out the entire auth conditional block and all auth-related hooks/imports in `nav-bar.tsx`, with comment "Auth UI hidden — hooks preserved for future re-enablement". Add: nav `aria-label="Main navigation"`; Menu button `aria-haspopup="menu"`, `aria-controls="nav-mobile-menu"`; dropdown `id="nav-mobile-menu"`, `role="menu"`; links `role="menuitem"`; Escape closes menu and returns focus to Menu button; focus to first link on open, back to Menu on close; Arrow Up/Down between menuitems. Do not modify `button.tsx`; use Button's existing ref forwarding for focus return.

**Rationale**: Right-section order matches design (Menu always rightmost). Hiding auth simplifies current UI while keeping re-enablement trivial. Full menu ARIA and keyboard behaviour meet accessibility expectations without changing visual design.

**Consequences**: Auth no longer visible in nav; re-enable by uncommenting block and hooks. NavBar Key Files and CONVENTIONS/ARCHITECTURE docs updated to describe current state.

---

## [2025-02-07] - Nav layout fix: centred links, 640px breakpoint, Menu Button (Phase 2b)

**Context**: After Phase 2, desktop nav links jumped horizontally when switching between `/` (CurrencySelector visible) and `/faq` (CurrencySelector hidden). Near 480px, links collided with the currency selector. Menu used a raw `<button>` instead of the design system `Button`.

**Decision**: Add `--breakpoint-md: 640px`. Show desktop Calculator/FAQ links at ≥640px only (not 480px). Absolutely centre the link container (`.nav-links-centre`: `position: absolute; left: 50%; transform: translateX(-50%)`) so link position is independent of left/right content. Replace the Menu control with `<Button variant="secondary">` for consistent styling. Keep nav title visibility at 480px (`--breakpoint-sm`).

**Rationale**: Centring prevents layout shift; 640px gives enough room so links and currency don’t collide; using `Button` keeps nav actions visually consistent with the rest of the app.

**Consequences**: New token `--breakpoint-md`; new class `.nav-links-centre`; `.nav-links-desktop` and `.nav-menu-button` media queries use 640px; inner nav wrapper has `position: relative` for the centred block.

---

## [2025-02-07] - Navigation redesign: desktop links, mobile menu, conditional currency (Phase 2)

**Context**: After adding `/faq`, the nav needed direct links to Calculator and FAQ, a mobile-friendly menu, and the currency selector only on the calculator page.

**Decision**: Desktop: show inline "Calculator" and "FAQ" text links with active state (`aria-current`, token-driven). Mobile: show a "Menu" button that toggles a dropdown with the same two links; close on link click, click outside, or route change. Render `CurrencySelector` only when `pathname === '/'`. NavBar is a client component (`usePathname`, `useState` for menu open). (Breakpoint for desktop links/menu was later set to 640px in Phase 2b.)

**Rationale**: Clear wayfinding to main routes; mobile avoids crowding; currency selector on FAQ is irrelevant so hide it there. Token-driven active state and dropdown styling keep design system consistent.

**Consequences**: New nav tokens (`--nav-link-*`, `--nav-menu-*`) and utility classes (`.nav-links-desktop`, `.nav-menu-button`, `.nav-menu-dropdown`).

---

## [2025-02-07] - FAQ moved to dedicated /faq page (Phase 1)

**Context**: FAQ lived inline on the calculator page; we wanted a dedicated route for SEO (FAQPage JSON-LD, targeted meta), clearer information architecture, and room to refocus content on couples.

**Decision**: Create `app/faq/page.tsx` with full FAQ content, FAQPage structured data, and "Try the calculator" CTAs. Remove `FaqSection` from the calculator page and replace with a short "How It Works" summary plus link to `/faq`. Delete `components/faq-section.tsx`. Add `/faq` to sitemap (priority 0.7, monthly). Update FAQ copy to couples/partner language (no roommates framing).

**Rationale**: Dedicated page improves crawlability and rich results; calculator page stays focused on the tool; single source of content avoids drift; couples focus matches product positioning.

**Consequences**: One less component; calculator page is shorter; docs and any external links that pointed at in-page FAQ need to use `/faq` if they want the full FAQ.

---

## [2025-02-07] - Nav title aria-hidden with persistent aria-label

**Context**: Nav home link shows logo + "Fair Share" title at ≥420px (Phase 2e); below that only the logo is visible. Screen readers need a clear announcement without duplication when both link text and aria-label exist.

**Decision**: Keep `aria-label="Fair Share Calculator home"` on the Link at all times. Add `aria-hidden="true"` on the visible title span so screen readers announce only the aria-label. Logo remains `aria-hidden="true"`.

**Rationale**: When title is visible, reading both "Fair Share Calculator home" and "Fair Share" is redundant. Hiding the title from assistive tech avoids that. The aria-label provides a consistent, descriptive announcement across breakpoints (logo-only on mobile, logo+title on desktop).

**Consequences**: If the title later becomes always visible and aria-label is removed, remove aria-hidden from the span so the link text is announced.

---

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
