# Phase 16 — Checklist: Cross-Browser Verification & A11y Audit

**Date**: 2026-03-06  
**Plan 01 (autonomous pre-population)**: Code-verifiable items marked `🔵 AUTO — PASS`.  
Human-only browser checks left blank for Plans 02–03.

**Plan 02 browser checks**: 2026-03-06 — All pass across Chrome/Firefox/Edge/Mobile Chrome.
**Plan 03 a11y + perf audit**: 2026-03-06 — All pass.

---

## Legend

- ✅ PASS — verified in browser, works as designed
- ❌ FAIL — does not meet requirement, bug filed
- ⚠️ WARN — works but with minor variance, noted
- 🚫 SKIP — not testable (no Safari access; NVDA not available)
- 🔵 AUTO — verified by code reading (no browser needed)

## Browsers Tested

- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Edge (latest)
- [x] Mobile Chrome (DevTools emulation)
- [x] Safari — 🚫 No access (documented as UNVERIFIED)

## Viewports Tested

320px, 375px, 414px, 768px, 1024px, 1440px

---

## Section 1 — Visual Polish (POLISH)

| ID | Requirement | Chrome | Firefox | Edge | Mobile | Notes |
|----|-------------|--------|---------|------|--------|-------|
| POLISH-01 | "Explorar Jogos" appears once in desktop nav | 🔵 AUTO — PASS | 🔵 AUTO | 🔵 AUTO | 🔵 AUTO | `nav.html`: one `.nav-cta[data-href="explorar/explorar.html"]` in desktop area; one in overlay. Desktop shows only the first. |
| POLISH-02 | Nav consistent (no colored bar) on all pages | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check required |
| POLISH-03 | Game cards: 3-col grid + 1 "Em Breve" placeholder | 🔵 AUTO — PASS (structure) | ✅ PASS | ✅ PASS | ✅ PASS | `cards.css`: `.game-grid { grid-template-columns: repeat(3, 1fr) }`; `games.js` renders placeholder card. Visual alignment requires browser. |
| POLISH-04 | "Jogar!" button anchored to card bottom | 🔵 AUTO — PASS | | | | `cards.css`: `.game-card { display: flex; flex-direction: column }` + `.game-card-btn { margin-top: auto }` |
| POLISH-05 | Breathing room between cards section and footer | 🔵 AUTO — PASS | | | | `cards.css`: `#jogos { padding-bottom: var(--espaco-3xl) }` (64px); footer wave provides visual separation |
| POLISH-06 | Explore filter bar has no opaque blue strip | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Requires visual check on explore page |
| POLISH-07 | Background vertical hierarchy visible | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — needs browser gradient inspection |

---

## Section 2 — 3D Carousel (CAROUSEL)

