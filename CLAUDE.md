# Flux-A-Flow — Design & Code Context

Direct farm-to-market platform. Vite + React 19 frontend, Express + MongoDB backend.

## Folder map

```
frontend/
  src/
    pages/
      auth/      Auth, AuthForm, Login, SignUp        (logged-out)
      app/       Home, Profile, Marketplace, Reviews  (logged-in, all use <Aside />)
    components/  Aside (sidebar), Header, Success
    styles/
      tokens.css   ← single source of truth, imported once in main.jsx
      index.css    sidebar + page-layout structural rules
      auth.css     auth-only
      home.css     home-only
      reviews.css  reviews-only (editorial / serif)
      profile.css, market.css
backend/
  app.js                Express bootstrap, CORS for :5173
  routes/auth.js        all /auth/* endpoints
  controller/           sign_in, sign_up, profile
  middleware/           authMiddleware (JWT), multer (uploads)
  model/db.js           Farmers, Profile, Marketplace schemas
  utils/                cloudinary, sendEmail
```

## Routes

| Frontend route | Component   | Auth required | Backend it calls               |
| -------------- | ----------- | ------------- | ------------------------------ |
| `/`, `/login`  | Auth        | no            | POST /auth/signin, /auth/signup |
| `/home`        | Home        | yes           | GET /auth/home → fallback /auth/profile |
| `/profile`     | Profile     | yes           | GET /auth/profile, /auth/social-profile; POST /auth/upload-profile |
| `/marketplace` | MarketPlace | yes           | POST /auth/marketplace (create)  |
| `/reviews`     | Reviews     | yes           | none — dummy data              |

**After login → redirect to `/home`** (not `/profile`).

## Design system

All visual decisions live as CSS custom properties in `frontend/src/styles/tokens.css`.
**Never hardcode hex/px in component CSS — pull from tokens.**

### Color (warm, earthy, low-vibrance)
- `--bg` cream, `--bg-soft` card surface, `--surface` white
- `--ink` near-black, `--ink-2` body, `--mute` captions
- Brand: `--green` `#2f5d3b` (deep forest), `--green-deep` for hover, `--green-soft` tinted bg, `--green-glow` shadow
- Functional: `--warm` ochre (stars), `--danger` muted terracotta
- Dark mode override via `body.dark`

### Type
- `--font-bubble` Fredoka — primary, friendly rounded, used on Home + Auth
- `--font-serif` Fraunces — editorial, used on Reviews
- `--font-mono` JetBrains Mono — labels, dates, kickers
- `--font-sans` DM Sans — neutral body where needed

Scale ranges `--fs-xs` (13) → `--fs-display` (clamp 56–96). Default body is `--fs-base` (17) — intentionally larger than typical 14–15.

### Motion tokens (Emil rules)
- `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` — UI default (NOT built-in `ease-out`)
- `--ease-spring` `cubic-bezier(0.34, 1.56, 0.64, 1)` — gentle overshoot
- `--t-fast` 140ms, `--t-base` 220ms, `--t-slow` 360ms — all under 400ms

### Rules
- Buttons get `transform: scale(0.97)` on `:active`
- Never enter from `scale(0)`; start from `scale(0.95)` + opacity
- All hover/transform behavior gated behind `@media (hover: hover)`
- `@media (prefers-reduced-motion: reduce)` disables animation on every page
- Touch targets ≥ 44 × 44px
- Live status dots use a pulsing box-shadow (`hm-pulse`), not size animation

## Per-page aesthetic

- **Auth**: bubbly (Fredoka), single-column card, large logo with `logo-in` + `bob`, animated backdrop blobs, deep-forest primary button with shimmer sweep. No showcase panel.
- **Home**: bubbly dashboard. Hero with waving emoji, stagger-in stat cards (80ms apart), live "Today's harvest" feed, quick-action buttons. Pulsing green dot on the `Live` pill.
- **Reviews**: editorial minimalism. Fraunces display number, hairline dividers between reviews (no cards), olive uppercase mono product tags. Separate aesthetic from Home/Auth by design.

## Backend notes

- `Founder` is imported in `routes/auth.js` but **does not exist** in `model/db.js`. The `Farmers` model is what the app actually uses. The `/auth/home` endpoint uses `Farmers`.
- `sign_in.js` issues a JWT but **never checks the password** — known security bug.
- Passwords are stored in plain text — needs bcrypt before any production use.
- JWT secret is hardcoded as `"my_secret"` in `sign_in.js` and `middleware/authMiddleware.js`. Move to `process.env.JWT_SECRET` next.
- Gmail credentials now read from `process.env.SMTP_USER` / `SMTP_PASS` (see `backend/.env.example`). **Rotate the previously-committed app password.**

## Running locally

```
# backend
cd backend && npm install && npm run dev   # :5000, nodemon

# frontend
cd frontend && npm install && npm run dev  # :5173 (or :5174 via preview launch config)
```

For preview without backend running, the Home page falls back gracefully to dummy stats and routes still work — you just need a `token` in `localStorage`.
