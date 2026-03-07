# Roadmap: Meu Planetinha

## Milestones

- ✅ **[v1.0 Website Redesign](milestones/v1.0-ROADMAP.md)** — Full rebuild of site shell (homepage, explore, about, 404) with design system, planet carousel, game cards, shared nav/footer, a11y, and GitHub Pages deploy. 11 phases · 46 plans · Shipped 2026-03-05.
- ✅ **v2.0 Visual Polish, 3D Carousel & Platform Prep** — Transform the site from a clean static layout into an immersive animated space experience with a 3D orbital planet carousel, wave section transitions, animation system, and game shell infrastructure. 6 phases (12–17) · 24 requirements · Shipped 2026-03-06.

---

## v2.0 — Visual Polish, 3D Carousel & Platform Prep

**Goal:** A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.

**Stack:** Zero new dependencies — native CSS 3D transforms, @keyframes, inline SVG, vanilla JS.

**Phase ordering rationale:**
1. Tokens first — every other phase depends on them
2. Animations before 3D carousel — float @keyframes are used by planet cards
3. 3D carousel in its own phase — biggest risk, needs focused attention
4. Hero/waves after carousel — they merge into the carousel section
5. Verification as explicit phase — 3D CSS has known browser inconsistencies (Safari preserve-3d)
6. Game shell last — stretch goal, independent of visual polish

---

## Phase 12: Foundation — Tokens & Quick Polish

**Goal:** Update design tokens for 3D/animation support and ship all quick visual fixes so downstream phases build on a clean baseline.

**Requirements:** POLISH-01, POLISH-02, POLISH-03, POLISH-04, POLISH-05, POLISH-06

**Tasks:**
- Update `estilos/base.css` `:root` with 3D/animation tokens (`--perspectiva`, `--orbita-raio`, `--orbita-inclinacao`, `--anim-duracao-orbita`, `--anim-duracao-flutuar`, `--anim-duracao-estrelas`, `--will-change-budget`, `--z-carousel`, `--z-stars`)
- Fix header "Explorar Jogos" duplicate (POLISH-01) and remove colored bar across all pages (POLISH-02)
- Game cards 3-column grid + 1 "Em Breve" placeholder card (POLISH-03)
- "Jogar!" button anchored to card bottom via `margin-top: auto` in flex column (POLISH-04)
- Index page spacing between cards section and footer (POLISH-05)
- Explore page filter bar without blue strip background (POLISH-06)

**Success Criteria:**
1. Header renders "Explorar Jogos" exactly once on every page; no colored bar visible on any page
2. Homepage game cards display in a 3-column grid (2-col on mobile) with a visible "Em Breve" placeholder as the third card
3. "Jogar!" button sits flush at the bottom of every game card regardless of description length
4. At least 24px of visible space separates the cards section from the footer on the index page
5. Explore page filter bar has a transparent or gradient-matching background (no opaque blue strip)

---

## Phase 13: Animation System

**Goal:** Create a centralized animation stylesheet with GPU-composited @keyframes for starfield drift, planet float, and sparkle accents — all gated by accessibility preferences and tab visibility.

**Phase:** Phase 13 is complete. Phase 14 ready to begin.

**Requirements:** ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05

**Tasks:**
- Create `estilos/animacoes.css` with all @keyframes declarations
- Starfield drift: continuous `transform: translate()` loop on `body::before`/`::after` pseudo-elements (ANIM-01)
- Planet float: `translateY` oscillation keyframe applied to `.planet-sphere` elements (ANIM-02)
- Sparkle/particle accents: small CSS-only sparkle elements near hero/carousel area (ANIM-03)
- `@media (prefers-reduced-motion: reduce)` block setting `animation: none` and `transition: none` on all animated elements (ANIM-04)
- JS `matchMedia('(prefers-reduced-motion: reduce)')` check to disable JS-driven animations (ANIM-04)
- Page Visibility API listener: toggle `animation-play-state: paused` on `document.hidden` (ANIM-05)

