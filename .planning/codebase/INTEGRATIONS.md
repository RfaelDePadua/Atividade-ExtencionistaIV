# External Integrations

**Analysis Date:** 2026-02-19

## Summary
- No third-party backend APIs or external SaaS integrations detected in the repository.
- Deployment target implied: GitHub Pages (see `homepage` in `package.json`).

## Hosting / CI
- Hosting: static site → GitHub Pages / any static host is appropriate.
- CI/CD: no pipeline detected (add GitHub Actions for testing/deploying if desired).

## Local Dev / Tooling
- Local dev: `python -m http.server 3000` (in `package.json` scripts) or use Live Server.
- DevDependencies include `express` and `nodemon` (for local dev server usage only).

## Auth / External APIs
- None detected (no OAuth, payment, analytics, or database integrations present).

## Webhooks / Callbacks
- None detected.

---
*If you plan to add analytics, auth, or payments, document provider and env var names here.*