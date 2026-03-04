# Stack Research

**Domain:** Vanilla static site — kids educational gaming platform
**Researched:** 2026-03-04
**Confidence:** HIGH

---

## Recommended Stack

| Layer | Choice | Version / Source |
|---|---|---|
| Markup | HTML5 (semantic) | — |
| Styling | Vanilla CSS + custom properties | — |
| Scripting | Vanilla ES Modules | — |
| Game engine | Phaser 3 | `3.90.0` (pinned, local file) |
| Icon system | Bootstrap Icons web font | `1.11.3` via jsDelivr CDN |
| Fonts | Google Fonts (Fredoka One, Nunito, Press Start 2P) | CSS API v2 |
| Local server | Python `http.server` or VS Code Live Server | — |
| Hosting | GitHub Pages | — |
| Build tool | **None** | Static files only |

---

## 1 · CSS Custom Properties Design System (2025 Best Practices)

### Token Naming Convention

Use a three-tier taxonomy: **primitive → semantic → component**.

```
Primitive  →  raw value with no meaning context
              --color-yellow-400: #FFD43B;

Semantic   →  named by role, references a primitive
              --color-accent: var(--color-yellow-400);

Component  →  scoped to a specific UI piece
              --button-bg: var(--color-accent);
```

For this project, **two tiers are sufficient** (primitive + semantic). A full three-tier system over-engineers a no-framework static site.

### Recommended `:root` Organisation in `geral.css`

Group tokens in this order, with section comments:

```css
:root {
  /* === 1. PRIMITIVE COLOR PALETTE === */
  --primitivo-amarelo-sol:   #FFD43B;
  --primitivo-rosa-chiclete: #FF6EB4;
  --primitivo-verde-menta:   #4DFFB4;
  --primitivo-laranja-tang:  #FF8C42;
  --primitivo-lilas-algodao: #C084FC;
  --primitivo-azul-ceu:      #1A3A8F;
  --primitivo-indigo:        #2D1B8A;
  --primitivo-magenta:       #8B1A6B;
  --primitivo-marinho:       #0D1A3A;
  --primitivo-fundo-jogo:    #0B0F2E;
  --primitivo-branco:        #FFFFFF;
  --primitivo-cinza-claro:   #C8D0E0;

  /* === 2. SEMANTIC COLORS (role-based) === */
  --cor-fundo:       var(--primitivo-azul-ceu);         /* page background top */
  --cor-fundo-base:  var(--primitivo-indigo);           /* page background bottom */
  --cor-fundo-footer: var(--primitivo-fundo-jogo);
  --cor-texto:       var(--primitivo-branco);
  --cor-texto-suave: var(--primitivo-cinza-claro);
  --cor-destaque:    var(--primitivo-amarelo-sol);
  --cor-cta:         var(--primitivo-laranja-tang);
  --cor-sucesso:     var(--primitivo-verde-menta);
  --cor-alerta:      var(--primitivo-laranja-tang);
  --cor-erro:        #FF4D4D;                           /* standalone — no primitive needed */
  --cor-nav-scroll:  var(--primitivo-marinho);

  /* === 3. PLANET ACCENT COLORS === */
  --planeta-calculon: var(--primitivo-laranja-tang);
  --planeta-letrion:  var(--primitivo-lilas-algodao);
  --planeta-naturox:  var(--primitivo-verde-menta);
  --planeta-terramund: #D4622A;
  --planeta-globish:  #00D4E8;

  /* === 4. TYPOGRAPHY === */
  --fonte-titulo:      'Fredoka One', 'Fredoka', cursive;
  --fonte-corpo:       'Nunito', system-ui, sans-serif;
  --fonte-pixel:       'Press Start 2P', monospace;    /* scores, badges only */

  /* === 5. SPACING SCALE (8px base) === */
  --espaco-2xs: 0.25rem;  /*  4px */
  --espaco-xs:  0.5rem;   /*  8px */
  --espaco-sm:  0.75rem;  /* 12px */
  --espaco-md:  1rem;     /* 16px */
  --espaco-lg:  1.5rem;   /* 24px */
  --espaco-xl:  2rem;     /* 32px */
  --espaco-2xl: 3rem;     /* 48px */
  --espaco-3xl: 4rem;     /* 64px */
  --espaco-4xl: 6rem;     /* 96px */

  /* === 6. TYPE SCALE (fluid — see §4) === */
  --texto-xs:   0.75rem;
  --texto-sm:   0.875rem;
  --texto-md:   1rem;
  --texto-lg:   1.25rem;
  --texto-xl:   1.5rem;
  --texto-2xl:  2rem;
  --texto-3xl:  2.5rem;
  --texto-4xl:  3.5rem;

  /* === 7. BORDER RADIUS === */
  --raio-sm:   0.5rem;
  --raio-md:   1rem;
  --raio-lg:   1.5rem;
  --raio-pill: 999px;

  /* === 8. SHADOWS === */
  --sombra-sm: 0 2px 8px rgba(0,0,0,0.25);
  --sombra-md: 0 4px 16px rgba(0,0,0,0.35);
  --sombra-lg: 0 8px 32px rgba(0,0,0,0.45);
  --sombra-brilho-ouro: 0 0 20px rgba(255,212,59,0.5);
  --sombra-brilho-ctx:  0 0 16px var(--cor-planeta-atual, var(--cor-destaque));

  /* === 9. MOTION (v1: zero duration — no animation) === */
  --duracao-rapida: 0ms;
  --duracao-media:  0ms;
  --duracao-lenta:  0ms;

  /* === 10. LAYOUT === */
  --largura-max:        1200px;
  --largura-texto-max:  65ch;
  --largura-card-jogo:  320px;
  --altura-nav:         72px;
  --altura-nav-scroll:  52px;
}
```

