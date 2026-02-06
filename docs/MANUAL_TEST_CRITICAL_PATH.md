# Manual Test: Critical Path (Auth + Calculator)

Run with dev server: `npm run dev` (e.g. http://localhost:3000 or 3002).

---

## 1. Home: Calculator works, no regressions

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Visit **/** | Home loads; NavBar shows logo, currency selector, **Sign in** button. |
| 1.2 | Check calculator | H1 "Income-Based Bill Split Calculator"; two income fields; expenses table; names; Calculate button. |
| 1.3 | Quick calc | Enter two incomes (e.g. 60000, 40000), one expense (e.g. 1000 Rent), two names → **Calculate** → Results show fair-share amounts. |
| 1.4 | Currency | Change currency in nav → values/formats update. |

**Pass:** Calculator behaves as before; no console errors.

---

## 2. Sign in → Google OAuth → Dashboard

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Click **Sign in** in NavBar | Navigate to **/login**. |
| 2.2 | Login page | Title "Sign in to Fair Share Calculator"; **Continue with Google** button; link "calculator" back to /. |
| 2.3 | Click **Continue with Google** | Redirect to Google OAuth (accounts.google.com). |
| 2.4 | Complete Google sign-in | After auth, redirect to **/auth/callback** then to **/dashboard**. |
| 2.5 | Dashboard | Page shows "Your dashboard is coming soon" (or equivalent); URL is **/dashboard**. |

**Pass:** Full OAuth flow completes and user lands on /dashboard.

---

## 3. NavBar when logged in

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | On **/dashboard** (or **/** while logged in) | NavBar shows: logo, currency selector, **user initial** (circle with first letter of email), **sign-out** (logout) icon. |
| 3.2 | No "Sign in" button | Only initial + sign-out are shown in the auth area. |

**Pass:** NavBar shows initial + sign-out; no "Sign in" when session exists.

---

## 4. Sign out → back to "Sign in" state

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | Click **sign-out** (logout) in NavBar | Session ends; page refreshes/updates. |
| 4.2 | NavBar | Shows **Sign in** again (no initial, no sign-out). |
| 4.3 | Visit **/** | Still shows Sign in; calculator works. |

**Pass:** After sign-out, NavBar shows "Sign in" and app is in logged-out state.

---

## 5. Dashboard while logged out → redirect to /login

| Step | Action | Expected |
|------|--------|----------|
| 5.1 | Ensure you are **signed out** (or use incognito / different browser). | — |
| 5.2 | Visit **/dashboard** directly (type URL or link). | Immediate redirect to **/login** (no flash of dashboard content). |
| 5.3 | URL | Browser shows **/login**, not /dashboard. |

**Pass:** Unauthenticated /dashboard access redirects to /login.

---

## Quick checklist

- [ ] **1** — Visit / ; calculator works; no regressions
- [ ] **2** — Sign in → Google OAuth → lands on /dashboard
- [ ] **3** — NavBar shows initial + sign-out when logged in
- [ ] **4** — Sign out → NavBar shows "Sign in"
- [ ] **5** — Visit /dashboard logged out → redirects to /login

---

**Note:** The in-IDE browser (MCP) cannot reach localhost. Run these steps in your own browser against `http://localhost:3000` (or the port your dev server uses).
