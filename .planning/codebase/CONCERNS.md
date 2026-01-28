# Concerns & Technical Debt

**Analysis Date:** 2026-01-28

## High-priority concerns

1. **Static files hosting mismatch**
   - `server.js` is configured to serve `public/` (`express.static(path.join(__dirname, 'public'))`) but `index.html` and site files live at the repo root. This will cause the server to return 404 for `/` unless files are moved or `server.js` is updated. (See `STRUCTURE.md` for remediation options.)

2. **package.json inconsistencies**
   - `package.json` lists `main: "index.js"` but there is no `index.js` at repo root. `server.js` is likely the intended entry. Also `dependencies` includes `"backend": "file:"` which appears misconfigured.

3. **No tests or linting**
   - No automated tests detected and no linter configuration. This increases risk for regressions.

4. **Mixed module systems**
   - Browser games use ES modules, server uses CommonJS. If the project evolves to shared code between server and client, decide on a single module system or add transpilation.

5. **No CI/CD or deployment documentation**
   - No GitHub Actions or other pipeline files found. Add basic pipeline to run tests and deploy or document manual deployment process.

## Low-priority / informational
- `phaser.min.js` is checked in (vendor). Consider using a package manager or CDN for easier upgrades.
- Assets are in repo increasing repo size — consider external asset hosting if repo grows.

---

*Concerns snapshot: 2026-01-28*