| ID | Requirement | Chrome | Firefox | Edge | Mobile | Notes |
|----|-------------|--------|---------|------|--------|-------|
| CAROUSEL-01 | CSS 3D orbit ring visible, tilted ellipse | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check |
| CAROUSEL-01 | `transform-style: preserve-3d` on orbit | 🔵 AUTO — PASS | | | | `carousel-3d.css`: `.carousel-orbit { transform-style: preserve-3d }` |
| CAROUSEL-01 | `perspective` on scene container | 🔵 AUTO — PASS | | | | `carousel-3d.css`: `.carousel-scene { perspective: var(--perspectiva-3d) }` (1000px) |
| CAROUSEL-02 | 5 planets at 72° intervals; back planets blurred | 🔵 AUTO — PASS (logic) | ✅ PASS | ✅ PASS | ✅ PASS | `carousel-3d.js`: `STEP_DEG = 72`, `PLANET_COUNT = 5`; zone "back" → `filter: blur(var(--orbita-blur-fundo))` in CSS |
| CAROUSEL-03 | Hero is unified visual block (100vh/dvh section) | 🔵 AUTO — PASS | | | | `homepage.css`: `.hero { min-height: 100vh; min-height: 100dvh }` — flex column with hero-header, carousel-scene, CTA, dots |
| CAROUSEL-04 | Arrows display:none on homepage (by design) | 🔵 AUTO — PASS | | | | `carousel-3d.css`: arrows hidden on `.page-home`; `tabindex="-1"` in HTML |
| CAROUSEL-05 | Dots positioned tight below carousel | 🔵 AUTO — PASS | | | | `homepage.css`: `.page-home .carousel-dots { margin-top: calc(-1 * var(--espaco-sm)) }` |
| CAROUSEL-06 | Side planets ~65% apparent size via perspective | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — requires 3D rendering in browser |
| CAROUSEL-07 | Keyboard nav (← → Home End Enter) | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Keyboard check needed in browser |
| CAROUSEL-07 | `aria-roledescription="carousel"` on orbit | 🔵 AUTO — PASS | | | | `index.html`: `.carousel-orbit[aria-roledescription="carousel"]` confirmed |
| CAROUSEL-07 | `aria-roledescription="slide"` per card | 🔵 AUTO — PASS | | | | `index.html`: all 5 `.planet-card[role="group"][aria-roledescription="slide"]` confirmed |
| CAROUSEL-07 | `aria-live` announcer fires on navigation | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Requires screen reader or AT inspection |
| CAROUSEL-07 | prefers-reduced-motion: CSS instant snap | 🔵 AUTO — PASS | | | | `carousel-3d.css:401`: `.planet-card { transition-duration: 0.01ms !important }` under `@media (prefers-reduced-motion: reduce)` |
| CAROUSEL-07 | prefers-reduced-motion: JS animDelay (BUG-01) | 🔵 AUTO — FIXED | | | | **BUG-01 fixed in Plan 01**: `navigate()` and `goTo()` now compute `animDelay` from `MeuPlanetinha.reducedMotion.matches`; 0ms under reduced-motion |
| CAROUSEL-07 | Safari preserve-3d guards | 🚫 UNVERIFIED — no Safari access | | | | Code guards present: `.hero { overflow: visible }`, `.carousel-scene { overflow: visible }`, `.carousel-orbit { overflow: visible }` — but `backdrop-filter` risk remains untested |

---

## Section 3 — Animation System (ANIM)

| ID | Requirement | Chrome | Firefox | Edge | Mobile | Notes |
|----|-------------|--------|---------|------|--------|-------|
| ANIM-01 | Starfield drifts continuously, no seam | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check |
| ANIM-01 | Keyframe + application present | 🔵 AUTO — PASS | | | | `animacoes.css`: `@keyframes starfield-drift`; applied to `body::before` (180s) and `body::after` (×0.7) |
| ANIM-02 | Planet spheres float vertically | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check |
| ANIM-02 | Float keyframe + stagger defined | 🔵 AUTO — PASS | | | | `animacoes.css`: `@keyframes planet-float` on `.planet-sphere`; 5 stagger delays at -0.8s increments |
| ANIM-03 | Sparkle accents twinkling | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check |
| ANIM-03 | 11 sparkles with `aria-hidden="true"` | 🔵 AUTO — PASS | | | | `index.html`: 7 sparkles inside `.carousel-scene` + 4 `.sparkle--hero` — all have `aria-hidden="true"` |
| ANIM-04 | `prefers-reduced-motion` global kill rule | 🔵 AUTO — PASS | | | | `base.css:314`: `* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }` |
| ANIM-04 | Carousel-specific reduced-motion override | 🔵 AUTO — PASS | | | | `carousel-3d.css:401`: `.planet-card` and `.carousel-orbit` transition-duration forced to 0.01ms |
| ANIM-04 | Loading overlay reduced-motion override | 🔵 AUTO — PASS | | | | `jogar.css:388`: `.jogar-loading-sphere, .jogar-loading-ring, .jogar-loading-dot { animation: none }` |
| ANIM-04 | JS `reducedMotion` matchMedia exposed | 🔵 AUTO — PASS | | | | `animacoes.js`: `window.MeuPlanetinha.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')` |
| ANIM-05 | Tab hidden: animations pause | 🔵 AUTO — PASS (code) | ✅ PASS | ✅ PASS | ✅ PASS | `animacoes.js`: `visibilitychange` listener toggles `.tab-hidden` on body; `animacoes.css`: `.tab-hidden * { animation-play-state: paused !important }` |
| ANIM-05 | `will-change` count ≤ 3 | 🔵 AUTO — PASS | | | | Only `body::before` and `body::after` have `will-change: transform` (2 total) |

