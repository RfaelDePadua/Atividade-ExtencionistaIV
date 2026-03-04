# Requirements: Meu Planetinha — Website Redesign

**Defined:** 2026-03-04
**Core Value:** A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.

---

## v1 Requirements

### Design System (DS)

- [ ] **DS-01**: CSS custom properties in `estilos/base.css` implement the full Guia-Visual palette (`--cor-primaria` through all planet accents, functional colors)
- [ ] **DS-02**: Google Fonts loaded via `<link rel="preconnect">` + `&display=swap` — no `@import` in CSS, three fonts: Fredoka One, Nunito (400/700), Press Start 2P
- [ ] **DS-03**: Bootstrap Icons v1.11.3 loaded via CDN `<link>` (not CSS `@import`)
- [ ] **DS-04**: CSS spacing scale defined as custom properties (`--espaco-xs` through `--espaco-2xl`)
- [ ] **DS-05**: CSS typography scale: heading classes use Fredoka One, body uses Nunito, score/badge contexts use Press Start 2P
- [ ] **DS-06**: Responsive container: max-width centered layout that works from 320px to 1440px+ viewport widths
- [ ] **DS-07**: Button component styles — primary (gradient pill) and secondary (outlined pill) — per Guia-Visual Section 07
- [ ] **DS-08**: Planet accent color tokens system — each of the 5 planets has its own CSS variable set (bg, text, accent)

### Navigation (NAV)

- [x] **NAV-01**: Single `components/nav.html` source-of-truth file — all pages load it via fetch + innerHTML injection
- [x] **NAV-02**: `components/components.js` script handles fetch-loading nav and footer; falls back to inline HTML if fetch fails
- [x] **NAV-03**: Active page state applied automatically — the current page's nav link gets `aria-current="page"` and visual highlight
- [x] **NAV-04**: Nav links work correctly from all page depths (root, `/explorar/`, `/sobre_nos/`)
- [x] **NAV-05**: Nav is accessible — keyboard-navigable, has skip-to-content link, all links have descriptive labels
- [x] **NAV-06**: Mobile-responsive nav — collapses to hamburger menu at ≤640px breakpoint

### Footer (FOOT)

- [x] **FOOT-01**: Single `components/footer.html` shared across all site pages (not game pages)
- [x] **FOOT-02**: Footer contains: logo (reduced), tagline, and a Contato link (Privacidade/Termos deferred to v2 per user decision in 02-CONTEXT.md)
- [x] **FOOT-03**: Footer background `#0B0F2E`, distinct from page background
- [x] **FOOT-04**: Footer has wavy/curved top border (CSS clip-path or SVG wave)

### Space Background (BG)

- [ ] **BG-01**: Full-page CSS gradient background — top `#1A3A8F` → middle `#2D1B8A` → bottom `#8B1A6B` — applied via `body` or `.page-bg`
- [ ] **BG-02**: Background visually consistent across all pages (index, explorar, sobre_nos, 404)
- [ ] **BG-03**: No animated elements on the background in v1 (static gradient, no drifting stars)

### Homepage (HOME)

- [ ] **HOME-01**: `index.html` rebuilt from scratch — valid HTML5, `lang="pt-BR"`, correct meta tags, `<base href>` or relative paths verified
- [ ] **HOME-02**: Fixed header — transparent at page top, transitions to `#0D1A3A` on scroll
- [ ] **HOME-03**: Header contains: logo (planet icon + "Meu Planetinha" in Fredoka One), nav links (center), "Explorar Jogos" CTA button (right)
- [ ] **HOME-04**: Hero section — welcome headline and subtitle above the carousel
- [ ] **HOME-05**: "Explorar Jogos" CTA scrolls smoothly to the planet carousel section

### Planet Carousel (CAR)

