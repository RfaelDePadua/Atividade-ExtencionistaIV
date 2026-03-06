# Phase 13: Animation System — Research

**Researched:** 2026-03-06
**Confidence:** High
**Mode:** Implementation

---

## Architecture Overview

The animation system is a **pure additive layer** — no existing functionality changes, only new motion added on top of the existing static layout.

**New files:**
- `estilos/animacoes.css` — all @keyframes + animation application rules
- `scripts/animacoes.js` — Page Visibility API handler + reduced-motion JS guard (global, loaded on every page)

**Modified files:**
- `estilos/base.css` — move star gradient layers from `body` to `body::before`/`body::after`; update `--anim-drift-duracao` token
- `index.html` — add sparkle `<span>` elements inside `#carousel`; add `<link>` for `animacoes.css`; add `<script>` for `animacoes.js`
- All other HTML pages — add `<link>` for `animacoes.css`; add `<script>` for `animacoes.js` (starfield + visibility are global)

**CSS load order — insert after base.css:**
```
reset.css
base.css
animacoes.css        ← NEW (after tokens, before layout)
layout.css
page-shell.css
componentes.css
components/components.css
[page-specific].css
carousel.css
cards.css
```

**JS load order — animacoes.js loads before page-specific scripts but after components.js:**
```html
<script src="components/components.js"></script>
<script src="scripts/animacoes.js"></script>    <!-- NEW -->
<script src="scripts/homepage.js"></script>
<script src="scripts/carousel.js"></script>
<script src="scripts/games.js"></script>
```

---

## Standard Stack

All native browser APIs — zero dependencies:

| Feature | API / Spec |
|---------|-----------|
| Starfield drift | CSS `@keyframes` + `transform: translate()` on pseudo-elements |
| Planet float | CSS `@keyframes` + `transform: translateY()` |
| Sparkle accents | CSS `@keyframes` + `opacity` on positioned `<span>` elements |
| Reduced motion (CSS) | `@media (prefers-reduced-motion: reduce)` — already in base.css |
| Reduced motion (JS) | `window.matchMedia('(prefers-reduced-motion: reduce)')` + `.addEventListener('change')` |
| Tab visibility | `document.addEventListener('visibilitychange')` + `document.hidden` |
| GPU compositing | `will-change: transform` (max 3-4 elements) |

---

## Architecture Patterns

### Pattern 1: Split Background Layers — Nebulae on Body, Stars on Pseudo-Elements

**The problem:** The current `body` has ALL background layers (nebulae + stars) on one element. You can't animate `background-position` efficiently (triggers repaint, violates P-04). You must animate via `transform: translate()`, which requires moving the entire element. Nebulae are viewport-sized and should stay fixed — only stars should drift.

**The solution:** Split the background:
- `body` keeps: background-color + 7 nebulae radial-gradients (non-repeating, 100% 100%). These stay static.
- `body::before` gets: the 4 bright/large star layers (1.5px–2px dots). Slower drift. "Near" star parallax layer.
- `body::after` gets: the 6 small/dim star layers (1px dots). Faster drift. "Far" star parallax layer.

Both pseudo-elements are `position: fixed`, `inset: 0`, `pointer-events: none`, with `z-index: -1` (behind all content).

**CRITICAL DISCOVERY: `background-attachment: fixed` is IGNORED on transformed elements.** When `transform: translate()` is applied, the browser treats `background-attachment: fixed` as `scroll`. This is per CSS spec — transforms establish a new containing block. This means:

- Remove `background-attachment: fixed` from the pseudo-elements entirely.
- Use `position: fixed` on the pseudo-elements themselves to achieve the "fixed to viewport" effect.
- The body's nebulae can keep `background-attachment: fixed` because the body itself is not being transformed.

### Pattern 2: Seamless Infinite Translation Loop (Double-Size Technique)

**The trick:** Make the pseudo-element **exactly 2× the viewport size** in both dimensions. The tiling star gradients repeat across this doubled area. The @keyframes translates from `(0, 0)` to exactly `(-50%, -50%)` — which is exactly one copy of the viewport-sized tile. At the keyframe boundary, the pattern is in an identical position to start, so the loop is seamless.

