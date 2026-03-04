# Directory Structure

**Analysis Date:** 2026-03-04

## Layout

```
/                               ← Root (static site root, also GitHub Pages root)
├── index.html                  ← Homepage (planet carousel + game discovery)
├── 404.html                    ← Custom 404 page
├── package.json                ← npm manifest (dependency tracking, dev scripts)
│
├── estilos/                    ← Shared CSS (site-wide design system)
│   ├── geral.css               ← Global CSS variables, fonts, base resets
│   ├── barra_superior.css      ← Navigation bar styles (shared across all pages)
│   ├── principal.css           ← Homepage layout/sections
│   └── carousel.css            ← Planet carousel component styles
│
├── scripts/                    ← Shared JavaScript
│   └── carousel.js             ← PlanetCarousel class for homepage navigation
│
├── midia/                      ← Site-wide media assets (images, GIFs, etc.)
│
├── explorar/                   ← "Explore Games" page
│   ├── explorar.html
│   └── estilos/
│       └── principal.css       ← Page-specific styles
│
├── sobre_nos/                  ← "About Us" page
│   ├── sobre_nos.html
│   └── estilos/
│       └── principal.css       ← Page-specific styles
│
├── jogos/                      ← Games directory (each game self-contained)
│   ├── Contando_Estrelas/      ← Math game (Phaser 3, space shooter)
│   │   ├── index.html          ← Game page
│   │   ├── main.js             ← Phaser config and game bootstrap (ES module)
│   │   ├── phaser.min.js       ← Vendored Phaser 3 library
│   │   ├── scenes/             ← Phaser scene files
│   │   │   ├── BootScene.js
│   │   │   ├── PreloadScene.js ← Loads all game assets and creates animations
│   │   │   ├── MenuScene.js    ← Title/start screen
│   │   │   ├── GameScene.js    ← Main gameplay (math asteroids)
│   │   │   └── GameOverScene.js
│   │   ├── assets/             ← Game sprites, images, fonts
│   │   │   └── super-dario-advance-4.css ← Custom pixel font CSS
│   │   └── estilos/
│   │       └── principal.css   ← Game-specific page layout
│   │
│   └── Jogo_de_Silaba/         ← Syllable/word game (Vanilla Canvas 2D)
│       ├── index.html          ← Game page
│       ├── script.js           ← All game logic (vanilla, no modules)
│       ├── style.css           ← Game-specific styles
│       ├── phaser.min.js       ← Vendored Phaser (present but unused by script.js)
│       ├── assets/             ← Game assets (images)
│       └── estilos/
│           └── principal.css   ← Page-specific styles
│
└── Referencias/                ← Project documentation
    └── Guia-Visual.md          ← Visual/design system guide
```

## Key Locations

| What | Where |
|------|-------|
| CSS design tokens | `estilos/geral.css` (`:root` block) |
| Shared nav styles | `estilos/barra_superior.css` |
| Planet carousel logic | `scripts/carousel.js` |
| Game 1 entry point | `jogos/Contando_Estrelas/main.js` |
| Game 1 gameplay | `jogos/Contando_Estrelas/scenes/GameScene.js` |
| Game 2 all logic | `jogos/Jogo_de_Silaba/script.js` |
| Design guide | `Referencias/Guia-Visual.md` |

## Codebase Metrics

- **Total HTML pages:** 5 (index, 404, explorar, sobre_nos, 2 game pages)
- **Total JS files:** ~9 (carousel.js + 6 scene files + main.js + script.js; excluding phaser.min.js)
- **Total CSS files:** ~9 (shared estilos + per-page estilos)
- **Test files:** 0
- **Vendored libraries:** 2 copies of `phaser.min.js`

## Naming Conventions

- **Pages/folders:** kebab-case (`sobre_nos`, `Contando_Estrelas`) — inconsistent: some use underscores, some PascalCase
- **Phaser scene files:** PascalCase (`GameScene.js`, `MenuScene.js`)
- **CSS files:** snake_case (`barra_superior.css`, `principal.css`)
- **JS classes:** PascalCase (`PlanetCarousel`, `GameScene`)
- **Variables/functions:** camelCase, predominantly in Brazilian Portuguese

---

*Structure analysis: 2026-03-04*
