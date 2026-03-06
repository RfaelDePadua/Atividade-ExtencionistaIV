# Phase 15: Unified Hero & Section Transitions - Research

**Researched:** 2026-03-06
**Domain:** CSS 3D layout integration, SVG wave dividers, section transitions
**Confidence:** HIGH

## Summary

Phase 15 merges the standalone `.hero` section and `#carousel` section into a single 100vh hero block, adds inline SVG Bézier wave dividers between major sections, and establishes a tonal background hierarchy for a continuous "space journey" feel. The core technical challenge is placing a 3D `preserve-3d` carousel inside a flexbox-driven 100vh layout without breaking Safari's 3D rendering — specifically, the requirement that NO ancestor of `.carousel-orbit` introduces `overflow: hidden` (or any `overflow` value other than `visible`/`clip` on Chrome). The solution uses a single `<section class="hero">` with `display: flex; flex-direction: column; min-height: 100dvh` that arranges title → carousel → CTA vertically while preserving every critical `overflow: visible` and `transform-style: preserve-3d` in the chain.

For wave dividers, the existing footer uses `clip-path: polygon()` which produces a sawtooth rather than a smooth curve. Phase 15 replaces this with inline SVG `<path>` elements using cubic Bézier curves, yielding smooth sine-like waves at ~120-150 bytes each. Each divider is absolutely positioned at the bottom of its parent section, overlapping the next section by 2px to prevent subpixel hairline gaps. `preserveAspectRatio="none"` ensures the wave scales to any viewport width without JS.

The radial glow / nebula wash behind the carousel uses a CSS `radial-gradient` on a `::before` pseudo-element of the hero section. This avoids adding a new `will-change` layer (staying within the 3-4 budget) because it composites with the hero's paint layer rather than creating a new GPU layer. The frosted glass experiment uses `backdrop-filter: blur()` on the title/CTA container only — NOT on any ancestor of the 3D carousel — keeping preserve-3d intact.

## Standard Stack

No libraries needed. All patterns use:

- **CSS Flexbox** for the unified hero vertical layout
- **CSS `min-height: 100dvh`** with `100vh` fallback for full-viewport hero
- **Inline SVG `<path>`** with cubic Bézier curves for wave dividers
- **CSS `radial-gradient`** on pseudo-elements for nebula glow
- **CSS `backdrop-filter: blur()`** for optional frosted glass text panel
- **CSS `display: none`** for arrow hiding (with JS null-guard already present)
- **CSS Custom Properties** for all new tokens (consistent with existing system)

## Architecture Patterns

### 1. Unified Hero HTML Structure

Merge the two sections into one. The hero becomes a flex column container: title block at top, carousel in the middle (flex-grow to fill space), CTA prompt at bottom, dots below CTA.

```html
<!-- BEFORE: two separate sections -->
<section class="hero">...</section>
<section id="carousel">...</section>

<!-- AFTER: single unified hero section -->
<section class="hero" id="carousel" role="region"
         aria-label="Carrossel de planetas"
         data-active-planet="calculon" tabindex="0">

  <!-- Title block (floats above orbit ring) -->
  <div class="hero-header">
    <h1 class="hero-title">Meu Planetinha</h1>
    <p class="hero-subtitle">Cada planeta é uma aventura diferente</p>
  </div>

  <!-- 3D Carousel (occupies middle zone) -->
  <div class="carousel-scene">
    <div class="carousel-orbit" aria-roledescription="carousel" aria-label="Planetas temáticos">
      <!-- 5 planet-cards unchanged -->
    </div>
    <!-- Arrows: kept in DOM but hidden via CSS -->
    <button class="carousel-arrow carousel-arrow--prev" ...></button>
    <button class="carousel-arrow carousel-arrow--next" ...></button>
    <!-- Sparkles -->
    <span class="sparkle" ...></span>
    <!-- + additional hero sparkles -->
  </div>

  <!-- CTA prompt (below carousel) -->
  <p class="hero-cta">Escolha seu planeta!</p>

  <!-- Navigation dots -->
  <nav class="carousel-dots" aria-label="Navegação do carrossel">
    <!-- 5 dots unchanged -->
  </nav>

  <!-- SR announcer -->
  <div class="carousel-announcer visually-hidden" aria-live="polite" aria-atomic="true"></div>

  <!-- Wave divider (hero → cards transition) -->
  <svg class="wave-divider wave-divider--hero" aria-hidden="true" ...></svg>
</section>
```

