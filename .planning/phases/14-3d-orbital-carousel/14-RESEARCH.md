# Phase 14 — 3D Orbital Carousel: RESEARCH

> Researched 2026-03-06 by gsd-phase-researcher agent  
> Target: Replace v1 flat carousel with CSS 3D perspective ring

---

## 1. CSS 3D Carousel Ring Architecture

### 1.1 The Three-Layer Container Model

A CSS 3D carousel requires three nested layers:

```
.carousel-scene            ← perspective container (sets viewing distance)
  .carousel-orbit          ← preserve-3d ring (rotated as a whole)
    .planet-card × 5       ← positioned via rotateY + translateZ
```

**Scene container** — provides the vanishing point:
```css
.carousel-scene {
  perspective: 700px;            /* exaggerated depth per user decision */
  perspective-origin: 50% 50%;   /* center vanishing point */
  overflow: visible;             /* CRITICAL: never hidden (Safari P-01) */
}
```

**Orbit ring** — the actual 3D rotating element:
```css
.carousel-orbit {
  transform-style: preserve-3d;
  transform: rotateX(-25deg) rotateY(var(--orbit-angle, 0deg));
  transition: transform 600ms ease-out;
}
```

**Planet cards** — each positioned at a fixed angular offset around the ring:
```css
.planet-card:nth-child(1) { transform: rotateY(0deg)   translateZ(var(--orbit-radius)); }
.planet-card:nth-child(2) { transform: rotateY(72deg)  translateZ(var(--orbit-radius)); }
.planet-card:nth-child(3) { transform: rotateY(144deg) translateZ(var(--orbit-radius)); }
.planet-card:nth-child(4) { transform: rotateY(216deg) translateZ(var(--orbit-radius)); }
.planet-card:nth-child(5) { transform: rotateY(288deg) translateZ(var(--orbit-radius)); }
```

### 1.2 CSS Custom Property Animation Driver Pattern

This is the cornerstone of the architecture. Instead of JS manipulating individual planet transforms:

1. **JS owns one single value**: `--orbit-angle` (a `deg` value set on `.carousel-orbit`)
2. **CSS handles everything else**: each planet's world position is derived from the orbit rotation
3. **Transition is CSS-native**: `transition: transform 600ms ease-out` on `.carousel-orbit`

**How it works per step:**
```js
// JS: rotate orbit by -72deg per "next" click
orbitAngle -= 72;
orbit.style.setProperty('--orbit-angle', orbitAngle + 'deg');
```

```css
/* CSS: the orbit ring reads the custom property */
.carousel-orbit {
  transform: rotateX(-25deg) rotateY(var(--orbit-angle, 0deg));
  transition: transform 600ms ease-out;
}
```

The browser's CSS transition engine interpolates the `rotateY` value smoothly. All five planets move together because they're children of the rotating orbit ring — no per-planet JS animation needed.

**Key benefit**: Only 1 DOM style mutation per navigation step (setting `--orbit-angle`). All visual positioning, scaling, opacity changes derive from the natural 3D transform pipeline.

### 1.3 Tilted Elliptical Orbit

The "elliptical" look comes from viewing a circular ring at an angle:

```css
.carousel-orbit {
  transform: rotateX(-25deg) rotateY(var(--orbit-angle, 0deg));
}
```

- `rotateX(-25deg)` tilts the ring forward — planets at the "back" appear higher and smaller, planets at the "front" appear lower and larger
- The negative value tilts the top away from the viewer, creating the impression that back planets are above and distant
- The combination of perspective + tilt creates a natural elliptical appearance — the ring IS circular in 3D space, but the perspective projection makes it look elliptical in 2D

**Why -25deg specifically?** User decision says "gentle (~25°)" — the ring is mostly horizontal with subtle depth. A steeper angle (60°+) would make the ring look like a vertical hoop; 25° keeps planets roughly on a horizontal band with visible front/back depth separation.

### 1.4 Perspective Value and Side-Planet Scaling

The `perspective` CSS property controls how dramatic the 3D depth appears:

- **`perspective: 1200px`** (current token) = mild depth, back/front planets nearly same size
- **`perspective: 700px`** (target) = exaggerated depth, front planet dominates
- **`perspective: 400px`** = extreme fisheye distortion

**Math for side-planet scaling:**

