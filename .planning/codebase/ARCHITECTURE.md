# Architecture Overview

**Analysis Date:** 2026-01-28

## High-level shape

- Primary surface: Static website that hosts a collection of browser games and informational pages (`index.html`, `explorar/`, `sobre_nos/`).
- Node/Express (`server.js`) is included to serve static files (and to provide a dev/host layer for deployment).
- Games are self-contained under `jogos/` with their own `index.html`, assets, and game code (e.g., `jogos/Contando_Estrelas/`).

## Entry points

- `server.js` — Node entry that serves `path.join(__dirname, 'public')` (note: repository root places `index.html` at root, not under `public/` — see CONCERNS.md)
- `index.html` — main site entry
- `jogos/*/index.html` — per-game entry points
- `jogos/Contando_Estrelas/main.js` — Phaser game bootstrap (imports scenes)

## Routing & Layers

- No server-side API endpoints beyond GET / for serving static content.
- Client-side games run in browser; game logic is implemented via Phaser scenes (`scenes/*.js`).

## Observations

- No explicit client/server API boundary beyond static hosting.
- No build pipeline — server serves static files as-is.

---

*Architecture analysis: 2026-01-28*
