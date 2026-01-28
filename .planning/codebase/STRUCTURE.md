# Project Structure

**Analysis Date:** 2026-01-28

## Top-level layout

```
index.html
server.js
package.json
estilos/          # CSS for site
midia/             # Images, gifs, assets used by site
jogos/             # Each game lives in a subfolder (index.html, assets/, scenes/)
  └─ Contando_Estrelas/
     ├─ index.html
     ├─ main.js
     ├─ phaser.min.js
     ├─ assets/
     └─ scenes/
explorar/          # exploratory pages
sobre_nos/         # about pages
.planning/         # (to be created) codebase docs and project planning
```

## Where to add new code

- Site pages (HTML) → add under root or dedicated folder (e.g., `pages/` or `public/`) and update navigation in `index.html`.
- New games → add a new folder under `jogos/` with `index.html`, `main.js`, `assets/` and `scenes/`.
- Server changes → `server.js` (currently only static hosting). If adding APIs, create `routes/` and `controllers/` directories.

## Static files hosting mismatch (IMPORTANT)
- `server.js` serves `path.join(__dirname, 'public')` as static root and serves `public/index.html` on `/`.
- Current repo places `index.html` at repository root, not under `public/`. Choose one of:
  - Move site files into `public/` to match `server.js` (recommended for minimal changes), or
  - Update `server.js` to point to the existing site root (`path.join(__dirname, '.')`) or explicitly to the repo root files.

## Conventions for placement
- Keep per-game assets and code entirely inside `jogos/<game>/` to keep games self-contained.
- Keep global shared assets (site-wide images, CSS) in `midia/` and `estilos/`.

---

*Structure snapshot: 2026-01-28*
