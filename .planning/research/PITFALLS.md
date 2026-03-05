# Pitfalls Research

**Domain:** Kids' educational gaming platform — 3D CSS carousel, animations, iframe sandboxing
**Researched:** 2026-03-05
**Confidence:** HIGH

## Critical Pitfalls

### P-01: Safari `preserve-3d` Flattening

**What goes wrong:**
Safari flattens the 3D context when any ancestor has `overflow: hidden`, `overflow: auto`, `opacity < 1` on ancestors, or certain `filter` properties. The 3D carousel degrades to a flat 2D rendering where all planets overlap at the same depth.

**Why it happens:**
Safari's compositor aggressively flattens 3D stacking contexts for performance. Any CSS property that creates a new stacking context on an ancestor can trigger this.

**How to avoid:**
- Ensure NO ancestor of `.carousel-orbit` has `overflow: hidden/auto`
- The v1 `.carousel-track` uses `overflow: hidden` — this MUST be removed in v2
- Set `transform-style: preserve-3d` on every element in the chain from perspective parent to 3D children
- Test in Safari early — this is the #1 3D CSS pitfall

**Warning signs:**
Planets appear flat/overlapping instead of in 3D ring. All planets visible at same size.

**Phase to address:** 3D carousel implementation. Must be tested in Safari before marking complete.

---

### P-02: Backface Visibility Flicker

**What goes wrong:**
When planets rotate past 90° (facing away), `backface-visibility: hidden` hides them. During the transition, there's a frame where both front and back face are partially visible, creating a flicker.

**Why it happens:**
Browser rendering timing — the face swap happens mid-frame.

**How to avoid:**
- Use `backface-visibility: hidden` on planet cards
- Also use opacity fade for back-facing planets. Opacity transition covers the flicker gap
- Already planned: back planets get `opacity: 0` + `filter: blur()` — this naturally solves it

**Warning signs:**
Brief transparent/flickering flash when rotating carousel.

**Phase to address:** 3D carousel implementation.

---

### P-03: Z-Index — 3D Elements vs Regular DOM

**What goes wrong:**
Elements inside a `preserve-3d` context follow 3D z-ordering (based on Z position), but elements outside (nav, footer, wave dividers) follow normal CSS z-index. These two systems can conflict — 3D elements may render over the nav/footer.

**Why it happens:**
3D-transformed elements create their own painter's algorithm, which can override 2D z-index.

**How to avoid:**
- Set `z-index` explicitly on the carousel's containing section
- Ensure nav (`z-index: 100+`) is above the carousel container
- The perspective parent should have a lower z-index than page chrome
- Test with nav/footer overlay states (mobile hamburger menu)

**Warning signs:**
Planets rendering over the navigation bar or footer.

**Phase to address:** 3D carousel integration with page layout.

---

### P-04: Box-Shadow Starfield Repaints

