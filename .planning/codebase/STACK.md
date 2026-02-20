# Technology Stack

**Analysis Date:** 2026-02-19

## Languages

**Primary:**
- JavaScript (ES2020+) — client-side game logic and site behavior (Phaser scenes, vanilla canvas game)
- HTML, CSS — static pages and styles

**Secondary:**
- JSON — configuration (`package.json`)

## Runtime

**Environment:**
- Browser (modern Chromium/Firefox/Safari) — runs the games and UI
- Node.js (developer tools only, not required to serve static site)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks / Libraries

**Core:**
- Phaser 3 (dependency: `phaser` ^3.90.0) — game framework used by `jogos/Contando_Estrelas`
- Vanilla JS + Canvas — used by `jogos/Jogo_de_Silaba`

**Dev / Local:**
- Express (devDependency) & nodemon (devDependency) — present for local/dev server use only

## Key Dependencies (critical to understand)
- `phaser` ^3.90.0 — game engine (central to the product)
- `express` ^4.21.2 (dev) — local server scaffolding
- `nodemon` ^3.1.9 (dev) — developer convenience

## Build / Dev
- Static site — no bundler (files served directly from filesystem)
- Dev server: `python -m http.server 3000` (see `npm run dev`) or use Live Server extension

## Platform / Deployment
- Target: static hosting (GitHub Pages indicated by `homepage` in `package.json`)
- No backend runtime required for production — purely client-side

---
*Notes:* repository is a static, browser-first stack centered on Phaser games. Consider adding a minimal build/bundling step and automated dependency checks if you plan to grow the project.