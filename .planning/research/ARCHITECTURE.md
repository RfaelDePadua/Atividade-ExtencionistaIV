# Architecture Research

**Domain:** Kids' educational gaming platform — visual polish, 3D carousel, animations, iframe sandboxing
**Researched:** 2026-03-05
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌───────────┐  │
│  │  3D Orbit   │ │  Animations  │ │ Wave Divs  │ │ Loading   │  │
│  │  Carousel   │ │  System      │ │ (SVG)      │ │ Screen    │  │
│  └──────┬─────┘ └──────┬───────┘ └─────┬──────┘ └─────┬─────┘  │
│         │              │               │               │        │
├─────────┴──────────────┴───────────────┴───────────────┴────────┤
│                    CSS TOKEN LAYER (base.css)                    │
│   existing tokens + new: --perspectiva-3d, --orbita-raio,       │
│   --orbita-inclinacao, --anim-* timing, --z-* layers            │
├─────────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Nav/Foot │  │ Hero     │  │ Cards    │  │ Filter   │       │
│  │ (v1 ✓)  │  │ (merged) │  │ (3-col)  │  │ (redes.) │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                    GAME SHELL LAYER (stretch)                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  jogos/jogar.html — iframe host with sandbox         │       │
│  │  ┌──────────────────────────────────────────────┐    │       │
│  │  │  <iframe sandbox="allow-scripts              │    │       │
│  │  │          allow-same-origin">                  │    │       │
│  │  │    jogos/{game}/index.html                    │    │       │
│  │  └──────────────────────────────────────────────┘    │       │
│  │  postMessage("game-ready") → hides loading screen    │       │
│  └──────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                    PAGE LAYER (existing v1)                      │
│  index.html │ explorar.html │ sobre_nos.html │ 404.html        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| 3D Orbit Carousel | rotateY ring of 5 planets, JS controls `--orbit-angle` custom property, tilt via rotateX | Replace v1 carousel.css + carousel.js entirely. New: `carousel-3d.css` + `carousel-3d.js` |
| Animation System | @keyframes definitions, animation utility classes, prefers-reduced-motion gate | New: `estilos/animacoes.css`. JS: pause on hidden tab via Page Visibility API |
| Wave Dividers | Inline SVG curves between sections | Added to `componentes.css`. SVG markup in HTML pages |
| Unified Hero | Single section containing title + subtitle + CTA + carousel track | Modify `index.html` structure. CSS in `homepage.css` |
| Cards 3-col | game-grid with 3rd "Coming Soon" card, button anchored bottom | Modify `cards.css` + `games.js` |
| Explore Filter | Redesigned filter bar without blue strip | Modify `explore.css` |
| Game Shell (stretch) | Iframe wrapper page with site nav/footer, loads game by query param | New: `jogos/jogar.html` + `jogos/jogar.js` + `jogos/jogar.css` |

## New/Modified File Structure

```
estilos/
├── base.css               # UPDATED: new 3D + animation tokens
├── animacoes.css           # NEW: @keyframes, animation utilities
├── carousel.css           # DELETED (replaced by carousel-3d.css)
├── carousel-3d.css         # NEW: 3D orbital carousel styles
├── cards.css              # UPDATED: 3-col, Coming Soon, button layout
├── componentes.css        # UPDATED: wave divider rules
├── pages/
│   ├── homepage.css       # UPDATED: unified hero section
│   ├── explore.css        # UPDATED: filter bar redesign
│   └── page-shell.css     # UPDATED: remove colored bar
scripts/
├── carousel.js            # DELETED (replaced by carousel-3d.js)
├── carousel-3d.js          # NEW: 3D carousel logic, --orbit-angle
├── games.js               # UPDATED: Coming Soon card generation
├── homepage.js            # UPDATED: animation pause on tab hidden
components/
├── nav.html               # UPDATED: remove duplicate text
index.html                 # UPDATED: merged hero + carousel, wave SVGs
explorar/explorar.html     # UPDATED: filter section markup
jogos/
├── jogar.html              # NEW (stretch): iframe game shell
├── jogar.js                # NEW (stretch): game loading logic
├── jogar.css               # NEW (stretch): loading screen styles
```

## Architectural Patterns

### Pattern 1: CSS Custom Property Animation Driver