```
@keyframes starfield-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(-50%, -50%); }
}
```

**Why this works:** With `width: 200vw; height: 200vh` and a tiling background, after translating by -50% (one viewport-width) the visible area shows the same tile arrangement. The `animation-timing-function: linear` ensures constant speed with no easing stutter at the loop point.

**Direction:** Translate to `(-50%, -50%)` produces diagonal drift toward upper-left. The visible effect is stars moving down-right relative to the viewport (like the viewer is drifting up-left through space). For the "diagonal down-left" classic space drift feel from the context doc, use `translate(50%, -50%)` — stars drift up and to the left, giving the observer a sense of drifting down-left.

Actually, re-examining: the *stars* should appear to drift diagonally. To make stars appear to move toward lower-left:
- `from: translate(0, 0)` → `to: translate(-50%, 50%)` doesn't work because we need the seamless wrap.

Correct approach: translate in the direction opposite to the apparent star motion. For stars appearing to drift down-left (gravity-like gentle fall), translate the element up-right: `translate(50%, 50%)`. But negative is simpler to reason about — what matters is the tiling math.

**Final decision:** Use `translate(-50%, -50%)`. Stars appear to drift from lower-right to upper-left across the viewport. This is the standard "diagonal space drift" effect. The key insight: with doubled dimensions and tiling, ANY combination of `±50%` in x/y produces a seamless loop. Pick `(-50%, -50%)` — it gives a natural downward-left drift illusion (stars slide up-left = observer drifts down-left).

### Pattern 3: Parallax via Different Animation Durations

Two pseudo-elements, same keyframe, different `animation-duration`:

| Layer | Element | Star sizes | Tile density | Duration | Feel |
|-------|---------|-----------|-------------|----------|------|
| Near (bright) | `body::before` | 1.5px–2px | Sparse (280px–350px tiles) | 40s | Slow, foreground |
| Far (dim) | `body::after` | 1px | Dense (150px–250px tiles) | 28s | Fast, background |

This creates natural parallax: dim far stars zip by faster than bright near stars, exactly like real-life depth perception.

### Pattern 4: Body Class Toggle for Tab Hidden State

**Use a CSS class, not inline style manipulation.**

```js
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('tab-hidden', document.hidden);
});
```

```css
.tab-hidden *,
.tab-hidden *::before,
.tab-hidden *::after {
  animation-play-state: paused !important;
}
```

**Why class toggle, not direct style:** A single class on body cascades to all animated elements via CSS. No need to query/iterate individual elements. Adding/removing one class is the cheapest possible DOM operation. The CSS rule covers future animations added in later phases (3D carousel, etc.) without JS changes.

### Pattern 5: Planet Float on Child Element

The float animation MUST target `.planet-sphere` (the inner circle), not `.planet-card` (the positioning wrapper). The `.planet-card` already has `transform` for carousel positioning — stacking another transform on the same element would conflict.

```css
.planet-sphere {
  animation: planet-float var(--anim-float-duracao) ease-in-out infinite;
}
```

Stagger via `animation-delay` on nth-child or per-planet modifier. Five planets, each offset by 20% of cycle:
- Planet 1: delay 0s
- Planet 2: delay 0.8s (20% of 4s)
- Planet 3: delay 1.6s
- Planet 4: delay 2.4s
- Planet 5: delay 3.2s

### Pattern 6: Sparkle Elements via HTML Spans

**Use real `<span>` elements, not pseudo-elements.** Reason: the carousel section only has 2 pseudo-elements available (::before/::after) and those may be needed by Phase 14 (3D carousel). Using 5-7 `<span>` elements is cleaner and allows individual animation-delay control.

```html
<!-- Inside #carousel > .container, after carousel-track -->
<span class="sparkle" aria-hidden="true"></span>
<span class="sparkle" aria-hidden="true"></span>
<!-- ... 5-7 total -->
```

Each sparkle is:
- `position: absolute` within the carousel container
- 2-3px circle (border-radius: 50%)
- White fill
- `pointer-events: none`
- `opacity` keyframe: 0 → 1 → 0
- Different `animation-delay` and `animation-duration` per element
- Positioned via `top`/`left` percentages (scattered across carousel area)

