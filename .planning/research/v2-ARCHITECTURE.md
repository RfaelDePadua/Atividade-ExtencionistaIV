# Architecture — Meu Planetinha v2.0

> Research dimension: **ARCHITECTURE**
> Generated: 2026-03-05
> Status: Draft — ready for review before implementation

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GitHub Pages (Static Hosting)                                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  SITE SHELL (shared nav/footer via components.js fetch+inject)  │  │
│  │  ┌────────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐  │  │
│  │  │ index.html │  │explorar/  │  │sobre_nos/ │  │  404.html  │  │  │
│  │  │ (homepage) │  │explorar   │  │sobre_nos  │  │            │  │  │
│  │  │            │  │ .html     │  │ .html     │  │            │  │  │
│  │  └────┬───────┘  └─────┬─────┘  └───────────┘  └────────────┘  │  │
│  │       │                │                                        │  │
│  │  ┌────▼───────┐   ┌────▼─────┐                                  │  │
│  │  │  3D CSS    │   │ Game     │  ◄── v2.0 NEW                    │  │
│  │  │ Carousel   │   │ Card     │                                  │  │
│  │  │ (v2 orbit) │   │ Grid     │                                  │  │
│  │  └────┬───────┘   └────┬─────┘                                  │  │
│  │       │                │                                        │  │
│  │       │ planet-selected event                                   │  │
│  │       └───────►────────┘                                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  IFRAME GAME SHELL  ◄── v2.0 NEW                                │  │
│  │  jogos/jogar.html?jogo=contando-estrelas                        │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Site Header (shared nav)                                  │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  <iframe sandbox="allow-scripts allow-same-origin">  │  │  │  │
│  │  │  │  ┌────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │ Loading Screen → Game (Phaser / Canvas)        │  │  │  │  │
│  │  │  │  └────────────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────────────┘  │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │  Site Footer (shared footer)                               │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ANIMATION LAYER  ◄── v2.0 NEW                                  │  │
│  │  @keyframes in estilos/animacoes.css                            │  │
│  │  Starfield drift · Planet float · Particle effects              │  │
│  │  respects prefers-reduced-motion (base.css already resets)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  WAVE DIVIDERS  ◄── v2.0 NEW                                    │  │
│  │  Inline SVG / clip-path between sections                        │  │
│  │  Styled via estilos/componentes.css (new .wave-divider rules)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Responsibilities

| Component | Owner file(s) | Responsibility | v2.0 changes |
|---|---|---|---|
| **Component Loader** | `components/components.js` | Fetch nav.html + footer.html, inject via innerHTML, rewrite `data-href` links, detect active page, setup mobile menu | No changes — iframe shell page also uses this unchanged |
| **Nav** | `components/nav.html`, `components/components.css` | Skip link, logo, desktop links, CTA, hamburger + overlay | No changes |
| **Footer** | `components/footer.html`, `components/components.css` | Brand, tagline, contact link, decorative stars, wave top border | No changes |
| **Design Tokens** | `estilos/base.css` | CSS custom properties (palette, planet accents, typography, spacing, shadows, borders, transitions), base element styles, starfield background, `prefers-reduced-motion` reset | Add animation-duration tokens (`--duracao-lenta`, `--duracao-infinita`) |
| **Layout** | `estilos/layout.css` | `.container`, `.container-texto`, flex utilities | No changes |
| **Page Shell** | `estilos/pages/page-shell.css` | `.page-wrapper` flex-grow | No changes |
| **Homepage CSS** | `estilos/pages/homepage.css` | Hero section styles | Minor: wave divider integration between hero↔carousel, carousel↔jogos |
| **Carousel CSS** | `estilos/carousel.css` | Track, planet cards (5 position classes), spheres, arrows, dots, responsive | **REPLACE** position-class approach with 3D `preserve-3d` + `rotateY` system |
| **Carousel JS** | `scripts/carousel.js` | `PlanetCarousel` class: navigation, state update, events (arrows, keyboard, touch, dots, click), `planet-selected` custom event | **REPLACE** class-toggle approach; control parent `rotateY` angle instead |
| **Game Cards CSS** | `estilos/cards.css` | `.game-card`, difficulty stars, planet-gradient variants | No changes |
| **Game Cards JS** | `scripts/games.js` | `GAME_DATA` array, card HTML generator, render/filter/empty state, `planet-selected` listener, public API on `window.MeuPlanetinha.games` | Update: `path` values → iframe shell URL; add `gameId` field for URL routing |
| **Explore Page JS** | `scripts/explore.js` | Planet filter pills/select, grid rendering (uses games.js public API) | Update: card links → iframe shell URLs |
| **Homepage JS** | `scripts/homepage.js` | Scroll behavior, CTA intercept | No changes |
| **Animations CSS** | `estilos/animacoes.css` *(NEW)* | `@keyframes` for starfield-drift, planet-float, particle-sparkle, fade-in utilities | **NEW FILE** |
| **Wave Dividers** | `estilos/componentes.css` (extension) | `.wave-divider` clip-path/SVG component | **NEW RULES** in existing file |
| **Iframe Game Shell** | `jogos/jogar.html` *(NEW)* | Wrapper page: shared nav/footer + sandboxed iframe + loading screen + postMessage listener | **NEW FILE** |
| **Game Shell JS** | `scripts/game-shell.js` *(NEW)* | URL param parsing, iframe src injection, loading screen lifecycle, postMessage handler | **NEW FILE** |
| **Game Shell CSS** | `estilos/pages/game-shell.css` *(NEW)* | Iframe container layout, loading screen overlay, responsive sizing | **NEW FILE** |

