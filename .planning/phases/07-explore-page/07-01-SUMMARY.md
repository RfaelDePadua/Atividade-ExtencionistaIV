---
phase: 7
plan: 1
status: complete
commit: ce707ef
---

# Summary: 07-01 — Refactor games.js — expose public API and basePath parameter

## What Was Done

Refactored `scripts/games.js` to expose a public API and add configurability for multi-page use.

### Changes to `scripts/games.js`

**Task 1 — Public API export:**
Added `window.MeuPlanetinha.games` namespace exposing `GAME_DATA`, `createCard`, `createStars`, `renderCards`, `filterCards`, `showAll` — placed before the initialization block.

**Task 2 — `createCard(game, basePath)`:**
Added optional `basePath` parameter (defaults to `''`). Game card "Jogar!" href becomes `basePath + game.path`. Homepage still receives `href="jogos/..."` with no basePath; explore page gets `href="../jogos/..."` with `basePath: '../'`.

**Task 3 — `renderCards(options)`:**
Made `renderCards()` accept an `options` object with `gridId` (default: `'game-grid'`) and `basePath` (default: `''`). Homepage auto-init uses default grid; explore page calls `renderCards({ gridId: 'explore-grid', basePath: '../' })`.

**Task 4 — `filterCards(planet, gridId)`:**
Added optional `gridId` parameter (default: `'game-grid'`). Homepage calls without gridId — no behavior change.

**Task 5 — `init()` safety:**
Confirmed `renderCards()` no-ops when `#game-grid` is absent (explore page uses `#explore-grid`). `renderToolbar()` already no-ops when `#jogos-toolbar` is absent. Homepage behavior entirely unchanged.

## Verification
- [x] `window.MeuPlanetinha.games` exposed with all required functions
- [x] `createCard(game)` with no basePath still produces `href="jogos/..."` (homepage compatible)
- [x] `createCard(game, '../')` produces `href="../jogos/..."` (explore compatible)
- [x] `renderCards({ gridId: 'explore-grid', basePath: '../' })` targets custom grid
- [x] Homepage behavior unchanged (non-breaking refactor)

## Files Changed
- `scripts/games.js` — 31 insertions, 8 deletions