---

## Implementation Approach

### ANIM-01: Starfield Drift

**Step 1 — Modify `estilos/base.css`:** Split the body background.

Current body has 17 background-image layers: 7 nebulae + 10 star layers. Move the 10 star layers to pseudo-elements.

**Body keeps (static nebulae):**
```css
body {
  background-color: #0B0F2E;
  background-image:
    /* 7 nebula radial-gradients — unchanged */
    radial-gradient(ellipse 55% 45% at 80% 15%, rgba(255, 140, 66, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 90% 55%, rgba(192, 132, 252, 0.12) 0%, transparent 65%),
    radial-gradient(ellipse 50% 40% at 12% 78%, rgba(77, 255, 180, 0.05) 0%, transparent 65%),
    radial-gradient(ellipse 45% 35% at 25% 40%, rgba(0, 212, 232, 0.13) 0%, transparent 60%),
    radial-gradient(ellipse 70% 70% at 50% 50%, rgba(45, 27, 138, 0.50) 0%, transparent 80%),
    radial-gradient(ellipse 80% 60% at 40% 25%, rgba(26, 58, 143, 0.40) 0%, transparent 75%),
    radial-gradient(ellipse 60% 30% at 55% 95%, rgba(139, 26, 107, 0.30) 0%, transparent 70%);
  background-size: 100% 100%; /* all nebulae at full viewport */
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}
```

**body::before gets "near" stars (bright/sparse — 4 layers):**
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 200vw;
  height: 200vh;
  pointer-events: none;
  z-index: -1;

  background-image:
    radial-gradient(1.5px 1.5px at 40px  70px,  rgba(255,255,255,0.9), transparent),
    radial-gradient(2px   2px   at 180px 110px, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 60px  50px,  rgba(176,196,255,0.7), transparent),
    radial-gradient(1.5px 1.5px at 30px 180px, rgba(255,228,181,0.5), transparent);

  background-size:
    300px 280px,
    350px 320px,
    220px 240px,
    310px 340px;

  background-repeat: repeat;

  animation: starfield-drift var(--anim-drift-duracao) linear infinite;
}
```

**body::after gets "far" stars (dim/dense — 6 layers):**
```css
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 200vw;
  height: 200vh;
  pointer-events: none;
  z-index: -1;

  background-image:
    radial-gradient(1px 1px at 20px  30px,  #FFFFFF, transparent),
    radial-gradient(1px 1px at 65px  88px,  rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 130px 45px,  rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 85px  140px, #FFFFFF, transparent),
    radial-gradient(1px 1px at 110px 90px,  rgba(255,228,181,0.6), transparent),
    radial-gradient(1px 1px at 200px 160px, rgba(176,196,255,0.5), transparent);

  background-size:
    150px 170px,
    200px 200px,
    180px 220px,
    250px 190px,
    260px 260px,
    280px 300px;

  background-repeat: repeat;

  animation: starfield-drift calc(var(--anim-drift-duracao) * 0.7) linear infinite;
}
```

**Step 2 — Define keyframes in `estilos/animacoes.css`:**
```css
@keyframes starfield-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(-50%, -50%); }
}
```

**Step 3 — Ensure content stays above pseudo-elements.** The pseudo-elements use `z-index: -1` so all page content renders on top naturally. No changes needed to existing content z-indexing — negative z-index on `position: fixed` elements stacks them behind the body's content flow.

### ANIM-02: Planet Float

**Keyframe in `animacoes.css`:**
```css
@keyframes planet-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(calc(-1 * var(--anim-float-distancia))); }
}
```

**Application in `animacoes.css`:**
```css
.planet-sphere {
  animation: planet-float var(--anim-float-duracao) ease-in-out infinite;
}

