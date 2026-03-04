# External Integrations

**Analysis Date:** 2026-03-04

## APIs & External Services

**None** — this is a fully client-side static site with no backend API calls at runtime.

## Data Storage

**None** — no databases, no localStorage persistence, no session storage.
- Game state (score, lives, wave) is held in memory during a session only; resets on page reload.

## Authentication & Identity

**None** — no login, no user accounts, no auth provider.

## CDN Assets (browser-loaded)

**Google Fonts:**
- Loaded from: `https://fonts.googleapis.com`
- Fonts: `Bricolage Grotesque`, `Lexend`, `Patrick Hand`, `Fredoka`
- Required for design system to render correctly; fallback system fonts defined in CSS

**Bootstrap Icons:**
- Loaded from: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`
- Used for search icon (`bi-search`) and logo planet icon (`bi-planet`) in nav header

## Deployment

**GitHub Pages:**
- Static hosting via GitHub Pages
- No server-side processing; all files served as-is
- Deployment: push to configured branch (implied `main` or `gh-pages`)
- Homepage configured in `package.json`: `https://USERNAME.github.io/Atividade-ExtencionistaIV/`

## Monitoring & Observability

**None** — no error tracking (Sentry, etc.), no analytics, no logging infrastructure.

---

*Integrations analysis: 2026-03-04*
*No runtime external dependencies beyond CDN font/icon loading*