**Success Criteria:**
1. Star background visibly drifts in a continuous diagonal loop; no jump/snap when the cycle repeats
2. Planet spheres oscillate vertically by ~4-6px with smooth easing; oscillation is visible at rest
3. With DevTools forced `prefers-reduced-motion: reduce`, zero elements animate (CSS and JS both respect it)
4. Switching to another browser tab pauses all animations; returning resumes them (verify via DevTools animation inspector)
5. At least one sparkle/particle accent is visible near the carousel area on the homepage

---

## Phase 14: 3D Orbital Carousel ✅

**Goal:** Replace the v1 flat carousel with a CSS 3D perspective ring where 5 planets orbit on a tilted elliptical plane, with back planets faded/blurred and side planets naturally scaled by perspective depth.

**Phase:** Phase 14 is complete. Phase 15 ready to begin.

**Requirements:** CAROUSEL-01, CAROUSEL-02, CAROUSEL-04, CAROUSEL-05, CAROUSEL-06, CAROUSEL-07

**Tasks:**
- Create `estilos/carousel-3d.css` replacing `estilos/carousel.css` — perspective container, preserve-3d orbit ring, `rotateY` + `translateZ` planet positioning (CAROUSEL-01)
- Create `scripts/carousel-3d.js` replacing `scripts/carousel.js` — single `--orbit-angle` CSS custom property driver, arrow/dot/keyboard/touch handlers
- 5 planets at 72° intervals; back planets receive `opacity` fade + `filter: blur()` based on angle offset (CAROUSEL-02)
- Arrow buttons positioned adjacent to side planets, not at page edges (CAROUSEL-04)
- Dot indicators positioned tight below the carousel orbit container (CAROUSEL-05)
- Side planets appear at ~65% of center planet size via natural CSS perspective depth — no JS size manipulation (CAROUSEL-06)
- Preserve v1 a11y: `aria-roledescription="carousel"`, `aria-live` announcements, keyboard arrow navigation, `prefers-reduced-motion` instant snap (CAROUSEL-07)
- Safari `preserve-3d` safeguard: ensure NO `overflow: hidden` on any ancestor of the 3D container

**Success Criteria:**
1. Carousel visually renders as a tilted 3D ring; rotating via arrows shows planets moving along an elliptical orbit path (not sliding left/right)
2. The two back-most planets are visibly faded and slightly blurred compared to the front-center planet
3. Side planets are noticeably smaller than center (~60-70% visual size) without any JS resize logic — purely perspective
4. Keyboard navigation (Left/Right/Home/End) cycles planets with ARIA live region announcement on each change
5. With `prefers-reduced-motion: reduce`, planet transitions snap instantly (no rotation animation)

---

## Phase 15: Unified Hero & Section Transitions ✅

**Goal:** Merge the hero text block into the carousel section as a single cohesive unit and add SVG wave dividers between major sections to create a flowing visual hierarchy.

**Phase:** Phase 15 is complete. Phase 16 ready to begin.

**Requirements:** CAROUSEL-03, TRANS-01, TRANS-02, POLISH-07

**Tasks:**
- Restructure `index.html` hero section: title ("Meu Planetinha"), subtitle, CTA line, and carousel wrapped in a single `.hero` container (CAROUSEL-03)
- Create inline SVG Bézier wave dividers between hero→cards and cards→footer sections (TRANS-01)
- Wave SVGs overlap adjacent sections by 1-2px with matching background colors to prevent subpixel gaps (TRANS-02)
- Background hierarchy polish: ensure each section has a distinct visual depth/tone that creates vertical rhythm — no large empty voids (POLISH-07)

**Success Criteria:**
1. Hero title, subtitle, CTA text, and planet carousel render as a single visually connected block with no gap or divider between them
2. At least two wave dividers are visible on the homepage (hero→cards transition and cards→footer transition)
3. Zooming to 200% shows no visible 1px gap line between wave dividers and their adjacent sections
4. Scrolling the homepage reveals a clear vertical hierarchy — each section (hero, games, footer) has a distinct background treatment
5. Wave dividers render correctly on mobile viewports (320px–768px) without horizontal overflow

