# Stack Research

**Domain:** Kids' educational gaming platform — visual polish, 3D carousel, animations, iframe sandboxing
**Researched:** 2026-03-05
**Confidence:** HIGH (all techniques are native CSS/JS, well-supported in evergreen browsers)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| CSS 3D Transforms | CSS3 (all evergreen) | 3D orbital planet carousel | Native, no library needed. `perspective`, `transform-style: preserve-3d`, `rotateY`, `translateZ` create genuine 3D ring. Supported since Chrome 36, Firefox 16, Safari 9, Edge 12 |
| CSS @keyframes | CSS3 (all evergreen) | Starfield drift, planet float, sparkle particles | GPU-composited when using `transform` and `opacity`. Zero JS overhead for ambient animations |
| CSS `will-change` | CSS (all evergreen) | Hint browser to promote animated layers to GPU | Prevents layout thrashing on carousel rotation and starfield drift. Use sparingly — max 3-4 promoted elements |
| CSS Custom Properties | CSS (all evergreen) | Animation tokens, 3D perspective values, per-planet stagger delays | Extends existing `base.css` token system. `--orbit-angle`, `--perspectiva-3d`, `--float-delay`, `--anim-drift-duracao` |
| SVG (inline) | SVG 1.1 | Wave dividers between sections | Bézier curves for smooth organic shapes. ~150 bytes per divider. `fill` uses CSS custom properties for theming |
| iframe sandbox | HTML5 | Game isolation + contributor sandboxing | `sandbox="allow-scripts allow-same-origin"` minimum. Native browser security, no library needed |
| postMessage API | HTML5 | Loading screen coordination | Parent frame shows loading screen, game iframe sends "ready" via postMessage. Timeout fallback for games that don't implement the protocol |

### Supporting Techniques

| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| `color-mix()` | Darken/lighten planet sphere gradients for 3D depth | Already used in v1 carousel.css. Extend for 3D depth shading |
| `backdrop-filter: blur()` | Frosted glass effect on back carousel planets | Applied to planets behind the focal point for depth |
| `clip-path: polygon()` | Alternative wave divider method | Fallback if SVG approach creates complexity. Already used in v1 footer wave |
| CSS `animation-play-state` | Pause animations when tab not visible | Performance conservation — pause starfield when `document.hidden` |
| `prefers-reduced-motion` | Disable all animations for a11y | Already exists in v1 base.css. Extend to cover new @keyframes |

### New CSS Tokens (extending base.css)

| Token | Value | Purpose |
|-------|-------|---------|
| `--perspectiva-3d` | `1000px` | 3D carousel perspective depth |
| `--orbita-raio` | `280px` | translateZ distance for planet ring |
| `--orbita-inclinacao` | `15deg` | rotateX tilt for elliptical view |
| `--anim-drift-duracao` | `60s` | Starfield drift cycle |
| `--anim-float-duracao` | `4s` | Planet float cycle |
| `--anim-float-distancia` | `8px` | Float amplitude |
| `--anim-sparkle-duracao` | `2s` | Sparkle/particle cycle |
| `--z-carousel` | `100` | z-index layer for 3D carousel |
| `--z-wave` | `1` | z-index layer for wave dividers |

## Installation

N/A — zero new dependencies. Everything is native CSS/JS. No npm packages, no CDN links.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| CSS 3D transforms | Three.js / WebGL | Only if needing true 3D models (spheres with texture mapping). Overkill for gradient circles |
| CSS @keyframes | GSAP (GreenSock) | If needing complex sequenced animations with timeline control. Adds 27KB min. Not needed for ambient effects |
| Inline SVG waves | CSS clip-path | If waves are simple triangles/polygons. Use SVG for smooth Bézier curves |
| postMessage | SharedWorker | If needing bidirectional real-time game-platform communication. Overkill for loading screen coordination |
| Vanilla JS carousel | Flickity / Swiper | If needing 50+ items with virtual scrolling. 5 planets doesn't justify a library |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Three.js / Babylon.js | 100KB+ library for what CSS 3D handles natively. Overkill for gradient spheres | CSS perspective + rotateY + translateZ |
| GSAP / anime.js | Adds JS dependency for effects achievable with CSS @keyframes | CSS @keyframes with custom properties for parameterization |
| Canvas-based starfield | Requires JS animation loop, can't use prefers-reduced-motion natively | CSS @keyframes with `transform: translate()` on box-shadow starfield |
| `<embed>` / `<object>` for games | Less sandboxing control, inconsistent behavior, deprecated patterns | `<iframe sandbox>` with explicit allow-list |
| CSS `@property` | Still experimental in Firefox (behind flag) | CSS custom properties (`var()`) — universally supported |

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|-------|
| `transform-style: preserve-3d` | 36+ | 16+ | 9+ | 12+ | Safari: `overflow: hidden` on ancestor flattens 3D |
| `perspective` | 36+ | 16+ | 9+ | 12+ | Use on direct parent of 3D-transformed elements |
| `color-mix(in srgb)` | 111+ | 113+ | 16.2+ | 111+ | Fallback already exists in v1 |
| `backdrop-filter` | 76+ | 103+ | 9+ | 17+ | `-webkit-` prefix for older Safari |
| `iframe sandbox` | 4+ | 17+ | 5+ | 12+ | `allow-same-origin` needed for Phaser localStorage |
| `will-change` | 36+ | 36+ | 9.1+ | 79+ | Max 3-4 promoted elements |

## Sources

- MDN Web Docs — CSS 3D Transforms, perspective, transform-style
- David DeSandro — Intro to CSS 3D Transforms (carousel tutorial, user-provided reference)
- web.dev — Animations performance guide (compositor-only properties)
- HTML spec — iframe sandbox attribute flags

---
*Stack research for: Meu Planetinha v2.0*
*Researched: 2026-03-05*
