# Project State

## Project Reference

See: [.planning/PROJECT.md](.planning/PROJECT.md) (updated 2026-03-05)

**Core value:** A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.
**Current focus:** v2.0 complete — Phase 16 (Cross-Browser Verification & A11y Audit) finished. All v2.0 phases complete.

## Current Position

Milestone: v2.0 Visual Polish, 3D Carousel & Platform Prep
Phase: 16 of 17 (Complete) — Phase 17 (stretch) already complete
Plan: 4 of 4
Status: Phase 16 complete. All v2.0 phases complete.
Last activity: 2026-03-06 — Phase 16 executed: cross-browser verification + a11y audit. BUG-01 fixed. All items pass. v2.0 milestone complete.

Progress: [████████████████████████████████████████████████] 100%

## v1.0 Summary (Shipped)

- 11 phases, 46 plans, ~140 min total execution
- Site live at https://rfaeldePadua.github.io/Atividade-ExtencionistaIV/
- All 13 v1 requirements verified and shipped 2026-03-05

## v2.0 Phase Overview

| Phase | Name | Requirements | Status |
|-------|------|-------------|--------|
| 12 | Foundation — Tokens & Quick Polish | POLISH-01–06 (6) | ✅ Complete |
| 13 | Animation System | ANIM-01–05 (5) | ✅ Complete |
| 14 | 3D Orbital Carousel | CAROUSEL-01,02,04,05,06,07 (6) | ✅ Complete |
| 15 | Unified Hero & Section Transitions | CAROUSEL-03, TRANS-01,02, POLISH-07 (4) | ✅ Complete |
| 16 | Cross-Browser Verification & A11y Audit | Verify all above (0 new) | ✅ Complete |
| 17 | Game Shell & Iframe Sandbox (Stretch) | SHELL-01–03 (3) | ✅ Complete |

## Performance Metrics

**v1.0 Velocity:**
- Total plans completed: 46
- Average duration: ~5 min/plan
- Total execution time: ~140 min

**v2.0 Velocity:**
- Total plans completed: 18
- Estimated phases: 6 (12–17)

## Accumulated Context

### v1.0 Decisions (Carried Forward)

- **Init**: Rebuild from scratch — zero reuse of existing site HTML/CSS/JS (games untouched)
- **Init**: Vanilla HTML/CSS/JS only — no build tool, no bundler, deploys to GitHub Pages as-is
- **Init**: Shared nav/footer via JS `fetch()` + innerHTML injection — `components/components.js`
- **Init**: Design authority: `Referencias/Guia-Visual.md` — all visual decisions reference it
- **Phase 2**: Footer uses tagline "Explore o universo do aprendizado!" (not Guia-Visual default)
- **Phase 2**: Only one footer link for v1: Contato (mailto:) — no Privacidade/Termos
- **Phase 2**: `body { display: flex; flex-direction: column }` established in components.css — footer pushed to bottom via `[data-component="footer"] { margin-top: auto }`
- **Phase 2**: Footer wave uses `clip-path: polygon()` with 42px height (2px overlap) to eliminate subpixel rendering gap
- **Phase 3**: Gradient angle `170deg` (not 180deg) — blue covers 0–65%, magenta only bottom 35%
- **Phase 3**: Container padding scale: 16px mobile (≤640px) / 24px default / 32px desktop (≥1024px)
- **Phase 3**: Stars/nebulae are `position: fixed` using `box-shadow` and `radial-gradient` on body pseudo-elements — no canvas, no SVG, no JS
- **Phase 3**: Accent colors Laranja-Tang, Rosa-Chiclete, Lílás-Algodão restricted to large text/decorative use (only 3:1–4.99:1 on gradient)
- **Phase 4**: `body.page-home` scoping pattern — homepage-only CSS overrides without global side effects
- **Phase 4**: Fixed nav with layout space reserved via `[data-component="nav"] { min-height: 64px }` — content doesn't collapse
- **Phase 4**: homepage.js IIFE pattern — page-specific JS loaded after components.js, no global pollution
- **Phase 4**: `.nav-cta` intercept via event delegation on `[data-component="nav"]` wrapper — catches both desktop + mobile CTAs
- **Phase 7**: `explore.css` path used instead of plan-specified `estilos/pages/explorar.css` — consistent naming with JS file
- **Phase 7**: `scripts/games.js` public API placed before `init()` call — ensures `window.MeuPlanetinha.games` is defined even if `init()` no-ops on explore page
- **Phase 8**: CSS initials avatars chosen over image references. `body.page-sobre-nos` scoping pattern follows Phase 4/7 precedent.
- **Phase 9**: `404.html` at root depth — `body.page-404` scoping. GitHub Pages auto-serves `404.html` for unmatched paths.
- **Phase 10**: Carousel dots use padding+background-clip tap target trick (14px visual, 44px tap). Single-Tab-stop carousel widget (tabindex=-1 on arrows/dots). Named difficulty labels (Fácil/Médio/Difícil). Focus moves to jogos heading after planet selection (Home/End also added).

