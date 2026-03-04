---
phase: 02-shared-nav-footer-components
plan: 02
subsystem: ui
tags: [javascript, fetch, components, path-resolution, aria, mobile-menu]

requires:
  - phase: 02-01
    provides: nav.html and footer.html fragments with data-href attributes; components.css with all styles

provides:
  - components.js — fetch-based component loader with BASE_URL path detection, link rewriting, active-page detection, mobile menu toggle
  - _nav-footer-test.html — root-level test page verifying nav + footer load correctly from root depth

affects: [02-03, all site pages]

tech-stack:
  added: []
  patterns:
    - document.currentScript.src captured synchronously at parse time for BASE_URL detection
    - Promise.all for parallel component fetching with sequential injection order
    - data-href → href rewriting with protocol whitelist (mail:, tel:, http:, https: bypass BASE_URL)
    - normalizePath() for reliable aria-current detection across index.html/trailing-slash variations

key-files:
  created:
    - components/components.js
    - _nav-footer-test.html

key-decisions:
  - "Used Promise.all for parallel fetch then ordered injection — faster than sequential await loop"
  - "var declarations (not const/let) for maximum compatibility without transpilation"
  - "Script tag must NOT have defer/async/type=module — documented in file header comment"
  - "Fallback nav injected inline when fetch fails for nav component (footer silently omitted)"

patterns-established:
  - "BASE_URL pattern: SCRIPT_URL.substring(0, SCRIPT_URL.lastIndexOf('components/')) — works at any depth"
  - "Protocol check regex: /^(https?:|mailto:|tel:)/ — skips BASE_URL for absolute/special URLs"

duration: 10min
completed: 2026-03-04
---

# Plan 02-02: components.js + Root Test Page Summary

**JavaScript component loader that fetches nav/footer HTML fragments, rewrites links via BASE_URL computed from document.currentScript.src, detects active page, and manages the mobile menu.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-03-04
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Created `components/components.js` — 6-section vanilla JS loader: BASE_URL detection, fetch wrapper, link rewriting, active-page detection, mobile menu toggle (open/close/Escape/click-outside/focus management), DOMContentLoaded init with Promise.all parallel fetching
- Created `_nav-footer-test.html` — root-depth test page with nav/footer placeholders, noscript fallback, checklist, and BASE_URL debug display

## Task Commits

1. **Task 1: Create components/components.js** — included in `05ddc01`
2. **Task 2: Create _nav-footer-test.html** — included in `05ddc01`

**Plan commit:** `05ddc01` feat(02-02): create components.js loader and root nav-footer test page

## Files Created

- `components/components.js` — Fetch-based component loader; captures document.currentScript.src; rewrites data-href → href; sets aria-current="page"; mobile hamburger toggle with keyboard + focus support
- `_nav-footer-test.html` — Root-level developer test fixture; loads all Phase 1+2 CSS; includes noscript fallback nav; BASE_URL debug display

## Decisions Made

- `Promise.all` used for parallel fetching (faster than sequential `await`) while still injecting nav before footer (array order preserved in `.then()` callback)
- `var` used throughout for compatibility (no ES6 module/class requirement from the plan)
- `mailto:contato@meuplanetinha.com` link skips BASE_URL prefix — handled by protocol regex check
