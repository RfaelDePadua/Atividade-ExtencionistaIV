# Coding Conventions

**Analysis Date:** 2026-03-04

## Language

All user-facing content and most variable/function/class names are in **Brazilian Portuguese**:
- Variables: `jogador`, `silabas`, `palavrasValidas`, `velocidade`, `inimigosRestantes`
- CSS classes: `.barra-de-navegacao`, `.barra-de-pesquisa`, `.cor-primaria`
- Comments: Mixed (Portuguese and some English)

Exception: GSD/tooling files in English (`.github/`, `.planning/`)

## Naming Patterns

**Files:**
- Phaser scene files: `PascalCase.js` (e.g., `GameScene.js`, `PreloadScene.js`)
- Game entry points: lowercase (`main.js`, `script.js`)
- CSS files: `snake_case.css` (`barra_superior.css`, `principal.css`)
- HTML pages: `snake_case.html` (`sobre_nos.html`, `explorar.html`) or lowercase (`index.html`)
- Folder names: inconsistent — `Contando_Estrelas` (PascalCase_underscore), `scripts` (lowercase), `estilos` (lowercase)

**Functions:**
- camelCase: `setupEventListeners()`, `updatePlanetStates()`, `comecarOnda()`
- Handler convention: descriptive Portuguese verbs (`comecar`, `atualizar`, `criar`)

**Variables:**
- camelCase: `currentIndex`, `isAnimating`, `touchStartX`
- Portuguese names: `jogador`, `silabas`, `listaSimbolos`, `fundoMovimento`
- Constants: no UPPER_SNAKE_CASE convention established — `camelCase` used for all

**CSS Classes:**
- kebab-case: `.planet-card`, `.carousel-track`, `.nav-links`, `.barra-de-pesquisa`
- BEM not used — flat class names with some contextual nesting

**Phaser Scenes:**
- Class name = file name = scene key string (e.g., class `GameScene`, file `GameScene.js`, key `'GameScene'`)

## Code Style

**Formatting:**
- No Prettier or automated formatter configured
- Indentation: 2 spaces (site shell) or 4 spaces (game scenes) — inconsistent between files
- Quotes: single quotes in JS (`'GameScene'`), double quotes in HTML attributes
- Semicolons: present throughout

**Linting:**
- No ESLint configured

## Module System

**Contando_Estrelas:** ES Modules (`export default class`, `import X from './X.js'`)
- `main.js` uses `type="module"` in the HTML `<script>` tag
- Scene files all use `export default class`

**Jogo_de_Silaba:** No modules — single flat script
- `script.js` uses global scope; `<script src="script.js">` without `type="module"`
- All game state as module-level `const`/`let` variables

**Site Shell:** No modules
- `scripts/carousel.js` defines `PlanetCarousel` globally via class; auto-inits with `DOMContentLoaded`

## CSS Conventions

**Design System:**
- All design tokens in CSS custom properties under `:root` in `estilos/geral.css`
- Token naming: `--cor-primaria`, `--fonte-display`, `--espaco-md`, etc.
- Organized sections: PRIMARY COLORS, LEGACY COLORS, PLANET ACCENT COLORS, FUNCTIONAL COLORS, TYPOGRAPHY, SPACING SCALE, LAYOUT, ANIMATION TIMING

**Page-specific styles:**
- Each page/game has its own `estilos/principal.css` that imports or assumes shared styles are already loaded
- Shared styles must be loaded before page-specific styles (HTML `<link>` order)

## Error Handling

**Patterns:**
- Minimal — no structured error handling
- `Jogo_de_Silaba/script.js`: single `console.error()` guard for canvas context
- Phaser handles its own errors internally
- No user-facing error messages or try/catch in application code

## Comments

- Portuguese comments for game logic: `// Inicializar variáveis`, `// Criar o player fora da tela`
- English comments for design system: `/* PRIMARY COLORS */`, `/* DESIGN SYSTEM v1.0 */`
- TODO present in `Jogo_de_Silaba/script.js`: `// TODO: Review and expand valid words list for educational value`

---

*Conventions analysis: 2026-03-04*
