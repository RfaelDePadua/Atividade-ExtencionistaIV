---
phase: 09-404-page
plan: "09-01"
subsystem: ui
tags: [html, 404, nav, footer, components]

requires:
  - phase: 01-design-system-foundation
    provides: CSS design tokens, reset, base, layout stylesheets
  - phase: 02-shared-nav-footer-components
    provides: components.js fetch loader, nav.html, footer.html, components.css
  - phase: 03-global-layout-space-background
    provides: page-shell.css (space gradient, page-wrapper)

provides:
  - 404.html — complete rebuild at root depth with nav+footer injection and design system CSS
affects: [phase-10-accessibility, phase-11-compatibility]

tech-stack:
  added: []
  patterns:
    - body.page-404 scoping — page-specific CSS isolated via body class (follows Phase 4/7/8 precedent)
    - Root-depth paths — estilos/..., components/... (no ../ prefix, unlike depth-1 pages)

key-files:
  created: []
  modified:
    - 404.html — full rewrite from legacy (geral.css, barra_superior.css) to new design system
---

# Plan 09-01 Summary: Scaffold 404.html

## What Was Done

Completely replaced the legacy `404.html` (which referenced `geral.css` and `barra_superior.css`) with a new, valid HTML5 page built from `_template.html`.

### Files Modified
- **404.html** — full rewrite; root-depth CSS paths, `body.page-404`, skip link, nav+footer injection via `components/components.js`

### Verification Against Must-Haves
- ✅ Valid HTML5, `lang="pt-BR"`, `charset=UTF-8`
- ✅ Space background from `page-shell.css`
- ✅ Nav and footer injected via `components/components.js`
- ✅ `body.page-404` class for CSS scoping
- ✅ Skip link: `<a class="skip-link" href="#main-content">`
- ✅ All CSS at root depth (`estilos/...`, no `../` prefix)
- ✅ `components/components.css` loaded from root
- ✅ Links `estilos/pages/404.css` (created by Plan 09-03)

## Commit
`feat(09-01/02/03): rebuild 404.html and create estilos/pages/404.css`
Hash: 8661451
