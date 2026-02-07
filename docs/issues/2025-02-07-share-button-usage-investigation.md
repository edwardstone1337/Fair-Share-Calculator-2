# Share Button: Usage-Based Retention Decision

**Type:** Improvement (investigation)  
**Priority:** Normal  
**Effort:** Small  

---

## TL;DR

Investigate GA4 usage data for the "Share Results" button and decide whether to keep it. We already have `share_results` events tracked with `method: "copy_link"` — use that data to inform the call.

---

## Current State

- **Share button**: In `ResultsFooter`, copies share URL to clipboard (via backend Cloudflare Worker or legacy query-param fallback)
- **Tracking**: `trackEvent("share_results", { method: "copy_link" })` fires on successful copy
- **Cost**: Backend share API (Cloudflare Worker) + copy UX + fallback logic

---

## Investigation Steps

1. **GA4**: Run report on `share_results` events — count vs. total calculator completions / page views
2. **Metrics**: Conversion funnel (calculate → see results → share) to get share rate
3. **Decide**: If usage is very low, consider removing or deprioritising

---

## Expected Outcome

- Data-backed decision: keep, simplify, or remove share button
- If remove: document in DECISION_LOG, remove button + `shareViaBackend` / `buildLegacyShareUrl` usage where appropriate

---

## Relevant Files

- `components/calculator/results-footer.tsx` — Share button UI
- `components/calculator/calculator-client.tsx` — `handleShare`, `trackEvent("share_results")`
- `lib/calculator/share.ts` — Backend share + legacy URL logic

---

## Notes

- Share links (`?id=` or `?name1=...`) are used for config loading — removing the share *button* doesn't remove share *links*; users could still paste URLs manually or share via other means.
- Backend Worker: if share button goes, Worker may become dead code unless links are generated elsewhere.