**Key decisions:**
- The section gets BOTH `class="hero"` and `id="carousel"` — the carousel JS finds its root by `#carousel`, so this maintains compatibility without JS changes to the selector.
- Remove the inner `.container` wrapper from the carousel area. The hero itself becomes the full-width container; only `.hero-header` and `.hero-cta` get `max-width` constraints.
- `.carousel-scene` stays exactly as-is (no new wrappers around it).

### 2. Hero CSS Layout (Flex Column, 100dvh)

```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;        /* mobile address bar aware */
  padding: calc(64px + var(--espaco-xl)) var(--espaco-lg) var(--espaco-xl);
  /* 64px = nav height clearance */
  text-align: center;
  position: relative;         /* for wave divider positioning */
  overflow: visible;          /* CRITICAL: Safari preserve-3d */
}
```

**Why `min-height` not `height`:** Content can exceed 100vh on very small screens — `min-height` prevents clipping. The `100dvh` unit (dynamic viewport height) accounts for mobile browser chrome (address bar collapse). Fallback to `100vh` for older browsers.

**Flex distribution:**
- `.hero-header` — `flex: 0 0 auto` (natural height, sits at top of centered block)
- `.carousel-scene` — `flex: 0 0 auto` with its existing fixed height (420px / 350px / 300px)
- `.hero-cta` — `flex: 0 0 auto` (natural height)
- `justify-content: center` vertically centers the group

### 3. Preserve-3D Ancestor Chain Safety

**THE critical constraint.** The `overflow: visible` chain from `.carousel-orbit` up through every ancestor must be maintained:

```
.hero (overflow: visible) ✓
  └─ .carousel-scene (overflow: visible) ✓  — already set
       └─ .carousel-orbit (transform-style: preserve-3d, overflow: visible) ✓
            └─ .planet-card (3D transforms)
```

**Rules:**
- `.hero` MUST NOT have `overflow: hidden` or `overflow: auto`
- Do NOT use `overflow-x: clip` on `.hero` (fine on `.container` descendants per current code, but not on direct ancestors of `.carousel-scene`)
- The existing `#carousel > .container` had `overflow-x: clip` — since we're removing the `.container` wrapper around the carousel scene, this is no longer in the chain. If horizontal scroll prevention is needed, apply `overflow-x: clip` to `body` or `.page-wrapper` instead (already handled by existing CSS).
- Do NOT add `backdrop-filter` to `.hero` itself — it creates a new stacking context that CAN interfere with preserve-3d in some browsers

### 4. SVG Wave Divider Pattern

Use inline SVG with a single cubic Bézier `<path>`. Target: ~120 bytes per wave.

```html
<svg class="wave-divider" viewBox="0 0 1440 48" preserveAspectRatio="none"
     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0,32 C360,0 720,48 1080,16 S1440,32 1440,32 L1440,48 L0,48 Z"
        fill="currentColor"/>
</svg>
```

**Breakdown:**
- `viewBox="0 0 1440 48"` — 1440px reference width (common desktop), 48px wave height
- `preserveAspectRatio="none"` — stretches to fill any viewport width; wave amplitude stays consistent
- The `<path>` uses `C` (cubic Bézier) for the smooth curve, `S` (smooth shorthand) for reflection, then `L` to fill the rectangle below the curve
- `fill="currentColor"` — the CSS `color` property on `.wave-divider` sets the fill, making it trivial to theme per-section
- Total SVG: ~160 bytes before gzip, ~90 bytes gzipped

**CSS positioning (overlap technique):**