### v2.0 Decisions (New)

- **Research**: Zero new dependencies — all native CSS 3D transforms, @keyframes, inline SVG, vanilla JS
- **Research**: 3D carousel uses CSS Custom Property Animation Driver pattern — JS sets `--orbit-angle`, CSS handles all positioning
- **Research**: `carousel-3d.css` + `carousel-3d.js` fully replace v1 carousel files (not incremental modification)
- **Research**: 9 new CSS custom properties extending `base.css` for 3D perspective, animation timing, z-index layers
- **Research**: `estilos/animacoes.css` is the centralized animation stylesheet (new file)
- **Research**: Wave dividers are inline SVG Bézier curves (~150 bytes each), styled via componentes.css
- **Research**: MAX 3-4 `will-change` elements to prevent GPU memory exhaustion (remove v1's per-planet `will-change`)
- **Phase 14**: Per-card counter-rotation (`rotateY(θ) translateZ(R) rotateY(-θ)`) — orbit ring stays static, JS sets `--card-angle` per card
- **Phase 14**: Blur-only depth cueing — no opacity on planet zones; depth via `filter: blur()` only to avoid mid-transition transparency
- **Phase 14**: Sparkles placed inside `.carousel-scene` to share stacking context with 3D-projected planets
- **Phase 15**: Hero→cards wave divider removed per user preference — gradient background on `#jogos` creates soft transition instead
- **Phase 15**: `#jogos` uses `background: linear-gradient(transparent → #111842 at 80px)` — distinct from footer (#0B0F2E)
- **Phase 15**: `overflow-x: clip` on `body` (not `html`) — `position: fixed` nav unaffected since fixed elements reference viewport
- **Phase 15**: `.hero-header` frosted glass (`backdrop-filter: blur(12px)`) — sibling of `.carousel-scene`, never a parent (would flatten preserve-3d)
- **Phase 15**: Skip-link changed to `:focus-visible` — no longer visible on click-focus
- **Phase 15**: 11 total sparkles in hero area (7 inside `.carousel-scene`, 4 `.sparkle--hero` as direct `.hero` children)
- **Phase 16**: BUG-01 fixed (carousel isAnimating 600ms lock under reduced-motion). Safari preserve-3d documented as unverified (RISK-02). Zero additional bugs found in browser/a11y/performance testing.

### v2.0 Critical Pitfalls

- **P-01**: Safari `preserve-3d` flattening — `overflow: hidden` on ANY ancestor kills 3D. v1 `.carousel-track` has `overflow: hidden` and MUST be removed.
- **P-04**: Box-shadow starfield repaints — animate via `transform: translate()` only, never animate box-shadow values.
- **P-05**: GPU memory — MAX 3-4 `will-change` elements.
- **P-09**: `prefers-reduced-motion` must cover JS — CSS media query alone is insufficient for JS-driven carousel rotation.
- **P-12**: Battery drain — pause animations when `document.hidden`.

### Pending Todos

- [x] ~~Begin Phase 12: update `estilos/base.css` with 3D/animation tokens~~ ✅
- [x] ~~Phase 12: fix header duplicate "Explorar Jogos" (POLISH-01, POLISH-02)~~ ✅
- [x] ~~Phase 12: card grid 3-col + "Em Breve" placeholder (POLISH-03, POLISH-04)~~ ✅
- [x] ~~Phase 12: index spacing + explore filter (POLISH-05, POLISH-06)~~ ✅
- [x] ~~Begin Phase 13: create `estilos/animacoes.css` with @keyframes~~ ✅
- [x] ~~Phase 13: integrate animation system into all pages~~ ✅
- [x] ~~Phase 14: build `carousel-3d.css` + `carousel-3d.js`~~ ✅
- [x] ~~Phase 15: merge hero section + wave dividers~~ ✅
- [x] ~~Phase 16: cross-browser + a11y verification~~ ✅
- [x] ~~Phase 17 (stretch): game shell iframe wrapper~~ ✅

- **Phase 17**: `jogos/jogar.html` shell page loads games in sandboxed iframe with site nav/footer; URL routing via `?game=<id>`, loading overlay with 5s timeout + postMessage, floating controls (back/mute/fullscreen), error state for invalid IDs
- **Phase 17**: Both games stripped of legacy chrome (nav/header/footer/old CSS), send `postMessage('game-ready')` to parent
- **Phase 17**: `scripts/games.js` updated: `findGameById()` added, card links route through `jogar.html?game=<id>`

### Blockers/Concerns

- Safari preserve-3d flattening is the #1 risk — test early in Phase 14
- Need Safari (macOS or iOS) access for Phase 16 verification
- Phase 17 is stretch — may defer to v2.1 if timeline tightens

## Session Continuity

Last session: 2026-03-06
Stopped at: Phase 16 complete. All v2.0 phases (12–17) complete. v2.0 milestone shipped.
Resume file: None