/* Stagger: each planet starts at a different point in the cycle */
.planet-card:nth-child(1) .planet-sphere { animation-delay: 0s; }
.planet-card:nth-child(2) .planet-sphere { animation-delay: -0.8s; }
.planet-card:nth-child(3) .planet-sphere { animation-delay: -1.6s; }
.planet-card:nth-child(4) .planet-sphere { animation-delay: -2.4s; }
.planet-card:nth-child(5) .planet-sphere { animation-delay: -3.2s; }
```

**IMPORTANT:** Use **negative** `animation-delay` so all planets are mid-animation on page load (no planet sits still waiting for its delay to pass). Negative delay means the animation starts as if it had already been playing for that duration.

**No conflict with existing `.planet-sphere` transition:** The existing `transition: transform var(--duracao-media) var(--easing-padrao)` on `.planet-sphere` in `carousel.css` handles hover scale. CSS animations + CSS transitions on the same property DO coexist: the animation runs continuously, and the hover transition applies on top. However, there's a subtlety: if the `.planet-card--center:hover .planet-sphere { transform: scale(1.05) }` rule fires, it sets an inline-equivalent transform that overrides the animation's transform for that property while the transition runs.

**Resolution:** The hover scale is on `.planet-card--center:hover .planet-sphere` — it only triggers on the center (visible) planet on hover. The float animation uses `translateY` and the hover uses `scale`. These ARE different transform functions — but they're both the `transform` property. They will conflict.

**Fix:** Move the float to a wrapper or use composite animation. Simplest fix: **add the float translateY into the hover state too:**

Actually, the cleanest approach: keep the float animation and accept that on hover, the explicit `transform: scale(1.05)` will override the animation momentarily. When hover ends, the animation resumes. This is acceptable UX — the planet "snaps to attention" on hover (stops floating, slightly enlarges) and resumes floating when hover leaves. This is actually a nice interaction.

Alternatively, nest the transforms: `transform: translateY(var(--float-y, 0)) scale(var(--hover-scale, 1))`. But this is over-engineering for Phase 13. **Accept the hover override behavior — it's actually desirable.**

### ANIM-03: Sparkle/Particle Accents

**HTML markup additions to `index.html`** (inside `#carousel > .container`, after the `carousel-announcer` div):
```html
<span class="sparkle" style="top: 12%; left: 8%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 68%; left: 15%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 25%; left: 85%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 72%; left: 90%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 5%; left: 50%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 55%; left: 35%;" aria-hidden="true"></span>
<span class="sparkle" style="top: 40%; left: 70%;" aria-hidden="true"></span>
```

**CSS in `animacoes.css`:**
```css
@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0; }
  50%      { opacity: 1; }
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #FFFFFF;
  pointer-events: none;
  opacity: 0;
  animation: sparkle-twinkle var(--anim-sparkle-duracao) ease-in-out infinite;
}

/* Stagger sparkles with varied delays and durations for organic feel */
.sparkle:nth-child(1 of .sparkle) { animation-delay: -0.0s; animation-duration: 2.0s; }
.sparkle:nth-child(2 of .sparkle) { animation-delay: -0.4s; animation-duration: 1.6s; }
.sparkle:nth-child(3 of .sparkle) { animation-delay: -1.1s; animation-duration: 2.2s; }
.sparkle:nth-child(4 of .sparkle) { animation-delay: -0.7s; animation-duration: 1.8s; }
.sparkle:nth-child(5 of .sparkle) { animation-delay: -1.5s; animation-duration: 2.4s; }
.sparkle:nth-child(6 of .sparkle) { animation-delay: -0.3s; animation-duration: 1.5s; }
.sparkle:nth-child(7 of .sparkle) { animation-delay: -1.9s; animation-duration: 2.1s; }
```

**Note on `:nth-child(An+B of S)` selector:** This is the "of S" filtering syntax (CSS Selectors 4). Browser support: Chrome 111+, Safari 9+, Firefox 113+. Well supported as of 2026. Fallback: if concerned, use `:nth-of-type` or just plain `.sparkle:nth-child(N)` targeting the children by overall sibling position. Since we know the exact DOM structure, using `.sparkle:nth-child(N)` from the parent is equally viable — just count the sibling index including non-sparkle siblings. Better yet: use unique `animation-delay` via `style` attribute on each span to avoid selector complexity entirely.

**Simplified approach — inline the delay/duration per sparkle:**
```html
<span class="sparkle" style="top:12%;left:8%;animation-delay:-0.0s;animation-duration:2.0s" aria-hidden="true"></span>
<span class="sparkle" style="top:68%;left:15%;animation-delay:-0.4s;animation-duration:1.6s" aria-hidden="true"></span>
<!-- etc. -->
```