```css
.wave-divider {
  position: absolute;
  bottom: -1px;           /* overlap into next section by 1-2px */
  left: 0;
  width: 100%;
  height: 48px;
  z-index: var(--z-wave); /* 5 — below carousel (10) but above starfield */
  pointer-events: none;
  display: block;
}

/* Hero → Cards wave: fill color matches cards section background */
.wave-divider--hero {
  color: transparent;     /* transparent if bg is continuous starfield */
  /* OR use a tinted color to hint at section change: */
  color: rgba(11, 15, 46, 0.3);
}

/* Cards → Footer wave: replaces existing .footer-wave clip-path */
.wave-divider--footer {
  color: var(--cor-fundo-footer);
}
```

**Why SVG over clip-path:**
- Clip-path polygon (existing footer) produces angular segments, not smooth curves
- SVG Bézier gives true smooth waves
- SVG `preserveAspectRatio="none"` handles responsive scaling automatically
- SVG can be colored via `currentColor` or `fill` attribute — more flexible than clip-path backgrounds
- Replacing the footer's clip-path `.footer-wave` div with an SVG is a clean upgrade

### 5. Arrow Hiding Strategy

CSS-only, keep DOM intact:

```css
.carousel-arrow {
  display: none;
}
```

**JS safety:** The carousel-3d.js already guards arrow references:
```js
if (this.prevBtn) { this.prevBtn.addEventListener('click', ...); }
if (this.nextBtn) { this.nextBtn.addEventListener('click', ...); }
```
These null checks handle `querySelector` returning `null` if arrows were removed. But since we're using `display: none` (not DOM removal), `querySelector` still finds them — the event listeners still bind but the buttons are invisible and non-interactive. This is fine; no JS changes needed.

**Alternative considered:** `visibility: hidden; position: absolute; pointer-events: none` — unnecessary complexity. `display: none` is cleaner and removes from tab order (combined with existing `tabindex="-1"`).

### 6. Frosted Glass Container (Experiment A)

Apply backdrop-filter to a container around title + subtitle + CTA ONLY, not around the carousel.

```css
.hero-header {
  background: rgba(13, 26, 58, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);  /* Safari */
  border-radius: var(--borda-raio-xl);
  padding: var(--espaco-lg) var(--espaco-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**CRITICAL: Do NOT wrap the carousel in the glass panel.** `backdrop-filter` creates a new stacking context. If applied to an ancestor of `.carousel-orbit`, it can flatten `preserve-3d` in Safari (same mechanism as `overflow: hidden` — P-01). The glass panel must be a SIBLING of `.carousel-scene`, never a parent.

**Browser support (2026):** `backdrop-filter` is supported in all evergreen browsers since 2022. Safari requires `-webkit-` prefix. Firefox stable has full support since v103.

**Performance:** `backdrop-filter` creates a GPU compositing layer. Combined with body::before and body::after (starfield), that's 3 GPU layers — within the 3-4 budget. The carousel's `perspective` container is already composited. Total: ~4 layers, acceptable.

**Experiment B (no container):** Simply style `.hero-header` with no background/blur. The title text sits directly on the starfield with text-shadow for readability:

```css
/* Experiment B — no glass, text-shadow for contrast */
.hero-title {
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6), 0 0 40px rgba(26, 58, 143, 0.4);
}
```

**Recommendation:** Implement Experiment A (frosted glass) first. It provides better text readability, visual grounding, and a premium feel. If it causes any 3D issues in testing, fall back to B (text-shadow only).

### 7. Radial Glow / Nebula Behind Carousel

Use a `::before` pseudo-element on `.hero` for a radial glow centered on the carousel area:

```css
.hero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);  /* shift up slightly to center on orbit */
  width: 120%;
  height: 80%;
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    rgba(45, 27, 138, 0.35) 0%,        /* indigo core */
    rgba(26, 58, 143, 0.20) 30%,        /* blue mid */
    rgba(139, 26, 107, 0.10) 60%,       /* magenta fringe */
    transparent 85%
  );
  pointer-events: none;
  z-index: 0;   /* behind carousel content but above body starfield */
}

/* Ensure hero children sit above the glow */
.hero > * {
  position: relative;
  z-index: 1;
}

