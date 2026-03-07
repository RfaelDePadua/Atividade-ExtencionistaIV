# Roadmap: Meu Planetinha

## Milestones

- ✅ **[v1.0 Website Redesign](milestones/v1.0-ROADMAP.md)** — Full rebuild of site shell (homepage, explore, about, 404) with design system, planet carousel, game cards, shared nav/footer, a11y, and GitHub Pages deploy. 11 phases · 46 plans · Shipped 2026-03-05.
- ✅ **[v2.0 Visual Polish, 3D Carousel & Platform Prep](milestones/v2.0-ROADMAP.md)** — Immersive animated space experience with 3D orbital carousel, wave transitions, animation system, and game shell infrastructure. 6 phases · 21 plans · 24 requirements verified · Shipped 2026-03-06.

---

## v2.0 — Visual Polish, 3D Carousel & Platform Prep (Archived)

**Status:** ✅ SHIPPED 2026-03-06  
**Phases:** 12–17 | **Plans:** 21 | **Requirements:** 24

See [milestones/v2.0-ROADMAP.md](milestones/v2.0-ROADMAP.md) for complete v2.0 documentation.

**Key Accomplishments:**
- Foundation tokens + design polish — updated design tokens for 3D/animation support
- GPU-optimized animations — starfield drift, planet float, sparkle accents with accessibility
- 3D orbital carousel — CSS perspective ring with 5 planets, blur-only depth cueing, full a11y
- Unified hero + wave dividers — merged sections with SVG Bézier transitions
- Cross-browser + a11y verified — tested across 4 browsers, 6 viewports; zero bugs
- Game shell infrastructure — sandboxed iframe wrapper with unified loading screen

**Known Issues:**
- Safari preserve-3d unverified (RISK-02). Code guards in place. Recommend testing before iOS promotion.

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
*Last updated: 2026-03-07 after v2.0 completion*