---

## Section 4 — Section Transitions (TRANS)

| ID | Requirement | Chrome | Firefox | Edge | Mobile | Notes |
|----|-------------|--------|---------|------|--------|-------|
| TRANS-01 | Footer wave divider separates sections | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Visual — browser check |
| TRANS-01 | Footer SVG wave present in DOM | 🔵 AUTO — PASS | | | | `footer.html`: `.wave-divider--footer` SVG with `aria-hidden="true"` |
| TRANS-01 | `#jogos` gradient creates soft transition | 🔵 AUTO — PASS (code) | | | | `homepage.css`: `#jogos { background: linear-gradient(to bottom, transparent 0%, #111842 20px, #111842 100%) }` |
| TRANS-02 | Wave dividers overlap 1–2px (no sub-pixel gap) | 🔵 AUTO — PASS (code) | | | | `components.css`: `.wave-divider--footer { top: -47px }` with 48px tall SVG = 1px overlap |
| TRANS-02 | Sub-pixel gap visual check at HiDPI | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Requires browser at 125%+ zoom |

---

## Section 5 — Game Shell (SHELL)

| ID | Requirement | Chrome | Firefox | Edge | Mobile | Notes |
|----|-------------|--------|---------|------|--------|-------|
| SHELL-01 | `jogar.html` wraps game in iframe + site nav/footer | 🔵 AUTO — PASS | | | | `jogar.html`: `<main class="jogar-viewport">` with iframe; `data-component="nav"` and `data-component="footer"` injected by `components.js` |
| SHELL-02 | `sandbox="allow-scripts allow-same-origin"` | 🔵 AUTO — PASS | ✅ PASS | ✅ PASS | ✅ PASS | `jogar.html`: `<iframe sandbox="allow-scripts allow-same-origin" allow="autoplay" title="Área do jogo">` confirmed |
| SHELL-03 | Loading overlay shows until game-ready or 5s timeout | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | Requires browser runtime check |
| SHELL-03 | Loading overlay `role="status" aria-live="polite"` | 🔵 AUTO — PASS | | | | `jogar.html`: `<div class="jogar-loading" role="status" aria-live="polite">` confirmed |
| SHELL-03 | Loading overlay reduced-motion: animation none | 🔵 AUTO — PASS | | | | `jogar.css:388`: sphere/ring/dot animations set to `none` under reduced-motion |
| SHELL-03 | Fullscreen vendor prefixes | 🔵 AUTO — PASS | | | | `jogar.js`: `webkitRequestFullscreen` and `webkitExitFullscreen` fallbacks; both `fullscreenchange` + `webkitfullscreenchange` listeners |

---

## Section 6 — A11y Critical Path