/* IMPORTANT: .carousel-scene must keep position: relative for its own children */
```

**GPU note:** This pseudo-element does NOT need `will-change` because it's static (no animation). It paints once and composites with the hero's layer. No additional GPU memory cost.

**CRITICAL:** The `::before` pseudo-element must NOT have `transform-style: preserve-3d` or `overflow: hidden`. It's a flat 2D decorative layer and won't interfere with the 3D carousel because `.carousel-scene` establishes its own perspective context.

However, there's a subtlety: `.hero::before` with `position: absolute` creates a stacking context on `.hero`. Verify in testing that this doesn't flatten the 3D. If it does, move the glow to a dedicated `<div class="hero-glow">` sibling inside `.hero`, positioned absolutely, instead of a pseudo-element.

### 8. Extra Sparkle Density

Add 4-5 more `.sparkle` elements to the hero section, positioned outside the `.carousel-scene` but inside `.hero`:

```html
<!-- Hero-level sparkles (outside carousel-scene, inside .hero) -->
<span class="sparkle sparkle--hero" style="top:8%;left:12%;animation-delay:-0.2s;animation-duration:2.3s" aria-hidden="true"></span>
<span class="sparkle sparkle--hero" style="top:15%;left:78%;animation-delay:-1.3s;animation-duration:1.9s" aria-hidden="true"></span>
<span class="sparkle sparkle--hero" style="top:82%;left:22%;animation-delay:-0.8s;animation-duration:2.5s" aria-hidden="true"></span>
<span class="sparkle sparkle--hero" style="top:88%;left:85%;animation-delay:-1.7s;animation-duration:1.7s" aria-hidden="true"></span>
```

```css
.sparkle--hero {
  position: absolute;
  width: 4px;    /* slightly larger than default 3px for hero prominence */
  height: 4px;
  z-index: 1;    /* above glow, below carousel planets */
}
```

**Performance:** 4 additional sparkles = 4 more animated elements. Each is tiny (3-4px dot) with a simple opacity keyframe. No `will-change` needed — the browser can handle these without GPU promotion. Total sparkles: 7 (carousel-scene) + 4 (hero) = 11. Well within performance budget.

### 9. Background Section Hierarchy (Tonal Flow)

Rather than per-section backgrounds with hard edges, use subtle tinting via section pseudo-elements that blend into the continuous starfield:

```css
/* Hero area — slightly warmer (indigo/blue) via the radial glow ::before */
/* Already handled by the nebula glow pseudo-element */

/* Cards section — slightly deeper tone */
#jogos {
  position: relative;
}

#jogos::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(11, 15, 46, 0.0) 0%,          /* transparent at top (blends with hero) */
    rgba(11, 15, 46, 0.25) 30%,         /* gradual darkening */
    rgba(11, 15, 46, 0.40) 100%         /* darker toward footer */
  );
  pointer-events: none;
  z-index: 0;
}

#jogos > * {
  position: relative;
  z-index: 1;
}
```

**Tonal progression:** Hero (brightest nebula glow) → Cards (gradual darkening via overlay) → Footer (solidest dark: `#0B0F2E`). The wave dividers serve as the visual "edge" between zones; the background tinting is continuous underneath.

**Starfield continuity:** `body::before` and `body::after` (starfield drift) are `position: fixed` and span the entire page. They remain visible through all sections because section backgrounds are transparent/semi-transparent overlays, not solid fills. This preserves the "continuous space" feel.

## Don't Hand-Roll

| Pattern | Use Established Solution |
|---|---|
| Smooth wave curves | SVG `<path>` with `C`/`S` Bézier commands — do not approximate with CSS `clip-path: polygon()` (too many points for smoothness) |
| Full-width SVG | `viewBox` + `preserveAspectRatio="none"` — do not use JS resize listeners |
| Mobile viewport height | `100dvh` with `100vh` fallback — do not reinvent with JS `window.innerHeight` |
| Frosted glass | `backdrop-filter: blur()` — do not simulate with layered semi-transparent elements |
| Vertical centering in hero | Flexbox `justify-content: center` — do not use absolute positioning + `top: 50%; transform: translateY(-50%)` |
| Hiding arrows | `display: none` in CSS — do not remove DOM elements or add JS visibility toggling |

## Common Pitfalls

