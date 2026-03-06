# Phase 13: Animation System - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a centralized animation stylesheet (`estilos/animacoes.css`) with GPU-composited @keyframes for starfield drift, planet float, and sparkle accents — all gated by `prefers-reduced-motion` and Page Visibility API. No new features or capabilities; this phase adds ambient motion to the existing static layout.

</domain>

<decisions>
## Implementation Decisions

### Starfield drift feel
- **Speed:** Gentle drift — clearly moving but relaxing. 30–45s animation loop.
- **Direction:** Diagonal down-left (classic space drift).
- **Parallax:** Yes — big stars (::before) move slower, small stars (::after) move faster, creating depth.
- **Loop technique:** Double-size background translated back seamlessly (no visible snap at cycle reset).

### Planet float rhythm
- **Oscillation range:** 4–6px vertical (`translateY`) — alive without being distracting.
- **Easing:** `ease-in-out` — smooth sine-wave feel, organic breathing motion.
- **Synchronization:** Staggered — each planet has a different `animation-delay` offset so they don't bob in unison.
- **Cycle duration:** 4–5s per full up-down cycle — calm, dreamy rhythm.

### Sparkle/particle style
- **Type:** Twinkling star points — small dots that `opacity` fade in/out in place (no translation).
- **Density:** 5–7 sparkle elements visible at any time — a light dusting, not overwhelming.
- **Color:** White/light only — pure starlight, no accent colors.
- **Placement:** Hero/carousel area only — scoped to the planet carousel region, not the full page.

### Animation intensity & cohesion
- **Overall mood:** Calm ambient — like a stargazing night. Relaxed space ambiance, nothing demands attention.
- **Coordination:** Independent — each animation (starfield, float, sparkle) runs its own uncorrelated cycle for organic feel.
- **Idle behavior:** Always alive — continuous subtle motion everywhere, no intersection-based triggering.

### Accessibility & performance
- **Reduced motion:** Full stop — zero animation under `prefers-reduced-motion: reduce` (both CSS `animation: none` / `transition: none` AND JS `matchMedia` check).
- **Tab visibility:** Page Visibility API pauses all animations when `document.hidden` is true; resumes on return.

### Claude's Discretion
- Exact keyframe percentages and bezier values for starfield drift
- Sparkle element implementation (pseudo-elements vs dedicated `<span>` elements)
- Exact animation-delay offsets for planet stagger
- Whether sparkle fade uses opacity alone or opacity + scale
- GPU compositing strategy (which elements get `will-change`, staying within 3–4 budget)

</decisions>

<specifics>
## Specific Ideas

- Starfield should feel like looking up at the night sky from a slowly drifting spaceship — not hyperspace, not static
- Planet float should evoke weightlessness, like objects gently bobbing in zero gravity
- Sparkles are decorative accent only — they enhance the carousel area, not compete with it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-animation-system*
*Context gathered: 2026-03-06*
