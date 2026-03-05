---
phase: 7
plan: 2
status: complete
commit: 14ee710
---

# Summary: 07-02 — Scaffold explorar.html from _template.html

## What Was Done

Completely rewrote `explorar/explorar.html` from the old legacy markup to the canonical `_template.html` pattern.

### Changes to `explorar/explorar.html`

Full file replacement (298 deletions → 86 insertions). Old file had legacy nav with hardcoded HTML, alphabet filter UI (A–Z), and placeholder game cards. New file follows Phase 2–4 patterns exactly.

**Key structural elements:**
- `lang="pt-BR"`, charset, viewport, description meta
- Google Fonts preconnect + Bootstrap Icons CDN
- CSS load order: reset → base → layout → page-shell → componentes → components → cards → explore
- Skip-link `<a class="skip-link" href="#main-content">`
- `<div data-component="nav">` with noscript fallback
- `<main id="main-content" class="page-wrapper">`
- `.explore-hero` section with `#explore-title` h1 and subtitle
- `.explore-filter-bar` section with `#explore-filters` (desktop pills) and `#explore-filters-mobile` (mobile dropdown)
- `.explore-games` section with `#explore-grid.game-grid`
- `<div data-component="footer">` with noscript fallback
- Script load order: components.js → games.js → explore.js

**Depth-1 path corrections:** All CSS/JS paths use `../` prefix. Nav fallback links use `../index.html`.

## Verification
- [x] Page uses `_template.html` pattern with depth-1 `../` path prefixes
- [x] Nav and footer loaded via `components.js`
- [x] `#explore-grid` (not `#game-grid`) — prevents games.js auto-init here
- [x] Page heading "Explorar Jogos" clearly introduces the page
- [x] All semantic sections with aria-labels present

## Files Changed
- `explorar/explorar.html` — full rewrite (86 insertions, 298 deletions)
