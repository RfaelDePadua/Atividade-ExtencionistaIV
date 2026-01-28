# Technology Stack

**Analysis Date:** 2026-01-28

**Codebase Size:**
- Files analyzed: ~30 source files (JS/HTML/CSS/scene files)
- Lines of code: ~2,000 lines (approx, excludes vendor files like phaser.min.js)

## Languages

**Primary:**
- JavaScript (ES Modules in frontend game code; CommonJS used in server) - browser game logic and Node server

**Secondary:**
- HTML/CSS - site and game UIs

## Runtime

**Environment:**
- Node.js (server) - version not specified in repo

**Package Manager:**
- npm - `package.json` present; lockfile not found (no `package-lock.json` or `yarn.lock` detected)

## Frameworks

**Core:**
- Express (^4.21.2) — server serving static files (see `server.js`)
- Phaser (bundled as `phaser.min.js` under game folders) — used for games (client-side)

**Testing:**
- Not detected — no test framework configuration found

**Build/Dev:**
- nodemon (devDependency) — for development server restarts
- No bundler (webpack/rollup/vite) detected — games appear to run in the browser directly via script imports

## Key Dependencies

**Critical:**
- `express` ^4.21.2 — drives server static hosting

**Infrastructure / Development:**
- `nodemon` ^3.1.9 — development-only convenience

## Configuration

**Environment:**
- Server reads `process.env.PORT` in `server.js` to configure port

**Build:**
- No explicit build scripts or configs found; static site and game files served directly

## Platform Requirements

**Development:**
- Node.js installed for running `server.js` and `nodemon` (recommended current LTS)

**Production:**
- Static hosting or Node/Express host; minimal runtime requirements

---

*Stack analysis: 2026-01-28*