This is pragmatic and avoids selector gymnastics. The `animacoes.css` then only needs the base `.sparkle` rule and the keyframe.

### ANIM-04: Reduced Motion

**CSS — already handled.** The existing `@media (prefers-reduced-motion: reduce)` block in `base.css` catches all animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This already kills starfield drift, planet float, and sparkle twinkle. No duplication needed in `animacoes.css`.

**JS — new guard in `scripts/animacoes.js`:**
```js
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Re-check on change (user toggles setting while tab is open)
reducedMotion.addEventListener('change', function() {
  // If reduced motion just turned on, ensure tab-hidden class is not active
  // (no animations to pause if they're already disabled)
  if (reducedMotion.matches) {
    document.body.classList.remove('tab-hidden');
  }
});
```

The JS side matters for Phase 14 (3D carousel will be JS-driven). For Phase 13, the main JS concern is: **don't run the visibility handler if reduced-motion is active** (no point toggling play-state on already-stopped animations). The `animacoes.js` script should export the `reducedMotion` check so carousel-3d.js can read it in Phase 14.

### ANIM-05: Page Visibility API

**In `scripts/animacoes.js`:**
```js
(function() {
  'use strict';

  // --- Reduced motion detection ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --- Page Visibility API ---
  document.addEventListener('visibilitychange', function() {
    if (reducedMotion.matches) return; // nothing to pause
    document.body.classList.toggle('tab-hidden', document.hidden);
  });

  // Expose for Phase 14 (carousel JS needs to check reduced motion)
  window.MeuPlanetinha = window.MeuPlanetinha || {};
  window.MeuPlanetinha.reducedMotion = reducedMotion;
})();
```

**CSS rule in `animacoes.css`:**
```css
.tab-hidden,
.tab-hidden *,
.tab-hidden *::before,
.tab-hidden *::after {
  animation-play-state: paused !important;
}
```

---

## Don't Hand-Roll

These patterns are well-established — use them as-is:

| Pattern | Established solution | Don't reinvent |
|---------|---------------------|----------------|
| Seamless star drift | 2× element + translate(-50%, -50%) + linear timing | Don't try background-position animation (triggers repaint) |
| Reduced motion CSS | `animation-duration: 0.01ms !important` on `*, *::before, *::after` | Don't set `animation: none` (breaks animation-fill-mode states) |
| Reduced motion JS | `window.matchMedia('(prefers-reduced-motion: reduce)')` + `change` listener | Don't poll or use MutationObserver |
| Tab hidden detection | `document.visibilitychange` + `document.hidden` | Don't use blur/focus events (unreliable, doesn't cover tab switching vs window switching) |
| Pause mechanism | Body class toggle + CSS `animation-play-state: paused` | Don't iterate elements in JS to set inline styles |
| Float easing | `ease-in-out` for organic bob | Don't use custom cubic-bezier (ease-in-out IS the sine approximation) |
| Element stagger | Negative `animation-delay` values | Don't use JS setTimeout stagger (fragile, doesn't survive tab-switch) |

---

## Common Pitfalls

### 1. `background-attachment: fixed` is IGNORED on transformed elements
**The #1 "I didn't know this" pitfall for this phase.**

Per CSS spec, when `transform` is applied to an element (or its ancestor), `background-attachment: fixed` reverts to `scroll`. This means if the pseudo-elements have `background-attachment: fixed` AND `transform: translate()`, the fixed attachment breaks.

**Solution:** Don't use `background-attachment: fixed` on pseudo-elements at all. Use `position: fixed` on the element itself. The pseudo-elements are `position: fixed; top: 0; left: 0; width: 200vw; height: 200vh` — they're fixed to the viewport by positioning, not by background-attachment. When the animation translates them, they move relative to the viewport exactly as desired.

The body's nebulae can keep `background-attachment: fixed` because body itself is never transformed.

### 2. Negative z-index requires positioned parent
`z-index: -1` on `body::before`/`body::after` with `position: fixed` works because the body is the natural stacking context parent. However, if body has `position: relative` or any property that creates a stacking context (opacity, transform, will-change), the pseudo-elements stack behind body's background but still above the html element's background. With `position: fixed`, the pseudo-elements participate in the root stacking context — `z-index: -1` correctly places them behind body's normal-flow children.