**What goes wrong:**
The v1 starfield uses `box-shadow` on pseudo-elements. Animating elements with box-shadow via `background-position` triggers full repaints. On low-end devices (kids' tablets), this causes visible jank (< 30fps).

**Why it happens:**
`box-shadow` is paint-only — it can't be composited. Moving an element with box-shadow via `transform: translate()` is fine (element moves as unit). Animating `box-shadow` values or `background-position` causes repaints.

**How to avoid:**
- Animate via `transform: translate()` ONLY — move the entire pseudo-element as a single unit
- DO NOT animate `box-shadow` properties or `background-position`
- The pseudo-element should have `will-change: transform` to promote to GPU
- Use a large enough element (2x viewport) so translation loops seamlessly

**Warning signs:**
Stuttering starfield on mobile. DevTools paint flashing shows green on starfield.

**Phase to address:** Animation system phase.

---

### P-05: `will-change` GPU Memory Exhaustion

**What goes wrong:**
Applying `will-change: transform` to many elements promotes each to its own GPU layer, consuming video memory. With 5 planet cards + starfield + wave dividers, you can exhaust GPU memory on mobile, causing de-promotion and worse jank.

**Why it happens:**
Each promoted layer allocates a separate bitmap in GPU memory. Mobile GPUs have limited memory (128-256MB typically).

**How to avoid:**
- `will-change` on MAX 3-4 elements: the carousel orbit container, the starfield pseudo-element, and optionally the center planet
- DO NOT add `will-change` to all 5 planet cards — only the orbit container needs it
- The v1 carousel has `will-change: transform, opacity, filter` on every `.planet-card` — REMOVE THIS in v2

**Warning signs:**
DevTools Layers panel shows 10+ promoted layers. Mobile Safari crashes or goes blank.

**Phase to address:** 3D carousel + animation phases.

---

### P-06: Iframe Sandbox Blocks Phaser Audio

**What goes wrong:**
The `<iframe sandbox>` attribute by default blocks all capabilities. Even with `allow-scripts`, audio playback requires user gesture delegation. Phaser.js games that play sound may fail silently.

**Why it happens:**
Browser security policy — sandbox restricts Web Audio API and autoplay unless explicitly allowed.

**How to avoid:**
- Use `sandbox="allow-scripts allow-same-origin"` as minimum
- `allow-same-origin` is needed for Phaser's localStorage usage and asset loading
- The user clicks "Jogar" in parent frame, which satisfies user gesture requirement. Gesture propagates to iframe on same-origin
- Test audio in Contando_Estrelas Phaser game specifically

**Warning signs:**
Game loads but no sound. Console shows "NotAllowedError: play() failed."

**Phase to address:** Game shell implementation (stretch).

---

### P-07: Double Scrollbar on Iframe

**What goes wrong:**
If iframe content is taller than iframe element, both iframe and parent page show scrollbars. Users see two scrollbars and can't figure out which to use.

**Why it happens:**
iframe defaults to scroll if content overflows.

**How to avoid:**
- Set iframe to `width: 100%; height: calc(100vh - nav-height - footer-height)`
- Set `overflow: hidden` on the iframe element
- Set `scrolling="no"` attribute
- Games should be designed to fit container (both existing games already do)

**Warning signs:**
Two scrollbars visible when game page is taller than viewport.

**Phase to address:** Game shell implementation (stretch).

---

### P-08: Clip-Path / SVG Wave Subpixel Gaps

**What goes wrong:**
At certain viewport widths, the wave divider and adjacent section have a 1px gap where background bleeds through.

**Why it happens:**
Browser rendering rounds fractional pixels differently for SVG/clip-path boundaries vs element boundaries.

**How to avoid:**
- Use inline SVG (not clip-path) for more reliable rendering
- Overlap the SVG divider with both adjacent sections by 1-2px (negative margin or absolute positioning)
- Set `display: block` on SVG element (prevents inline whitespace gap)
- v1 already solved this for footer wave with clip-path + 2px overlap

**Warning signs:**
Thin bright line visible between sections at certain viewport widths.

**Phase to address:** Wave divider implementation.

---

### P-09: prefers-reduced-motion Must Cover JS Animations

**What goes wrong:**
CSS `prefers-reduced-motion` disables CSS animations, but the 3D carousel rotation is JS-driven (setting `--orbit-angle`). If JS doesn't check the preference, the carousel still rotates with animation.

**Why it happens:**
CSS media query only affects CSS animations/transitions. JS-initiated transforms are unaffected.

**How to avoid:**
- In `carousel-3d.js`: check `window.matchMedia('(prefers-reduced-motion: reduce)')`
- If reduced motion: skip CSS transition on orbit rotation, apply transform instantly
- Add listener for preference changes (user can toggle while page is open)
- v1 already has this pattern — extend to new 3D version

**Warning signs:**
Carousel animates rotation when system has "reduce motion" enabled.

**Phase to address:** 3D carousel implementation.

---

### P-10: Screen Readers and 3D Carousel

**What goes wrong:**
3D CSS transforms don't affect DOM order. Screen readers read all 5 planets in DOM order regardless of visual position. `aria-hidden` on back-facing planets may cause confusion if not synced.

**Why it happens:**
Assistive technology reads the DOM, not the visual presentation.

**How to avoid:**
- Keep v1 aria pattern: `aria-roledescription="carousel"` on track, `role="group"` on each card
- Use `aria-hidden="true"` on non-center planets (synced by JS when orbit rotates)
- Live region announces current planet name
- v1 already has this — ensure v2 JS preserves it

**Warning signs:**
Screen reader announces all 5 planets at once, or wrong planet as current.

**Phase to address:** 3D carousel implementation + a11y verification.

---

### P-11: Motion Sickness from 3D Rotation

**What goes wrong:**
3D carousel rotation creates a sense of physical motion. Some users (especially children with vestibular disorders) may feel dizzy or nauseous.

**Why it happens:**
3D rotation triggers the vestibular system. Large-scale 3D movements are a WCAG concern.

**How to avoid:**
- Keep rotation speed moderate (`--duracao-media` ~300ms)
- Only rotate on user action — no auto-rotation
- `prefers-reduced-motion`: instant snap instead of animated rotation
- Tilt is subtle (15deg) — not a full 3D rotation

**Warning signs:**
User feedback about dizziness. Failing reduced-motion tests.

**Phase to address:** 3D carousel + a11y verification.

---

### P-12: Battery Drain from Constant Animations

**What goes wrong:**
Starfield drift runs infinitely. Mobile devices drain battery faster. Parents notice and stop using the site.

**Why it happens:**
CSS animations drive the compositor continuously even when visually imperceptible.

**How to avoid:**
- Use `animation-play-state: paused` when `document.hidden` (Page Visibility API)
- Consider `steps(30)` timing function for slightly lower compositing cost
- `will-change` only on actively animating elements
- Test battery impact on mobile

**Warning signs:**
Mobile device temperature increases. Battery drains faster than expected.

**Phase to address:** Animation system phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping both carousel.css and carousel-3d.css | Less risk during transition | Dead CSS, confusion about active file | Never — delete old file after 3D is stable |
| Hardcoding `--orbit-angle` values per planet | Quick to implement | Breaks if planets added/removed | Only during prototype. Replace with calc() based on count |
| Inline styles for postMessage loading state | Works immediately | Can't override with CSS, harder to maintain | Never — use class toggling instead |
| Not implementing postMessage in existing games | Games work without modification | Loading screen waits for timeout every time | Acceptable for v2 — add protocol in v3 |
| Duplicating wave SVG in each HTML page | Works without JS | 5 copies of same markup | Acceptable if wave is only on 1-2 pages |
| CSS `transition` on `--orbit-angle` | Quick 3D animation | Custom properties can't be transitioned natively without `@property` | Use transition on `transform` directly instead |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating box-shadow values | Stuttering, paint flashing | Only use transform/opacity for animation | Any number of animated box-shadows |
| > 4 GPU-promoted layers | Mobile jank, blank screens | Audit Layers panel regularly | > 256MB GPU memory used |
| perspective < 500px | Extreme distortion, elements behind camera | Keep perspective ≥ 800px | Small screens with close-up carousel |
| SVG wave with many control points | Layout recalc on resize | Keep paths to 3-4 Bézier points | > 10 control points |
| iframe without explicit dimensions | Layout shift on load | Set width/height in CSS before load | Double scrollbar appears |
| `transform-style: preserve-3d` on many nested levels | Unexpected stacking, z-fights | Keep 3D context to carousel only | > 2 levels of nested preserve-3d |

## Browser-Specific Gotchas

### Safari
- `overflow: hidden` on ANY ancestor breaks `preserve-3d` — critical for carousel
- `-webkit-` prefix still needed for `backdrop-filter` in some versions
- `transform-style: preserve-3d` is not inherited — must be set on each intermediate element
- Web Audio in sandboxed iframe requires explicit user gesture
- `color-mix()` fallback already exists in v1

### Chrome/Edge
- `will-change` may create layer even when element is not visible — wastes GPU memory
- Dev tools Layers panel is the best tool for auditing promoted layers
- `Intersection Observer` can be used to add/remove `will-change` on viewport enter/exit

### Firefox
- `perspective` on elements with `overflow: visible` had issues in older versions (fixed ESR 115+)
- `will-change: transform` may not auto-promote to GPU layer — verify in about:layers
- `transform-origin` behaves slightly differently with percentage values in 3D context

### Mobile (all)
- Touch events need `passive: true` for performance (already handled in v1)
- Viewport units (`vh`) change with mobile toolbar show/hide — use `dvh` with `vh` fallback
- GPU memory limit ~128-256MB on budget tablets — keep promoted layers < 4
- Battery drain from continuous CSS animations — pause on `document.hidden`

---
*Pitfalls research for: Meu Planetinha v2.0*
*Researched: 2026-03-05*
