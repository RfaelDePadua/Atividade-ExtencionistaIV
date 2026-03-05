---
phase: 7
plan: 4
status: complete
commit: a9fdba5
---

# Summary: 07-04 — Create scripts/explore.js — filter buttons, card rendering, filter logic

## What Was Done

Created `scripts/explore.js` — the complete Explore page controller as an IIFE. Consolidates roadmap plans 07-03 through 07-06.

### Created `scripts/explore.js`

**Config block:** `GRID_ID = 'explore-grid'`, `FILTERS_ID = 'explore-filters'`, `FILTERS_MOBILE_ID = 'explore-filters-mobile'`, `BASE_PATH = '../'`. Planet info array with 5 planets.

**`renderCards()`:** Calls `window.MeuPlanetinha.games.renderCards({ gridId: 'explore-grid', basePath: '../' })` to render all game cards with correct `/explorar/`-depth paths.

**`filterCards(planet)`:** Iterates `.game-card` elements in `#explore-grid`, sets/removes `hidden` attribute by `data-planeta` match. Calls `updateFilterState()`, `updateMobileSelect()`, `updateEmptyState()`.

**`renderFilterButtons()`:** Renders "Todos" pill + 5 planet pills into `#explore-filters`. Delegated click handler — "Todos" calls `showAll()`, others call `filterCards(slug)`.

**`updateFilterState(planet)`:** Adds `explore-filter-btn--active` to active planet button, removes from others. "Todos" never gets active class.

**`renderMobileFilter()`:** Renders `<label>` + `<select>` into `#explore-filters-mobile`. Change event syncs with `filterCards()`/`showAll()`.

**`updateMobileSelect(planet)`:** Syncs `<select>` value to current filter state.

**`updateEmptyState(grid, visibleCount)`:** Creates `.explore-empty` div with 🪐 icon, "Nenhum jogo disponível" text, and "Ver Todos" button when `visibleCount === 0`. "Ver Todos" calls `showAll()`.

**`init()`:** Guards against missing API with console.warn. Calls `renderCards()`, `renderFilterButtons()`, `renderMobileFilter()`. Default state: all cards visible.

**DOMContentLoaded guard:** IIFE checks `document.readyState` before attaching.

## Verification
- [x] `scripts/explore.js` created (267 lines)
- [x] All game cards render on load in `#explore-grid`
- [x] Six filter buttons: Todos + 5 planets
- [x] Clicking planet button filters grid; active gets planet theme color
- [x] "Todos" never gets `explore-filter-btn--active`
- [x] Empty state with "Nenhum jogo disponível" + "Ver Todos" button
- [x] Mobile `<select>` dropdown syncs with button state
- [x] Card "Jogar!" links use `../jogos/...` prefix
- [x] Homepage `index.html` unaffected (uses `#game-grid`, different from `#explore-grid`)

## Files Changed
- `scripts/explore.js` — created (267 lines)
