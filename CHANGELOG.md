# Changelog

## Unreleased

### Added

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

- Documentation: API reference and conventions updated to match current code (env return shape, share API env override, logger).

### Fixed

- (None yet.)

### Security

- (None yet.)

### Removed

- (None yet.)
