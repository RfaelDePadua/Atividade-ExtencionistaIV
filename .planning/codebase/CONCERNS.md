# Codebase Concerns

**Analysis Date:** 2026-02-19

## Tech Debt
**No automated tests or CI**
- Issue: No test suite or CI workflows present.
- Impact: Refactors and dependency upgrades are higher risk.
- Fix approach: Add unit tests (Vitest) and a basic GitHub Actions CI that runs `npm test`.

**No bundler/build step**
- Issue: All code served as static files; no minification, tree-shaking, or module bundling.
- Impact: Harder to introduce modern JS toolchain, larger payloads on mobile.
- Fix approach: Introduce a lightweight bundler (Vite/Rollup) only if/when complexity grows.

## Known Bugs / TODOs (code comments)
- `jogos/Jogo_de_Silaba/script.js`: contains `// TODO: Review and expand valid words list` — game data TODO.
- No automated repros in codebase (no issue tracker entries present in repo).

## Security Considerations
- Risk: Client-only code — low server risk, but ensure assets and any future API calls sanitize user input.
- Recommendation: Add basic CSP meta tags and validate any future input sent to servers.

## Performance Bottlenecks
- Issue: Static assets (images/fonts) may be unoptimized.
- Impact: Slower initial load on mobile/slow networks.
- Fix approach: Optimize/resize images, add lazy-loading where appropriate, consider a bundler + minification.

## Fragile Areas
- Game logic concentrated in scene classes — changes can easily break levels or scoring.
- No automated tests around critical gameplay paths.

## Missing Critical Features
- README / contributing guidelines / license — onboarding and contribution friction.
- Accessibility audit — some image alt text is generic (`alt="Descrição da imagem"`).
- No CI/CD or release process configured.

## Test Coverage Gaps
- All areas: 100% untested. Prioritize:
  1. Game core logic (scoring, level progression)
  2. Asset loading / preload flows
  3. Site navigation and page load

---
*Prioritize tests and basic CI; optimize assets for performance and fix accessibility gaps early.*