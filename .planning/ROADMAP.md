# Roadmap: Meu Planetinha — Website Redesign

## Overview

The rebuild proceeds in 11 phases, moving from the design system foundation outward toward each page, and finishing with accessibility and compatibility validation. Phases 1–3 establish the substrate (tokens, shared components, global styles) that all subsequent pages depend on. Phases 4–9 deliver each page independently. Phases 10–11 verify correctness across the full site. Games in `jogos/` are never modified.

## Phases

- [x] **Phase 1: Design System Foundation** — CSS tokens, typography, button components, color system
- [x] **Phase 2: Shared Nav & Footer Components** — fetch-based component loader, nav.html, footer.html
- [x] **Phase 3: Global Layout & Space Background** — body gradient, container system, spacing scale, page shell
- [x] **Phase 4: Homepage Structure & Header** — index.html scaffold, fixed header, hero section
- [x] **Phase 5: Planet Carousel** — 5 planets, Órbita Central layout, navigation, planet filtering
- [ ] **Phase 6: Game Cards** — card component, game data, carousel filter integration
- [ ] **Phase 7: Explore Page** — full game grid, planet filter buttons, filter logic
- [ ] **Phase 8: About Us Page** — team section, on-brand design
- [ ] **Phase 9: 404 Page** — space-themed not-found page
- [ ] **Phase 10: Accessibility Audit** — contrast ratios, touch targets, keyboard nav, semantic HTML
- [ ] **Phase 11: Compatibility & Integration** — GitHub Pages paths, game page isolation, cross-browser check

---

## Phase Details

### Phase 1: Design System Foundation
**Goal**: A single `estilos/base.css` file that implements the complete Guia-Visual design system. All downstream phases import this file and inherit the correct tokens.
**Depends on**: Nothing
**Requirements**: DS-01, DS-02, DS-03, DS-04, DS-05, DS-06, DS-07, DS-08
**Success Criteria**:
  1. `estilos/base.css` exists with all CSS custom properties from Guia-Visual (palette, spacing, typography, planet accents) in a `/:root {}` block
  2. A test page opening `base.css` shows the three Google Fonts (Fredoka One, Nunito, Press Start 2P) rendering correctly, loaded with `preconnect` + `display=swap` (no render-block)
  3. `.btn-primario` and `.btn-secundario` component classes render correctly per Section 07 of Guia-Visual
  4. All 5 planet accent variable sets exist (`--planeta-calculon-cor`, `--planeta-letrion-cor`, etc.)
  5. Responsive container class centers content correctly from 320px to 1440px

**Plans:**
- [ ] 01-01: Create `estilos/reset.css` (CSS reset) + `estilos/base.css` (complete `:root` token block — palette, semantics, 5 planets, typography, spacing, shadows, borders, transitions + base element styles)
- [ ] 01-02: Create `estilos/layout.css` (container, grid, spacing utils, `.sr-only`) + `estilos/componentes.css` (`.btn-primario`, `.btn-secundario`, planet button variants)
- [ ] 01-03: Create `_design-system-test.html` visual test fixture — verifies all tokens, fonts, colors, planets, buttons, layout, icons, accessibility

---

### Phase 2: Shared Nav & Footer Components
**Goal**: A single source of truth for site navigation and footer, loaded via JS fetch on all site pages. Game pages in `jogos/` are explicitly never touched.
**Depends on**: Phase 1
**Requirements**: NAV-01 to NAV-06, FOOT-01 to FOOT-04
**Success Criteria**:
  1. `components/nav.html`, `components/footer.html`, and `components/components.js` exist
  2. A test page at root depth loads the nav/footer correctly via `components.js`
  3. A test page at `/explorar/` depth loads the nav/footer correctly (paths resolve)
  4. The active page's nav link has `aria-current="page"` attribute applied automatically
  5. If JS is disabled or fetch fails, a basic inline fallback nav renders
  6. Footer contains logo, tagline, and Contato link (single parent-facing link for v1 per user decision); background is `#0B0F2E`
  7. Nav is keyboard-navigable; all focus styles are visible

