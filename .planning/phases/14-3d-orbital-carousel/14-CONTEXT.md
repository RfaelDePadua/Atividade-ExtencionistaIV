# Phase 14: 3D Orbital Carousel - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the v1 flat carousel with a CSS 3D perspective ring where 5 planets orbit on a tilted elliptical plane. Back planets are faded/blurred, side planets scaled by perspective depth. Arrow/dot/keyboard/touch navigation preserved. This phase delivers the 3D carousel only — hero restructuring and wave dividers belong in Phase 15.

</domain>

<decisions>
## Implementation Decisions

### Orbit visual feel
- **Tilt angle:** Gentle (~25°) — the ring is mostly horizontal with a subtle sense of depth, not a steeply angled hoop
- **Spread:** Wide — orbit ring fills the section width for an immersive feel; `translateZ` radius should be generous
- **Perspective depth:** Exaggerated — front planet dominates visually, rear planets appear noticeably small; use a relatively short `perspective` value (e.g., 600–800px) to amplify size difference
- **Planet clipping fix:** Orbit container must have generous padding and `overflow: visible` on the 3D container and all ancestors — current v1 hover/pulse animations clip the top of planets. This is a known issue to resolve

### Rotation & transition behavior
- **Rotation speed:** Smooth float, ~600ms per step
- **Easing curve:** Ease-out (decelerate) — planet glides to a stop
- **Auto-rotate:** None — carousel stays still until user interacts; no idle auto-rotation
- **Touch momentum:** Fixed 1-planet swipe — each swipe always advances exactly one planet regardless of velocity

### Back-planet treatment
- **Opacity fade:** Ghostly/heavy — rear planets at ~30% opacity, appearing as distant silhouettes
- **Blur:** Visible, ~2–3px `filter: blur()` on rear planets — strong depth-of-field camera effect
- **Clickability:** Side planets (immediate left/right of center) are clickable as prev/next shortcuts. The two back-most planets are NOT clickable. Three interaction zones: left-side click → previous, center → current planet, right-side click → next
- **Labels:** Front planet and both side planets show names/info (3 of 5 planets labeled). Back two planets show no labels — they're ghostly silhouettes only

### Arrow & dot controls
- **Arrow position:** Adjacent to side planets — compact, clearly part of the carousel unit
- **Arrow style:** Minimal chevrons (‹ ›) — clean and minimal, space-themed via color only
- **Dot indicators:** Mini planet-colored dots — each dot matches its planet's color for visual identification
- **Mobile arrows:** Smaller arrows on mobile viewports, tucked tighter to planets — still visible but less intrusive than desktop

### Claude's Discretion
- Exact `perspective` value (within exaggerated range ~600–800px)
- Exact `translateZ` radius for wide spread feel
- Blur gradient (whether blur is binary or gradual based on angle offset)
- Exact arrow sizing and spacing on mobile breakpoints
- Dot indicator size and spacing below carousel
- Touch swipe threshold distance

</decisions>

<specifics>
## Specific Ideas

- **Planet hover/pulse clipping:** User reports that in v1, hovering or pulsing a planet clips the top of the sphere. The 3D container design must guarantee no ancestor has `overflow: hidden` and the orbit container has enough padding to accommodate hover scale-up effects. This is explicitly called out in v2.0 Critical Pitfall P-01 (Safari `preserve-3d` flattening from `overflow: hidden`).
- **Three-zone click model:** User envisions the carousel area as three clickable regions — left side, center, right side — rather than requiring arrow buttons. Side planet clicks act as prev/next navigation shortcuts.
- **Side planet labels:** User wants the 2 side planets to also show their names (not just the front one), so the child can preview what's coming next on either side.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-3d-orbital-carousel*
*Context gathered: 2026-03-06*