**Rationale for naming in Portuguese:** team is Brazilian; keeping BP names in PT-BR reduces cognitive load and avoids half-translated codebases. Stick to it consistently.

**No `!important` on tokens** — custom properties cascade normally. Reserve `!important` only for forced overrides in accessibility resets.

---

## 2 · Google Fonts Loading Best Practices (2025)

### Critical Finding: `@import` inside CSS is Render-Blocking

The current `geral.css` uses:
```css
@import url("https://fonts.googleapis.com/css2?...");
```
This is **suboptimal**: the browser must download `geral.css`, parse it, then discover the font import — a serial waterfall. It delays First Contentful Paint.

### Correct Pattern: `<link>` Tags in `<head>` with Preconnect

```html
<!-- Step 1: Preconnect to font CDNs (saves ~200ms DNS+TLS handshake) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Step 2: Load Google Fonts stylesheet non-render-blocking -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700&family=Press+Start+2P&display=swap"
>
```

### `font-display: swap` is Already Handled by the `display=swap` URL Parameter

Appending `&display=swap` to the Google Fonts URL injects `font-display: swap` into every `@font-face` rule the API generates. **Do not** redeclare it yourself. This means:
- Body text renders immediately in the fallback font.
- It swaps to Nunito once downloaded — FOUT (Flash of Unstyled Text) is acceptable for non-game UI.
- `Press Start 2P` only appears in score badges — FOUT is irrelevant there.

### Optimal Font URL for This Project

```
https://fonts.googleapis.com/css2?
  family=Fredoka+One
  &family=Nunito:wght@400;700
  &family=Press+Start+2P
  &display=swap
```

Collapsed into one `<link>` — one HTTP request instead of three.