---

## 3. Project Structure Additions

```
Atividade-ExtencionistaIV/
├── estilos/
│   ├── animacoes.css              ◄ NEW — @keyframes + animation utilities
│   ├── base.css                   ◄ EDIT — add animation duration tokens
│   ├── carousel.css               ◄ REWRITE — 3D preserve-3d approach
│   ├── componentes.css            ◄ EDIT — add .wave-divider rules
│   └── pages/
│       └── game-shell.css         ◄ NEW — iframe shell page layout
├── scripts/
│   ├── carousel.js                ◄ REWRITE — 3D rotateY approach
│   ├── games.js                   ◄ EDIT — path → iframe shell URLs
│   ├── explore.js                 ◄ EDIT — path → iframe shell URLs
│   └── game-shell.js             ◄ NEW — iframe URL routing + loading
├── jogos/
│   ├── jogar.html                 ◄ NEW — iframe game shell template
│   ├── Contando_Estrelas/         (unchanged, loaded inside iframe)
│   └── Jogo_de_Silaba/            (unchanged, loaded inside iframe)
└── index.html                     ◄ EDIT — wave divider markup, carousel HTML restructure
```

Files unchanged: `components/`, `estilos/layout.css`, `estilos/pages/page-shell.css`, `estilos/pages/homepage.css` (minimal), `estilos/cards.css`, `scripts/homepage.js`, all game directories.

---

## 4. Architectural Patterns

### 4.1 — 3D CSS Carousel Pattern

**Decision: REPLACE entirely, not extend.**

The v1 carousel uses 5 CSS position classes (`planet-card--center`, `--left`, `--right`, `--hidden-left`, `--hidden-right`) toggled by JS. This flat approach is fundamentally incompatible with the 3D orbit concept: all cards must be uniformly distributed around a cylinder and the parent rotates as a unit.

#### v1 approach (being replaced)

```
JS: compute positionMap → toggle per-card classes
CSS: each class defines transform/opacity/filter/z-index per position
Result: 2.5D illusion with blur/scale tricks
```

#### v2 approach (3D orbit)

```
JS: set ONE CSS variable (--orbit-angle) on parent
CSS: parent rotateY transitions; children positioned via fixed rotateY + translateZ
Result: true 3D carousel with perspective depth
```

#### CSS structure

