---
phase: 10-accessibility
plan: 10-05
subsystem: ui
tags: [javascript, wcag, keyboard-nav, carousel, focus-management]

requires:
  - phase: 05-planet-carousel
    provides: carousel.js with _bindEvents() keydown handler
  - plan: 10-02
    provides: index.html with tabindex=-1 already applied to arrows/dots
provides:
  - Home/End keyboard navigation in carousel (ARIA carousel pattern)
  - Programmatic focus moves to game grid heading after planet selection
  - jogos-titulo heading accepts programmatic focus via tabindex=-1
affects: [11-compatibility]

tech-stack:
  added: []
  patterns: [Home/End keyboard navigation for carousel widget; post-action focus management with tabindex=-1 heading]

key-files:
  created: []
  modified:
    - scripts/carousel.js
    - index.html

key-decisions:
  - "tabindex=-1 on jogos-titulo heading follows standard programmatic focus target pattern"
  - "if (jogosHeading) guard prevents errors if element absent"

patterns-established:
  - "Post-action focus management: after selection, move focus to result region heading"

duration: 5min
completed: 2026-03-05
---

# Plan 10-05: Carousel Keyboard Enhancements Summary

**Added Home/End keyboard navigation to the planet carousel and programmatic focus management after planet selection — screen readers immediately hear filtered game results.**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-03-05
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- carousel.js: Home key jumps to Calculon (index 0), End key jumps to Globish (index 4)
- carousel.js: After planet card click/Enter, browser focus moves to `#jogos .jogos-titulo` heading
- index.html: `.jogos-titulo` h2 gets `tabindex="-1"` for programmatic focus (no Tab-order pollution)

## Task Commits

1. **Tasks 1–3: Home/End keyboard + focus management** - `9610b09` (feat)

## Files Created/Modified
- `scripts/carousel.js` — _bindEvents() keydown handler extended with Home/End; focus move after dispatchEvent
- `index.html` — `.jogos-titulo` tabindex="-1" (also committed in 10-02 batch as file state)

## Decisions Made
None — followed plan as specified.
