# Project Research Summary

**Project:** Meu Planetinha v2.0 — Visual Polish, 3D Carousel & Platform Prep
**Domain:** Kids' educational gaming platform (vanilla HTML/CSS/JS, GitHub Pages)
**Researched:** 2026-03-05
**Confidence:** HIGH

## Executive Summary

Meu Planetinha v2.0 transforms a clean static layout into an immersive animated space experience. The headline feature — a CSS 3D orbital carousel — replaces the v1 flat position-class system with a genuine `preserve-3d` ring where 5 planets orbit on a tilted elliptical plane. Combined with starfield drift animations, wave section dividers, and visual polish across all pages, the site goes from "functional" to "magical."

The entire v2.0 stack is **zero new dependencies** — everything uses native CSS 3D transforms, @keyframes, inline SVG, and vanilla JS. This preserves the project's core constraint of deploying as static files to GitHub Pages. The game shell (iframe sandbox) is a stretch goal that lays infrastructure for future contributor support.

Key risks are Safari's aggressive 3D flattening behavior (the `overflow: hidden` ancestor pitfall) and animation performance on low-end children's tablets. Both are well-understood and have clear mitigation strategies documented in PITFALLS.md.

## Key Findings

### Recommended Stack

Zero new dependencies. Everything needed is native CSS3/HTML5/ES6:

- **CSS 3D Transforms**: `perspective`, `transform-style: preserve-3d`, `rotateY`, `translateZ` — creates a genuine 3D carousel ring
- **CSS @keyframes**: GPU-composited animations for starfield drift, planet float, sparkle accents
- **Inline SVG**: Bézier wave dividers between sections (~150 bytes each)
- **iframe sandbox**: `allow-scripts allow-same-origin` for game isolation
- **CSS Custom Properties**: 9 new tokens extending `base.css` for 3D perspective, animation timing, z-index layers

### Expected Features

**Must have (v2.0 launch — 11 features):**
- F-01: 3D orbital carousel (tilted elliptical ring, CSS 3D transforms)
- F-02: Unified hero section (title + subtitle + CTA + carousel as one block)
- F-03: Header consistency (remove duplicate, drop bar)
- F-05: Wave dividers between sections
- F-06: Cards 3-per-row with "Coming Soon" placeholder
- F-06b: Card button anchored to bottom
- F-07: Starfield drift + planet float animations
- F-08: Background hierarchy (vertical rhythm)
- F-09: Index spacing (breathing room before footer)
- F-10: Explore filter redesign (remove blue strip)

**Should have (v2.x — 3 features):**
- F-07b: Ambient particle accents
- F-11: Game shell iframe wrapper (jogar.html)
- F-12: Unified loading screen

**Defer (v3+):**
- Contributor SDK / game submission workflow
- Progress tracking with LocalStorage
- Functional search + alphabet filter

### Architecture Approach

The 3D carousel uses a **CSS Custom Property Animation Driver** pattern: JS sets a single `--orbit-angle` on the `.carousel-orbit` container; CSS handles all planet positioning via static `rotateY(N*72deg) translateZ(var(--orbita-raio))` offsets. This replaces the v1 system of toggling position classes (`--center`, `--left`, `--right`, etc.) with a more elegant single-variable rotation model.

**Major components:**
1. **3D Orbit Carousel** — `carousel-3d.css` + `carousel-3d.js` (full rewrite, replaces v1)
2. **Animation System** — `estilos/animacoes.css` (new) with centralized @keyframes
3. **Wave Dividers** — Inline SVG in HTML, styled via `componentes.css`
4. **Game Shell** — `jogos/jogar.html` iframe wrapper (stretch goal)

### Critical Pitfalls