```
.carousel-scene                     ← perspective container
│ perspective: 1000px;
│ perspective-origin: 50% 50%;
│
└─ .carousel-orbit                  ← the rotating ring
   │ transform-style: preserve-3d;
   │ transform: rotateX(15deg)       /* tilt for elliptical ring */
   │            rotateY(var(--orbit-angle));
   │ transition: transform var(--duracao-media) var(--easing-padrao);
   │
   ├─ .planet-card[data-index="0"]
   │   transform: rotateY(0deg) translateZ(var(--orbit-radius));
   │
   ├─ .planet-card[data-index="1"]
   │   transform: rotateY(72deg) translateZ(var(--orbit-radius));
   │
   ├─ .planet-card[data-index="2"]
   │   transform: rotateY(144deg) translateZ(var(--orbit-radius));
   │
   ├─ .planet-card[data-index="3"]
   │   transform: rotateY(216deg) translateZ(var(--orbit-radius));
   │
   └─ .planet-card[data-index="4"]
       transform: rotateY(288deg) translateZ(var(--orbit-radius));
```

#### Key calculations

- **5 planets → 360°/5 = 72° per slot.**
- `--orbit-radius`: calculated so front card is fully visible and back cards are naturally smaller via perspective. Suggested values:
  - Desktop: `300px`
  - Tablet (≤768px): `220px`
  - Mobile (≤480px): `160px`
- `--orbit-angle`: JS controls this single variable. Navigate +1 → subtract 72°. Navigate −1 → add 72°.
- **Tilt**: `rotateX(15deg)` on `.carousel-orbit` creates the tilted elliptical orbit. Cards counter-rotate to stay upright: each card gets `rotateX(-15deg)` applied after its positional `rotateY + translateZ`.
- **Card facing fix**: Each card needs `transform: rotateY(N*72deg) translateZ(R) rotateY(-N*72deg) rotateX(-15deg)` to face the viewer correctly when at the front.

#### JS approach

```js
// JS controls ONE variable: the orbit angle
PlanetCarousel.prototype.navigate = function(direction) {
  this.currentIndex = (this.currentIndex + direction + PLANET_COUNT) % PLANET_COUNT;
  this.orbitAngle = -(this.currentIndex * 72);
  this.orbit.style.setProperty('--orbit-angle', this.orbitAngle + 'deg');
  this._updateState(true); // ARIA + dots + data-active-planet + announce
};
```

No class toggling for positions. No per-card transform updates in JS.

#### Back-face dimming

Cards behind the center plane should appear dimmed. Two approaches:

**Option A — CSS `backface-visibility: hidden`**: Cards disappear when facing away. Simple but binary (visible/invisible).

**Option B — JS-based opacity (recommended)**: After each navigation, compute angular distance from front for each card and set `opacity` + `filter: blur()` proportionally. This preserves the smooth depth illusion from v1.

```js
// After orbit rotation, adjust per-card visual depth
for (var i = 0; i < PLANET_COUNT; i++) {
  var angleDiff = Math.abs(((i * 72) + this.orbitAngle + 360) % 360);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  // 0° = front, 180° = back
  var normalizedDepth = angleDiff / 180; // 0 = front, 1 = back
  this.cards[i].style.opacity = 1 - (normalizedDepth * 0.7);
  this.cards[i].style.filter = 'blur(' + (normalizedDepth * 4) + 'px)';
  this.cards[i].style.pointerEvents = (angleDiff < 36) ? 'auto' : 'none';
}
```

#### What carries over from v1

- Planet data array (slugs, names, subjects) — reused as-is.
- Event binding pattern (arrows, keyboard, touch, dots, click → `planet-selected`) — same API contract.
- Dot navigation, ARIA announcer, `data-active-planet` attribute on `#carousel` — same behavior.
- Design tokens for planet colors — same CSS custom properties.
- Responsive breakpoints (768px, 480px) — same, adjusted with `--orbit-radius`.

#### What gets removed from v1

- The 5 position classes (`planet-card--center`, `--left`, `--right`, `--hidden-left`, `--hidden-right`) in CSS.
- All per-class `transform` / `opacity` / `filter` / `z-index` rules in `carousel.css`.
- The `positionMap` object and class-toggle loop in `carousel.js` `_update()`.

#### Fallback strategy

```css
@supports not (transform-style: preserve-3d) {
  /* Fallback: simple horizontal slide (no 3D) */
  .carousel-orbit {
    display: flex;
    overflow: hidden;
  }
  .planet-card {
    flex: 0 0 100%;
    transform: none !important;
  }
}
```