The 3D carousel JS sets a single `--orbit-angle` custom property on the parent `.carousel-orbit`. All planet positioning derives from this one value via static `rotateY` offsets per card. JS only touches one property — CSS handles all visual math.

```css
.carousel-scene {
  perspective: var(--perspectiva-3d);
}

.carousel-orbit {
  transform-style: preserve-3d;
  transform: rotateX(var(--orbita-inclinacao)) rotateY(var(--orbit-angle, 0deg));
  transition: transform var(--duracao-media) var(--easing-padrao);
}

.planet-card:nth-child(1) { transform: rotateY(0deg) translateZ(var(--orbita-raio)); }
.planet-card:nth-child(2) { transform: rotateY(72deg) translateZ(var(--orbita-raio)); }
.planet-card:nth-child(3) { transform: rotateY(144deg) translateZ(var(--orbita-raio)); }
.planet-card:nth-child(4) { transform: rotateY(216deg) translateZ(var(--orbita-raio)); }
.planet-card:nth-child(5) { transform: rotateY(288deg) translateZ(var(--orbita-raio)); }
```

**JS side:** To show planet N, set `--orbit-angle: -(N * 72)deg`. The CSS transition handles the animation.

### Pattern 2: Iframe Sandbox with Loading Protocol

```
Parent (jogar.html)          Game (iframe)
─────────────────            ─────────────
Show loading screen
Load iframe src  ──────────>  Game starts loading
                              Game initializes
                              Game ready
                 <──────────  postMessage({type:"game-ready"})
Hide loading                  
                              Game plays
```

Fallback: If postMessage not received within 5 seconds, hide loading screen anyway (games may not implement protocol).

### Pattern 3: Progressive Animation Enhancement

```
base.css:         prefers-reduced-motion: reduce → animations: none (reset)
animacoes.css:    @keyframes defined (star-drift, planet-float, sparkle)
homepage.css:     .page-home .starfield { animation: star-drift ... }
carousel-3d.css:  .planet-card { animation: planet-float ... }
```

Animations defined centrally but applied per-page — explore page can opt out of starfield if desired.

## Suggested Build Order

**Track A — Quick Wins (parallel, low risk):**
1. CSS tokens update (base.css) — foundation for everything
2. Header fix (nav.html + componentes.css)
3. Card layout + button bottom + Coming Soon (cards.css + games.js)
4. Explore filter redesign (explore.css)
5. Index spacing (homepage.css)

**Track B — 3D Carousel (critical path):**
6. Animation system (animacoes.css + animation tokens)
7. 3D carousel rewrite (carousel-3d.css + carousel-3d.js) — the big feature
8. Unified hero section (merge in index.html + homepage.css) — depends on carousel stability
9. Wave dividers (componentes.css + SVG in HTML) — connects sections
10. Background hierarchy polish — final visual pass

**Track C — Game Shell (stretch):**
11. Game shell page (jogar.html + jogar.js + jogar.css)
12. Loading screen + postMessage
13. Link migration (game cards → jogar.html?jogo=X)

**Critical path:** Step 1 → 6 → 7 → 8 → 9 → 10

**Dependencies:**

| Step | Depends On | Why |
|------|------------|-----|
| 6 (animations) | 1 (tokens) | Animation tokens must exist |
| 7 (3D carousel) | 1 (tokens), 6 (animations) | Needs tokens + float @keyframes |
| 8 (unified hero) | 7 (3D carousel) | Must merge into stable carousel |
| 9 (wave dividers) | 8 (unified hero) | Waves connect hero to cards |
| 10 (background) | 7, 9 | Final polish needs all pieces in place |
| 12 (loading screen) | 11 (game shell) | Loading screen lives in shell page |
| 13 (link migration) | 11, 12 | Shell must be functional first |

## Accessibility & Performance Guardrails

- `prefers-reduced-motion`: ALL animations disabled (CSS + JS carousel transition)
- `will-change`: MAX 3-4 elements (orbit container, starfield, active planet)
- GPU layers: Audit in DevTools Layers panel, target < 6 promoted layers
- Tab visibility: Pause CSS animations via `animation-play-state` when `document.hidden`
- Screen reader: `aria-hidden="true"` on non-center planets (synced by JS)
- Keyboard: Preserve v1 single-tab-stop carousel, arrow key navigation
- Touch: Preserve v1 swipe support

---
*Architecture research for: Meu Planetinha v2.0*
*Researched: 2026-03-05*
