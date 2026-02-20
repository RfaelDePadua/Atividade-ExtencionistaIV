# Architecture

**Analysis Date:** 2026-02-19

## Pattern Overview
**Overall:** Static multi-page site with embedded client-side games (browser-executed game loops).

**Key Characteristics:**
- Client-side execution only (no server-side application logic in production)
- Each game is self-contained under `jogos/` (independent entry points)
- Assets and scenes loaded at runtime by the browser/Phaser loader

## Layers

**Presentation (Site):**
- Purpose: Site shell, navigation, game discovery UI
- Contains: `index.html`, CSS under `estilos/`, `scripts/carousel.js`
- Depends on: static assets and client-side JS

**Game Layer:**
- Purpose: Interactive educational games
- Contains: `jogos/Contando_Estrelas/` (Phaser scene-based), `jogos/Jogo_de_Silaba/` (Canvas-based)
- Depends on: Phaser (for Contando_Estrelas), browser Canvas APIs

**Assets Layer:**
- Purpose: Images, fonts, audio, sprites
- Contains: `midia/`, `jogos/*/assets/`

**Dev/Tooling Layer:**
- Purpose: Local dev server and convenience scripts
- Contains: `package.json` scripts (uses `python -m http.server`), devDependencies

## Data Flow (typical user journey)
1. Browser requests `index.html` (static hosting)
2. Client downloads CSS/JS/assets referenced by HTML
3. User navigates to a game (e.g., `jogos/Contando_Estrelas/index.html`) → game JS initializes Phaser/Canvas and loads assets
4. Gameplay state is held in-memory (browser), results are not persisted server-side

**State Management:** In-browser only (no database or server-side persistence)

## Key Abstractions
- Phaser Scenes (BootScene, PreloadScene, MenuScene, GameScene): encapsulate lifecycle of each game
- Canvas rendering loop (for `Jogo_de_Silaba`) — handcrafted game loop and drawing routines
- Static site as shell + per-game entry points

## Entry Points
- `index.html` — main site / navigation
- `jogos/Contando_Estrelas/index.html` — Phaser game launcher
- `jogos/Jogo_de_Silaba/index.html` — Canvas game launcher

## Error Handling
- Minimal/implicit (client-side console logging). No centralized error-reporting or try/catch strategy present.

## Cross-Cutting Concerns
- Asset loading and preloading (Phaser loader)
- Responsive layout handled in CSS but needs verification across viewports
- No automated observability, testing, or CI in current codebase

---
*Update this when adding server-side features or major architectural changes.*