---

### 4.2 — Iframe Game Shell Pattern

**Goal:** Wrap standalone game pages in the site shell (nav + footer) without modifying the games themselves. Games remain fully standalone HTML pages.

#### URL routing strategy

```
jogos/jogar.html?jogo=contando-estrelas
jogos/jogar.html?jogo=jogo-de-silaba
```

The `jogo` query parameter maps to a game entry in a lookup table defined in `game-shell.js`:

```js
var GAME_ROUTES = {
  'contando-estrelas': {
    src: 'Contando_Estrelas/index.html',
    title: 'Contando Estrelas'
  },
  'jogo-de-silaba': {
    src: 'Jogo_de_Silaba/index.html',
    title: 'Jogo de Sílaba'
  }
};
```

Paths are relative because `jogar.html` lives in `jogos/` — the same parent directory as game folders.

**Why query params (not hash or path routing)?**
- GitHub Pages serves static files; no server rewrite rules available.
- Query params don't trigger 404 on GitHub Pages (the base HTML file loads).
- Simple to parse with `URLSearchParams`.
- Adding a new game = adding one entry to the `GAME_ROUTES` object.

#### Sandbox flags

```html
<iframe
  id="game-frame"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  title="Área do jogo"
></iframe>
```

| Flag | Included? | Why |
|---|---|---|
| `allow-scripts` | **Yes** | Games are JS applications (Phaser, canvas) |
| `allow-same-origin` | **Yes** | Phaser needs same-origin for asset loading via fetch/XHR |
| `allow-popups` | No | Games should not open new windows/tabs |
| `allow-forms` | No | No form submissions needed inside games |
| `allow-top-navigation` | No | Game must not navigate the parent frame |
| `allow-modals` | No | No alert/confirm/prompt needed |

This is the **minimum privilege set** for running Phaser and Canvas games securely.

#### Page structure (jogos/jogar.html)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carregando jogo… — Meu Planetinha</title>

  <!-- Same CSS load chain as other depth-1 pages -->
  <link rel="stylesheet" href="../estilos/reset.css">
  <link rel="stylesheet" href="../estilos/base.css">
  <link rel="stylesheet" href="../estilos/layout.css">
  <link rel="stylesheet" href="../estilos/pages/page-shell.css">
  <link rel="stylesheet" href="../estilos/componentes.css">
  <link rel="stylesheet" href="../components/components.css">
  <link rel="stylesheet" href="../estilos/animacoes.css">
  <link rel="stylesheet" href="../estilos/pages/game-shell.css">
</head>
<body class="page-jogar">
  <div data-component="nav"></div>

  <main id="main-content" class="page-wrapper game-shell">
    <section class="game-shell-container">
      <!-- Loading overlay (shown until game signals ready) -->
      <div id="game-loading" class="game-loading" aria-live="polite">
        <div class="game-loading-spinner" aria-hidden="true"></div>
        <p class="game-loading-text">Carregando jogo…</p>
      </div>

      <!-- Game iframe (src set by JS from URL param) -->
      <iframe id="game-frame"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              title="Área do jogo">
      </iframe>
    </section>
  </main>

  <div data-component="footer"></div>
  <script src="../components/components.js"></script>
  <script src="../scripts/game-shell.js"></script>
</body>
</html>
```

#### CSS layout (estilos/pages/game-shell.css)

```css
.game-shell-container {
  position: relative;
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  margin: var(--espaco-xl) auto;
  border-radius: var(--borda-raio-lg);
  overflow: hidden;
  background: #000;
}

#game-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.game-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--espaco-md);
  background: radial-gradient(ellipse at 50% 50%, #1a2555, #0B0F2E);
  z-index: 10;
  transition: opacity var(--duracao-media) var(--easing-padrao);
}

.game-loading.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Responsive: stack vertically on small screens */
@media (max-width: 640px) {
  .game-shell-container {
    border-radius: 0;
    margin: 0 auto;
  }
}
```

#### Updating game card links

In `scripts/games.js`, the `GAME_DATA[].path` values change:

```js
// v1 (direct link to standalone game):
{ path: 'jogos/Contando_Estrelas/index.html' }