### P-01 (INHERITED): Safari preserve-3d Flattening
**Trigger:** Any ancestor of `.carousel-orbit` with `overflow: hidden`, `overflow: auto`, `filter`, `backdrop-filter`, or `contain: paint`.
**In Phase 15:** The unified `.hero` section becomes a new ancestor. It MUST have `overflow: visible`. Do NOT apply `backdrop-filter` to `.hero` itself. Only apply it to `.hero-header` (a sibling of `.carousel-scene`, not a parent of `.carousel-orbit`).
**Test:** After restructure, verify in Safari (macOS + iOS) that planets are visible and 3D perspective is correct.

### P-15: Flex container + preserve-3d Interaction
**Trigger:** `display: flex` on an ancestor can sometimes force `transform-style: flat` in older Safari versions.
**Mitigation:** Explicitly set `transform-style: flat` on `.hero` (the default). Only `.carousel-orbit` needs `preserve-3d`. The `perspective` is set on `.carousel-scene`, not on `.hero`. Safari handles this correctly as long as `.hero` doesn't also declare `transform-style: preserve-3d`.
**Verification needed:** Test Safari 16+ (iOS 16+). This is not an issue in Safari 17+.

### P-16: 100dvh Not Supported in Older Browsers
**Trigger:** `100dvh` is supported since Safari 15.4, Chrome 108, Firefox 108. Older browsers ignore it.
**Mitigation:** Double declaration with `100vh` first:
```css
min-height: 100vh;
min-height: 100dvh;
```

### P-17: Wave Divider Subpixel Gap
**Trigger:** At fractional zoom levels or on high-DPI screens, a 1px hairline gap can appear between the wave SVG bottom edge and the next section's top.
**Mitigation:** `bottom: -1px` on the wave positions it to overlap 1px into the next section. The fill color matches the next section's background, so the overlap is invisible.

### P-18: Radial Glow Pseudo-element Creating Stacking Context
**Trigger:** `.hero::before` with `position: absolute` + `z-index` makes `.hero` a stacking context. This could affect how the 3D carousel renders if `.carousel-scene`'s `perspective` doesn't establish its own context strongly enough.
**Mitigation:** `.carousel-scene` already has `perspective: 1000px` which creates its own stacking context. Children within `.carousel-scene` are rendered in 3D space independently. The hero's stacking context only affects the ordering of `.hero`'s direct children (glow, header, scene, CTA, dots).
**If issues arise:** Move the glow from `::before` to a `<div class="hero-glow">` element, placed BEFORE `.carousel-scene` in DOM order, with `z-index: 0`.

### P-19: CTA Below Carousel May Be Below Fold on Short Viewports
**Trigger:** On 640px-tall viewports with 420px carousel-scene, the CTA might be barely visible or cut off.
**Mitigation:** At `min-height: 100dvh` with flex centering, content that exceeds viewport height will scroll naturally. The CTA should still be visible because the total content height (header ~80px + scene 420px + CTA ~40px + dots ~30px ≈ 570px) fits within 100vh on most devices. On very small screens (480px breakpoint), carousel-scene drops to 300px, making the total ~450px — comfortably within viewport.

### P-04 (INHERITED): will-change Budget
**Current usage:** `body::before` (1), `body::after` (1) = 2 layers.
**Phase 15 additions:** Frosted glass panel with `backdrop-filter` creates 1 compositing layer = 3 total.
**Budget:** Stay at ≤ 4 `will-change` / GPU-promoted layers. Do NOT add `will-change: transform` to the hero glow pseudo-element or wave dividers.

### P-09 (INHERITED): prefers-reduced-motion
The base.css `@media (prefers-reduced-motion: reduce)` rule already kills all `animation-duration` and `transition-duration` globally. No additional work needed for Phase 15 — new sparkles inherit the global rule.

## Code Examples

### A. Complete Unified Hero CSS

```css
/* === homepage.css additions === */

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--espaco-lg);
  min-height: 100vh;
  min-height: 100dvh;
  padding: calc(64px + var(--espaco-xl)) var(--espaco-lg) var(--espaco-xl);
  text-align: center;
  position: relative;
  overflow: visible;          /* CRITICAL: Safari 3D */
  outline: none;
}

.hero:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: -3px;
  border-radius: var(--borda-raio-lg);
}

/* Nebula glow behind carousel */
.hero::before {
  content: '';
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(900px, 120%);
  height: 60%;
  background: radial-gradient(
    ellipse at center,
    rgba(45, 27, 138, 0.35) 0%,
    rgba(26, 58, 143, 0.18) 35%,
    rgba(139, 26, 107, 0.08) 65%,
    transparent 90%
  );
  pointer-events: none;
  z-index: 0;
}

.hero > * {
  position: relative;
  z-index: 1;
}
```