1. **P-01: Safari `preserve-3d` flattening** — `overflow: hidden` on ANY ancestor kills 3D. The v1 `.carousel-track` has `overflow: hidden` and MUST be removed. Test in Safari early.
2. **P-04: Box-shadow starfield repaints** — Animate via `transform: translate()` only, never animate box-shadow values directly. Use `will-change: transform` on the pseudo-element.
3. **P-05: GPU memory exhaustion** — MAX 3-4 `will-change` elements. Remove v1's `will-change` on every `.planet-card` — only the orbit container needs it.
4. **P-09: prefers-reduced-motion must cover JS** — CSS query only disables CSS animations. JS carousel rotation needs explicit `matchMedia` check + instant snap fallback.
5. **P-12: Battery drain** — Pause animations when `document.hidden`. Consider `steps(30)` timing for lower compositing cost.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation — Tokens & Quick Fixes
**Rationale:** Update design tokens first; they're needed by everything else. Bundle quick wins to show early progress.
**Delivers:** Updated `base.css` with 3D/animation tokens, header fix, card layout fix, explore filter redesign, index spacing
**Addresses:** F-03, F-06, F-06b, F-09, F-10
**Avoids:** P-05 (establish `will-change` budget early)

### Phase 2: Animation System
**Rationale:** @keyframes must exist before 3D carousel can use float animations. Starfield drift is independent.
**Delivers:** `animacoes.css` with star-drift, planet-float, sparkle keyframes. Tab visibility pause. prefers-reduced-motion integration.
**Addresses:** F-07 (starfield + float)
**Avoids:** P-04 (correct animation technique from the start), P-09 (motion pref in JS), P-12 (tab pause)

### Phase 3: 3D Orbital Carousel
**Rationale:** The headline feature. Depends on tokens and animations. Biggest risk item — needs dedicated phase.
**Delivers:** `carousel-3d.css` + `carousel-3d.js`. Replaces v1 carousel entirely. 5 planets on tilted 3D ring.
**Addresses:** F-01, F-04 (side planets sized by perspective)
**Avoids:** P-01 (Safari preserve-3d), P-02 (backface flicker), P-03 (z-index conflicts), P-10 (a11y), P-11 (motion sickness)

### Phase 4: Unified Hero & Wave Dividers
**Rationale:** With carousel stable, merge hero section and add wave dividers to connect all sections.
**Delivers:** Merged hero in `index.html`, wave SVGs between sections, background hierarchy polish.
**Addresses:** F-02, F-05, F-08
**Avoids:** P-08 (subpixel gaps)

### Phase 5: Verification & Cross-Browser
**Rationale:** 3D CSS is Safari-sensitive. Dedicated verification pass before stretch goals.
**Delivers:** Cross-browser testing (Safari, Firefox, Chrome, Edge), mobile viewport testing, a11y audit.
**Addresses:** All P-01 through P-12 final verification
**Avoids:** Shipping with undetected Safari bugs

### Phase 6 (Stretch): Game Shell & Iframe Sandbox
**Rationale:** Platform infrastructure for future contributors. Depends on visual polish being complete.
**Delivers:** `jogar.html` iframe wrapper, loading screen, postMessage protocol.
**Addresses:** F-11, F-12
**Avoids:** P-06 (audio sandbox), P-07 (double scrollbar)

### Phase Ordering Rationale

- Tokens first because every other phase depends on them
- Animations before 3D carousel because float @keyframes are used by planet cards
- 3D carousel in its own phase because it's the biggest risk and needs focused attention
- Hero/waves after carousel because they merge into the carousel section
- Verification as explicit phase because 3D CSS has known browser inconsistencies
- Game shell last because it's a stretch goal and independent of visual polish

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (3D Carousel):** Most complex feature. May need prototype before full plan.
- **Phase 6 (Game Shell):** iframe sandbox flags + Phaser.js compatibility needs hands-on testing.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Quick fixes):** Straightforward CSS changes
- **Phase 2 (Animations):** Well-understood @keyframes patterns
- **Phase 4 (Hero/waves):** HTML restructuring + SVG insertion

---
*Research summary for: Meu Planetinha v2.0*
*Synthesized: 2026-03-05*
