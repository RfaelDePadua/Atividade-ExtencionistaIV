# Phase 15: Unified Hero & Section Transitions - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Merge the hero text block into the carousel section as a single cohesive unit and add SVG wave dividers between major homepage sections to create a flowing visual hierarchy. Requirements: CAROUSEL-03, TRANS-01, TRANS-02, POLISH-07.

</domain>

<decisions>
## Implementation Decisions

### Hero–Carousel Fusion
- Title ("Meu Planetinha") floats above the orbit ring — centered, no overlap with the 3D carousel
- Small 1-line tagline subtitle sits directly below the title (reduced weight/opacity)
- CTA ("Escolha seu planeta!") sits below the carousel as a prompt to interact
- Full 100vh hero on desktop — scroll to see game cards
- Hide standalone arrow buttons for a cleaner hero look; keep keyboard, touch/swipe, click, and dot navigation
- Container approach: try both variants — (A) frosted panel behind title/subtitle/CTA with carousel outside on starfield, vs (B) no container, everything on starfield — implement the more promising one, user will evaluate visually
- Extra sparkle/particle density around the hero area compared to the rest of the page

### Wave Divider Character
- Subtle ripple (low amplitude) — calm horizon feel, not dramatic or playful curves
- ~150 bytes inline SVG Bézier curves per divider (per research phase decision)
- Same wave shape across viewports, scales with width

### Claude's Discretion
- Wave layer count (single vs layered) — simplest approach that looks good
- Wave shape variation per transition (same or different) — whatever fits best
- Wave coloring strategy — match cosmic theme naturally
- CTA spacing below carousel — whatever creates the best visual rhythm
- Tonal progression from hero → cards → footer — Claude picks the approach
- Starfield continuity vs per-section variation — Claude decides

### Section Background Hierarchy
- Sections should flow smoothly into each other — waves are the primary visual separator (no harsh band changes)
- Radial glow / nebula-like wash behind the carousel area for atmosphere
- No distinct "landing zones" per section — the feeling should be one continuous space journey

### Mobile Layout Flow
- 100vh hero on mobile (same as desktop)
- Proportional scaling — title and carousel both scale down together
- Swipe gesture on the 3D orbit for mobile navigation (existing Phase 14 touch handler)
- Dots remain visible for tap navigation on mobile

</decisions>

<specifics>
## Specific Ideas

- **Container experiment:** User feels the hero elements might be scattered and wants to visualize whether a frosted/glass panel behind the text elements (but not the carousel) helps unify them. Carousel should remain "in space" either way. Build whichever approach looks better, but be prepared to quickly swap if user wants the other.
- **Radial glow:** A soft nebula-style radial gradient behind the carousel adds atmosphere without competing with the 3D perspective effect.
- **Arrow removal context:** Phase 14 placed arrows adjacent to side planets. Phase 15 removes them for a cleaner look — navigation via swipe, keyboard, dots, and direct planet click.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 15-unified-hero-section-transitions*
*Context gathered: 2026-03-06*