**Plans:**
- [ ] 02-01 (Wave 1): Create `components/nav.html` (nav fragment with skip-link, logo, links, CTA, hamburger, mobile overlay) + `components/footer.html` (footer fragment with wave, logo, tagline, Contato, star SVGs) + `components/components.css` (all nav + footer styles, mobile responsive ≤640px, FOUC prevention)
- [ ] 02-02 (Wave 2): Create `components/components.js` (fetch loader, `document.currentScript.src` base-path detection, `data-href` link rewriting, `aria-current="page"` detection, mobile menu toggle) + root-level test page `_nav-footer-test.html`
- [ ] 02-03 (Wave 3): Create depth-1 test page `explorar/_nav-footer-test.html` + verify all 7 Phase 2 success criteria (path resolution, keyboard nav, active page, fallback, footer visuals)

---

### Phase 3: Global Layout & Space Background
**Goal**: Every site page has the correct full-page space gradient background, a consistent page shell, and properly structured `<html>` with `lang`, meta tags, and font `<link>` preconnects.
**Depends on**: Phase 1, Phase 2
**Requirements**: BG-01, BG-02, BG-03, DS-06
**Success Criteria**:
  1. Every site page (index, explorar, sobre_nos, 404) shows the `#1A3A8F → #2D1B8A → #8B1A6B` gradient background
  2. No transitions or animations exist on the background in v1
  3. A shared `_template.html` or documented HTML head block ensures all pages include correct charset, viewport, lang, preconnect links, and CSS file order
  4. Text on the gradient background passes 5:1+ contrast for all white/light text
  5. Game pages (`jogos/`) are unaffected — no gradient, no style contamination

**Plans:**
- [x] 03-01: Define and verify the space gradient CSS (`background: linear-gradient(...)`) in `base.css`; confirm exact hex values match Guia-Visual Section 01
- [x] 03-02: Create `_template.html` — a documented HTML page template with all required `<head>` elements (charset, viewport, `lang="pt-BR"`, `<base href>`, preconnect links, CSS load order) that all new pages will copy from
- [x] 03-03: Create `estilos/pages/page-shell.css` — `.page-wrapper` flex column layout (header + main grows + footer at bottom), gradient background on body
- [x] 03-04: Run contrast check on all Guia-Visual color pairings against the gradient background; document passing/failing combinations in `.planning/` for reference
- [x] 03-05: Confirm no shared CSS file is accidentally linked from a game page (verify `jogos/*/index.html` files — they should not reference `../../estilos/base.css`)

---

### Phase 4: Homepage Structure & Header
**Goal**: `index.html` is a complete, correctly structured page with a working fixed header that transitions from transparent to dark on scroll, plus a hero welcome section.
**Depends on**: Phase 1, Phase 2, Phase 3
**Requirements**: HOME-01 to HOME-05
**Success Criteria**:
  1. `index.html` exists — valid HTML5, `lang="pt-BR"`, loads all Phase 1–3 CSS, loads `components.js`, nav and footer inject correctly
  2. Header is fixed to the top of the viewport
  3. At page top, header background is transparent; after scrolling ~80px it transitions to `#0D1A3A` (CSS transition, no animation library)
  4. Header contains: planet icon + "Meu Planetinha" (Fredoka One), nav links, "Explorar Jogos" button
  5. Hero section shows a welcome headline and subtitle above where the carousel will be (Phase 5)
  6. "Explorar Jogos" button smoothly scrolls to `#carousel` section (`scroll-behavior: smooth`)