The apparent size of an element at depth `z` from the perspective plane is:
$$\text{scale} = \frac{p}{p - z}$$

Where $p$ = perspective value, $z$ = element's z-offset from the transform origin.

For 5 planets at 72° intervals with orbit radius $r$:
- **Front planet** (0°): $z = +r$ → scale = $\frac{p}{p - r}$
- **Side planets** (±72°): $z = r \cdot \cos(72°) = r \cdot 0.309$ → scale = $\frac{p}{p - 0.309r}$
- **Back planets** (±144°): $z = r \cdot \cos(144°) = -r \cdot 0.809$ → scale = $\frac{p}{p + 0.809r}$

With $p = 700$, $r = 300$:
- Front: $700 / (700 - 300) = 1.75×$ 
- Side: $700 / (700 - 92.7) = 1.15×$
- Back: $700 / (700 + 242.7) = 0.74×$

**Relative to front**: side = 1.15/1.75 = **65.7%** ✅ (matches ~65% requirement)

So with `perspective: 700px` and `--orbit-radius: 300px`, side planets naturally appear at ~65% of front planet size via pure CSS perspective. No JS size manipulation needed.

**Recommendation**: Use `perspective: 700px` with `--orbita-raio: 300px`. Tune slightly if the ratio needs adjustment (±50px on either value).

### 1.5 Counter-Rotation for Upright Labels

Because the orbit ring rotates, planet cards rotate WITH it. To keep planet labels/spheres facing the viewer, each card needs a counter-rotation:

```css
.planet-card {
  /* After orbit positions the card, un-rotate it to face viewer */
  backface-visibility: hidden; /* optional: hide when fully behind */
}
```

**However**, for this carousel the counter-rotation is not applied via a CSS calc on each card — it would be overly complex. Instead:

**Approach A (recommended)**: Each `.planet-card` gets an inline or nth-child rotateY that positions it AND the global orbit-angle counter-rotates them. Because the orbit ring itself contains the rotateY, cards stay at their relative positions. The cards DON'T individually counter-rotate — the `.planet-info` labels are part of the 3D space. This means labels on side planets will appear slightly perspective-skewed, which adds to the 3D feel.

**Approach B (if labels must be flat)**: Apply a counter-rotation on `.planet-info` only:
```css
.planet-card:nth-child(1) .planet-info {
  transform: rotateY(calc(-1 * (0deg + var(--orbit-angle, 0deg))));
}
```
This is complex and may cause Safari issues with nested transforms. **Not recommended** unless the angled labels are unacceptable visually.

**Recommendation for this project**: Let the planet spheres exist in 3D space naturally. Since the tilting is gentle (25°), labels won't be dramatically skewed. The 3D immersion > label readability concern for a children's space theme.

---

## 2. Back-Planet Visual Treatment

### 2.1 The Angular Offset Problem

Each planet's visual treatment (opacity, blur, label visibility, clickability) depends on its angular distance from the front-center position. The challenge: **CSS alone cannot inspect the computed rotateY angle of a child element** and conditionally apply styles.

### 2.2 Approach: JS Sets Per-Planet Data Attributes

The most reliable pattern for this carousel:

```js
function updatePlanetStates(currentIndex) {
  const offsets = [0, 1, 2, 2, 1]; // distance from center in "steps"
  // For currentIndex=0: planet0=center,1=side,2=back,3=back,4=side
  
  cards.forEach((card, i) => {
    const rel = (i - currentIndex + 5) % 5; // 0=center,1=right-side,2=right-back,3=left-back,4=left-side
    const zone = rel === 0 ? 'center' 
               : (rel === 1 || rel === 4) ? 'side' 
               : 'back';
    card.dataset.orbitZone = zone; // 'center', 'side', 'back'
  });
}
```

Then CSS uses attribute selectors for styling:

```css
/* Front-center: full visibility */
.planet-card[data-orbit-zone="center"] {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

/* Side planets: slightly faded, clickable */
.planet-card[data-orbit-zone="side"] {
  opacity: 0.7;
  filter: blur(0);
  pointer-events: auto;
  cursor: pointer;
}

/* Back planets: ghostly, non-interactive */
.planet-card[data-orbit-zone="back"] {
  opacity: 0.3;
  filter: blur(2.5px);
  pointer-events: none;
}

/* Hide labels on back planets */
.planet-card[data-orbit-zone="back"] .planet-info {
  visibility: hidden;
}
```