**Verify:** Body in base.css does NOT have `position: relative`, `transform`, or `will-change`. It's clean. The negative z-index will work correctly.

### 3. `will-change` budget
The starfield pseudo-elements (body::before, body::after) run continuous transforms and are prime candidates for `will-change: transform`. That's 2 of the 3-4 budget.

Planet spheres do NOT need `will-change` — the `translateY` animation is simple and browsers auto-promote animated elements to the compositor. Only add `will-change` to planet spheres if there's measurable jank during testing.

Sparkles definitely don't need `will-change` — opacity-only animations are lightweight.

**Budget allocation:**
1. `body::before` → `will-change: transform` ✓
2. `body::after` → `will-change: transform` ✓
3. Reserved for Phase 14 (3D carousel orbit container)
4. Reserved for Phase 14 (center planet card)

### 4. Carousel container needs `position: relative` for sparkle positioning
The sparkle `<span>` elements are `position: absolute` and need a positioned ancestor. `#carousel > .container` already has `position: relative` defined in carousel.css. Sparkles will position correctly relative to this container.

### 5. Animation + transition on same property
As noted in ANIM-02, `.planet-sphere` has `transition: transform` for hover and `animation: planet-float` using `transform: translateY`. When the hover rule sets `transform: scale(1.05)`, it overrides the animation. This is acceptable behavior — the planet stops floating during hover (visual "attention snap") and resumes when hover ends.

Do NOT try to solve this with multiple transform properties or custom properties in Phase 13. Phase 14 replaces the carousel entirely, so this interaction is temporary.

### 6. Doubled element + viewport units on mobile
`200vw` / `200vh` on mobile: The `vh` unit on iOS changes when the toolbar shows/hides. For the starfield pseudo-elements, this means a slight jump when the toolbar animates. Use `200dvh` with `200vh` fallback:

```css
body::before, body::after {
  height: 200vh;
  height: 200dvh; /* override if supported */
}
```

`dvh` = dynamic viewport height, adjusts with toolbar. Supported in all modern browsers as of 2024.

### 7. z-index stacking with fixed pseudo-elements
`position: fixed` elements participate in the root stacking context. Using `z-index: -1` places them behind normal-flow content. However, the existing `components/components.css` uses `z-index: 2` on body children via `body > * { position: relative; z-index: 2; }` — wait, that's in `geral.css` (v1 design system), NOT in the v2 CSS chain.

**Verify v2 has no such rule:** The v2 CSS chain (reset → base → layout → page-shell → componentes → components) does not set z-index on `body > *`. The pseudo-elements at `z-index: -1; position: fixed` will render below all body content correctly.

### 8. Animation not appearing immediately
With the 2× size technique, if the pseudo-element exceeds the viewport, it renders correctly because `position: fixed` and `overflow` on html/body defaults to visible. However, some resets set `overflow: hidden` on html or body. Check:

The project's `reset.css` does NOT set overflow on html or body. Safe.

---

## Code Examples

### animacoes.css (complete file)

