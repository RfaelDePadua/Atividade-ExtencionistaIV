# Architecture

**Analysis Date:** 2026-03-04

## Pattern Overview

**Overall:** Multi-page static website with self-contained embedded mini-games

**Key Characteristics:**
- No framework — pure HTML/CSS/JS site shell
- Each game is a self-contained folder with its own assets and dependencies
- No shared templating — nav/header duplicated via copy-paste across pages
- Client-side only — zero server round-trips at runtime
- Two distinct game rendering approaches: Phaser 3 (scene-based) and Vanilla Canvas 2D

## Layers

**Site Shell (website layer):**
- Purpose: Navigation, discovery, and landing experience
- Contains: `index.html`, `explorar/`, `sobre_nos/`, shared `estilos/`, `scripts/`
- Depends on: CDN fonts, Bootstrap Icons, local CSS
- Used by: Users browsing and selecting games

**Game Layer:**
- Purpose: Individual game experiences, fully isolated from the site shell
- Contains: `jogos/Contando_Estrelas/`, `jogos/Jogo_de_Silaba/`
- Depends on: Phaser 3 (vendored), game-specific assets
- Used by: Site shell links to game pages

## Data Flow

**User Browsing Flow:**

1. User lands on `index.html` (homepage with planet carousel)
2. `PlanetCarousel` class (`scripts/carousel.js`) handles subject navigation
3. User selects a planet/subject → carousel filters game cards
4. User clicks a game → navigates to `jogos/<game>/index.html`
5. Game page loads its self-contained JS and assets

**Contando_Estrelas (Phaser 3 Game) Flow:**

1. `index.html` loads `phaser.min.js` and `main.js` (ES module)
2. `main.js` creates Phaser game config and instantiates `Phaser.Game`
3. Scene sequence: `BootScene` → `PreloadScene` → `MenuScene` → `GameScene` ↔ `GameOverScene`
4. `PreloadScene` loads all sprites, spritesheets, and fonts
5. `GameScene` runs the math asteroid-shooting gameplay loop
6. `GameOverScene` shows results; player can restart

**Jogo_de_Silaba (Vanilla Canvas) Flow:**

1. `index.html` loads `script.js` (vanilla, no modules)
2. Script grabs `<canvas id="gameCanvas">` and runs game loop directly
3. No scene management — single file game loop with requestAnimationFrame

**State Management:**
- Stateless across sessions — no persistence
- Contando_Estrelas: Phaser scene registry passes state between scenes via `this.registry` or scene restarts
- Jogo_de_Silaba: module-level JS variables during session

## Key Abstractions

**Phaser Scene (Contando_Estrelas):**
- Purpose: Encapsulates each game state (boot, preload, menu, gameplay, game over)
- Examples: `BootScene`, `PreloadScene`, `MenuScene`, `GameScene`, `GameOverScene`
- Pattern: Phaser lifecycle methods (`preload()`, `create()`, `update()`)

**PlanetCarousel (Site Shell):**
- Purpose: Interactive planet-based subject navigation on homepage
- Examples: `scripts/carousel.js` — `PlanetCarousel` class
- Pattern: Vanilla class with DOM event listeners, touch support, keyboard support

**CSS Design System:**
- Purpose: Centralized design tokens (colors, typography, spacing, breakpoints)
- Location: `estilos/geral.css` — CSS custom properties under `:root`
- Pattern: CSS variables consumed by all pages and components

## Entry Points

**Homepage:**
- Location: `index.html`
- Triggers: Browser navigation / direct URL
- Responsibilities: Landing page, carousel, game discovery

**Explore Page:**
- Location: `explorar/explorar.html`
- Triggers: Nav link from any page
- Responsibilities: Browse all games with filtering by subject/letter

**Game Pages:**
- Location: `jogos/Contando_Estrelas/index.html`, `jogos/Jogo_de_Silaba/index.html`
- Triggers: Navigation from explore or home
- Responsibilities: Load and run the game in `#game-container`

## Error Handling

**Strategy:** No structured error handling — browser console errors only
- `Jogo_de_Silaba/script.js` has a `console.error()` guard on canvas context acquisition
- No user-facing error messages or fallbacks

## Cross-Cutting Concerns

**Fonts/Icons:**
- Loaded globally via `estilos/geral.css` CDN imports; available everywhere

**Navigation:**
- Duplicated HTML block across all pages (no shared include/component)
- Style: `estilos/barra_superior.css`

**Responsiveness:**
- CSS handles mobile layout; Phaser games use `Scale.FIT` / `CENTER_BOTH`
- `meta viewport` set on all pages

**Language:**
- All content and most variable/class names in Brazilian Portuguese
