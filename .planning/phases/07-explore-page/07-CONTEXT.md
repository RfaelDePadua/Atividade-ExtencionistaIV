# Phase 7: Explore Page - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

`explorar/explorar.html` — a dedicated game discovery page where users see all games in a responsive grid and filter by planet using a sticky filter bar. Shares the card component and game data from Phase 6. No new game capabilities are added here; this is purely a browse/discover page.

</domain>

<decisions>
## Implementation Decisions

### Filter Bar Design
- Pill-style buttons with planet name text only (no icons)
- On mobile (≤640px): collapses to a `<select>` dropdown — pills do not wrap or scroll
- Active state visual: Claude's discretion (use planet theme color meaningfully)
- Filter bar is **sticky** — stays fixed below the nav as user scrolls the game grid

### Grid Layout & Density
- 3 columns on desktop, 2 columns on tablet, 1 column on mobile
- Cards are **identical** to homepage Portal de Entrada cards — same component, same size
- Grid gap: Claude's discretion
- Standard site container — centered, same max-width as rest of site (not full-bleed)

### Page Hero / Heading Area
- Title: **"Explorar Jogos"** (Fredoka One, matches site headings)
- Sub-headline: **"Descubra os jogos do universo do aprendizado!"**
- No intro paragraph — title + sub-headline only
- Heading section is **center-aligned**
- Vertical size/padding: Claude's discretion

### Empty State
- Shows **"Nenhum jogo disponível"** text centered in the grid area, with vertical padding
- Includes a **"Ver Todos"** button that resets the active filter when clicked
- "Todos" button in the filter bar has **no active/highlighted state** when all games are shown — it is visually neutral by default; only planet buttons get highlighted when active

### Claude's Discretion
- Active filter button highlight style (use planet color variables, e.g. `--planeta-calculon-cor`)
- Grid gap between cards
- Heading section vertical padding/height
- Sticky filter bar top offset (must clear the fixed nav)

</decisions>

<specifics>
## Specific Ideas

- The sticky filter bar must clear the fixed nav (nav is `64px` tall per Phase 4 decision — use `top: 64px` or equivalent)
- The mobile dropdown collapse replaces pill buttons entirely on small screens — not a hybrid
- Relative paths for "Jogar!" links must be `../jogos/...` since the page is at `/explorar/` depth
- Game data comes from `scripts/games.js` (defined in Phase 6) — reuse that constant, don't duplicate

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-explore-page*
*Context gathered: 2026-03-05*
