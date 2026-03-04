---
plan: "03-02"
status: "complete"
completed: "2026-03-04"
---

# Summary: 03-02 — Create _template.html — canonical HTML page boilerplate

## What was done
1. Created `_template.html` at project root — the canonical HTML boilerplate for all new site pages.
2. Added `page-shell.css` `<link>` to three existing test pages: `_nav-footer-test.html`, `_design-system-test.html`, `explorar/_nav-footer-test.html`.

## Template features
- `<!DOCTYPE html>` + `<html lang="pt-BR">`
- `<meta charset>`, `<meta viewport>`, `<meta description>` placeholder
- Google Fonts `<link rel="preconnect">` (fonts.googleapis.com + fonts.gstatic.com) + stylesheet link for Fredoka One, Nunito, Press Start 2P with `display=swap`
- Bootstrap Icons CDN link
- CSS in canonical order: `reset.css` → `base.css` → `layout.css` → `pages/page-shell.css` → `componentes.css` → `components/components.css`
- Skip link `<a class="skip-link" href="#main-content">` for accessibility
- `<div data-component="nav">` with `<noscript>` fallback
- `<main id="main-content" class="page-wrapper">` with `.container` inside
- `<div data-component="footer">` with `<noscript>` fallback
- `<script src="components/components.js">` at end of body
- Comment documentation: CSS load order explanation + path depth guide for root vs depth-1 pages

## Files created
- `_template.html`

## Files modified
- `_nav-footer-test.html` — added `page-shell.css` link (root-depth path)
- `_design-system-test.html` — added `page-shell.css` link (root-depth path)
- `explorar/_nav-footer-test.html` — added `page-shell.css` link (depth-1 path)

## Verification
- [x] `_template.html` exists at project root
- [x] `lang="pt-BR"` on `<html>`
- [x] `<meta charset="UTF-8">` and `<meta name="viewport">`
- [x] Google Fonts preconnect + stylesheet links
- [x] Bootstrap Icons CDN link
- [x] CSS load order: reset → base → layout → page-shell → componentes → components
- [x] `data-component="nav"` and `data-component="footer"` with noscript fallbacks
- [x] `<main id="main-content" class="page-wrapper">` with `.container`
- [x] `components/components.js` at end of body
- [x] Skip link for accessibility
- [x] Comments document CSS load order and path depth guide
- [x] page-shell.css added to all three test pages
