# Coding Conventions

**Analysis Date:** 2026-01-28

## Observed patterns

- Frontend/game JS uses **ES modules** and `import` syntax (e.g., `jogos/Contando_Estrelas/main.js` and `scenes/*.js`).
- Node server uses **CommonJS** (`require`) in `server.js`.
- CSS class naming uses **kebab-case** (e.g., `barra-de-navegacao`).
- Game scenes are implemented as ES6 classes (PascalCase names like `BootScene`, `GameScene`).

## Recommended conventions

- Prefer **ES modules** for browser/game code (keep current usage). When adding server-side code, choose one module system consistently (ESM recommended for modern Node, or keep CommonJS and document it).
- JavaScript files: use **PascalCase** for scene/class constructors and **camelCase** for functions and variables.
- CSS: use **kebab-case** for class names to match current style.
- Keep static assets organized: `jogos/<game>/assets/` for game assets; `midia/` for site assets.
- Add a simple linter and formatter (ESLint + Prettier) to reduce style drift.

## Examples

- Scene class file: `jogos/Contando_Estrelas/scenes/BootScene.js` → export default class `BootScene` { ... }
- Game entry: `jogos/<game>/main.js` → use ES module imports for scenes and assets

---

*Conventions analysis: 2026-01-28*