### 2.3 Why Not Pure CSS `calc()` on Angles?

In theory, you could compute each planet's z-position via:
```css
--planet-z: calc(cos(var(--planet-base-angle) + var(--orbit-angle)) * var(--orbit-radius));
```

And then conditionally apply opacity based on z. **However:**

1. CSS `cos()`/`sin()` are supported in modern CSS (since 2023), but **there's no way to conditionally apply a `filter: blur()` based on a computed value** — CSS has no `if/then` or `@when` for property values.
2. You could use `clamp()` with `cos()` for opacity:
   ```css
   opacity: clamp(0.3, calc(0.5 + 0.5 * cos(var(--planet-base-angle) + var(--orbit-angle))), 1);
   ```
   This works for a **continuous gradient** of opacity but doesn't give discrete zones (center vs side vs back).

3. Blur cannot be smoothly interpolated via CSS trig functions — `filter: blur(calc(...))` is valid but gives a continuous blur, not the desired discrete "none / none / 2.5px" zones.

**Verdict**: JS must set `data-orbit-zone` or equivalent per-planet custom properties. This is minimal (5 dataset writes per navigation step alongside the single `--orbit-angle` write). The "CSS Custom Property Animation Driver" pattern still holds — JS drives the orbit angle and zone states; CSS handles all visual rendering.

### 2.4 Smooth Zone Transitions

When a planet transitions from "side" to "back", the opacity/blur change should animate smoothly. Apply transitions on the planet cards:

```css
.planet-card {
  transition: opacity 600ms ease-out, filter 600ms ease-out;
}
```

This syncs with the orbit rotation duration (600ms). The data-attribute change is instant, but the CSS transition smooths the visual change.

**Important timing**: JS should set `data-orbit-zone` attributes BEFORE setting `--orbit-angle`, so the opacity/blur transitions begin simultaneously with the rotation.

---

## 3. Safari `preserve-3d` Pitfalls

### 3.1 Things That Break `preserve-3d` in Safari/WebKit

Safari has known issues where `transform-style: preserve-3d` is "flattened" (silently reverts to `flat`) when certain properties are set on the preserve-3d element **or any of its ancestors**:

| Property | Breaks preserve-3d? | Details |
|----------|---------------------|---------|
| `overflow: hidden` | **YES** | Most common culprit. Any overflow clip on an ancestor flattens 3D children |
| `overflow: auto/scroll` | **YES** | Same as hidden — any non-visible overflow |
| `filter` (any value) | **YES** | `filter: blur()`, `filter: drop-shadow()`, etc. on the preserve-3d element or parent flattens children |
| `opacity < 1` | **In some cases** | Safari may create a compositing layer that flattens 3D. Opaque parents are safe |
| `clip-path` | **YES** | Creates a compositing context that flattens 3D |
| `mask` / `-webkit-mask` | **YES** | Same as clip-path |
| `mix-blend-mode` | **YES** | Creates a stacking context that can break 3D |
| `isolation: isolate` | **Possibly** | Creates a stacking context |
| `contain: paint/layout` | **YES** | Creates a paint containment that flattens 3D |
| `will-change: filter/opacity` | **Can trigger** | May create a compositing layer that interferes |

### 3.2 Audit of Current Ancestors

For the carousel, the DOM ancestry is:
```
<body>
  <main>
    <section#carousel>
      <div.container>
        <div.carousel-track>    ← currently has overflow: hidden!
          <div.planet-card>...
```

**Offenders found in current CSS:**

