# Phase 5: Planet Carousel - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

An interactive planet carousel on the homepage with all 5 themed planets (Calculon, Letrion, Naturox, Terramund, Globish) in an Órbita Central layout. Keyboard, touch, and click navigation. Selecting the center planet sets a `data-active-planet` attribute that Phase 6 (Game Cards) will read for filtering. This phase does NOT include game cards, filtering logic, or decorative animations (float, particles) — those belong in Phase 6 and v2 respectively.

</domain>

<decisions>
## Implementation Decisions

### Planet visual style
- **Gradient spheres (CSS only)** — large circles with radial gradients suggesting a 3D sphere, using each planet's Guia-Visual base color
- **No glow/shadow halo** — clean circles against the dark background; colored glow deferred to v2
- **No rings** — Saturn-style decorative rings are deferred to v2
- **No surface detail** — craters, mountains, emoji overlays all deferred; v1 is clean gradient spheres only
- **Sizing at Claude's discretion** — pick a responsive size that works from 320px to 1440px

### Carousel layout & visibility
- **3 planets visible** at any time: center (large) + 1 smaller on each side; other 2 hidden off-screen
- **Side planets: smaller + blurred** — scaled down (~70%) with `filter: blur()` per Guia-Visual "menores e desfocados"
- **Slide transition** — planets slide left/right with CSS `transform: translateX` transition (~300ms). This is a functional transition, not decorative animation
- **Slight arc layout** — side planets sit slightly lower than center, suggesting an orbital path (Órbita Central feel)

### Interaction & selection feedback
- **Slight scale-up on hover** — center planet grows subtly (e.g., `scale(1.05)`) via CSS transition on hover/focus. No particles, no pulse
- **Center position IS the selection** — no extra "selected" visual state. Navigating to center a planet constitutes selecting it; `data-active-planet` updates when a planet reaches center
- **Rocket-shaped arrows** — navigation arrows styled as rockets (CSS/Unicode) per Guia-Visual "setas em formato de foguete apontando para os lados"
- **Planet-colored navigation dots** — dots below the carousel, active dot filled in the current planet's accent color, inactive dots as outlines

### Planet labels & text
- **Planet name + subject name** — e.g., "Calculon" (Fredoka One) / "Matemática" (Nunito) — no invitation phrases in v1
- **Labels below the planet** — outside/below the sphere, not overlaid
- **All planets show labels** — including side (blurred) planets; side labels match the blur/fade of their planet
- **No emoji** — text only, clean and simple

### Claude's Discretion
- Center planet diameter and responsive scaling breakpoints
- Exact blur radius for side planets
- Exact arc offset (how many px lower side planets sit)
- Rocket arrow implementation (CSS shapes vs Unicode 🚀 rotated)
- Slide transition duration and easing curve
- Touch swipe threshold distance
- Keyboard focus management approach (focus trap vs roving tabindex)

</decisions>

<specifics>
## Specific Ideas

- Guia-Visual Section 06 is the primary visual reference — "Órbita Central" style
- Planet colors from Guia-Visual: Calculon #FF8C42, Letrion #C084FC, Naturox #4DFFB4, Terramund #D4622A, Globish #00D4E8
- Planet names and subjects: Calculon/Matemática, Letrion/Português, Naturox/Ciências, Terramund/Geografia, Globish/Inglês
- CSS custom properties for planet colors already exist in `estilos/base.css` (e.g., `--planeta-calculon-cor`)
- The hero section (#carousel placeholder) already exists in `index.html` from Phase 4

</specifics>

<deferred>
## Deferred Ideas

- Floating/bobbing animation for planets (v2 motion pass)
- Hover particle effects in planet accent color (v2 motion pass)
- Planet surface details: craters, mountains, rings, themed elements (v2 visual enrichment)
- Glow/shadow halo around planets (v2 visual enrichment)
- Saturn-style orbital rings on specific planets (v2 visual enrichment)

</deferred>

---

*Phase: 05-planet-carousel*
*Context gathered: 2026-03-05*