**Do not request font weights you don't use.** The design system uses:
- Fredoka One: 400 only (it's a single-weight family)
- Nunito: 400 (body), 700 (buttons/subtítulos)
- Press Start 2P: 400 only (single-weight)

### `<link rel="preload">` for Critical Fonts (Optional Optimisation)

If Fredoka One causes layout shift on the nav bar, add a preload hint for the woff2 file. However, Google Fonts CDN URLs change; a simpler approach is to **self-host** the two display fonts (see §7 on pinning). For v1, the CDN + preconnect approach is sufficient.

### Remove `@import` from CSS Files Entirely

All `@import url(fonts.googleapis.com/...)` lines in `.css` files must be deleted. Font loading belongs in HTML `<head>` only.

---

## 3 · Bootstrap Icons v1.11+ Usage Patterns

### Two Delivery Methods

| Method | Pros | Cons | Verdict for this project |
|---|---|---|---|
| **Web font via CDN** | Single `<link>`, `<i class="bi bi-planet">` syntax, all 2000+ icons available | Loads the entire font file (~230KB woff2) even for 10 icons used | **Use this — simplicity > micro-optimisation at this scale** |
| **SVG sprites (self-hosted)** | Only include icons you use, no HTTP request | Manual sprite build step, requires a build tool or manual copy, more complex HTML (`<use>`) | Overkill for a no-bundler project |
| **Inline SVG** | Zero external requests, per-icon | Bloats HTML, hard to maintain | Only for 1–2 icons maximum |

### Recommended: CDN `<link>` in `<head>` (not `@import` in CSS)

Same render-blocking issue as Google Fonts. Move Bootstrap Icons out of `geral.css` and into HTML:

```html
<!-- Bootstrap Icons — after font preconnects, before </head> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
>
```

Pin to `@1.11.3` — jsDelivr resolves the exact version and caches permanently once pinned. **Never use `@latest`** — version drift can silently rename or remove icons you rely on.

### Usage in HTML (no change to current convention)

```html
<i class="bi bi-planet" aria-hidden="true"></i>
```

Add `aria-hidden="true"` on decorative icons. For icons that carry meaning (e.g., a search button with no visible label), add `aria-label` on the parent element.

### Icons Used — Audit All Pages

Before v1 launch, audit every page and list every `bi-*` class used. The web font loads all 2000+ icons regardless — an audit has no size benefit here, but it ensures you don't accidentally reference removed icons in a future version bump.

---

## 4 · Vanilla CSS Patterns for Responsive Kids Educational Sites

### Mobile-First Media Queries

Always write base styles for the smallest screen, then expand:

```css
/* Base: mobile (≤ 480px) */
.card-jogo {
  width: 100%;
  padding: var(--espaco-md);
}

/* Tablet and up */
@media (min-width: 640px) {
  .card-jogo { width: var(--largura-card-jogo); }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card-jogo { /* large screen styles */ }
}
```

**Breakpoint scale for this project:**

| Name | Min-width | Target |
|---|---|---|
| `sm` | 480px | Large phones |
| `md` | 640px | Small tablets |
| `lg` | 1024px | Tablets landscape / small laptops |
| `xl` | 1280px | Standard desktop |

Do **not** define breakpoints in CSS custom properties — they cannot be used inside `@media` queries (custom properties are runtime-resolved, media queries are parse-time).

### Fluid Typography with `clamp()`

For kids ages 6–10, legibility is paramount. Use `clamp()` so text scales proportionally across devices without hard breakpoint jumps:

```css
:root {
  /* clamp(min, preferred, max) */
  --texto-h1:   clamp(2rem,   5vw, 3.5rem);   /* Planet names, section titles */
  --texto-h2:   clamp(1.5rem, 4vw, 2.5rem);
  --texto-h3:   clamp(1.25rem,3vw, 2rem);
  --texto-corpo: clamp(1rem,  2vw, 1.25rem);
  --texto-pixel: clamp(0.625rem, 1.5vw, 0.875rem); /* Press Start 2P — keep small */
}
```

**Press Start 2P** has built-in visual weight; at 1rem it reads larger than most 1rem fonts. Cap it at `0.875rem` (14px) outside of full-screen game HUD.

### Spacing Scale Based on `rem` (not `px`)

The base `font-size: 16px` on `<html>` makes `1rem = 16px`. All spacing should use the `--espaco-*` token scale (see §1) in `rem` units. Benefits:
- User browser font-size preferences are respected.
- Scaling `<html>` font-size at small/large screens (via `clamp` or media query) automatically scales all spacing.

### Container Pattern (No Framework)

```css
.container {
  width: min(var(--largura-max), 100% - var(--espaco-lg) * 2);
  margin-inline: auto;
}
```

This single rule replaces Bootstrap's grid container. `min()` + `margin-inline: auto` is the modern idiom for centered, max-width-constrained content.

### Grid for Card Layouts

```css
.grade-jogos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(var(--largura-card-jogo), 100%), 1fr));
  gap: var(--espaco-xl);
}
```

`auto-fill` + `minmax` creates a responsive grid that never breaks below the card's minimum width — no media queries needed for the grid itself.

### Accessibility: `prefers-reduced-motion`

This is required for a children's platform where some users may have vestibular disorders:

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

Since v1 has **no animations**, this block is effectively a safety net. Keep it.

---

## 5 · JS Module Patterns for Vanilla Static Sites

### ES Modules Without a Bundler

For a no-build-tool project, ES modules (`type="module"`) work natively in all modern browsers (Chrome 61+, Firefox 60+, Safari 10.1+). GitHub Pages does not require any special configuration.

```html
<!-- In <body> before </body> -->
<script type="module" src="./scripts/carousel.js"></script>
```

Key properties of `type="module"`:
- **Deferred by default** — equivalent to `defer`; executes after DOM is parsed.
- **Strict mode by default** — no need for `'use strict'`.
- **Scoped** — top-level variables are not added to `window`.
- **CORS-restricted** — modules cannot be loaded via `file://`. Use a local server (`python -m http.server 3000` or Live Server).

### When to Use ES Modules vs Classic Scripts

| Scenario | Use |
|---|---|
| Site UI logic (carousel, nav scroll, search filter) | `type="module"` |
| Phaser game — each game's `index.html` loads `main.js` | `type="module"` for orchestrator, classic `<script>` for `phaser.min.js` |
| Shared utility imported by multiple pages | ES Module with `export` |
| Inline one-liner event handler | Classic inline (rare, avoid) |

### Recommended Module Structure for Site Scripts

```
scripts/
  carousel.js          ← carousel UI (standalone module)
  nav.js               ← header scroll-shrink behaviour
  utils.js             ← shared helpers (exported functions)
  search.js            ← client-side game filter on explorar page
```

Each script should export named functions; nothing should be an IIFE or pollute `window`:

```js
// scripts/nav.js
export function initShrinkingNav(selector = '.barra-de-navegacao') {
  const nav = document.querySelector(selector);
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });
}
```

Import in the page's module script:

```html
<script type="module">
  import { initShrinkingNav } from './scripts/nav.js';
  initShrinkingNav();
</script>
```

### Phaser Games: Hybrid Approach

Phaser 3 (`phaser.min.js`) is a classic UMD build — include it as a classic `<script>` before your game module:

```html
<!-- In game index.html -->
<script src="./phaser.min.js"></script>
<script type="module" src="./main.js"></script>
```

`main.js` (module) can import its scene files:

```js
// jogos/Contando_Estrelas/main.js
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  scene: [BootScene, PreloadScene, GameScene],
};
new Phaser.Game(config);
```

This avoids concatenated scene files and mirrors what a bundler would produce, without build steps.

### No Dynamic `import()` in v1

Avoid `import()` (dynamic import / code splitting). It adds complexity with no measurable benefit for pages this small. If a page's module is only used on one page, placing its `<script type="module">` only in that page's HTML is sufficient isolation.

---

## 6 · What Goes in CSS Variables vs Utility Classes

### Decision Rule

> **Variables = values that repeat or change by context.**
> **Utility classes = single-property overrides applied directly in HTML for layout adjustments.**

Do **not** replicate every CSS property as a utility class (that's Tailwind's model and requires a build step to purge). For a vanilla project, the boundary is:

### Use Custom Properties (`--var`) For:

| Category | Examples |
|---|---|
| Design tokens | Colors, font families, spacing scale, shadows, radii |
| Theme values | Per-planet accent color via `--cor-planeta-atual` |
| Transition timings | `--duracao-rapida`, even when set to `0ms` in v1 |
| Layout constants | `--largura-max`, `--largura-card-jogo` |
| State variants | Set inline: `style="--cor-planeta-atual: var(--planeta-calculon)"` |

**Scoped overrides for planet context** (very powerful pattern):

```css
/* In geral.css: default context token */
:root { --cor-planeta-atual: var(--cor-destaque); }

/* In component CSS: reference the context token */
.botao-primario {
  background: var(--cor-planeta-atual);
  box-shadow: 0 0 16px var(--cor-planeta-atual);
}
```

```html
<!-- In page HTML: override per planet section -->
<section style="--cor-planeta-atual: var(--planeta-letrion)">
  <button class="botao-primario">Jogar Letrion!</button>
</section>
```

This one pattern eliminates per-planet modifier classes (`botao--letrion`, `botao--calculon`, etc.).

### Use Utility Classes For:

Only a small set of genuinely reusable, single-concern rules:

```css
/* Visibility / display */
.sr-only { /* screen reader only — standard WCAG pattern */ }
.oculto  { display: none; }

/* Text alignment */
.texto-centro { text-align: center; }

/* Spacing helpers (used sparingly) */
.mt-auto   { margin-top: auto; }
.mx-auto   { margin-inline: auto; }

/* Container */
.container {
  width: min(var(--largura-max), 100% - var(--espaco-lg) * 2);
  margin-inline: auto;
}

/* Flex shortcuts */
.flex-centro {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Do not create utilities for:** padding amounts, specific colors, font sizes, or border radii — those should be in component classes or tokens, not utilities.

### Component Classes Handle Everything Else

A `.card-jogo`, `.botao-primario`, `.barra-de-navegacao` class owns all its own styling using token variables internally. Pages apply component classes, not raw token references.

---

## 7 · Library Versions to Pin

| Library | Pinned Version | CDN URL |
|---|---|---|
| Bootstrap Icons | **1.11.3** | `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css` |
| Phaser 3 | **3.90.0** | Local file `phaser.min.js` (already in each game folder — **do not change**) |
| Google Fonts API | v2 (URI parameter) | `https://fonts.googleapis.com/css2?...&display=swap` |

**Why pin Bootstrap Icons at 1.11.3:** v2.x is a future potential breaking change (icon names may change). jsDelivr with `@1.11.3` serves from immutable cache — zero risk of upstream changes.

**Why Phaser stays local:** The npm package is listed as a dependency but games already vendor `phaser.min.js` locally. Keep this pattern — it guarantees games work offline and on GitHub Pages without any CDN dependency. Do not load Phaser from a CDN.

**Google Fonts API v2** does not have a version to pin in the URL. It is a Google-managed API with backward compatibility guarantees. The font families themselves (`Fredoka One`, `Nunito`, `Press Start 2P`) are stable.

### No Other JS Libraries

The site requires no jQuery, no Lodash, no animation library (v1 has no animations). The only JS per-page is site UI scripts (carousel, nav) plus Phaser per-game. Adding any library must clear the bar: *does this replace meaningful custom code, or does it replace three lines?*

---

## 8 · Critical Audit Items (Current Codebase)

These gaps were found during stack research and must be addressed in REQUIREMENTS.md:

| # | Issue | File | Recommended Fix |
|---|---|---|---|
| 1 | `@import url(fonts.googleapis.com)` inside CSS | `estilos/geral.css` line 2 | Move to `<link rel="preconnect">` + `<link rel="stylesheet">` in all HTML `<head>` sections |
| 2 | `@import url(bootstrap-icons CDN)` inside CSS | `estilos/geral.css` line 3 | Move to `<link rel="stylesheet">` in HTML `<head>` |
| 3 | Font stack in code (Bricolage Grotesque, Lexend, Patrick Hand) differs from Guia-Visual.md (Fredoka One, Nunito, Press Start 2P) | `estilos/geral.css` | Align `--fonte-titulo/corpo/pixel` tokens with Guia-Visual.md spec |
| 4 | `<html>` missing `lang="pt-BR"` | `index.html` | Required for screen readers and SEO |
| 5 | `scene/*.js` files in games use classic `<script>` pattern without `type="module"` | All game `index.html` | Migrate to ES module imports in `main.js` (see §5) |
| 6 | No `<title>` content on game pages | Various | Each page needs a descriptive `<title>` |

---

## 9 · Summary of Prescriptive Decisions

1. **Fonts:** Load via `<link>` in HTML `<head>` with `preconnect` hints. Remove all `@import` for fonts from CSS. Pin to: `Fredoka One`, `Nunito:wght@400;700`, `Press Start 2P` — single combined URL.

2. **Bootstrap Icons:** Load via `<link>` in HTML `<head>`. Pin `@1.11.3`. Always `aria-hidden="true"` on decorative icons.

3. **CSS tokens:** Three groups — primitives (raw hex/values), semantic (role-based), component-scoped. Name everything in Portuguese. Use `--cor-planeta-atual` context token pattern to avoid per-planet class proliferation.

4. **Responsive:** Mobile-first breakpoints at 480 / 640 / 1024 / 1280px. `clamp()` for all heading sizes. `min()` + `margin-inline: auto` for containers. CSS Grid `auto-fill` + `minmax` for card grids.

5. **JavaScript:** `type="module"` for all site UI scripts. Phaser stays as classic `<script>` + a `type="module"` orchestrator per game. No dynamic imports. No `window` pollution.

6. **What goes in variables:** Design tokens, timings, layout constants, contextual theme overrides. **Not** in utilities.

7. **What goes in utilities:** `.container`, `.sr-only`, `.flex-centro`, `.texto-centro`, `.mx-auto`. Small set, single-responsibility. Components handle everything else.

8. **Phaser 3:** Stay pinned at `3.90.0`, vendored locally. Never load from CDN.

9. **No new libraries in v1.** Every addition must replace real complexity, not convenience.