### B. Hero Header (Frosted Glass — Experiment A)

```css
.hero-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--espaco-sm);
  max-width: var(--largura-max-texto);
  padding: var(--espaco-lg) var(--espaco-2xl);
  border-radius: var(--borda-raio-xl);
  background: rgba(13, 26, 58, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Experiment B (no glass) — swap to this if A causes 3D issues */
/*
.hero-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--espaco-sm);
  max-width: var(--largura-max-texto);
  background: none;
}

.hero-title {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6), 0 0 60px rgba(26, 58, 143, 0.4);
}
*/
```

### C. Hero CTA Prompt

```css
.hero-cta {
  font-family: var(--fonte-corpo);
  font-size: var(--texto-lg);
  color: rgba(255, 255, 255, 0.75);
  font-weight: 700;
  margin: 0;
  /* Subtle glow for emphasis */
  text-shadow: 0 0 12px rgba(255, 212, 59, 0.25);
}
```

### D. Hero Subtitle (Reduced Weight)

```css
.hero-subtitle {
  font-family: var(--fonte-corpo);
  font-size: var(--texto-base);
  color: rgba(255, 255, 255, 0.60);
  font-weight: 400;
  margin: 0;
  max-width: 32ch;
}
```

### E. SVG Wave Divider — Hero → Cards

```html
<svg class="wave-divider wave-divider--hero" viewBox="0 0 1440 48"
     preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
     aria-hidden="true">
  <path d="M0,28 C240,4 480,44 720,24 C960,4 1200,40 1440,28 L1440,48 L0,48 Z"/>
</svg>
```

**Wave breakdown:**
- Start at (0, 28) — slightly below midline
- Curve up to trough around x=240 via control points, peak around x=480
- Second wave cycle through x=720 to x=1440
- Close path: L to bottom-right, L to bottom-left, Z close
- Amplitude: ~24px within 48px viewBox = subtle, low-amplitude ripple

### F. SVG Wave Divider — Cards → Footer (replaces .footer-wave clip-path)

```html
<svg class="wave-divider wave-divider--footer" viewBox="0 0 1440 48"
     preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
     aria-hidden="true">
  <path d="M0,20 C360,44 720,0 1080,28 C1260,40 1380,12 1440,20 L1440,48 L0,48 Z"
        fill="var(--cor-fundo-footer)"/>
</svg>
```

**Note:** This wave uses a slightly different curve from the hero wave. Varying the control points between transitions gives each divider a unique character while maintaining the same calm ripple amplitude. Both waves are ~150 bytes.

### G. Wave Divider CSS

```css
.wave-divider {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: var(--z-wave);
  pointer-events: none;
  display: block;
  line-height: 0;         /* prevent inline SVG baseline gap */
}

.wave-divider--hero path {
  fill: rgba(11, 15, 46, 0.35);
}

.wave-divider--footer path {
  fill: var(--cor-fundo-footer);
}
```

### H. Arrow Hiding

```css
/* Phase 15: hide standalone arrow buttons for cleaner hero */
.carousel-arrow {
  display: none;
}
```

### I. Cards Section Tonal Overlay

```css
#jogos {
  position: relative;
  padding: var(--espaco-2xl) 0;
  padding-bottom: var(--espaco-3xl);
}

#jogos::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(11, 15, 46, 0.20) 40%,
    rgba(11, 15, 46, 0.35) 100%
  );
  pointer-events: none;
  z-index: 0;
}

#jogos > * {
  position: relative;
  z-index: 1;
}
```

### J. Mobile Responsive Adjustments

