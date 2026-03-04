# Phase 3: Global Layout & Space Background - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Every site page gets the correct full-page space gradient background, a consistent page shell (flex column: header + main grows + footer at bottom), and a properly structured `<html>` with `lang`, meta tags, and font preconnects. A shared `_template.html` documents the standard page boilerplate. Game pages in `jogos/` remain untouched. No animations in v1 — decorative elements are static only.

</domain>

<decisions>
## Implementation Decisions

### Background scroll behavior
- Gradient direction: slight angle (~170deg or ~190deg) rather than strictly vertical — more dynamic feel
- Color stop distribution: more blue, less magenta — blue (#1A3A8F) dominates most of the page; indigo (#2D1B8A) transitions at ~65%; magenta (#8B1A6B) appears only near the bottom
- Claude's discretion: scroll attachment (fixed vs scrolling) and short-page min-height behavior

### Stars & nebulae in v1
- Include **static stars** — CSS-generated random scatter (box-shadow or pseudo-element technique), varying sizes and opacities
- Star colors: multi-tinted per Guia-Visual — white, slightly blue, and yellowish mix
- Include **static nebulae** — pastel radial-gradient blobs (orange pastel, turquesa, rosa from Guia-Visual Section 01), no animation
- No drift, no pulse, no movement — all decorative elements are static in v1
- Claude's discretion: whether stars are fixed to viewport or scroll with content

### Content container sizing
- Horizontal padding: progressive — 16px on small screens (≤640px), 24px on tablets (~641–1024px), 32px on desktop (1025px+)
- Container max-width: same width across all pages (homepage, explorar, sobre_nós, 404) — no page-specific widths
- Claude's discretion: actual max-width value and whether certain sections (carousel, hero) may break out to full-bleed

### Claude's Discretion
- Background scroll attachment (fixed to viewport vs scrolling with content)
- Short-page rendering strategy (min-height: 100vh or equivalent)
- Container max-width value (960px–1280px range, whichever best fits the project)
- Full-bleed breakout policy for wide sections (carousel, hero)
- Star viewport attachment (fixed or scrolling)

</decisions>

<specifics>
## Specific Ideas

- Guia-Visual Section 01 is the design authority for gradient colors and decorative elements
- Nebulae described as "difusas, como bolhas de tinta na água" — soft, diffuse radial gradients in orange pastel, turquoise, and pink
- Stars described as "coloridas (brancas, levemente azuis, amareladas), tamanhos variados"
- Phase 2 already established `body { display: flex; flex-direction: column }` in components.css — page-shell.css must complement, not conflict
- STATE.md notes: "No animations in v1 — ship static correct layout first, add motion in v2"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-global-layout-space-background*
*Context gathered: 2026-03-04*