```css
/*
 * animacoes.css — Meu Planetinha Animation System
 * Phase 13 · @keyframes, animation application, visibility/reduced-motion hooks
 *
 * Depends on: base.css (tokens), base.css already handles prefers-reduced-motion
 * Load after: base.css, before: layout.css
 */

/* =========================================
   @KEYFRAMES
   ========================================= */

/* Starfield: diagonal drift toward upper-left (observer drifts down-right through space) */
@keyframes starfield-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(-50%, -50%); }
}

/* Planet: gentle vertical bob */
@keyframes planet-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(calc(-1 * var(--anim-float-distancia))); }
}

/* Sparkle: twinkle in/out */
@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0; }
  50%      { opacity: 1; }
}

/* =========================================
   STARFIELD DRIFT — applied to body pseudo-elements
   (Pseudo-element definitions live in base.css)
   ========================================= */

body::before,
body::after {
  will-change: transform;
}

body::before {
  animation: starfield-drift var(--anim-drift-duracao) linear infinite;
}

body::after {
  animation: starfield-drift calc(var(--anim-drift-duracao) * 0.7) linear infinite;
}

/* =========================================
   PLANET FLOAT
   ========================================= */

.planet-sphere {
  animation: planet-float var(--anim-float-duracao) ease-in-out infinite;
}

/* Stagger each planet using negative delay */
.planet-card:nth-child(1) .planet-sphere { animation-delay: 0s; }
.planet-card:nth-child(2) .planet-sphere { animation-delay: -0.8s; }
.planet-card:nth-child(3) .planet-sphere { animation-delay: -1.6s; }
.planet-card:nth-child(4) .planet-sphere { animation-delay: -2.4s; }
.planet-card:nth-child(5) .planet-sphere { animation-delay: -3.2s; }

/* =========================================
   SPARKLE ACCENTS
   ========================================= */

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #FFFFFF;
  pointer-events: none;
  opacity: 0;
  z-index: 0;
  animation: sparkle-twinkle var(--anim-sparkle-duracao) ease-in-out infinite;
}

/* =========================================
   TAB HIDDEN — pause all animations
   ========================================= */

.tab-hidden,
.tab-hidden *,
.tab-hidden *::before,
.tab-hidden *::after {
  animation-play-state: paused !important;
}
```

### scripts/animacoes.js (complete file)

```js
/**
 * animacoes.js — Meu Planetinha Animation Utilities
 * Phase 13
 *
 * 1. Page Visibility API: pause animations when tab is hidden
 * 2. Reduced motion guard: exposes matchMedia result for other scripts
 *
 * Load on every page, after components.js, before page-specific scripts.
 */

(function () {
  'use strict';

  /* --- Reduced motion detection --- */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Page Visibility API --- */
  function onVisibilityChange() {
    if (reducedMotion.matches) {
      // Nothing animates under reduced motion — ensure class is clean
      document.body.classList.remove('tab-hidden');
      return;
    }
    document.body.classList.toggle('tab-hidden', document.hidden);
  }

  document.addEventListener('visibilitychange', onVisibilityChange);

  /* Handle reduced-motion change while tab is hidden */
  reducedMotion.addEventListener('change', function () {
    if (reducedMotion.matches) {
      document.body.classList.remove('tab-hidden');
    }
  });

  /* --- Public API for other scripts (Phase 14 carousel needs this) --- */
  window.MeuPlanetinha = window.MeuPlanetinha || {};
  window.MeuPlanetinha.reducedMotion = reducedMotion;
})();
```

### base.css modifications (pseudo-element definitions)

Add after the `body { ... }` block in base.css:

```css
/* =========================================
   STARFIELD PSEUDO-ELEMENTS
   Stars split from body background for animation.
   Nebulae stay on body (static); stars on ::before/::after (animated).
   Animation applied in animacoes.css.
   ========================================= */

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 200vw;
  height: 200vh;
  height: 200dvh;
  pointer-events: none;
  z-index: -1;

  /* Near stars: bright, sparse, larger */
  background-image:
    radial-gradient(1.5px 1.5px at 40px  70px,  rgba(255,255,255,0.9), transparent),
    radial-gradient(2px   2px   at 180px 110px, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 60px  50px,  rgba(176,196,255,0.7), transparent),
    radial-gradient(1.5px 1.5px at 30px 180px, rgba(255,228,181,0.5), transparent);
  background-size:
    300px 280px,
    350px 320px,
    220px 240px,
    310px 340px;
  background-repeat: repeat;
}

body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 200vw;
  height: 200vh;
  height: 200dvh;
  pointer-events: none;
  z-index: -1;

  /* Far stars: dim, dense, smaller */
  background-image:
    radial-gradient(1px 1px at 20px  30px,  #FFFFFF, transparent),
    radial-gradient(1px 1px at 65px  88px,  rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 130px 45px,  rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 85px  140px, #FFFFFF, transparent),
    radial-gradient(1px 1px at 110px 90px,  rgba(255,228,181,0.6), transparent),
    radial-gradient(1px 1px at 200px 160px, rgba(176,196,255,0.5), transparent);
  background-size:
    150px 170px,
    200px 200px,
    180px 220px,
    250px 190px,
    260px 260px,
    280px 300px;
  background-repeat: repeat;
}
```