// v2 (link to iframe shell):
{ path: 'jogos/jogar.html?jogo=contando-estrelas' }
```

This is the **only** change in `games.js`. The `createCard()` function already builds `<a href="basePath + game.path">` — the destination simply changes.

`explore.js` uses `basePath + game.path` with `basePath = '../'`, which resolves correctly:
- From homepage: `jogos/jogar.html?jogo=contando-estrelas`
- From explorar: `../jogos/jogar.html?jogo=contando-estrelas`

---

### 4.3 — Unified Loading Screen Pattern

The loading screen lives **inside `jogar.html`** (in the parent frame), not inside the iframe. This avoids cross-frame styling issues and gives the shell full control.

#### Lifecycle

```
1. jogar.html loads
   → Loading overlay is visible (CSS default state)
   → components.js injects nav + footer

2. game-shell.js executes
   → Reads ?jogo= from URL
   → Looks up GAME_ROUTES[jogo]
   → Sets document.title to game name
   → Sets iframe.src = route.src

3. Iframe begins loading game HTML + assets
   → Loading overlay remains visible over iframe

4. Game ready signal (two mechanisms):
   Option A: Game dispatches parent.postMessage({ type: 'game-ready' }, '*')
   Option B: iframe 'load' event fires (fallback for unmodified games)

5. game-shell.js hides loading overlay
   → Adds .is-hidden class → CSS opacity transition → pointer-events: none
```

#### postMessage protocol

```js
// === Inside game (OPTIONAL — add to games that support it) ===
// e.g. at end of Phaser PreloadScene or after canvas setup
window.parent.postMessage({ type: 'game-ready' }, '*');


// === Inside game-shell.js (parent frame) ===
var loadingEl = document.getElementById('game-loading');
var iframe = document.getElementById('game-frame');
var loadingHidden = false;

function hideLoadingScreen() {
  if (loadingHidden) return;
  loadingHidden = true;
  if (loadingEl) loadingEl.classList.add('is-hidden');
}

// Preferred: game explicitly signals readiness
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'game-ready') {
    hideLoadingScreen();
  }
});

// Fallback: iframe load event + small delay for game init
iframe.addEventListener('load', function() {
  setTimeout(function() {
    hideLoadingScreen();
  }, 800);
});
```

The existing games (Contando Estrelas, Jogo de Sílaba) do **NOT** need modification. The iframe `load` fallback handles them out of the box. Adding `postMessage` is an optional per-game enhancement for faster perceived load.

#### Error handling

```js
// In game-shell.js:

// 1. Missing or invalid ?jogo= parameter
var jogo = new URLSearchParams(location.search).get('jogo');
if (!jogo || !GAME_ROUTES[jogo]) {
  showError('Jogo não encontrado.', 'Voltar para Explorar Jogos');
  return;
}

// 2. Iframe load timeout (10 seconds)
var loadTimeout = setTimeout(function() {
  if (!loadingHidden) {
    showError('Não foi possível carregar o jogo.', 'Tentar novamente');
  }
}, 10000);

// 3. Clear timeout on successful load
function hideLoadingScreen() {
  clearTimeout(loadTimeout);
  // ... hide overlay ...
}
```

---

### 4.4 — Animation System Pattern

**Decision: NEW FILE `estilos/animacoes.css`.**

Rationale: Animations are cross-cutting (used on homepage, explore, about pages). Too large for `base.css` (tokens + base only). A dedicated file is modular and easy to disable for debugging.

#### New tokens in base.css

```css
:root {
  /* ... existing tokens ... */
  --duracao-lenta:       600ms;
  --duracao-loop:        20s;    /* ambient infinite animations */
  --duracao-loop-rapida: 8s;     /* shorter loop cycles */
}
```

#### Animation file structure (estilos/animacoes.css)

```css
/* ===========================================
   STARFIELD DRIFT — subtle parallax on body star layers
   =========================================== */
@keyframes starfield-drift {
  from { background-position-y: 0; }
  to   { background-position-y: 200px; }
}

body.has-animations {
  animation: starfield-drift var(--duracao-loop) linear infinite;
}

/* ===========================================
   PLANET FLOAT — gentle bob on planet spheres
   =========================================== */
