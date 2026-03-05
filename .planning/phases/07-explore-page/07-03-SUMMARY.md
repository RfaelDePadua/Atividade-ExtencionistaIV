---
phase: 7
plan: 3
status: complete
commit: 216386d
---

# Summary: 07-03 — Create estilos/pages/explore.css — page-specific styles

## What Was Done

Created `estilos/pages/explore.css` with all Explore page styles, and added `--cor-foco` design token to `estilos/base.css`.

### Task 0 — Added `--cor-foco` to `estilos/base.css`
Added `--cor-foco: #60A5FA;` to the `:root` semantic color token block (after `--cor-aviso`). General-purpose focus ring color for use across the site.

### Task 1 — Created `estilos/pages/explore.css`

**Sections implemented:**
- `.explore-hero` — center-aligned heading section with `var(--espaco-2xl)` top padding
- `.explore-titulo` — Fredoka One, `var(--texto-4xl)`, white
- `.explore-subtitulo` — Nunito, `var(--texto-lg)`, 75% white opacity
- `.explore-filter-bar` — `position: sticky; top: 64px` with `rgba(13,26,58,0.92)` glass background + backdrop-filter blur
- `.explore-filters` — flex wrap, centered, gap `var(--espaco-sm)`
- `.explore-filter-btn` — 999px border-radius pill, transparent bg, 2px border, hover translateY(-1px)
- Five planet active states using `--planeta-{slug}-cor/texto` CSS custom properties
- "Todos" button intentionally has NO active state (context decision)
- `.explore-filter-select` — mobile `<select>` with custom chevron SVG, `var(--cor-foco)` focus outline
- `.explore-filters-mobile` — hidden by default, shown at ≤640px
- `.explore-games` — `padding: var(--espaco-xl) 0 var(--espaco-2xl)`
- `.explore-games .game-grid` — `grid-template-columns: repeat(3, 1fr)` desktop override
- `.explore-empty` — centered empty state with icon, text, and button styles
- Responsive: 2 columns at ≤1024px, 1 column at ≤640px; dropdown replaces pills at ≤640px

## Verification
- [x] `estilos/pages/explore.css` exists (266 lines)
- [x] `--cor-foco: #60A5FA` added to base.css `:root`
- [x] Sticky filter bar at `top: 64px`
- [x] Five planet active states using correct planet CSS variables
- [x] "Todos" has no active/highlighted state
- [x] Responsive grid: 3→2→1 columns
- [x] Mobile dropdown at ≤640px

## Files Changed
- `estilos/pages/explore.css` — created (266 lines)
- `estilos/base.css` — 1 line added (`--cor-foco` token)
