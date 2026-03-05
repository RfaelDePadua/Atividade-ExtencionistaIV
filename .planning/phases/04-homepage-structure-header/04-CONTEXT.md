# Phase 4: Homepage Structure & Header - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold `index.html` as a complete, correctly structured page with a fixed header that transitions from transparent to dark on scroll, plus a hero welcome section. The carousel (Phase 5) and game cards (Phase 6) are out of scope — this phase delivers the **page skeleton and header scroll behavior** only.

</domain>

<decisions>
## Implementation Decisions

### Hero section height & visual style
- **Compact text block (~30–40vh)** — just enough for headline + subtitle, carousel area visible without scrolling
- **Text only** — no illustrations, planet silhouettes, or decorative elements in the hero; clean and minimal
- **Centered on both axes** — classic landing page feel, text floats in the middle of the hero area
- **Slight background overlay/tint** — a subtle darkening or semi-transparent layer to visually distinguish the hero from the rest of the page

### Header shrink-on-scroll scope
- **Smooth CSS transition** on background-color change (e.g. `transition: background-color 0.3s ease`)
- **Subtle box-shadow** appears when header becomes opaque (scrolled state)
- **Claude's Discretion: shrink scope** — whether to implement logo/nav size reduction on scroll, or just the background change. Guia-Visual says "encolhe suavemente" but "no animations in v1" is in effect; Claude should pick the right balance
- **Claude's Discretion: trigger mechanism** — scroll distance (~80px per success criteria) or IntersectionObserver on hero section; Claude picks the best approach

### Hero call-to-action
- **No CTA button in the hero section** — the header's "Explorar Jogos" button handles navigation to the carousel/explore page
- Preferred CTA phrasing "Embarcar na Aventura" noted for potential future use, but NOT implemented in this phase

### Page section layout
- **All sections contained** — hero, carousel placeholder, and cards placeholder all sit inside the container (max-width constrained)
- **Compact spacing (24–32px)** between major sections — content flows quickly without large gaps
- **Visible dev placeholders** — dashed-border boxes with labels like "Carrossel aqui" and "Cards aqui" for developer reference until Phases 5–6 fill them
- **Subtle dividers** — light horizontal lines or gradient separators between sections

### Claude's Discretion
- Header shrink scope (background-only vs full size reduction)
- Scroll trigger mechanism (pixel threshold vs IntersectionObserver)
- Exact overlay opacity/color for hero background tint
- Divider style (hairline rule, gradient fade, or other subtle approach)

</decisions>

<specifics>
## Specific Ideas

- Hero headline: "Bem-vindo ao Meu Planetinha" (from plan 04-05)
- Hero subtitle: "Cada planeta representa uma matéria diferente" (from plan 04-05)
- Header scrolled background: `#0D1A3A` (from Guia-Visual Section 04)
- Header transparent at page top per Guia-Visual
- Fredoka One for "Meu Planetinha" logo text, Nunito for nav links
- `scroll-behavior: smooth` on HTML element for "Explorar Jogos" → `#carousel` anchor
- Existing `components/nav.html` already has logo, nav links, CTA, hamburger menu — Phase 4 adds scroll behavior and homepage-specific structure

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-homepage-structure-header*
*Context gathered: 2026-03-04*