And the body's background-image is trimmed to keep only the 7 nebulae layers (remove the 10 star layers and their corresponding background-size/background-repeat entries).

---

## Token Updates

| Token | Current Value | New Value | Reason |
|-------|--------------|-----------|--------|
| `--anim-drift-duracao` | `18s` | `35s` | User decided 30-45s; 35s is the midpoint. 18s is too fast for "gentle drift." |

All other tokens are correct:
- `--anim-float-duracao: 4s` → matches 4-5s range ✓
- `--anim-float-distancia: 6px` → matches 4-6px range ✓
- `--anim-sparkle-duracao: 1.8s` → base sparkle duration (individual sparkles vary ±0.5s via inline style) ✓

---

## Open Questions

These need runtime testing — cannot be determined by code review alone:

1. **dvh unit + 200dvh on iOS Safari:** Does `position: fixed; height: 200dvh` work correctly in mobile Safari, or does the dynamic viewport unit cause visual stuttering during toolbar show/hide? Fallback is `200vh` which is slightly over- or under-sized but acceptable.

2. **Starfield visual density after split:** The 10 star layers are being split into two groups (4 near + 6 far). The near stars move slower and the far stars move faster. Test whether the visual density feels right or if layers need to be redistributed between pseudo-elements.

3. **Planet float + hover override timing:** When hovering a center planet, the transform animation is overridden by `scale(1.05)`. Test whether the transition back from hover to float animation is smooth or jarring. If jarring, consider removing the hover transform in Phase 13 (it'll be replaced in Phase 14 anyway).

4. **Sparkle z-stacking in carousel:** Sparkles are `position: absolute; z-index: 0` inside the carousel container. They need to appear behind the planet cards but above the background. Test whether `z-index: 0` is correct or needs adjustment relative to the `.planet-card` z-index values.

5. **will-change on body pseudo-elements:** `body::before` and `body::after` with `will-change: transform` each create a GPU layer of 200vw × 200vh size. On low-end mobile devices with small GPU memory budgets, this could be expensive. Test on a throttled device. If problematic, reduce to `150vw × 150vh` (translating 33.3% instead of 50%).

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `estilos/animacoes.css` | All @keyframes definitions, animation application rules, .tab-hidden pause rule |
| `scripts/animacoes.js` | Page Visibility API handler, reduced-motion JS guard, public API on `window.MeuPlanetinha.reducedMotion` |

### Modified Files
| File | Changes |
|------|---------|
| `estilos/base.css` | (1) Update `--anim-drift-duracao` from `18s` to `35s`. (2) Remove 10 star gradient layers from `body` background-image (keep 7 nebulae). (3) Remove corresponding star entries from background-size and background-repeat. (4) Add `body::before` and `body::after` pseudo-element rules with the star layers. (5) Remove `background-attachment: fixed` from body (nebulae use `background-size: 100% 100%` + no-repeat which pins them to body anyway; body is never scrolled independently since it's `min-height: 100vh` and the page scrolls). Actually — keep `background-attachment: fixed` on body for the nebulae; it's not being transformed so it still works. |
| `index.html` | (1) Add `<link rel="stylesheet" href="estilos/animacoes.css">` after base.css in head. (2) Add `<script src="scripts/animacoes.js"></script>` after components.js. (3) Add 7 sparkle `<span>` elements inside `#carousel > .container` after the carousel-announcer div. |
| `explorar/explorar.html` | Add `<link>` for animacoes.css + `<script>` for animacoes.js (starfield drift + visibility pause are global) |
| `sobre_nos/sobre_nos.html` | Same — add animacoes.css + animacoes.js |
| `404.html` | Same — add animacoes.css + animacoes.js |

### NOT Modified
| File | Reason |
|------|--------|
| `estilos/carousel.css` | No changes — planet float is applied via animacoes.css; existing hover transition is left as-is |
| `scripts/carousel.js` | No changes — carousel is purely transition-based, not animation-based; visibility API pauses CSS animations only |
| `scripts/homepage.js` | No changes — no animations to manage |
| `components/components.js` | No changes — component injection unrelated |