@keyframes planet-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

/* Applied to .planet-sphere inside 3D carousel.
   Must compose with the card's 3D transform. */

/* ===========================================
   PARTICLE SPARKLE — tiny star particles
   =========================================== */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50%      { opacity: 1; transform: scale(1); }
}

/* ===========================================
   LOADING SPINNER — for game shell
   =========================================== */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.game-loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--cor-primaria);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ===========================================
   FADE-IN UTILITY — section entrance
   =========================================== */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-fade-in-up {
  animation: fade-in-up var(--duracao-lenta) var(--easing-padrao) both;
}
```

#### prefers-reduced-motion

Already handled globally in `base.css`:

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

All animations in `animacoes.css` are automatically disabled for users who prefer reduced motion. **No additional per-animation work needed.**

#### CSS load order placement

```html
<!-- in <head>, after componentes.css + components.css, before page-specific CSS -->
<link rel="stylesheet" href="estilos/animacoes.css">
```

---

### 4.5 — Wave Divider Pattern

**Decision: CSS rules in existing `estilos/componentes.css` + inline SVG markup in HTML.**

Wave dividers are reusable components (hero↔carousel, carousel↔jogos, potentially other pages). They belong with buttons and other shared components, not in a page-specific stylesheet.

#### HTML pattern

```html
<!-- Between sections — decorative separator -->
<div class="wave-divider" aria-hidden="true">
  <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="currentColor"/>
  </svg>
</div>
```

#### CSS rules (added to estilos/componentes.css)

```css
/* WAVE DIVIDERS — decorative section separators */

.wave-divider {
  position: relative;
  width: 100%;
  height: 60px;
  overflow: hidden;
  line-height: 0;
  color: rgba(255, 255, 255, 0.03); /* subtle tint by default */
  margin: calc(-1 * var(--espaco-sm)) 0; /* slight section overlap */
  pointer-events: none;
}

.wave-divider svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* Flip vertically for bottom-of-section placement */
.wave-divider--flip {
  transform: scaleY(-1);
}

