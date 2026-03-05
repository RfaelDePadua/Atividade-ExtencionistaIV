---
phase: 04-homepage-structure-header
plan: 01
subsystem: ui
tags: [html, scaffold, homepage, template]

requires:
  - phase: 03-global-layout-space-background
    provides: _template.html canonical head block and page-shell CSS
provides:
  - index.html scaffolded and ready as Phase 4 homepage foundation

affects: [04-02, 04-03, 04-04, 04-05, 05-planet-carousel, 06-game-cards]

tech-stack:
  added: []
  patterns: [data-component placeholders for component injection, .page-home body class for scoped CSS overrides]

key-files:
  created: []
  modified: [index.html]

key-decisions:
  - "No skip-link in body — nav.html injects it, avoiding duplication"
  - "Hero has no CTA button in v1 — text-only welcome block"
  - "Dev placeholders (#carousel, #jogos) are dashed-border sections scoped to Phase 5–6"

patterns-established:
  - "page-home body class: scopes homepage CSS overrides without !important"

duration: 5min
completed: 2026-03-04
---

# Plan 04-01: Scaffold index.html from _template.html Summary

**Legacy index.html replaced with valid HTML5 page: lang="pt-BR", page-home body class, component placeholders, hero section, and Phase 5–6 dev placeholders.**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-03-04
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced 167-line legacy HTML with clean 72-line scaffold
- All 7 required CSS files in correct load order (reset → base → layout → page-shell → componentes → components → homepage)
- Hero section: `.hero-title` + `.hero-subtitle` with component placeholder for nav/footer injection
- `#carousel` and `#jogos` dev placeholder sections ready for Phase 5–6

## Task Commits

1. **Task 1: Replace index.html with scaffolded content** - `a0e0d9e` (feat)

**Plan metadata:** (committed with wave 1 batch)

## Files Created/Modified
- `index.html` — Complete scaffold replacement: valid HTML5, correct head, body.page-home, hero section, dev placeholders

## Decisions Made
No deviations from plan. Skip-link omitted per plan spec (nav.html provides it).