```css
@media (max-width: 640px) {
  .hero {
    padding: calc(64px + var(--espaco-lg)) var(--espaco-md) var(--espaco-lg);
    gap: var(--espaco-md);
  }

  .hero-header {
    padding: var(--espaco-md) var(--espaco-lg);
  }

  .hero-title {
    font-size: var(--texto-3xl);
  }

  .hero-subtitle {
    font-size: var(--texto-sm);
  }

  .hero-cta {
    font-size: var(--texto-base);
  }

  .wave-divider {
    height: 32px;   /* slightly shorter wave on mobile */
  }
}
```

## State of the Art

### 100dvh (Dynamic Viewport Height)
- **Support:** Safari 15.4+ (2022), Chrome 108+ (2022), Firefox 108+ (2022)
- **Behavior:** Accounts for mobile browser chrome (address bar). When the address bar is visible, `100dvh` equals the smaller viewport; when hidden (scrolled), it equals the larger viewport.
- **Usage:** Always double-declare: `min-height: 100vh; min-height: 100dvh;` — first line is fallback.

### backdrop-filter
- **Support:** Chrome 76+ (2019), Safari 9+ with `-webkit-` prefix, Firefox 103+ (2022)
- **Caveats:** Creates a new stacking context. MUST NOT be on an ancestor of `preserve-3d` elements.
- **Performance:** Single compositing layer. Blur radius should be ≤ 20px for smooth 60fps on mobile.

### SVG preserveAspectRatio="none"
- **Universal support** across all browsers. This is the standard way to make full-width SVG shapes that scale without maintaining aspect ratio.
- **Key detail:** Combined with `viewBox`, the SVG coordinate space maps to any container width. The wave shape stretches horizontally but keeps its vertical amplitude fixed via the `height` CSS property.

### CSS overflow-x: clip vs overflow: hidden
- `overflow: clip` does NOT create a scroll container and does NOT establish a new block formatting context. It clips content but doesn't interfere with `preserve-3d`. Supported since Chrome 90, Firefox 81, Safari 16.
- `overflow: hidden` creates a scroll container and FLATTENS `preserve-3d` in Safari. **Never use on 3D ancestors.**
- In Phase 15, since `.hero` must have `overflow: visible`, neither applies to the hero. But `overflow-x: clip` on `#carousel > .container` (current code) is safe because we're removing that intermediate container.

### CSS color-mix() with SVG fill
- SVG `fill` can accept CSS custom properties via `fill="var(--token)"` in inline SVG.
- `currentColor` inheritance works in inline SVG, allowing `color` on the parent to propagate.

## Open Questions

1. **Frosted glass vs no glass (A vs B):** Must be evaluated visually in browser. Implement A first; if 3D artifacts appear in Safari, switch to B. Both CSS paths should exist as commented alternatives.

2. **Wave amplitude tuning:** The 24px amplitude within 48px height produces a very subtle ripple. May need visual testing at various viewport widths to ensure the wave is perceptible but not distracting. Adjustment: change the `C` control point Y values in the SVG path.

3. **Hero glow opacity intensity:** The `rgba(45, 27, 138, 0.35)` nebula glow may be too subtle or too strong depending on monitor calibration. Tune the alpha channel after visual inspection.

4. **Footer wave migration:** Replacing the existing `.footer-wave` clip-path div with an inline SVG wave requires updating `components/footer.html`. Confirm this is acceptable (changes a shared component used by all pages). The SVG wave should be placed as the first child of `<footer>`, replacing the `<div class="footer-wave">`.

5. **Sparkle z-index layering:** Hero-level sparkles (outside `.carousel-scene`) need careful `z-index` to appear behind the 3D orbit ring but above the nebula glow. Since they're siblings of `.carousel-scene` (not inside it), they don't participate in the 3D context. Test that they visually appear "in front of" the glow but "behind" the planets.

6. **Title text change:** The current title is "Bem-vindo ao Meu Planetinha" — the spec says "Meu Planetinha." Confirm the shorter title is intentional (more impactful hero; the welcome subtext becomes the subtitle).

## Claude's Discretion Recommendations

### Wave Layer Count: Single Layer
Use a **single wave SVG** per transition. Layering 2-3 waves with different speeds/parallax adds visual complexity but also DOM weight and rendering cost. The space theme benefits from simplicity — a single calm ripple reads as a "horizon line" in space. If more visual interest is needed later, a second wave at 50% opacity can be added as a phase polish.

