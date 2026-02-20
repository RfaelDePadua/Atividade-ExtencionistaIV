# Codebase Structure

**Analysis Date:** 2026-02-19

## Directory Layout

```
[project-root]/
├── index.html                 # Site shell / entry page
├── estilos/                   # CSS (site + game-specific styles)
├── explorar/                  # "Explorar" page
├── jogos/                     # Per-game folders (self-contained games)
│   ├── Contando_Estrelas/     # Phaser-based game (scenes, assets)
│   └── Jogo_de_Silaba/        # Canvas-based educational game
├── midia/                     # Shared media (images used by site)
├── scripts/                   # Global client-side scripts (carousel.js)
├── sobre_nos/                 # About page
├── package.json               # Project metadata + dev scripts
└── .planning/                 # (created) project planning & codebase map
    └── codebase/              # STACK/ARCHITECTURE/STRUCTURE/etc. (this map)
```

## Directory Purposes

**`estilos/`**
- Purpose: Site and page styling
- Contains: CSS files used by `index.html` and subpages

**`jogos/`**
- Purpose: Each game is isolated in its own subfolder containing game HTML, JS, assets, and styles
- Key files: `index.html`, `main.js` or `script.js`, `phaser.min.js`, `assets/`, `estilos/`, `scenes/`

**`midia/`**
- Purpose: Shared images and thumbnails used across the site

**`scripts/`**
- Purpose: Small UI scripts (carousel behavior)

**`sobre_nos/`, `explorar/`**
- Purpose: Content pages (static HTML + CSS)

**`package.json`**
- Purpose: Dev scripts and dependency list (Phaser listed as dependency)

## Key File Locations / Where to add new code
- Site entry: `index.html` — add global UI changes here
- New game: add a new folder under `jogos/` with `index.html`, `assets/`, and game scripts
- Shared assets: `midia/`
- Global JS: `scripts/` (small helpers like `carousel.js`)
- Styles: add CSS files under `estilos/` (or `jogos/<game>/estilos/` for game-specific styles)

## Naming Conventions (observed)
- `scenes/` files: PascalCase for scene classes (`BootScene.js`, `GameScene.js`)
- General scripts: kebab or lowerCamel (`script.js`, `carousel.js`)
- CSS files: kebab-case (`principal.css`, `carousel.css`)

## Special Notes
- Games are designed to be self-contained directories — good for incremental additions or separate deployments.
- No `src/`/`dist/` distinction — repository serves static files directly.

---
*Update when directory layout changes or when adding build outputs.*