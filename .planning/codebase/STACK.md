# Technology Stack

**Analysis Date:** 2026-03-04

## Languages

**Primary:**
- JavaScript (ES2020+) — all game logic and interactive UI (`scripts/`, `jogos/*/`)
- HTML5 — page structure and game containers (all `.html` files)
- CSS3 — styling and design system (`estilos/`)

**Secondary:**
- Markdown — documentation (`Referencias/Guia-Visual.md`)

## Runtime

**Environment:**
- Browser-based static site — no server-side runtime required
- Development: Python HTTP server (`python -m http.server 3000`) or VS Code Live Server

**Package Manager:**
- npm (package-lock.json present)
- Used primarily to track dependencies; no build step required

## Frameworks

**Game Engine:**
- Phaser 3 (`^3.90.0`) — used in `jogos/Contando_Estrelas/` for scene management, physics, sprites, and animations
  - Bundled locally as `phaser.min.js` in each game folder (not loaded from CDN)

**No web framework** — vanilla HTML/CSS/JS for the site shell; no React, Vue, Angular, or similar

**Build/Dev:**
- No bundler (no Webpack, Vite, Parcel, etc.)
- No transpiler (no Babel, TypeScript)

## Key Dependencies

**Production:**
- `phaser ^3.90.0` — 2D game engine powering `Contando_Estrelas`; vendored locally inside each game folder

**Dev Only (archived/legacy):**
- `express ^4.21.2` — local dev HTTP server; superseded by Python server / Live Server
- `nodemon ^3.1.9` — file watcher for express server; no longer actively used
- `get-shit-done-multi ^2.0.4` — GSD project planning workflow tooling

## External CDNs (loaded in browser)

- **Google Fonts** — `Bricolage Grotesque`, `Lexend`, `Patrick Hand`, `Fredoka` (loaded in `geral.css`)
- **Bootstrap Icons v1.11.3** — icon library (loaded via CDN in `geral.css`)

## Configuration

**Environment:**
- No environment variables; fully static — no `.env` files needed

**Build:**
- No build config files; source = deployable output

## Platform Requirements

**Development:**
- Any platform with a modern browser and Python 3 (for local server)
- Node.js required only for `npm install` (dependency tracking)

**Production:**
- GitHub Pages (static hosting)
- Homepage: `https://USERNAME.github.io/Atividade-ExtencionistaIV/`

---

*Stack analysis: 2026-03-04*
*Update after major dependency changes*
