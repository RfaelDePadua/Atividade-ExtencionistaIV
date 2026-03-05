---
phase: 04-homepage-structure-header
plan: 05
subsystem: ui
tags: [javascript, scroll-listener, smooth-scroll, homepage]

requires:
  - phase: 04-01
    provides: index.html with #carousel element and [data-component="nav"] wrapper
  - phase: 04-04
    provides: .site-nav--scrolled CSS class in components.css

provides:
  - scripts/homepage.js with scroll header toggle and CTA smooth-scroll

affects: [05-planet-carousel]

tech-stack:
  added: []
  patterns: [IIFE module pattern, event delegation on nav wrapper, passive scroll listener]

key-files:
  created: [scripts/homepage.js]
  modified: []

key-decisions:
  - "IIFE to avoid global variable pollution"
  - "Boolean guard (isScrolled) prevents redundant classList writes on every scroll tick"
  - "Event delegation on [data-component='nav'] wrapper catches both desktop + mobile CTAs"
  - "scrollIntoView({ behavior: 'smooth' }) leverages base.css scroll-behavior smooth"
  - "Passive scroll listener ({ passive: true }) for browser-optimized scroll performance"

patterns-established:
  - "homepage.js pattern: page-specific JS loaded after components.js, IIFE-wrapped"

duration: 8min
completed: 2026-03-04
---

# Plan 04-05: Create scripts/homepage.js — scroll listener and CTA intercept Summary

**`scripts/homepage.js` created as IIFE with two behaviors: scroll listener toggles `.site-nav--scrolled` at 80px threshold, and event-delegated `.nav-cta` click interceptor smooth-scrolls to `#carousel` and closes mobile overlay.**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-03-04
- **Tasks:** 1
- **Files modified:** 1 (created)

## Accomplishments
- Scroll listener with boolean guard — only writes DOM on state change, not every scroll event
- Initial state check `onScroll()` on init — handles mid-scroll page reload correctly
- Event delegation via `navWrapper.addEventListener` catches both desktop and mobile `.nav-cta` elements
- Mobile overlay cleanup on CTA click (removes `.is-open`, sets `aria-hidden`, resets hamburger `aria-expanded`)
- DOMContentLoaded fallback in case script runs before component injection (safety net)

## Task Commits

1. **Task 1: Create scripts/homepage.js** - `2a895db` (feat)

## Files Created/Modified
- `scripts/homepage.js` — 79 lines, IIFE-wrapped scroll + CTA behaviors

## Decisions Made
No deviations from plan. `scrollIntoView()` used rather than manual scroll calculation — leverages `html { scroll-behavior: smooth }` from Plan 04-03.