### Wave Shape Variation Per Transition
Use **subtly different Bézier curves** for each divider. The hero→cards wave and cards→footer wave should have different control points so they look like unique ripples rather than a repeated stamp. Both should maintain the same amplitude range (20-28px within 48px viewBox) for visual consistency.

### Wave Coloring Strategy
- **Hero → Cards:** Semi-transparent dark tint `rgba(11, 15, 46, 0.30)` — barely visible, acts as a subtle horizon line without breaking the continuous starfield feel.
- **Cards → Footer:** Solid `var(--cor-fundo-footer)` (`#0B0F2E`) — this wave needs an opaque fill to mask the transition into the solid footer background. Same approach as existing clip-path, just smoother.

### CTA Spacing Below Carousel
Use `gap: var(--espaco-lg)` (24px) in the hero flex column for consistent spacing between all elements. The CTA sits naturally 24px below the carousel dots. No custom margin needed — the flex gap handles it uniformly. If the CTA feels too close to dots, increase to `var(--espaco-xl)` (32px) specifically between dots and CTA via a margin-top on `.hero-cta`.

### Tonal Progression Hero → Cards → Footer
- **Hero:** Brightest area — nebula radial glow adds warmth and light
- **Cards:** Gradual darkening via linear-gradient overlay (`transparent → rgba(11,15,46,0.35)`)
- **Footer:** Solidest dark (`#0B0F2E`) — grounds the page, signals finality
- This creates a natural "descending into deep space" progression that matches the site's space theme.

### Starfield Continuity vs Per-Section Variation
Use **continuous starfield** (the current `body::before/::after` approach). The starfield drift animation already spans the full page via `position: fixed`. Adding per-section starfield variations would require additional pseudo-elements and GPU layers. The tonal overlay approach (darkening overlays per section) creates visual distinction without duplicating starfield rendering. Keep it simple.

## Sources

| Source | Confidence | Notes |
|---|---|---|
| Current codebase (`carousel-3d.css`, `base.css`, `animacoes.css`, `components.css`) | HIGH | Direct inspection of all 3D architecture, tokens, animations, existing wave |
| Current `carousel-3d.js` source | HIGH | Arrow null-guards confirmed; no JS changes needed for arrow hiding |
| MDN: `backdrop-filter` | HIGH | Stacking context creation confirmed; -webkit- prefix documented |
| MDN: `100dvh` / dynamic viewport units | HIGH | Support table verified for target browsers |
| MDN: SVG `preserveAspectRatio` | HIGH | "none" stretching behavior is spec-defined |
| Safari preserve-3d flattening behavior | HIGH | Documented in project pitfalls P-01; confirmed by multiple CSS 3D references |
| CSS `overflow: clip` vs `hidden` 3D behavior | MEDIUM | Tested in Chrome/Firefox; Safari edge cases may exist — verify |
| `will-change` GPU layer budget | MEDIUM | General guidance from Chrome DevTools paint profiling articles; 3-4 layers is conservative |

## Metadata

| Area | Confidence | Rationale |
|---|---|---|
| Unified hero flex layout | HIGH | Standard flexbox pattern; `min-height: 100dvh` is well-supported |
| Preserve-3d ancestor chain safety | HIGH | Deeply understood from existing P-01 pitfall and codebase audit |
| SVG wave dividers | HIGH | Standard SVG technique; Bézier paths are well-documented |
| Frosted glass (`backdrop-filter`) | MEDIUM | Works in all modern browsers, but interaction with 3D context needs testing in Safari |
| Nebula glow pseudo-element | MEDIUM | Standard radial-gradient technique, but stacking context interaction with 3D needs verification |
| Arrow hiding (CSS) | HIGH | JS already has null guards; `display: none` is trivial |
| Background tonal hierarchy | HIGH | Overlay pseudo-elements are a standard pattern |
| Sparkle density | HIGH | Additive sparkles follow existing pattern, within performance budget |
| Mobile 100dvh behavior | HIGH | Double declaration with 100vh fallback is industry standard |