**Plans:**
- [x] 04-01 (Wave 1): Scaffold `index.html` from `_template.html` — valid HTML5, `body.page-home`, data-component placeholders, hero section, dev placeholder sections (#carousel, #jogos), no duplicate skip-link
- [x] 04-02 (Wave 1): Create `estilos/pages/homepage.css` — hero section styles (centering, 35vh min-height, typography), dev placeholder dashed-border styles, mobile responsive
- [x] 04-03 (Wave 1): Add `html { scroll-behavior: smooth; }` to `estilos/base.css` — enables CTA smooth-scroll (prefers-reduced-motion override already handles fallback)
- [x] 04-04 (Wave 2): Update `components/components.css` — `.site-nav` from sticky→fixed, `.page-home .site-nav` transparent override, `.site-nav--scrolled` class with #0D1A3A bg + box-shadow + transition
- [x] 04-05 (Wave 2): Create `scripts/homepage.js` — scroll listener (80px threshold toggles `.site-nav--scrolled`), CTA click interceptor (smooth-scroll to #carousel), mobile overlay close after CTA

---

### Phase 5: Planet Carousel
**Goal**: An interactive planet carousel on the homepage with all 5 themed planets, keyboard/touch/click navigation, and the ability to filter game cards by selected planet.
**Depends on**: Phase 4
**Requirements**: CAR-01 to CAR-07
**Success Criteria**:
  1. All 5 planets display: Calculon, Letrion, Naturox, Terramund, Globish — each with their Guia-Visual color and name
  2. Center planet is visually larger and more prominent than side planets
  3. Left/right arrows navigate between planets
  4. Keyboard ←/→ keys navigate the carousel (focus must be within the carousel section)
  5. Touch swipe left/right navigates on mobile
  6. Navigation dots display and update to reflect current planet
  7. Selecting the center planet sets a `data-active-planet` attribute (or equivalent) that card filtering (Phase 6) will read
  8. Each planet card is visually distinct — themed color backgrounds

**Plans:**
- [x] 05-01: Create carousel HTML in `index.html` — complete 2026-03-05
- [x] 05-02: Overwrite `estilos/carousel.css` — Órbita Central layout — complete 2026-03-05
- [x] 05-03: Overwrite `scripts/carousel.js` — PlanetCarousel class — complete 2026-03-05
- [x] 05-04: ARIA enhancements — all checks pass from prior plans — complete 2026-03-05
- [x] 05-05: Verification — 15/15 must-haves, 8/8 SC, 7/7 CAR — complete 2026-03-05

---

### Phase 6: Game Cards
**Goal**: Game card components appear below the carousel and correctly link to the actual games. Cards filter dynamically when a planet is selected.
**Depends on**: Phase 5
**Requirements**: CARD-01 to CARD-06
**Success Criteria**:
  1. Two game cards render: Contando Estrelas (Calculon/Math) and Jogo de Sílaba (Letrion/Portuguese)
  2. Each card shows game name, planet affiliation, 3 difficulty stars (visual), and "Jogar!" button
  3. "Jogar!" buttons correctly navigate to `jogos/Contando_Estrelas/index.html` and `jogos/Jogo_de_Silaba/index.html` respectively
  4. Selecting Calculon planet in the carousel shows only the Math game card; selecting Letrion shows only the Portuguese game card; all other planets show "Nenhum jogo disponível"
  5. Selecting no planet (initial state) shows all cards
  6. Card visual matches Guia-Visual Portal de Entrada style — planet-themed gradient, rounded corners, "Jogar!" button

**Plans:**
- [ ] 06-01: Create game data definition — a JS constant array of game objects `{ id, name, planet, difficulty, path }` in `scripts/games.js`
- [ ] 06-02: Create `estilos/components/card.css` — Portal de Entrada card styles: planet-themed gradient background, rounded corners, star difficulty rating, "Jogar!" button
- [ ] 06-03: Create card renderer function — generates card HTML from game data array, inserts into `#game-grid` on `index.html`
- [ ] 06-04: Implement filter logic — `PlanetCarousel` `planetSelected` event triggers card grid to show/hide cards by planet affiliation
- [ ] 06-05: Implement "Nenhum jogo disponível" empty state — shown when selected planet has no games
- [ ] 06-06: Verify game links — confirm relative paths from `index.html` to `jogos/Contando_Estrelas/index.html` and `jogos/Jogo_de_Silaba/index.html` resolve correctly

---

### Phase 7: Explore Page
**Goal**: `explorar/explorar.html` is a complete page showing all games in a grid, with planet filter buttons that filter the game grid per subject.
**Depends on**: Phase 6 (shares card component and game data)
**Requirements**: EXP-01 to EXP-05
**Success Criteria**:
  1. Page loads with space background, nav, and footer via components.js
  2. All games displayed in a responsive card grid by default
  3. Five planet filter buttons + "Todos" button appear above the grid
  4. Clicking a planet filter button filters the grid to show only games for that planet; "Todos" resets the filter
  5. Active filter button is visually highlighted using the planet's theme color
  6. Page heading "Explorar Jogos" or equivalent clearly introduces the page

**Plans:**
- [ ] 07-01: Scaffold `explorar/explorar.html` from `_template.html` — nav/footer placeholders, filter section, game grid section
- [ ] 07-02: Create `estilos/pages/explorar.css` — page-specific styles (filter bar, grid layout)
- [ ] 07-03: Implement planet filter buttons from game data — rendered dynamically in JS from `scripts/games.js`
- [ ] 07-04: Implement Explore page filter logic — button click filters `#explore-grid` cards; active button state uses `data-planet` attribute and planet color variable
- [ ] 07-05: Render all game cards on page load using the shared card component from Phase 6
- [ ] 07-06: Ensure card "Jogar!" links use correct relative paths from `/explorar/` depth (`../jogos/...`)

---

### Phase 8: About Us Page
**Goal**: `sobre_nos/sobre_nos.html` rebuilt with on-brand design — team credits, project description, consistent visual identity.
**Depends on**: Phase 3 (global shell)
**Requirements**: ABOUT-01, ABOUT-02, ABOUT-03
**Success Criteria**:
  1. Page loads with space background, nav, and footer
  2. Displays four team member names (Stanley Melo Costa, Robson Ribeiro Filho, Rafael de Pádua Oliveira, Matheus Terra Wachsmuth) and a brief project description
  3. Typography uses Fredoka One for headings, Nunito for body — consistent with design system
  4. Page is visually on-brand with rest of site

**Plans:**
- [ ] 08-01: Scaffold `sobre_nos/sobre_nos.html` from `_template.html`
- [ ] 08-02: Write page content — project description, team section with member names and roles
- [ ] 08-03: Create `estilos/pages/sobre_nos.css` — layout for team section (cards or list, centered)
- [ ] 08-04: Style team member cards with design system tokens
- [ ] 08-05: Verify nav active state marks "Sobre Nós" as current on this page

---

### Phase 9: 404 Page
**Goal**: `404.html` rebuilt with the space theme — an on-brand not-found experience with a clear path back to the homepage.
**Depends on**: Phase 3 (global shell)
**Requirements**: E404-01, E404-02, E404-03
**Success Criteria**:
  1. Page loads with space background, nav, footer
  2. Clear "Página não encontrada" (404) message visible
  3. Link or button that returns to `index.html` works correctly
  4. GitHub Pages serves this file automatically for 404s (no config needed — GitHub Pages picks up `404.html` at root)

**Plans:**
- [ ] 09-01: Scaffold `404.html` from `_template.html`
- [ ] 09-02: Write 404 page content — kid-friendly space-themed "lost in space" copy, "Voltar para casa" button/link
- [ ] 09-03: Style 404 page — centered card layout, large 404 display number in Fredoka One, CTA button using `.btn-primario`
- [ ] 09-04: Verify GitHub Pages serves `404.html` automatically (test by navigating to a nonexistent path)

---

### Phase 10: Accessibility Audit
**Goal**: Every page passes WCAG AA minimum contrast requirements, keyboard navigation works throughout, all interactive elements have proper labels, and the site is usable on mobile touch.
**Depends on**: Phases 4–9 (all pages complete)
**Requirements**: A11Y-01 to A11Y-07
**Success Criteria**:
  1. Zero WCAG AA contrast failures on any page — verified with axe DevTools or browser accessibility panel
  2. All interactive elements reachable and activatable via keyboard (Tab + Enter/Space)
  3. All images/icons have `alt` or `aria-label`
  4. Focus rings visible on all interactive elements
  5. `prefers-reduced-motion` media query prevents all CSS transitions/animations when set
  6. All touch targets ≥ 44×44px
  7. Heading hierarchy is correct on every page (one `<h1>`, logical `<h2>`/`<h3>` nesting)

**Plans:**
- [ ] 10-01: Run axe DevTools accessibility scan on all 4 pages — document all failures in a checklist
- [ ] 10-02: Fix all critical contrast failures — adjust text colors or background tints to achieve 5:1+ on all text
- [ ] 10-03: Fix all missing alt text and aria-labels — planet images, icons, carousel controls, game card stars
- [ ] 10-04: Keyboard navigation audit — Tab through every page, map any unreachable elements; add `tabindex`, `role`, or restructure HTML as needed
- [ ] 10-05: Add skip-to-main-content link in nav for screen readers
- [ ] 10-06: Audit touch target sizes — identify any element under 44×44px (especially carousel dots, nav links on mobile); fix with padding
- [ ] 10-07: Add `@media (prefers-reduced-motion: reduce)` block to `base.css` disabling all transitions and animations
- [ ] 10-08: Verify heading hierarchy on each page with a headings outline tool

---

### Phase 11: Compatibility & Integration
**Goal**: The rebuilt site deploys and works correctly on GitHub Pages, game pages are completely unaffected, and the site works across all target browsers and screen sizes.
**Depends on**: Phase 10
**Requirements**: COMPAT-01 to COMPAT-05
**Success Criteria**:
  1. Both game pages (`jogos/Contando_Estrelas/index.html` and `jogos/Jogo_de_Silaba/index.html`) load and play exactly as before — no visual changes, no broken CSS, no broken JS
  2. All pages load correctly when served from the `/Atividade-ExtencionistaIV/` GitHub Pages subpath — no broken CSS links, no broken images, no 404 nav/footer
  3. Nav and footer components inject on all pages when served via HTTP (Live Server / GitHub Pages)
  4. Site renders correctly on Chrome, Firefox, Safari, Edge (latest)
  5. Site is usable at 320px viewport width (no horizontal overflow on any page)

**Plans:**
- [ ] 11-01: Audit all `href`, `src`, `url()` references in new HTML and CSS — confirm zero absolute `/` paths; replace any found with relative paths or `<base href>` compatible paths
- [ ] 11-02: Load each game page in the browser with DevTools open — confirm no console errors, no style differences from original; verify Phaser canvas renders and gameplay works
- [ ] 11-03: Verify `components/components.js` fetch paths work from root, `/explorar/`, `/sobre_nos/` — test all three locally with `python -m http.server`
- [ ] 11-04: Cross-browser check — open `index.html` and `explorar.html` in Chrome, Firefox, Edge; note and fix any CSS rendering differences
- [ ] 11-05: Mobile responsiveness check — DevTools device emulation at 320px, 375px, 768px, 1024px, 1280px; fix any overflow or layout breaks
- [ ] 11-06: Deploy to GitHub Pages and perform final smoke test — check all 4 pages, both game pages, nav links across pages, 404 behavior
- [ ] 11-07: Verify `.planning/` is in `.gitignore` or excluded from GitHub Pages (should not be publicly served)

---

## Progress

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1. Design System Foundation | 3/3 | Complete | 2026-03-04 |
| 2. Shared Nav & Footer | 3/3 | Complete | 2026-03-04 |
| 3. Global Layout & Background | 0/5 | Not started | — |
| 4. Homepage Structure & Header | 0/5 | Not started | — |
| 5. Planet Carousel | 5/5 | Complete | 2026-03-05 |
| 6. Game Cards | 0/6 | Not started | — |
| 7. Explore Page | 0/6 | Not started | — |
| 8. About Us Page | 0/5 | Not started | — |
| 9. 404 Page | 0/4 | Not started | — |
| 10. Accessibility Audit | 0/8 | Not started | — |
| 11. Compatibility & Integration | 0/7 | Not started | — |

**Total:** 64 plans across 11 phases
