---
phase: 10-accessibility
plan: 10-02
subsystem: ui
tags: [html, wcag, skip-link, aria, tabindex, carousel]

requires:
  - phase: 02-shared-nav-footer
    provides: nav.html which injects skip-link via components.js
  - phase: 05-planet-carousel
    provides: index.html with #carousel section
provides:
  - Zero duplicate skip-links on any page
  - Carousel interactive children removed from Tab order
  - Carousel section registered as named ARIA landmark region
affects: [10-05, 11-compatibility]

tech-stack:
  added: []
  patterns: [tabindex=-1 on carousel children to create single-Tab-stop widget]

key-files:
  created: []
  modified:
    - explorar/explorar.html
    - sobre_nos/sobre_nos.html
    - 404.html
    - index.html

key-decisions:
  - "Removed inline skip-links from 3 pages — nav.html is the single source of truth for skip-link"
  - "tabindex=-1 on arrows+dots removes them from Tab order but preserves click/JS interaction"
  - "role=region added to #carousel section for consistent landmark exposure across screen readers"

patterns-established:
  - "Single-Tab-stop carousel widget: tabindex=0 on container, tabindex=-1 on children, arrow key nav via JS"

duration: 5min
completed: 2026-03-05
---

# Plan 10-02: HTML Structural Accessibility Fixes Summary

**Removed 3 duplicate skip-links (nav.html is the single source), removed carousel arrows/dots from Tab order, and added role="region" landmark to carousel section.**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-03-05
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments
- explorar/explorar.html, sobre_nos/sobre_nos.html, 404.html: inline skip-links removed — nav.html injection is the sole source
- index.html: #carousel section gets role="region"; 2 arrow buttons + 5 dot buttons get tabindex="-1"
- Note: index.html also includes the 10-05 jogos-titulo tabindex="-1" change (committed together as file state)

## Task Commits

1. **Tasks 1–4: All HTML structural fixes** - `872dfff` (feat)

## Files Created/Modified
- `explorar/explorar.html` — removed inline skip-link (3 lines)
- `sobre_nos/sobre_nos.html` — removed inline skip-link (3 lines)
- `404.html` — removed inline skip-link (3 lines)
- `index.html` — role="region" on #carousel; tabindex="-1" on 2 arrows + 5 dots + jogos-titulo h2

## Decisions Made
None — followed plan as specified.