- [ ] **CAR-01**: 5 planets displayed: Calculon (Math/#FF8C42), Letrion (Portuguese/#C084FC), Naturox (Science/#4DFFB4), Terramund (Geography/#D4622A), Globish (English/#00D4E8)
- [ ] **CAR-02**: Órbita Central layout — center planet prominent and larger, side planets smaller; center-focused layout
- [ ] **CAR-03**: Each planet card shows: planet name, subject label, themed color
- [ ] **CAR-04**: Carousel is navigable via left/right arrow buttons, keyboard (←/→ keys), and touch swipe
- [ ] **CAR-05**: Carousel navigation dots show current position
- [ ] **CAR-06**: Clicking/tapping the center planet filters the game cards below to that planet's subject
- [ ] **CAR-07**: Planet cards use the planet's themed color as their visual base — visually distinct per planet

### Game Cards (CARD)

- [ ] **CARD-01**: Game cards rendered below the carousel — one card per game (`Contando_Estrelas`, `Jogo_de_Silaba`)
- [ ] **CARD-02**: Card contains: game name, subject planet affiliation, difficulty stars (1–3), "Jogar!" button
- [ ] **CARD-03**: "Jogar!" button links to the correct game page relative path (`../jogos/Contando_Estrelas/index.html` etc.)
- [ ] **CARD-04**: Cards filtered by selected carousel planet — show only cards matching the active planet subject
- [ ] **CARD-05**: Card layout per Guia-Visual Section 08 — Portal de Entrada style: planet-themed gradient background, rounded corners
- [ ] **CARD-06**: Cards display "Nenhum jogo disponível" text when filtered to a planet with no games yet

### Explore Page (EXP)

- [ ] **EXP-01**: `explorar/explorar.html` rebuilt — consistent with site design
- [ ] **EXP-02**: Shows all available games in a responsive card grid (same card component as homepage)
- [ ] **EXP-03**: Planet filter buttons above the grid — 5 buttons (one per planet) + "Todos" — filter the grid by subject
- [ ] **EXP-04**: Active filter button highlighted using planet's color
- [ ] **EXP-05**: Page title and heading clearly identify this as the games exploration page

### About Us Page (ABOUT)

- [ ] **ABOUT-01**: `sobre_nos/sobre_nos.html` rebuilt — consistent with site design system
- [ ] **ABOUT-02**: Page displays team member names and project description
- [ ] **ABOUT-03**: On-brand visual design — correct typography, colors, background

### 404 Page (E404)

- [ ] **E404-01**: `404.html` rebuilt — on-brand space theme
- [ ] **E404-02**: Clear "página não encontrada" message with a link back to the homepage
- [ ] **E404-03**: GitHub Pages 404.html works automatically (no server config needed)

### Accessibility (A11Y)

- [ ] **A11Y-01**: All body text achieves minimum 4.5:1 contrast ratio against its background (WCAG AA); targets 5:1+ given child audience
- [ ] **A11Y-02**: All large text and UI components achieve minimum 3:1 contrast ratio
- [ ] **A11Y-03**: All interactive elements (buttons, links, nav items) have minimum 44×44px touch target
- [ ] **A11Y-04**: All images and icons have meaningful `alt` text or `aria-label`
- [ ] **A11Y-05**: Page structure uses correct semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, heading hierarchy)
- [ ] **A11Y-06**: Entire site is keyboard-navigable (visible focus indicators on all interactive elements)
- [ ] **A11Y-07**: `prefers-reduced-motion` media query respected — no transitions/animations fire for users with this preference

### Compatibility (COMPAT)

- [ ] **COMPAT-01**: Zero CSS contamination to game pages — `jogos/Contando_Estrelas/` and `jogos/Jogo_de_Silaba/` function exactly as before, with no style differences
- [ ] **COMPAT-02**: All asset/CSS/JS paths use relative references — no absolute `/` paths that break on GitHub Pages subpath deployment
- [ ] **COMPAT-03**: `fetch()` include paths for nav/footer resolve correctly at `/Atividade-ExtencionistaIV/` GitHub Pages subpath
- [ ] **COMPAT-04**: Site renders correctly on Chrome, Firefox, Safari, Edge (latest versions)
- [ ] **COMPAT-05**: Site is usable on mobile (320px minimum width) and desktop (1280px+)

---

## v2 Requirements

### Animations (deferred — ship static layout first)

- **ANIM-01**: Drifting starfield background (CSS animation, `prefers-reduced-motion` safe)
- **ANIM-02**: Floating/bobbing planet animation in carousel
- **ANIM-03**: Hover particle burst on planet cards
- **ANIM-04**: Header shrink-on-scroll animation (logo gets smaller, nav compacts)
- **ANIM-05**: "Jogar!" button click afunda + particle explosion effect

### Interactive Features (deferred — requires JS complexity)

- **FEAT-01**: Functional search — filter games by name/keyword
- **FEAT-02**: Alphabetical filter on Explore page — filter by first letter
- **FEAT-03**: LocalStorage progress tracking — progress bar on game cards showing levels completed

### User Accounts (deferred — no backend)

- **AUTH-01**: User registration / login ("Entrar")
- **AUTH-02**: Achievement / badge system
- **AUTH-03**: Per-user game progress persistence

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Game redesign (Contando_Estrelas, Jogo_de_Silaba) | Explicitly out of scope — games untouched |
| Backend / server-side | Static site only, GitHub Pages deployment |
| Animated starfield background | Deferred to v2 — ship clean static layout first |
| Login / user accounts | No backend; deferred to v2 |
| Achievements | No persistence layer; deferred to v2 |
| Functional search | Deferred to v2 |
| Alphabet filter (functional) | UI only is acceptable; functionality deferred |
| Node.js/Express server | Archived; Python or Live Server for local dev |
| Build tool / bundler | Explicitly rejected — no build step |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 to DS-08 | Phase 1 | Complete |
| NAV-01 to NAV-06 | Phase 2 | Complete |
| FOOT-01 to FOOT-04 | Phase 2 | Complete |
| BG-01 to BG-03 | Phase 3 | Pending |
| HOME-01 to HOME-05 | Phase 4 | Pending |
| CAR-01 to CAR-07 | Phase 5 | Pending |
| CARD-01 to CARD-06 | Phase 6 | Pending |
| EXP-01 to EXP-05 | Phase 7 | Pending |
| ABOUT-01 to ABOUT-03 | Phase 8 | Pending |
| E404-01 to E404-03 | Phase 9 | Pending |
| A11Y-01 to A11Y-07 | Phase 10 | Pending |
| COMPAT-01 to COMPAT-05 | Phase 11 | Pending |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 58
- Unmapped: 0 ✅

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after initialization*
