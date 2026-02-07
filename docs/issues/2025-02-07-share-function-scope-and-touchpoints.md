# Share Function: Scope and Touchpoints Investigation

**Type:** Investigation  
**Priority:** Normal  
**Effort:** Medium  

---

## TL;DR

Document how the share feature works end-to-end and every place it touches (UI, API, URL loading, analytics, env, external service). We have very low interaction with share and may stop supporting it; before deciding, we need a clear map of what would be affected.

---

## Current State vs Expected Outcome

| Current | Expected |
|--------|----------|
| Share flow is spread across client, lib, Worker, URL handling, and analytics with no single “map” | One place that lists: flow, files, APIs, URL params, env, and removal impact |

---

## How Share Works (Flow)

1. **User in results view** → Clicks “Share Results” in `ResultsFooter`.
2. **`handleShare`** (calculator-client) builds `ShareState` (name1, name2, salary1, salary2, expenses, currency), then:
   - **Primary:** `shareViaBackend(shareState)` → `POST` to Cloudflare Worker `/share` → Worker returns `{ id }` → client builds `{origin}{path}?id={id}`.
   - **Fallback:** If that fails, `buildLegacyShareUrl(shareState)` builds a long query-param URL (`?name1=...&salary1=...&expenses=[...]&currency=...`).
3. **Copy:** `navigator.clipboard.writeText(shareUrl)` (backend or legacy URL).
4. **Feedback:** On success → `trackEvent("share_results", { method: "copy_link" })` and Snackbar “Calculation link copied to clipboard!”. On total failure → `setErrorMessage("Could not copy link. Please try again.")`.
5. **Recipient:** Opens URL. Calculator page loads; `CalculatorClient` in a `useEffect` reads URL params:
   - **`?config={id}`** (takes precedence): loads saved config from Supabase (dashboard “Load”) — not share.
   - **`?id={id}`**: `loadFromShareId(id)` → `GET` Worker `/share/:id` → validates response → restores form state + currency and fires `data_restored`.
   - **Legacy params** (`name1`, `salary1`, etc.): parsed from query string → state restored, no Worker call.

So share **creation** uses Worker POST + clipboard; share **consumption** uses Worker GET for `?id=` or direct query params for legacy links.

---

## What It Touches (Files & Surfaces)

### Core logic

| File | Role |
|------|------|
| `lib/calculator/share.ts` | `ShareState` type; `shareViaBackend()` (POST /share); `buildLegacyShareUrl()`; `loadFromShareId()` (GET /share/:id); `validateShareResponse()` |

### UI & client flow

| File | Role |
|------|------|
| `components/calculator/results-footer.tsx` | “Share Results” button; `onShare` prop |
| `components/calculator/results-view.tsx` | Passes `onShare` to `ResultsFooter` |
| `components/calculator/calculator-client.tsx` | `handleShare`; URL param handling for `?id=`, `?config=`, legacy params; snackbar message; error message on share/load failure; imports from `@/lib/calculator/share` |

### Loading share links (inbound)

- **`?id=`** → `loadFromShareId(id)` in same `useEffect` in calculator-client (after `?config=` branch). On success: restore state, optional `setCurrency`, `fireDataRestored` (GA `data_restored`). On failure: `setErrorMessage("Could not load shared link. Please check the URL and try again.")`.
- **Legacy query params** → same file, parsed after `?id=` branch; no Worker; state + currency restored, `fireDataRestored`.

### Analytics

- **Share:** `trackEvent("share_results", { method: "copy_link" })` in calculator-client (not in `lib/analytics/events.ts` — raw string).
- **Load:** `data_restored` fired when state is restored from share link (or config/localStorage) with payload `has_names`, `has_salaries`, `has_expenses`, `expense_count`.

### Config & env

| Item | Role |
|------|------|
| `NEXT_PUBLIC_SHARE_API_URL` | Optional override for Worker base URL (default: `https://tight-firefly-c0dd.edwardstone1337.workers.dev`) |
| `lib/env.ts` | Exposes `NEXT_PUBLIC_SHARE_API_URL` in `getServerEnv()` (used for docs/env checks; client reads `process.env.NEXT_PUBLIC_SHARE_API_URL` in share.ts) |
| `.env.example` | Documents `NEXT_PUBLIC_SHARE_API_URL` |

### External dependency

- **Cloudflare Worker** at `tight-firefly-c0dd.edwardstone1337.workers.dev`: `POST /share` (store state, return id), `GET /share/:id` (return state). Not in this repo; kept alive for read-only share links.

### Other references

| File | Role |
|------|------|
| `app/components-inventory/page.tsx` | `ResultsFooter` with `onShare={noop}` for showcase |
| `components/dashboard/config-card.tsx` | Uses `/?config={id}` (saved config), not share `?id=` |
| Docs (ARCHITECTURE, API_REFERENCE, CONVENTIONS, DECISION_LOG, SYSTEM-ARCHITECTURE, CHANGELOG) | Describe share flow, Worker, legacy URLs, URL param loading, events |

---

## Risks / Notes

- **Removing only the button:** Share *links* would still work if users get a URL (e.g. legacy URL from somewhere). So “remove share” can mean (a) remove button only, (b) remove button + Worker + `?id=` loading, or (c) remove button + Worker but keep legacy param loading.
- **Worker:** If we drop share, the Worker has no other use unless we add one; consider deprecation/deletion and impact on existing `?id=` links in the wild.
- **`share_results`** is not in `lib/analytics/events.ts`; if we keep share, consider adding it for consistency.
- **QA:** Share failure path (Worker down → fallback → copy) was not fully tested per historical QA report; error snackbar exists in code.

---

## Suggested Follow-up

1. Use GA4 `share_results` (and optionally `data_restored` for share-origin) to get usage (see `2025-02-07-share-button-usage-investigation.md`).
2. Decide: keep as-is, simplify (e.g. legacy-only, no Worker), or remove (button and optionally Worker + `?id=` loading).
3. If removing: remove or stub `handleShare` / Share button, optionally remove or redirect `shareViaBackend` / `loadFromShareId` and Worker, update docs and env example.

---

## Relevant Files (max 3 for quick context)

- `lib/calculator/share.ts` — share API and legacy URL
- `components/calculator/calculator-client.tsx` — handleShare, URL loading, snackbar/errors
- `components/calculator/results-footer.tsx` — Share button UI