---

## Phase 16: Cross-Browser Verification & A11y Audit ✅

**Goal:** Verify all v2.0 visual and interactive features work correctly across browsers, viewports, and assistive technologies — with particular focus on Safari's 3D rendering and mobile performance.

**Phase:** Phase 16 is complete. All v2.0 phases complete. BUG-01 fixed, 74 checklist items verified (4/5 must-haves pass, 1 Safari documented exception). 4 plans, 7 commits.

**Requirements:** Verification of POLISH-01–07, CAROUSEL-01–07, ANIM-01–05, TRANS-01–02

**Tasks:**
- Safari preserve-3d testing: confirm 3D carousel renders correctly in Safari (macOS + iOS) with no flattening
- Mobile viewport testing: 320px, 375px, 414px, 768px, 1024px, 1440px — carousel, waves, cards, animations
- Accessibility audit: screen reader carousel announcements, keyboard-only navigation flow, focus management, color contrast on new elements
- Performance audit: count GPU compositing layers (max 3-4 `will-change`), verify 60fps animation on mid-range device, check no unnecessary repaints
- Verify `prefers-reduced-motion` coverage end-to-end (CSS + JS + carousel + starfield)

**Success Criteria:**
1. 3D carousel renders with correct perspective depth in Safari (macOS Safari 17+ and iOS Safari) — no flat/collapsed appearance
2. All pages pass at 6 viewport widths (320, 375, 414, 768, 1024, 1440px) with no overflow, overlap, or layout break
3. Screen reader (NVDA or VoiceOver) announces planet name on each carousel navigation; all interactive elements are keyboard-reachable
4. Chrome DevTools Layers panel shows ≤ 4 composited layers with `will-change`; animation frame rate stays above 55fps on throttled 4x CPU slowdown
5. Toggling `prefers-reduced-motion: reduce` disables every animation and transition on every page (spot-check all 4 site pages)

---

## Phase 17 (Stretch): Game Shell & Iframe Sandbox ✅

**Goal:** Create a reusable game wrapper page that loads any game inside a sandboxed iframe with the site's nav/footer, providing a consistent play experience and laying the foundation for future contributor-submitted games.

**Phase:** Phase 17 is complete. All 3 SHELL requirements satisfied. 4 plans, 9 commits.

**Requirements:** SHELL-01, SHELL-02, SHELL-03

**Tasks:**
- Create `jogos/jogar.html` with site nav/footer loaded via `components/components.js`, containing a full-viewport `<iframe>` for game content (SHELL-01)
- Configure iframe with `sandbox="allow-scripts allow-same-origin"` minimum privilege set (SHELL-02)
- Implement loading overlay screen shown by default; game signals ready via `postMessage('game-ready')` to dismiss it; 5-second timeout fallback auto-dismisses (SHELL-03)
- URL routing: `jogar.html?game=contando-estrelas` maps to game path via `GAME_DATA` lookup
- Update game card links to point to `jogar.html?game=<id>` instead of direct game URLs

**Success Criteria:**
1. Navigating to `jogar.html?game=contando-estrelas` renders the Contando Estrelas game inside an iframe with the site header and footer visible
2. iframe element has `sandbox="allow-scripts allow-same-origin"` attribute (inspect via DevTools)
3. A loading overlay is visible for up to 5 seconds (or until `postMessage` received), then smoothly fades out to reveal the game
4. Game audio and interaction work correctly inside the sandboxed iframe (click, keyboard, touch)
5. Invalid `?game=` parameter shows a friendly error state instead of a blank/broken iframe

---

## v2.x Candidates (deferred from v2.0)

- Functional search on Explore page (FEAT-01)
- Alphabet filter on Explore page (FEAT-02)
- LocalStorage progress tracking on game cards (FEAT-03)
- Games for Naturox, Terramund, Globish planets (CONT-01)
- Contributor SDK / documentation (v3)
- Privacy/Terms footer links

---

*Roadmap created: 2026-03-05*
*Last updated: 2026-03-06*