1. **`.carousel-track { overflow: hidden }`** — [carousel.css line 44](estilos/carousel.css#L44). THIS MUST BE REMOVED. In `carousel-3d.css`, the track (renamed to `.carousel-orbit` or kept as track) must have `overflow: visible`.

2. **`.container`** — no overflow set. ✅ Safe.

3. **`body::before / body::after`** — these are fixed-position pseudo-elements with `will-change: transform`. They don't affect the 3D context because pseudo-elements don't create containing blocks for their parent's children.

4. **Layout utility `.sr-only`** — [layout.css line 107](estilos/layout.css#L107) has `overflow: hidden` but this is on a separate utility class, not an ancestor. ✅ Safe unless misapplied.

### 3.3 Working Around Filter/Opacity on Individual Planets

The requirements say back planets need `filter: blur(2-3px)` and `opacity: 0.3`. This is safe as long as these are applied to the **planet-card children**, NOT to the orbit ring itself or its ancestors.

**Rule**: 
- ✅ `filter` on `.planet-card` (child of preserve-3d) — OK, affects that card only
- ❌ `filter` on `.carousel-orbit` (the preserve-3d element) — BREAKS 3D for all children
- ❌ `filter` on `.carousel-scene` or `.container` — BREAKS 3D

**Additional Safari safeguard**: Add explicit `transform-style: preserve-3d` to the orbit ring element AND verify no ancestor has `overflow` set to anything other than `visible`.

```css
/* Safari belt-and-suspenders */
.carousel-scene,
.carousel-scene .container,
#carousel {
  overflow: visible !important;
  transform-style: flat; /* don't accidentally inherit preserve-3d */
}

.carousel-orbit {
  transform-style: preserve-3d;
  /* DO NOT set filter, clip-path, or overflow on this element */
}
```

### 3.4 Testing Strategy

- Test on Safari (macOS) and iOS Safari — both use WebKit
- Look for "flat" rendering where all planets appear at the same size
- If planets render flat: use DevTools to check computed `transform-style` on the orbit ring — if it says `flat` despite being set to `preserve-3d`, an ancestor has a flattening property

---

## 4. Interaction Model

### 4.1 Three-Zone Click Model

The carousel has three interaction zones based on planet position:

| Zone | Planets | Click Action | Cursor |
|------|---------|--------------|--------|
| Center | Current front planet | Select/activate → dispatch `planet-selected` event, focus jogos heading | `pointer` |
| Side-Left | 1 planet left of center | Navigate to previous | `pointer` |
| Side-Right | 1 planet right of center | Navigate to next | `pointer` |
| Back (×2) | 2 rear-most planets | No interaction | `default` |

**Implementation via `data-orbit-zone`:**

```js
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    const zone = card.dataset.orbitZone;
    if (zone === 'center') {
      dispatchPlanetSelected(i);
    } else if (zone === 'side') {
      // Determine direction from relative position
      const rel = (i - currentIndex + 5) % 5;
      if (rel === 4) navigate(-1); // left-side → prev
      if (rel === 1) navigate(1);  // right-side → next
    }
    // zone === 'back' → do nothing (pointer-events: none also prevents this)
  });
});
```

### 4.2 Side Planet Clickability

Side planets are set with `pointer-events: auto` via CSS `[data-orbit-zone="side"]`. Back planets get `pointer-events: none`. This means:

- Click events naturally only fire on center + side planets
- The click handler determines direction based on relative index
- No need for hit-testing or bounding-box calculations — CSS handles the interactive surface

### 4.3 Touch Swipe on 3D-Transformed Elements

Touch events on 3D-transformed elements work normally — `touchstart`, `touchend` coordinates are in screen/client space, not 3D space. The existing swipe logic from v1 works unchanged:

```js
track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > SWIPE_THRESHOLD) {
    navigate(delta < 0 ? 1 : -1); // Fixed 1-planet advance per user decision
  }
}, { passive: true });
```

**Key**: The swipe target should be the **scene container** (outermost perspective element), not the orbit ring, because the orbit ring is transformed and may have unusual bounding boxes. Alternatively, attach to `#carousel` section itself.

**Fixed 1-planet swipe** (user decision): Each swipe advances exactly 1 planet regardless of velocity. This simplifies implementation — no velocity calculation or momentum physics needed.

### 4.4 Arrow Buttons — Adjacent to Side Planets

Per the requirement (CAROUSEL-04), arrows are positioned adjacent to side planets, not at page edges:

```css
.carousel-arrow--prev {
  position: absolute;
  /* Position relative to orbit container, near left-side planet */
  left: calc(50% - var(--orbita-raio) - 60px);
  top: 50%;
  transform: translateY(-50%);
}

.carousel-arrow--next {
  position: absolute;
  right: calc(50% - var(--orbita-raio) - 60px);
  top: 50%;
  transform: translateY(-50%);
}
```

The arrows should live **outside** the `.carousel-orbit` (not as 3D children) but inside the `.carousel-scene` or `.container` so they're positioned relative to the carousel layout, not the 3D space.

---

## 5. Accessibility Preservation

### 5.1 ARIA Attributes (Carry Forward from v1)

The v1 carousel has robust ARIA that must be preserved:

| Element | Attribute | Value | Notes |
|---------|-----------|-------|-------|
| `.carousel-track` / `.carousel-orbit` | `aria-roledescription` | `"carousel"` | Identifies semantics |
| `.carousel-track` / `.carousel-orbit` | `aria-label` | `"Planetas temáticos"` | Accessible name |
| Each `.planet-card` | `role` | `"group"` | Slide grouping |
| Each `.planet-card` | `aria-roledescription` | `"slide"` | Slide semantics |
| Each `.planet-card` | `aria-label` | `"Calculon — Matemática"` etc | Per-planet label |
| Non-center cards | `aria-hidden` | `"true"` | Hide from SR |
| Center card | `tabindex` | `"0"` | Focusable |
| Non-center cards | `tabindex` | `"-1"` | Not focusable |
| `.carousel-announcer` | `aria-live` | `"polite"` | SR announces changes |
| `.carousel-announcer` | `aria-atomic` | `"true"` | Read full text |

### 5.2 Screen Readers and `transform-style: preserve-3d`

**Good news**: CSS 3D transforms do NOT affect screen reader behavior. Screen readers read the DOM order, not the visual positioning. So:

- Planet cards are read in DOM order regardless of their 3D position
- `aria-hidden="true"` on non-center planets correctly hides them
- The `aria-live` announcer works identically — text content change triggers announcement

**No gotchas** with `preserve-3d` and screen readers. The accessibility layer is DOM-based, not visual.

### 5.3 Keyboard Navigation

Same as v1 — scoped to `#carousel` section:

- `ArrowLeft` → navigate(-1) → previous planet
- `ArrowRight` → navigate(1) → next planet
- `Home` → goTo(0) → first planet
- `End` → goTo(4) → last planet
- `Enter`/`Space` on center planet → dispatch `planet-selected`

The only change needed: update the `isAnimating` guard timeout from 300ms to 600ms to match the new transition duration.

### 5.4 `prefers-reduced-motion` (CAROUSEL-07 / P-09)

**CSS side**: Already handled by `base.css` global rule:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
This makes the orbit rotation snap instantly (0.01ms transition). ✅

**JS side** (P-09 — CSS alone is insufficient):
JS must ALSO respect reduced motion for the `isAnimating` timeout lock:

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getTransitionDuration() {
  return prefersReducedMotion.matches ? 0 : 600;
}

// Use in navigate():
setTimeout(() => { this.isAnimating = false; }, getTransitionDuration());
```

Listen for live changes:
```js
prefersReducedMotion.addEventListener('change', () => {
  // Update cached value — next navigation uses new duration
});
```

### 5.5 `planet-float` Animation in Reduced Motion

The planet-float (vertical bob) animation is already killed by the global `prefers-reduced-motion` rule. No additional work needed.

---

## 6. Performance & GPU Budget

### 6.1 Current `will-change` Usage

| Element | `will-change` value | Count | Source |
|---------|-------------------|-------|--------|
| `body::before` | `transform` | 1 | animacoes.css |
| `body::after` | `transform` | 1 | animacoes.css |
| **v1** each `.planet-card` (×5) | `transform, opacity, filter` | 5 | carousel.css |

**v1 total: 7 elements** — far exceeds the 3-4 budget (P-05). This is a known violation being fixed.

### 6.2 v2 Strategy

With 3D transforms, the browser automatically creates compositing layers for `preserve-3d` children. The key insight: **`will-change` may not be needed** on the orbit ring or planet cards because:

1. The orbit ring already has `transform-style: preserve-3d` — the browser creates a 3D rendering context
2. Planet cards are 3D-transformed children — browsers typically composite these automatically
3. The transition on `.carousel-orbit` triggers a compositor animation automatically

**Recommended approach:**

```css
/* Only add will-change to the orbit ring itself — NOT individual planets */
.carousel-orbit {
  will-change: transform; /* 1 element — orbit ring rotation is the animated property */
}
```

**Budget accounting:**
| Element | `will-change` | Count |
|---------|--------------|-------|
| `body::before` | `transform` | 1 |
| `body::after` | `transform` | 1 |
| `.carousel-orbit` | `transform` | 1 |
| **Total** | | **3** ✅ |

**DO NOT** add `will-change` to individual `.planet-card` elements. The 3D compositing context handles them.

### 6.3 Battery Drain (P-12)

The existing `animacoes.js` already handles `document.visibilitychange` by toggling `.tab-hidden` which pauses all animations. The 3D carousel has no auto-rotation, so it only animates when the user navigates. No additional battery drain concern.

However, the `planet-float` animation on each `.planet-sphere` is continuous. This is already handled by the `.tab-hidden` pause mechanism. ✅

### 6.4 `filter: blur()` Performance

`filter: blur()` on back planets (2 elements) does create a compositing layer per element. However:
- Only 2 elements have blur at any time
- Blur is static between navigations (not continuously animating)
- Transition between blur states (0 → 2.5px) is brief (600ms) and infrequent

**Risk**: LOW. The blur transitions happen only on user interaction, not continuously.

---

## 7. Token Reconciliation

### 7.1 Existing Tokens That Need Updating

| Token | Current Value | New Value | Reason |
|-------|--------------|-----------|--------|
| `--perspectiva-3d` | `1200px` | `700px` | User: "exaggerated" depth; math shows 700px gives ~65% side scaling |
| `--orbita-raio` | `220px` | `300px` | User: "wide/immersive" spread; larger radius fills section width |
| `--orbita-inclinacao` | `62deg` | `25deg` | User: "gentle (~25°)" tilt, mostly horizontal |

### 7.2 New Tokens Needed

```css
:root {
  /* ---- 3D Carousel Tokens (Phase 14) ---- */
  
  /* Updated existing tokens */
  --perspectiva-3d:         700px;     /* was 1200px — exaggerated depth */
  --orbita-raio:            300px;     /* was 220px — wide immersive spread */
  --orbita-inclinacao:      25deg;     /* was 62deg — gentle tilt */

  /* New tokens */
  --orbita-rotacao-duracao: 600ms;     /* smooth float per step */
  --orbita-easing:          ease-out;  /* decelerate to stop */
  --orbita-opacidade-fundo: 0.3;       /* ghostly rear planets */
  --orbita-blur-fundo:      2.5px;     /* depth-of-field on rear */
  --orbita-angulos:         5;         /* planet count (for calc) */
  --orbita-angulo-passo:    72deg;     /* 360 / 5 */
  
  /* Z-index for 3D layers */
  --z-orbit-scene:          10;        /* same as current --z-carousel */
  --z-orbit-arrows:         15;        /* arrows above 3D content */
}
```

### 7.3 Per-Planet Dot Colors (Already Exist)

The mini planet-colored dots already have tokens:
```css
--planeta-calculon-acento: #FFD43B;
--planeta-letrion-acento:  #E0B0FF;
--planeta-naturox-acento:  #00D4A0;
--planeta-terramund-acento:#FF8C42;
--planeta-globish-acento:  #00A3CC;
```

These are used by the v1 dot system and carry forward unchanged.

### 7.4 Token Update Strategy

The existing tokens `--perspectiva-3d`, `--orbita-raio`, `--orbita-inclinacao` are defined in `base.css` and currently only consumed by `carousel.css`. Updating them in-place in `base.css` is safe — no other files reference them. The update should happen as part of Phase 14 implementation.

---

## 8. HTML Structure Changes

### 8.1 Current Structure (v1)

```html
<section id="carousel" role="region" aria-label="Carrossel de planetas" data-active-planet="calculon" tabindex="0">
  <div class="container">
    <div class="carousel-track" aria-roledescription="carousel" aria-label="Planetas temáticos">
      <div class="planet-card" ...>...</div> <!-- ×5 -->
    </div>
    <button class="carousel-arrow carousel-arrow--prev" ...>...</button>
    <button class="carousel-arrow carousel-arrow--next" ...>...</button>
    <nav class="carousel-dots" ...>...</nav>
    <div class="carousel-announcer visually-hidden" ...></div>
    <span class="sparkle" ...></span> <!-- ×7 -->
  </div>
</section>
```

### 8.2 Proposed Structure (v2)

```html
<section id="carousel" role="region" aria-label="Carrossel de planetas" data-active-planet="calculon" tabindex="0">
  <div class="container">
    
    <!-- NEW: Perspective wrapper -->
    <div class="carousel-scene">
    
      <!-- RENAMED: carousel-track → carousel-orbit -->
      <div class="carousel-orbit" aria-roledescription="carousel" aria-label="Planetas temáticos">
        <div class="planet-card" data-planet="calculon" data-orbit-zone="center" role="group" aria-roledescription="slide" aria-label="Calculon — Matemática">
          <div class="planet-sphere planet-sphere--calculon"></div>
          <div class="planet-info">
            <span class="planet-name">Calculon</span>
            <span class="planet-subject">Matemática</span>
          </div>
        </div>
        <!-- ...4 more planet-cards... -->
      </div>

      <!-- Arrows INSIDE scene but OUTSIDE orbit (not 3D-transformed) -->
      <button class="carousel-arrow carousel-arrow--prev" aria-label="Planeta anterior" type="button" tabindex="-1">
        <span class="carousel-arrow-icon" aria-hidden="true">‹</span>
      </button>
      <button class="carousel-arrow carousel-arrow--next" aria-label="Próximo planeta" type="button" tabindex="-1">
        <span class="carousel-arrow-icon" aria-hidden="true">›</span>
      </button>
      
    </div><!-- /.carousel-scene -->

    <!-- Dots BELOW the scene container -->
    <nav class="carousel-dots" aria-label="Navegação do carrossel">
      <button class="carousel-dot" data-index="0" aria-label="Ir para Calculon" type="button" tabindex="-1"></button>
      <!-- ...4 more dots... -->
    </nav>

    <!-- SR announcer (unchanged) -->
    <div class="carousel-announcer visually-hidden" aria-live="polite" aria-atomic="true"></div>

    <!-- Sparkles (unchanged) -->
    <span class="sparkle" ...></span> <!-- ×7 -->

  </div>
</section>
```

### 8.3 Key Structural Changes

| Change | Reason |
|--------|--------|
| **Add `.carousel-scene` wrapper** | New perspective container. Provides `perspective: 700px` without putting it on `.container` (which has layout duties) |
| **Rename `.carousel-track` → `.carousel-orbit`** | Semantic clarity — it's an orbit ring, not a scrolling track. ARIA attributes carry over |
| **Add `data-orbit-zone` attributes** | JS sets these per navigation step for CSS zone-based styling |
| **Arrow icons: `◀`/`▶` → `‹`/`›`** | User decision: "minimal chevrons" instead of filled triangles |
| **Move arrows inside `.carousel-scene`** | So they position relative to the 3D stage, adjacent to side planets |
| **Keep dots OUTSIDE `.carousel-scene`** | Dots are below the 3D space (CAROUSEL-05: "tight below orbit container"), not part of the 3D scene |
| **Keep sparkles inside `.container`** | Sparkles use absolute positioning relative to container. They sit above the 3D scene via z-index but aren't 3D-transformed |

### 8.4 `overflow: hidden` Removal Audit

The v1 `.carousel-track` has `overflow: hidden` (line 44 of carousel.css). This MUST NOT carry over. The new `.carousel-orbit` must be `overflow: visible` (or unset, which defaults to visible).

Additionally, verify that `.container` has no overflow set — currently it doesn't. ✅

The `.carousel-scene` must explicitly NOT have `overflow: hidden`:
```css
.carousel-scene {
  overflow: visible; /* explicit for Safari safeguard */
}
```

### 8.5 CSS Link Change in `<head>`

In `index.html`, the stylesheet link changes from:
```html
<link rel="stylesheet" href="estilos/carousel.css">
```
To:
```html
<link rel="stylesheet" href="estilos/carousel-3d.css">
```

Similarly, the script tag changes from:
```html
<script src="scripts/carousel.js"></script>
```
To:
```html
<script src="scripts/carousel-3d.js"></script>
```

---

## 9. Additional Implementation Notes

### 9.1 Orbit Angle Wrapping

When navigating continuously in one direction, `--orbit-angle` accumulates (e.g., -72, -144, -216, ...). This is fine — CSS handles arbitrary rotation values. However, after many rotations the value becomes very large. Optionally normalize periodically:

```js
// Optional: normalize after each full loop
if (Math.abs(orbitAngle) >= 360) {
  orbitAngle = orbitAngle % 360;
  // Set without transition to avoid visual jump
  orbit.style.transition = 'none';
  orbit.style.setProperty('--orbit-angle', orbitAngle + 'deg');
  orbit.offsetHeight; // force reflow
  orbit.style.transition = '';
}
```

**Note**: This normalization can cause a visual jump if not handled carefully. It's only needed for extremely long sessions. For a children's educational site, it's likely unnecessary.

### 9.2 Responsive Considerations

The `--orbita-raio: 300px` works for desktop but may be too wide for mobile. Use media queries to adjust:

```css
@media (max-width: 768px) {
  :root {
    --orbita-raio: 200px;
    --perspectiva-3d: 600px;
  }
}

@media (max-width: 480px) {
  :root {
    --orbita-raio: 140px;
    --perspectiva-3d: 500px;
  }
}
```

The beauty of the token-driven approach: all planet positions auto-adjust because they reference the same custom properties.

### 9.3 Scene Container Height

The `.carousel-scene` needs an explicit height because the 3D-positioned children are taken out of normal flow:

```css
.carousel-scene {
  position: relative;
  height: 320px; /* enough for front planet + info label */
  /* adjust per breakpoint */
}
```

The orbit ring itself has zero intrinsic height (its children are 3D-positioned). The scene must set a height that accommodates the front-center planet (largest) plus its label.

### 9.4 Planet Card Transform Chain

Each planet card needs a carefully ordered transform chain:

```css
.planet-card:nth-child(1) {
  transform: rotateY(calc(0 * var(--orbita-angulo-passo))) translateZ(var(--orbita-raio));
}
```

The order matters:
1. `rotateY(angle)` — rotates the card's local coordinate system to its position on the ring
2. `translateZ(radius)` — pushes the card outward along its (now rotated) Z axis

This is the standard "rotate then translate" pattern for placing items in a 3D ring.

### 9.5 Orbit Ring Centering

The orbit ring should be centered in the scene:

```css
.carousel-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(calc(-1 * var(--orbita-inclinacao))) rotateY(var(--orbit-angle, 0deg));
  transition: transform var(--orbita-rotacao-duracao) var(--orbita-easing);
}
```

**Note**: `translate(-50%, -50%)` centers the orbit origin. This must come BEFORE the rotations in the transform chain.

### 9.6 Existing v1 Features to Preserve

A checklist of v1 behaviors that v2 must maintain:

- [x] `planet-selected` custom event on center planet click
- [x] `data-active-planet` attribute on `#carousel` section
- [x] Focus transfer to `#jogos .jogos-titulo` after planet selection
- [x] Dot active state with `--dot-color` inline custom property
- [x] `aria-current="true"` on active dot
- [x] `aria-hidden="true"` on non-center cards
- [x] `.carousel-announcer` text updates on every navigation
- [x] Keyboard scoping to `#carousel` section
- [x] Touch swipe on carousel area
- [x] High-contrast mode support (`forced-colors: active`)
- [x] Planet float animation (via `animacoes.css` — no changes needed)
- [x] Sparkle animations (independent of carousel — no changes needed)

---

## 10. Risk Summary & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Safari `preserve-3d` flattening | **HIGH** | Audit every ancestor for overflow/filter/clip-path. Add explicit `overflow: visible` to scene + orbit. Test on Safari early. |
| GPU budget exceeded | **MEDIUM** | Only `will-change: transform` on orbit ring (total: 3). No `will-change` on individual cards. |
| Side planet size ratio wrong | **LOW** | Math confirms ~65% at p=700, r=300. Easily tuned by adjusting token values. |
| Labels unreadable on tilted cards | **LOW** | 25° tilt is gentle; labels slightly perspective-skewed but readable. If problematic, add counter-rotation on `.planet-info` only. |
| Touch events misfire on 3D elements | **LOW** | Touch coordinates are screen-space, unaffected by 3D transforms. Attach listener to scene container. |
| Reduced-motion snap not working | **MEDIUM** | CSS global rule handles transitions. JS must also skip the `isAnimating` timeout. Both must be implemented. |
| `color-mix` fallback needed | **LOW** | Already handled in v1 carousel.css — planet sphere gradient fallbacks carry forward unchanged. |

---

## RESEARCH COMPLETE