/* Transparent variant (shape visible only via shadow or gradient) */
.wave-divider--ghost {
  color: transparent;
}
```

#### Why inline SVG instead of clip-path?

| Factor | Inline SVG | `clip-path: polygon()` | `clip-path: path()` |
|---|---|---|---|
| Smooth curves | Yes (Bézier `C` command) | No (straight segments only) | Yes |
| Browser support | Excellent (all modern) | Good | Weaker (no Safari <16) |
| Payload | ~150 bytes (gzips well) | In CSS (no extra DOM) | In CSS |
| Accessibility | `aria-hidden="true"` clearly marks decorative | Implicit | Implicit |
| Flexibility | Multiple paths, gradients | Single shape | Single path |

**Verdict:** Inline SVG is the best fit — smooth curves, tiny, universal support, explicit a11y.

---

## 5. Data Flow: Game Loading (Sequence)

```
    User clicks "Jogar!" on game card
    (homepage #jogos section or explorar page)
                    │
                    ▼
    Browser navigates to:
    jogos/jogar.html?jogo=contando-estrelas
                    │
                    ▼
    ┌──────────────────────────────────────────┐
    │  jogar.html loads                        │
    │  1. CSS chain loads (design system)      │
    │  2. Loading overlay visible (default)    │
    │  3. components.js injects nav + footer   │
    │  4. game-shell.js executes               │
    └──────────────────┬───────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────┐
    │  game-shell.js                           │
    │  1. Parse ?jogo= from URL                │
    │  2. Lookup GAME_ROUTES['contando-        │
    │     estrelas']                            │
    │  3. Update document.title → "Contando    │
    │     Estrelas — Meu Planetinha"            │
    │  4. Set iframe.src =                     │
    │     "Contando_Estrelas/index.html"        │
    │  5. Start 10s load timeout               │
    └──────────────────┬───────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────┐
    │  iframe loads game page                  │
    │  1. Game HTML + CSS load                 │
    │  2. Phaser/Canvas initializes            │
    │  3. Game assets (sprites, audio) load    │
    │  4. (optional) postMessage({             │
    │       type: 'game-ready' }) to parent    │
    └──────────────────┬───────────────────────┘
                       │
            ┌──────────┴───────────┐
            ▼                      ▼
    postMessage received    OR   iframe 'load' event
    (immediate hide)             + 800ms delay
            │                      │
            └──────────┬───────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────┐
    │  game-shell.js                           │
    │  1. Clear load timeout                   │
    │  2. Add .is-hidden to loading overlay    │
    │  3. CSS opacity transition → fade out    │
    │  4. Game is visible and interactive      │
    └──────────────────────────────────────────┘
```

#### Error states

| Condition | Response |
|---|---|
| `?jogo=` missing or empty | Show "Jogo não encontrado" + link to Explorar |
| `?jogo=` value not in `GAME_ROUTES` | Same error message |
| iframe fails to load (timeout 10s) | Show "Não foi possível carregar o jogo" + retry button |

---

## 6. CSS Load Order (v2.0 — all pages)

```
1. estilos/reset.css            ← box-sizing, margin reset
2. estilos/base.css             ← tokens + base styles + reduced-motion
3. estilos/layout.css           ← container + flex utilities
4. estilos/pages/page-shell.css ← page-wrapper flex-grow
5. estilos/componentes.css      ← buttons + wave-divider (v2 addition)
6. components/components.css    ← nav + footer
7. estilos/animacoes.css        ← NEW — @keyframes + animation utilities
8. [page-specific CSS]          ← homepage.css, carousel.css, cards.css,
                                   explore.css, game-shell.css, etc.
```

`animacoes.css` loads at position 7 so animations can reference design tokens from `base.css` and component classes from `componentes.css`, while page-specific CSS can override animation behavior.

---

## 7. Suggested Build Order

### Dependency graph

```
                    ┌─────────────────┐
                    │  S1. Animation   │
                    │  tokens in       │
                    │  base.css        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌────▼─────┐  ┌─────▼────────┐
       │ S2. Create  │ │ S3. Wave │  │ S4. 3D       │
       │ animacoes   │ │ dividers │  │ carousel CSS │
       │ .css        │ │ (CSS+SVG)│  │ rewrite      │
       └──────┬──────┘ └────┬─────┘  └─────┬────────┘
              │              │              │
              │              │        ┌─────▼────────┐
              │              │        │ S5. 3D       │
              │              │        │ carousel JS  │
              │              │        │ rewrite      │
              │              │        └─────┬────────┘
              │              │              │
              └──────┬───────┴──────────────┘
                     │
           ┌─────────▼───────────┐
           │ S6. Homepage v2     │
           │ integration         │
           │ (waves + 3D carousel│
           │ + animations)       │
           └─────────────────────┘


   ═══ INDEPENDENT TRACK ═══

           ┌─────────────────────┐
           │ S7. Iframe game     │  (no dependencies on S1-S6)
           │ shell (jogar.html + │
           │ game-shell.js +     │
           │ game-shell.css)     │
           └────────┬────────────┘
                    │
           ┌────────▼────────────┐
           │ S8. Game card link  │
           │ migration           │
           │ (games.js +         │
           │ explore.js paths)   │
           └────────┬────────────┘
                    │
           ┌────────▼────────────┐
           │ S9. Loading screen  │
           │ polish + postMsg    │
           │ in existing games   │
           └─────────────────────┘


   ═══ LATE TRACK ═══

           ┌─────────────────────┐
           │ S10. Animations on  │  (after S2)
           │ explore + about     │
           │ pages               │
           └─────────────────────┘
```

### Phase table

| Phase | Task | Depends on | Effort | Risk |
|---|---|---|---|---|
| **S1** | Animation duration tokens in `base.css` | — | XS | Low |
| **S2** | Create `estilos/animacoes.css` (keyframes + utility classes) | S1 | S | Low |
| **S3** | Wave divider component (rules in `componentes.css` + SVG template) | — | S | Low |
| **S4** | 3D carousel CSS rewrite (`carousel.css`) | S1 | M | **Medium** — visual regression risk |
| **S5** | 3D carousel JS rewrite (`carousel.js`) | S4 | M | **Medium** — must preserve `planet-selected` event contract |
| **S6** | Homepage integration (carousel HTML refactor, add wave markup, apply animations) | S2, S3, S4, S5 | M | Low — mostly assembly |
| **S7** | Iframe game shell (`jogar.html` + `game-shell.js` + `game-shell.css`) | — | M | Low |
| **S8** | Update game card links in `games.js` + `explore.js` | S7 | XS | Low |
| **S9** | Loading screen polish + optional `postMessage` in games | S7 | S | Low |
| **S10** | Apply animations to explore + about pages | S2 | S | Low |

### Parallel execution strategy

Two independent tracks can be worked in parallel:

- **Visual track:** S1 → S2 → S3 → S4 → S5 → S6
- **Game shell track:** S7 → S8 → S9

S10 can start after S2 completes, running alongside either track.

**Critical path:** S4 → S5 → S6 (the 3D carousel rewrite is the largest and riskiest change).

---

## 8. Key Decisions Summary

| Question | Decision | Rationale |
|---|---|---|
| 3D carousel: replace or extend? | **Replace entirely** | v1's position-class approach is fundamentally 2D; 3D orbit requires `preserve-3d` + parent rotation. No shared CSS/JS beyond event contract and planet data. |
| Animation CSS: new file or extend? | **New file** (`animacoes.css`) | Cross-cutting concern, too large for base.css, used on many pages. Separate file = easy to debug, disable, or conditionally load. |
| Wave dividers: clip-path or SVG? | **Inline SVG** | Smooth Bézier curves, ~150B payload, excellent browser support, `aria-hidden` for a11y. |
| Wave CSS: new file or extend? | **Extend `componentes.css`** | Reusable component, same category as buttons. Not large enough for its own file. |
| Iframe shell: URL routing? | **Query parameter** (`?jogo=slug`) | Single HTML page for all games. No server routing needed (GitHub Pages). New game = new entry in lookup table. |
| Iframe sandbox flags? | `allow-scripts allow-same-origin` | Minimum privilege: JS execution + same-origin for Phaser asset fetch. No popups, forms, or top-navigation allowed. |
| Loading screen: parent or child? | **Parent frame** (`jogar.html`) | Simpler styling, no cross-frame CSS issues, parent controls lifecycle. Game is unaware of loading screen. |
| Modify existing games? | **No** (optional `postMessage`) | Games work unmodified via iframe `load` fallback. `postMessage('game-ready')` is optional enhancement. |
| Game card link change scope? | **`GAME_DATA[].path` string only** | One-line change per game entry in `games.js`. Card rendering logic unchanged. |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 3D carousel visual regression on mobile | Medium | High | Extensive manual testing on iOS Safari, Chrome Android, budget devices. `@supports` fallback. Responsive `--orbit-radius`. |
| 3D transform performance on low-end devices | Low | Medium | `will-change: transform` on orbit parent only (not children). CSS transitions, no per-frame JS. Test on budget Android. |
| Planet float animation conflicts with 3D card transforms | Medium | Medium | Apply float animation to `.planet-sphere` (the inner sphere div), not to `.planet-card` (which has 3D positioning). Keeps animation and positioning on separate elements. |
| iframe blocks game keyboard input | Low | Medium | `allow-scripts` + `allow-same-origin` grant full keyboard access within iframe. User must click into iframe for focus. Test Phaser keyboard handler. |
| iframe sizing: games expect full viewport | Medium | Medium | Contando Estrelas uses `Phaser.Scale.FIT` with `autoCenter` — adapts to container. Jogo de Sílaba has fixed canvas 800×400 — may need CSS `width:100%; height:auto` in its own stylesheet, or `Scale.FIT` via minor game update. |
| Starfield animation jank on body background | Low | Low | `background-position` animation is GPU-composited. `prefers-reduced-motion` disables entirely. |
| Wave SVG rendering at extreme widths (320px–2560px) | Low | Low | `preserveAspectRatio="none"` stretches wave to fill. Visual test at breakpoints. |
| components.js `BASE_URL` detection from `jogos/jogar.html` | Low | Low | `jogar.html` loads `../components/components.js` — `document.currentScript.src` strips `components/components.js` to get base URL. Already works for depth-1 pages (tested with `explorar/explorar.html`). |
