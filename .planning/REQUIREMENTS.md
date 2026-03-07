# Requirements: Meu Planetinha v2.0

**Defined:** 2026-03-05
**Core Value:** A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.

## v2.0 Requirements

Requirements for v2.0 release. Each maps to roadmap phases.

### Visual Polish

- [x] **POLISH-01**: Header shows "Explorar Jogos" only once (remove duplicate nav-cta text)
- [x] **POLISH-02**: Header is consistent across all pages (no colored bar on any page)
- [x] **POLISH-03**: Game cards display in 3-column grid with 1 "Em Breve" (Coming Soon) placeholder card
- [x] **POLISH-04**: "Jogar!" button is anchored to bottom of game card (not vertically centered)
- [x] **POLISH-05**: Index page has visible breathing room (spacing) between cards section and footer
- [x] **POLISH-06**: Explore page filter bar does not have opaque blue strip background
- [x] **POLISH-07**: Background creates vertical hierarchy — no large empty areas without clear intention

### 3D Carousel

- [x] **CAROUSEL-01**: Planet carousel uses CSS 3D transforms (perspective, preserve-3d, rotateY, translateZ) to create a tilted elliptical orbit ring
- [x] **CAROUSEL-02**: 5 planets are spaced at 72° intervals on the ring; back planets are faded and blurred
- [x] **CAROUSEL-03**: Hero section is unified — title, subtitle, CTA line ("Escolha seu planeta e comece a aventura!"), and carousel exist as a single visual block
- [x] **CAROUSEL-04**: Navigation arrows are positioned close to the side planets (not at page edges)
- [x] **CAROUSEL-05**: Navigation dots sit tight below the carousel, visually part of the carousel unit
- [x] **CAROUSEL-06**: Side (adjacent) planets appear at approximately 65% of center planet's visual size via natural perspective depth
- [x] **CAROUSEL-07**: Carousel preserves v1 accessibility — keyboard navigation, aria-roledescription, live region announcements, prefers-reduced-motion instant snap

### Animations

- [x] **ANIM-01**: Star background drifts with continuous CSS animation (transform: translate loop on pseudo-element)
- [x] **ANIM-02**: Planet spheres float with subtle vertical oscillation (@keyframes translateY)
- [x] **ANIM-03**: Ambient sparkle/particle accents appear near carousel or hero area
- [x] **ANIM-04**: All animations respect prefers-reduced-motion (CSS media query + JS matchMedia check)
- [x] **ANIM-05**: Animations pause when browser tab is hidden (Page Visibility API + animation-play-state)

### Section Transitions

- [x] **TRANS-01**: Wave dividers (inline SVG Bézier curves) visually separate major sections (hero→cards, cards→footer)
- [x] **TRANS-02**: Wave dividers overlap adjacent sections by 1-2px to prevent subpixel gaps

### Game Shell (Stretch)

- [x] **SHELL-01**: Game shell page (jogar.html) wraps games in sandboxed iframe with site nav/footer
- [x] **SHELL-02**: Iframe uses `sandbox="allow-scripts allow-same-origin"` minimum privilege
- [x] **SHELL-03**: Unified loading screen shown until game signals ready via postMessage (5s timeout fallback)

## v2.x Requirements

Deferred to future release. Tracked but not in current roadmap.

### Features

- **FEAT-01**: Functional search on Explore page
- **FEAT-02**: Alphabet filter on Explore page
- **FEAT-03**: LocalStorage progress tracking on game cards

### Content

- **CONT-01**: Games for Naturox, Terramund, Globish planets

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Game redesign | Games in `jogos/` remain unmodified — only the wrapper shell is new |
| Three.js / WebGL | CSS 3D transforms are sufficient for gradient spheres — no library needed |
| Auto-playing carousel | Violates WCAG 2.2.2, distracts children, impedes reading |
| User accounts / login | No backend, no auth — static site only |
| Contributor SDK / documentation | Deferred to v3 — iframe sandbox is the foundation |
| Build tools / bundlers | Site deploys as-is to GitHub Pages |
| Canvas-based starfield | CSS @keyframes handles ambient animations without JS animation loop |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| POLISH-01 | Phase 12 | Complete |
| POLISH-02 | Phase 12 | Complete |
| POLISH-03 | Phase 12 | Complete |
| POLISH-04 | Phase 12 | Complete |
| POLISH-05 | Phase 12 | Complete |
| POLISH-06 | Phase 12 | Complete |
| POLISH-07 | Phase 15 | Complete |
| CAROUSEL-01 | Phase 14 | Complete |
| CAROUSEL-02 | Phase 14 | Complete |
| CAROUSEL-03 | Phase 15 | Complete |
| CAROUSEL-04 | Phase 14 | Complete |
| CAROUSEL-05 | Phase 14 | Complete |
| CAROUSEL-06 | Phase 14 | Complete |
| CAROUSEL-07 | Phase 14 | Complete |
| ANIM-01 | Phase 13 | Complete |
| ANIM-02 | Phase 13 | Complete |
| ANIM-03 | Phase 13 | Complete |
| ANIM-04 | Phase 13 | Complete |
| ANIM-05 | Phase 13 | Complete |
| TRANS-01 | Phase 15 | Complete |
| TRANS-02 | Phase 15 | Complete |
| SHELL-01 | Phase 17 | Complete |
| SHELL-02 | Phase 17 | Complete |
| SHELL-03 | Phase 17 | Complete |

**Coverage:**
- v2.0 requirements: 24 total
- Mapped to phases: 24 ✅
- Unmapped: 0
- Phase 12 (Foundation): 6 requirements (POLISH-01–06)
- Phase 13 (Animations): 5 requirements (ANIM-01–05)
- Phase 14 (3D Carousel): 6 requirements (CAROUSEL-01, 02, 04, 05, 06, 07)
- Phase 15 (Hero & Waves): 4 requirements (CAROUSEL-03, TRANS-01, TRANS-02, POLISH-07)
- Phase 16 (Verification): 0 new (verifies all 21 above)
- Phase 17 (Game Shell): 3 requirements (SHELL-01–03)

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after initial definition*
