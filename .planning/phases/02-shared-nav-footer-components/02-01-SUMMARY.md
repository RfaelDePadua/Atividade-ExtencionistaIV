---
phase: 02-shared-nav-footer-components
plan: 01
subsystem: ui
tags: [html, css, nav, footer, components, responsive]

requires:
  - phase: 01-design-system-foundation
    provides: CSS custom property tokens (colors, spacing, typography, shadows, borders)

provides:
  - Pure HTML fragment for site nav (skip-link, logo, 2 nav links, CTA, hamburger, mobile overlay)
  - Pure HTML fragment for site footer (wave, brand column, Contato link, 4 decorative stars)
  - Complete CSS for nav + footer with mobile responsive breakpoint at ≤640px and FOUC prevention

affects: [02-02, 02-03, all site pages using the component system]

tech-stack:
  added: []
  patterns:
    - data-href attributes for runtime link rewriting (href set by components.js at inject time)
    - FOUC prevention via min-height on [data-component] placeholders
    - CSS clip-path polygon for wavy footer top border
    - CSS position sticky nav with z-index layering

key-files:
  created:
    - components/nav.html
    - components/footer.html
    - components/components.css

key-decisions:
  - "All nav <a> elements use data-href (not href) — components.js will rewrite to real URLs at injection time"
  - "Footer tagline is 'Explore o universo do aprendizado!' per 02-CONTEXT.md (not Guia-Visual default)"
  - "Only one parent link in footer: Contato (mailto:) — no Privacidade/Termos for v1"
  - "Footer wave uses clip-path polygon with 23 points for smooth wavy appearance"
  - "Mobile breakpoint: ≤640px single breakpoint throughout"

patterns-established:
  - "Component fragment pattern: pure HTML files with no document wrapper, injected via innerHTML"
  - "data-href pattern: placeholder attribute rewritten by JS loader after injection"
  - "FOUC prevention: [data-component] min-height reserves space before fragment loads"

duration: 10min
completed: 2026-03-04
---

# Plan 02-01: Nav/Footer HTML Fragments + CSS Summary

**Three static component files — nav fragment, footer fragment, and shared CSS — that form the visual foundation of the site-wide navigation and footer.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-03-04
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Created `components/nav.html` — pure HTML fragment with skip-link, logo, 2 nav links, CTA button, hamburger button, and mobile overlay; all navigation `<a>` use `data-href` attributes
- Created `components/footer.html` — pure HTML fragment with wavy border div, two-column layout (brand + Contato link), and 4 decorative star SVGs
- Created `components/components.css` — 270+ lines covering FOUC prevention, skip-link, desktop nav, mobile nav/overlay at ≤640px, and full footer styles including the clip-path wave

## Task Commits

1. **Task 1: Create components/nav.html** — included in `d5a0557`
2. **Task 2: Create components/footer.html** — included in `d5a0557`
3. **Task 3: Create components/components.css** — included in `d5a0557`

**Plan commit:** `d5a0557` feat(02-01): create nav.html, footer.html, and components.css

## Files Created

- `components/nav.html` — Nav bar HTML fragment; uses data-href on all nav links; includes ARIA attributes; hamburger + mobile overlay structure
- `components/footer.html` — Footer HTML fragment; footer-wave clip-path div; two-column brand/links layout; 4 decorative star SVGs
- `components/components.css` — All nav + footer styles; FOUC prevention; skip-link; sticky nav; mobile overlay; wavy footer via clip-path; star positioning

## Decisions Made

- All `<a>` navigation links use `data-href` (not `href`) so `components.js` can rewrite paths based on computed `BASE_URL` at injection time — this is the key to depth-agnostic path resolution
- Footer wave implemented with `clip-path: polygon(...)` using 23 control points for a natural wave shape
- Extra desktop CTA selector uses `:not(.nav-overlay .nav-cta)` to hide desktop CTA on mobile without hiding the overlay CTA