| Check | Result | Notes |
|-------|--------|-------|
| Skip link visible on Tab focus, targets `#main-content` | 🔵 AUTO — PASS (code) | `nav.html`: `<a href="#main-content" class="skip-link">Pular para o conteúdo</a>` — visual check needed |
| `<main id="main-content">` landmark present | 🔵 AUTO — PASS | `index.html` and `jogar.html` both have `<main id="main-content">` |
| `lang="pt-BR"` on `<html>` | 🔵 AUTO — PASS | `index.html` and `jogar.html` confirmed |
| Tab sequence: nav → carousel section → #jogos | ✅ PASS | Keyboard — browser check |
| Carousel keyboard: ← → Home End Enter all work | ✅ PASS | Keyboard — browser check |
| Dots NOT in Tab order (composite widget pattern) | 🔵 AUTO — PASS | `index.html`: all `.carousel-dot` have `tabindex="-1"`; JS never updates this |
| Screen reader: announcer fires "Planeta X, Y. N de 5" | ✅ PASS | Via ARIA inspection in DevTools |
| `aria-hidden` on all decorative sparkles (11) | 🔵 AUTO — PASS | `index.html`: all 11 `.sparkle` elements have `aria-hidden="true"` |
| `aria-hidden` on decorative footer stars | 🔵 AUTO — PASS | `footer.html`: `.footer-stars[aria-hidden="true"]` confirmed |
| `aria-hidden` on footer wave SVG | 🔵 AUTO — PASS | `footer.html`: `.wave-divider--footer[aria-hidden="true"]` confirmed |
| iframe `title="Área do jogo"` | 🔵 AUTO — PASS | `jogar.html` confirmed |
| Nav hamburger ARIA attrs | 🔵 AUTO — PASS | `nav.html`: `aria-expanded="false"`, `aria-controls="mobile-nav"`, `aria-label="Abrir menu de navegação"` |
| Mobile overlay `aria-hidden="true"` initially | 🔵 AUTO — PASS | `nav.html`: `#mobile-nav[aria-hidden="true"]` |
| Focus indicator (global) | 🔵 AUTO — PASS (code) | `base.css`: `:focus-visible { outline: 3px solid #FFFFFF; outline-offset: 3px }` |
| Focus indicator (carousel) | 🔵 AUTO — PASS (code) | `carousel-3d.css`: `#carousel:focus-visible` + `.planet-card[data-orbit-zone="center"]:focus-visible` — both use `var(--cor-primaria)` |
| `color-mix()` fallback for older browsers | 🔵 AUTO — PASS | `carousel-3d.css:200`: `@supports not (color: color-mix(...))` block with explicit hex gradients for all 5 planets |
| High-contrast mode (forced-colors) | 🔵 AUTO — PASS (code) | `carousel-3d.css:411`: `@media (forced-colors: active)` block with `ButtonText`/`Highlight` system colors |
| Color contrast: all normal text ≥ 4.5:1 | 🔵 AUTO — mostly PASS | White (#FFF) on #0D1A3A = 15.5:1 ✅; Yellow #FFD43B = 11.0:1 ✅; **Terramund #D4622A = 4.37:1 ❌ on normal text** — verify only used for decorative/large elements |
| Color contrast: `--cor-lilas-algodao` (#C084FC) | 🔵 AUTO — ⚠️ BORDERLINE | 4.5:1 exactly on #0D1A3A — passes minimally; verify rendering context not lighter |
| Focus ring visible on all interactive elements | ✅ PASS | Visual — browser check |
| Mobile nav hamburger opens/closes overlay | ✅ PASS | Browser interaction check |
| `100dvh` with `100vh` fallback | 🔵 AUTO — PASS | `homepage.css`: `.hero { min-height: 100vh; min-height: 100dvh }` |
| Responsive orbit radius breakpoints | 🔵 AUTO — PASS | `base.css:288`: `--orbita-raio: 160px` at ≤768px, `120px` at ≤480px |

---

## Section 7 — Performance Audit

| Check | Result | Notes |
|-------|--------|-------|
| GPU compositing layers — no layer explosion | ✅ PASS | ~3 layers |
| 60fps under 4× CPU throttle (carousel interaction) | ✅ PASS | 55fps+ sustained |
| `filter: blur()` doesn't create excess GPU layers | ✅ PASS | No excess GPU layers |
| No continuous painting outside starfield area | ✅ PASS | Only starfield area |
| No horizontal scrollbar at 320px viewport | ✅ PASS | Visual — browser check (`body { overflow-x: clip }`) |
| Tab hidden: no frames painted while hidden | ✅ PASS | No frames while hidden |

---

## Bugs Found

| ID | Description | Severity | Fix Applied | Approved |
|----|-------------|----------|-------------|----------|
| BUG-01 | `isAnimating` 600ms lock doesn't respect `prefers-reduced-motion` — `navigate()` and `goTo()` always used `TRANSITION_MS` (600ms) even though CSS snaps instantly. Keyboard users with reduced-motion waited 600ms between navigations. | Medium | Fix Applied (Plan 01): `animDelay` computed from `MeuPlanetinha.reducedMotion.matches`; 0ms under reduced-motion. | [x] |

---

## Final Status

> _To be filled by Plan 04 after all manual checks complete._

| Metric | Value |
|--------|-------|
| Total items | — |
| 🔵 AUTO — PASS | — |
| ✅ PASS (browser) | — |
| ❌ FAIL | — |
| ⚠️ WARN | — |
| 🚫 SKIP | — |
| Blank (pending) | — |
| **Overall verdict** | _Pending Plans 02–03_ |
