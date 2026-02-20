# Testing Patterns

**Analysis Date:** 2026-02-19

## Current state
- No automated tests detected (no `tests/` folder, no `vitest`/`jest` config, `npm test` is a placeholder).
- No CI workflows found that run tests.

## Recommendation (first steps)
- Add unit tests for deterministic logic (math helpers, scoring, input parsing) using Vitest.
- Add lightweight E2E for gameplay smoke tests (Playwright) to verify game loads and basic interactions.
- Add a `test` script in `package.json` and a simple GitHub Actions workflow to run tests on PRs.

## Suggested test organization
- Unit tests alongside source (`*.test.js`) for small functions (e.g., calculation helpers).
- E2E tests in `e2e/` (Playwright) to run headless checks for each game entry point.

## Quick starter commands (example)
- `npm i -D vitest @testing-library/dom` — unit tests
- `npm i -D @playwright/test` — E2E tests for gameplay smoke checks

## Why tests matter here
- Game logic (scoring, levels) contains deterministic algorithms that are cheap to unit-test.
- Tests reduce risk when refactoring scenes or asset loading paths.

---
*Add tests as part of early roadmap; prioritize core game mechanics and load/boot flows.*