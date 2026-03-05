# Feature Research — v2.0 Visual Polish, 3D Carousel & Platform Prep

**Domain:** Kids educational gaming platform (ages 6–10)  
**Milestone:** v2.0  
**Researched:** 2026-03-05  
**Baseline:** v1.0 shipped — clean static layout, 2D carousel, game cards, shared nav/footer  
**Confidence:** HIGH

---

## Executive Summary

v2.0 transforms Meu Planetinha from a correct, clean layout into a **visually alive space experience**. The 12 target features break into three tiers: **table stakes** (things users already expect from a polished kids' site), **differentiators** (features that make the platform memorable), and one **anti-feature risk** (where over-execution harms the audience).

The critical path is: **3D carousel → unified hero → header cleanup → wave dividers → animations**. Everything else layers on top or runs in parallel.

---

## Table of Contents

1. [Feature-by-Feature Analysis](#feature-by-feature-analysis)
2. [Table Stakes](#table-stakes)
3. [Differentiators](#differentiators)
4. [Anti-Features / Risk Areas](#anti-features--risk-areas)
5. [Feature Dependency Diagram](#feature-dependency-diagram)
6. [Prioritization Matrix](#prioritization-matrix)
7. [MVP Definition](#mvp-definition)
8. [Micro-Interaction Expectations](#micro-interaction-expectations)
9. [Competitive Landscape](#competitive-landscape)
10. [Minimum Viable Visual Polish](#minimum-viable-visual-polish)

---

## Feature-by-Feature Analysis

### F-01: 3D Orbital Carousel

| Dimension | Assessment |
|---|---|
| **Description** | CSS `perspective` + `rotateY`/`translateZ` to position 5 planets on a tilted elliptical ring. Back planets faded and blurred. |
| **Category** | **Differentiator** |
| **Complexity** | **HIGH** |
| **Dependencies** | None (replaces existing 2D carousel in-place) |
| **User expectation** | Kids: "Whoa, the planets look like they're floating in space!" — the illusion of depth is immediately impressive and communicates that this is a game world, not a school portal. Parents: perceive higher production quality → increased trust. Teachers: neutral (functional navigation matters more than visual style). |

**Implementation notes:**
- Pure CSS `perspective` on the carousel container + per-planet `rotateY()` + `translateZ()` positions planets on an elliptical orbit path.
- Back-positioned planets get `opacity: 0.4`, `filter: blur(2px)`, and `scale(0.5)`.
- `z-index` must be dynamically calculated so front planets render above back planets.
- The existing JS carousel controller (`scripts/carousel.js`) will need refactoring — current system uses `translateX` offsets per position. v2 must compute `rotateY` angles instead.
- Must degrade gracefully: `prefers-reduced-motion` → instant position snapping, no rotation animation.
- Mobile: reduce perspective depth or flatten to 2.5D layout below 480px to prevent planets from overlapping on small screens.
- **Risk:** 3D CSS transforms on 5 animated elements + blur filters can cause jank on low-end devices. Must test on a budget Android phone. Consider `will-change: transform` carefully (memory cost).

**Research benchmark:** Sites like PBS Kids, National Geographic Kids, and Escola Games use animated carousels as the primary discovery mechanism. None use true 3D orbital layouts — this is a genuine differentiator. The closest precedent is Apple's Cover Flow, which uses perspective + scale + blur to similar effect.

---

### F-02: Unified Hero Section

| Dimension | Assessment |
|---|---|
| **Description** | Merge the current separate hero block (title + subtitle + CTA) with the carousel into one cohesive visual unit. |
| **Category** | **Table Stakes** |
| **Complexity** | **MEDIUM** |
| **Dependencies** | F-01 (3D carousel — the hero wraps around it) |
| **User expectation** | Kids: don't notice the merge consciously, but the page feels more focused — one thing to look at, not two disconnected blocks. Parents: the above-the-fold experience looks intentional and polished. |

**Implementation notes:**
- Remove the standalone `.hero` `<section>` and integrate title/subtitle/CTA into the carousel section.
- Title ("Bem-vindo ao Meu Planetinha") becomes an overlay or sits above the 3D ring.
- Subtitle becomes a contextual line that can change with the active planet ("Explore o planeta Calculon — Matemática").
- CTA button ("Explorar Jogos") positioned below the carousel ring, visually connected.
- This is primarily a **layout/HTML restructure** — the CSS complexity comes from making the overlay text readable against animated planet backgrounds.
- Text-shadow or a subtle dark gradient overlay may be needed for contrast.

**Why table stakes:** Every polished kids site (PBS Kids, Escola Games, ABCmouse) has a unified hero area where the main interactive element and the site branding occupy the same visual space. Separating them creates an awkward "banner ad → content" feel that reads as institutional.

---

### F-03: Header Consistency

| Dimension | Assessment |
|---|---|
| **Description** | Remove duplicate "Explore Games" text from header on homepage (where it's also in hero/CTA), drop the colored bar below the header, unify header appearance across all pages (homepage, explore, about, 404). |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | None (can be done independently) |
| **User expectation** | Kids: don't notice header inconsistencies consciously, but visual noise reduction helps focus. Parents: inconsistent headers signal "still under construction." Teachers: functional navigation just needs to work everywhere. |

**Implementation notes:**
- Audit `components/nav.html` and page-specific CSS overrides.
- The colored bar beneath the header was a v1 design artifact — remove it from `layout.css` or `componentes.css`.
- Ensure the header background behavior (transparent → opaque on scroll) is identical on all 4 pages.
- Check that `aria-current="page"` is correctly set on each page's nav link.
- Quick win — can be completed in a single plan, minimal code change.

---

### F-04: Carousel Polish

| Dimension | Assessment |
|---|---|
| **Description** | Side planets at ~65% scale (currently 70%), arrows closer to planets, dot indicators tighter to carousel edge. |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | F-01 (must be done after or alongside the 3D carousel rebuild) |
| **User expectation** | Kids: the carousel feels "tighter" and more intentional — less dead space means less confusion about what to tap. Parents: doesn't register consciously, but the layout feels more professional. |

**Implementation notes:**
- If F-01 (3D carousel) ships, this becomes a parameter-tuning task on the new system: adjust `scale()` values for position-1 and position-2 planets.
- If F-01 is deferred, this can be done on the existing 2D carousel by changing CSS custom properties.
- Arrow positioning: reduce `left`/`right` offset from current values; test that arrows don't overlap planet spheres on mobile.
- Dots: reduce `gap` in `.carousel-dots` and bring the `margin-top` down.
- Pure CSS changes — no JS impact.

---

### F-05: Wave Dividers

| Dimension | Assessment |
|---|---|
| **Description** | SVG or CSS clip-path wave shapes between major sections (hero↔cards, cards↔footer) for visual flow instead of hard edges. |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | F-02 (hero section must be finalized before placing the wave below it) |
| **User expectation** | Kids: subconscious — sections feel like a continuous journey through space rather than stacked blocks. Parents: common on modern sites; absence feels dated. |

**Implementation notes:**
- Two approaches:
  1. **Inline SVG** — `<svg>` between sections with a `<path>` wave. Full control, works everywhere.
  2. **CSS `clip-path`** — apply to section's `::before`/`::after`. Cleaner HTML but slightly less browser flexibility.
- Recommendation: inline SVG for the first divider (hero→cards), CSS `clip-path` for footer top border (already specified in Guia-Visual as "borda ondulada").
- Color of the wave must match the **bottom** of the section above and the **top** of the section below to create seamless flow.
- Typically 3–4 wave dividers needed: below hero, above cards, below cards, above footer.
- The Guia-Visual already specifies a wavy top border on the footer — this feature extends that pattern site-wide.

**Research benchmark:** Wave dividers are now ubiquitous on modern websites (estimated 60%+ of recently launched kids' sites use them). Tools like https://getwaves.io/ generate SVG paths. This is a visual expectation, not a novelty.

---

### F-06: Cards Layout (3-per-row + "Coming Soon")

| Dimension | Assessment |
|---|---|
| **Description** | Game cards in a 3-column grid layout, with 1 "Em Breve" (Coming Soon) placeholder card. "Jogar!" button anchored to bottom of each card regardless of content height. |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | None |
| **User expectation** | Kids: a third card breaks the "only two games?" perception — the Coming Soon card creates anticipation without misleading. Parents: placeholder communicates active development → platform won't stagnate. |

**Implementation notes:**
- Current grid in `estilos/cards.css` uses `auto-fill, minmax()`. Switch to explicit 3-column on desktop: `grid-template-columns: repeat(3, 1fr)`.
- Add a `.game-card--coming-soon` variant with: muted colors/grayscale, a lock or planet silhouette, "Em Breve" text, disabled button state.
- Button anchoring: use `display: flex; flex-direction: column;` on the card with `margin-top: auto` on the button — standard pattern for equal-height card bottoms.
- On mobile (< 768px), stack to 1 column; on tablet (768–1024px), 2 columns.
- The Coming Soon card should filter-match no planet (or match all planets) so it always appears.

---

### F-07: Animations (Starfield, Float, Particles)

| Dimension | Assessment |
|---|---|
| **Description** | Background starfield drift animation, planet hover/float effects (bob up and down), subtle particle accents on interaction. |
| **Category** | **Differentiator** (starfield + float) / **Table Stakes** (hover feedback) |
| **Complexity** | **MEDIUM** (starfield + float) / **HIGH** (particles) |
| **Dependencies** | F-01 (planet float works with either carousel, but 3D carousel needs coordinated timing) |
| **User expectation** | Kids: **this is the single highest-impact feature for "wow" factor.** A static page feels dead. An ambient-animated page feels like a living world. The star drift + planet float combo is what transforms a website into a *place*. Parents: ambient animation signals polish; they'll only notice if it's missing. Teachers: neutral unless it's distracting. |

**Breakdown:**

| Sub-feature | Complexity | Priority | Technique |
|---|---|---|---|
| **Star drift** | LOW | P0 (v2 launch) | CSS `@keyframes` on `.star` pseudo-elements or a `<canvas>` layer. CSS-only preferred for performance. |
| **Planet float** | LOW | P0 (v2 launch) | CSS `@keyframes` — `translateY` oscillation with `ease-in-out`, 4–8s cycles, slight offset per planet. |
| **Button hover rise** | LOW | P0 (v2 launch) | Already partially implemented (`transform: translateY(-4px)`). Extend with `box-shadow` growth. |
| **Card hover lift** | LOW | P0 (v2 launch) | Already partially implemented. Extend with planet pulse within card. |
| **Planet hover pulse** | MEDIUM | P1 (v2.x) | `scale` pulse + colored glow via `box-shadow`. Triggered by hover/focus. |
| **Click particles** | HIGH | P2 (v3) | Requires a particle system — either CSS-only (multiple `::after` elements with random animation) or a tiny JS library. Stretch goal. |

**Accessibility mandate:** All animations MUST be wrapped in `@media (prefers-reduced-motion: no-preference)`. The site must be fully functional and attractive with animations disabled.

**Performance budget:** Star drift should be CSS-only (GPU-composited `transform` and `opacity` — no layout thrash). Planet float uses `transform: translateY()` — safe. Particle system (if implemented) must be capped at ~20 particles and use `requestAnimationFrame` with automatic pause when tab is not visible.

---

### F-08: Background Hierarchy & Vertical Rhythm

| Dimension | Assessment |
|---|---|
| **Description** | Reduce empty space between sections, create clear visual rhythm with alternating background tints, improve section connectivity. |
| **Category** | **Table Stakes** |
| **Complexity** | **MEDIUM** |
| **Dependencies** | F-05 (wave dividers create the visual bridges between sections), F-02 (hero section defines the starting rhythm) |
| **User expectation** | Kids: the page feels like a continuous scroll-through-space journey, not a series of disconnected slides. Parents: professional spacing signals design intentionality. |

**Implementation notes:**
- Audit current `padding`/`margin` values on `<section>` elements — v1 used generous spacing for safety; v2 should tighten.
- Introduce a section background tint system: alternating between `--cor-fundo` (lighter) and `--cor-fundo-base` (darker), with wave transitions between them.
- Use CSS custom properties for section padding: `--section-padding-y: clamp(3rem, 6vw, 6rem)` — fluid spacing that compresses on mobile.
- Nebula blobs (from Guia-Visual: "laranja pastel, turquesa e rosa — difusas") can be placed as absolute-positioned `<div>` elements with `border-radius: 50%`, `filter: blur(80px)`, and low opacity to fill perceived empty space.
- **Warning:** Over-tightening vertical rhythm can make sections feel cramped on mobile. Test at 375px width.

---

### F-09: Index Page Spacing (Pre-Footer Breathing Room)

| Dimension | Assessment |
|---|---|
| **Description** | Add appropriate spacing between the game cards section and the footer on the homepage. |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | F-05 (wave divider above footer), F-08 (overall spacing system) |
| **User expectation** | Universal — content crashing into the footer feels unfinished. |

**Implementation notes:**
- This is a single CSS change: increase `margin-bottom` or `padding-bottom` on `#jogos` section, or add a spacer/wave divider element.
- If wave dividers (F-05) are implemented, this may resolve itself — the wave below the cards section creates natural breathing room.
- Target: ~80–120px of visual separation between the last card row and the footer border.
- Also consider the footer wave (Guia-Visual: "borda ondulada") as the gap-filler.

---

### F-10: Explore Page Filter Redesign

| Dimension | Assessment |
|---|---|
| **Description** | Remove or replace the blue strip behind the planet filter bar on the explore page. Redesign the filter pills/tabs to be visually integrated rather than sitting on a contrast bar. |
| **Category** | **Table Stakes** |
| **Complexity** | **LOW** |
| **Dependencies** | None |
| **User expectation** | Kids: the blue strip creates a visual barrier that makes the filter feel like a separate interface from the game cards. Removing it creates flow. Parents: cleaner design. |

**Implementation notes:**
- Current explore page (`estilos/pages/explore.css`) likely has a background on `.explore-filter` or similar class.
- Replace with: transparent background, planet-colored pill buttons with `border` and `background-color` on selected state.
- The active state should use the planet's accent color (`--planeta-calculon`, etc.) as fill; inactive pills use transparent + white text.
- Ensure the "Todos" (All) pill is visually differentiated from planet-specific pills (white fill, or gradient).
- Tap target size must remain ≥ 48px height per previous accessibility research.

---

### F-11: Game Shell Research (Iframe Wrapping)

| Dimension | Assessment |
|---|---|
| **Description** | Research and prototype wrapping Phaser.js games and plain HTML games in the site's design via `<iframe>`. The site header/footer surround the game, with a back button always visible. |
| **Category** | **Differentiator** |
| **Complexity** | **HIGH** |
| **Dependencies** | F-03 (header must be consistent before embedding in a game shell) |
| **User expectation** | Kids: clicking "Jogar!" should feel like entering the game without leaving the planet (no jarring full-page navigation to a completely different-looking page). A visible "back" button is critical — kids on mobile cannot find the browser back button. Parents: prefer the child stays within the platform's UI frame rather than being launched into an unknown page. Teachers: want easy return to the game list for switching activities. |

**Implementation notes:**
- **Current state:** Games in `jogos/` are fully self-contained HTML pages with their own CSS and different nav styles. They load at their own URLs directly.
- **Proposed approach:** Create a `game-shell.html` template page that:
  1. Loads the site header/footer
  2. Contains an `<iframe src="jogos/[game]/index.html">` that fills the main content area
  3. Provides a persistent "Voltar" (Back) button outside the iframe
  4. Shows a loading screen while the iframe loads
- **Iframe considerations:**
  - `sandbox` attribute: use `sandbox="allow-scripts allow-same-origin"` for Phaser games (they need JS execution and same-origin for asset loading).
  - `allow-same-origin` is required because the games load local assets via relative paths.
  - Do NOT use `allow-popups` or `allow-forms` — no reason for games to open windows.
  - Game `<iframe>` should be `width: 100%; height: calc(100vh - header_height)`.
- **URL routing:** Since this is a static site with no router, the game shell page would use URL parameters: `game-shell.html?game=Contando_Estrelas`.
- **Phaser-specific concerns:**
  - Phaser's canvas must receive keyboard events — verify that `<iframe>` doesn't swallow focus.
  - Phaser games may have their own fullscreen toggle — this should still work within the iframe.
  - Test performance: iframe + Phaser canvas rendering + parent page animations.
- **This is research scope for v2** — full implementation is v2.x or v3.

---

### F-12: Iframe Sandbox + Unified Loading Screen (Stretch)

| Dimension | Assessment |
|---|---|
| **Description** | Full sandboxed game loading with a branded "Meu Planetinha" loading screen that covers the iframe until the game signals readiness. |
| **Category** | **Differentiator** (stretch goal) |
| **Complexity** | **HIGH** |
| **Dependencies** | F-11 (game shell must exist first) |
| **User expectation** | Kids: a loading screen with a spinning planet + progress bar makes waiting fun instead of confusing. Without it, the iframe shows a blank white rectangle for 1–3 seconds, which feels broken. Parents: the branded loading screen maintains continuity → the child hasn't "left" the platform. |

**Implementation notes:**
- Loading screen sits on top of (or in front of) the iframe, themed to the planet being entered.
- Detection of "game ready": the game inside the iframe posts a `window.parent.postMessage('game-ready', '*')` event. The parent page listens and fades out the loading screen.
- **Fallback:** If no `postMessage` is received within 5 seconds, auto-dismiss the loading screen (don't leave the child stuck).
- For the two existing games (Contando Estrelas, Jogo de Sílaba), we'd need to add a single `postMessage` line — minimal game modification, but technically breaks the "games untouched" constraint from v1.
- **Alternative:** Use the iframe's `load` event instead of `postMessage`. Less precise (fires when HTML loads, not when the game canvas is ready) but requires zero game modification.
- Stretch goal: planet-colored loading bar that fills based on time estimate.
- **Clearly v3 scope** unless F-11 proves trivially easy.

---

## Table Stakes

Features that are **expected** on a polished kids' educational platform in 2026. Their absence would make the site feel unfinished to parents and unengaging to children.

| # | Feature | Why Table Stakes |
|---|---|---|
| F-02 | Unified hero section | Separated hero + carousel reads as "two things" instead of one immersive entrance. Every top-tier kids site merges branding with primary interaction. |
| F-03 | Header consistency | Duplicate text and inconsistent styling across pages signals "student project." Parents use header navigation on every page. |
| F-04 | Carousel polish | Spacing/scale refinements are expected on any production carousel. Current spacing is "functional but rough." |
| F-05 | Wave dividers | Hard-edged section breaks on a space-themed site look dated. Wave/organic dividers are a baseline visual expectation since ~2020. |
| F-06 | Cards (3-per-row + placeholder) | 2 cards in a row looks empty. 3 cards with a "Coming Soon" communicates a growing platform and fills the visual space. |
| F-07a | Hover/tap feedback animations | Interactive elements that don't respond to touch feel broken to children raised on mobile apps. This is baseline UX, not decoration. |
| F-08 | Background hierarchy | Excessive empty space makes the page feel sparse. Proper vertical rhythm is expected on any multi-section page. |
| F-09 | Pre-footer spacing | Content crashing into the footer is a layout bug, not a feature. |
| F-10 | Explore filter redesign | The blue strip is a v1 artifact that looks inconsistent with the rest of the design. |

---

## Differentiators

Features that **set Meu Planetinha apart** from typical kids' educational sites. These make visitors remember the platform.

| # | Feature | Why Differentiator |
|---|---|---|
| F-01 | 3D orbital carousel | No comparable kids' educational site uses a true 3D CSS orbit for subject navigation. This single feature transforms the homepage from "game list" to "universe explorer." The spatial metaphor (choosing a planet = choosing a subject) is unique in this space. |
| F-07b | Starfield drift + planet float | Ambient animation turns a static page into a living world. Most kids' sites have static backgrounds or simple gradient changes. A drifting starfield with floating planets creates the illusion of being in space — directly aligned with the platform's theme. |
| F-07c | Planet hover pulse + particles | Micro-interaction particles on planet hover/click create a "magic" feel. This level of interaction polish is rare on educational sites and is typically only seen on commercial game launchers. |
| F-11 | Game shell (iframe wrapping) | Maintaining the site's visual frame around embedded games is a platform-level feature. Most educational sites navigate away to the game entirely, losing parent-facing context and back-navigation. |
| F-12 | Iframe sandbox + loading screen | A branded loading transition between site and game is a AAA polish feature. Creates the perception of entering a "portal" to the planet's world. |

---

## Anti-Features / Risk Areas

Features or execution patterns that could **harm** the target audience if over-implemented.

### Risk 1: Animation Overload (F-07 over-execution)

**Trigger:** Implementing starfield drift + planet float + nebula glow + particle systems + button sparkles all simultaneously.

**Why dangerous:**
- Children with attention disorders (ADHD prevalence ~7-10% in the 6-10 age range) can experience sensory overload with more than 2 simultaneous animation layers.
- Children with photosensitive conditions may react to rapid particles or flickering effects.
- Low-end devices (school Chromebooks, budget Android tablets) will drop frames, causing the site to feel sluggish rather than impressive.
- Common Sense Media developmental guidelines recommend: **maximum 2 ambient animation layers visible at any time in any viewport.**

**Mitigation:**
- Hard rule: `star drift` + `planet float` are the two ambient layers. Everything else is **interaction-triggered only** (hover, click, focus).
- All animations behind `prefers-reduced-motion` media query.
- Performance budget: animations must maintain 60fps on a 2020 Chromebook (test target).
- Never use `animation-iteration-count: infinite` on more than 2 elements visible simultaneously.

### Risk 2: 3D Carousel Complexity Trap (F-01 scope creep)

**Trigger:** Spending excessive implementation time chasing pixel-perfect 3D orbital math instead of shipping a "good enough" 3D-looking carousel.

**Why dangerous:**
- True 3D elliptical orbits in CSS are mathematically complex — computing positions for 5 elements on a tilted ellipse requires precise `rotateX`, `rotateY`, `translateZ` calculations.
- Diminishing returns: the difference between "pretty good 3D effect" and "mathematically perfect elliptical orbit" is not perceivable by 6-10 year olds.
- Risk of introducing jank, z-index bugs, or touch-navigation regressions.

**Mitigation:**
- Start with a simpler "Cover Flow" approach (front/back z-positioning with scale + blur) and iterate toward full orbital if time permits.
- Define a maximum time box: if the 3D carousel takes > 2 implementation sessions, ship the "2.5D" version (current layout enhanced with perspective, blur, and z-index) and iterate.
- Maintain the v1 2D carousel as a fallback.

### Risk 3: Iframe Security Misconfiguration (F-11/F-12)

**Trigger:** Using overly permissive `sandbox` attributes on game iframes.

**Why dangerous:**
- `allow-same-origin` + `allow-scripts` together can allow the iframe content to remove its own sandbox — if game code is ever compromised, the entire parent page is vulnerable.
- For Phaser games loading local assets, `allow-same-origin` is unfortunately required.
- If the platform ever adds third-party or community-contributed games, the sandbox model must be revisited.

**Mitigation:**
- Minimum necessary sandbox: `sandbox="allow-scripts allow-same-origin"` — no `allow-popups`, no `allow-forms`, no `allow-top-navigation`.
- Add `Content-Security-Policy` meta tag in the game shell page.
- Document the security model and its limitations for future contributors.
- Never load games from external domains in the iframe.

---

## Feature Dependency Diagram

```
                    ┌─────────────────────────────────────────────────┐
                    │            INDEPENDENT (start anytime)          │
                    │                                                 │
                    │  F-03 Header Consistency ─────────┐             │
                    │  F-06 Cards 3-per-row             │             │
                    │  F-10 Explore Filter Redesign     │             │
                    │  F-09 Index Spacing *             │             │
                    └─────────────────────────┬─────────┘             │
                                              │                       │
              ┌───────────────────────────────┼───────────────────────┘
              │                               │
              ▼                               │
    ┌──────────────────┐                      │
    │  F-01  3D Orbit  │                      │
    │    Carousel      │                      │
    └────────┬─────────┘                      │
             │                                │
     ┌───────┴──────────┐                     │
     │                   │                    │
     ▼                   ▼                    │
┌──────────┐    ┌───────────────┐             │
│  F-02    │    │  F-04         │             │
│  Unified │    │  Carousel     │             │
│  Hero    │    │  Polish       │             │
└────┬─────┘    └───────────────┘             │
     │                                        │
     ▼                                        │
┌──────────────┐                              │
│  F-05  Wave  │                              │
│  Dividers    │                              │
└────┬─────────┘                              │
     │                                        │
     ▼                                        │
┌──────────────────┐                          │
│  F-08 Background │                          │
│  Hierarchy       │◄────────────────── F-09* │
└──────────────────┘      (spacing absorbed   │
                           into hierarchy)    │
                                              │
┌──────────────────┐                          │
│  F-07 Animations │  (can start alongside    │
│  (star, float,   │   F-01 but must not      │
│   particles)     │   conflict with 3D       │
└──────────────────┘   carousel transforms)   │
                                              │
              ┌───────────────────────────────┘
              │
              ▼
    ┌────────────────┐
    │  F-11  Game    │◄─── F-03 (header must be
    │  Shell         │      consistent before
    └────────┬───────┘      embedding in shell)
             │
             ▼
    ┌────────────────┐
    │  F-12  Iframe  │
    │  Sandbox +     │
    │  Loading       │
    └────────────────┘
```

**Critical Path:** F-01 → F-02 → F-05 → F-08 (sequential, each depends on prior)

**Parallel Tracks:**
- Track A (independent): F-03, F-06, F-10, F-09
- Track B (carousel chain): F-01 → F-02 → F-04
- Track C (visual flow): F-05 → F-08 → F-09
- Track D (animation): F-07 (can start after F-01 stabilizes)
- Track E (platform prep): F-11 → F-12 (research, then prototype)

---

## Prioritization Matrix

| Feature | Impact (kids) | Impact (parents) | Complexity | Priority | Ship in |
|---|---|---|---|---|---|
| **F-01** 3D Orbital Carousel | 🔴 Very High | 🟠 High | HIGH | **P0** | v2.0 |
| **F-02** Unified Hero | 🟠 High | 🟠 High | MEDIUM | **P0** | v2.0 |
| **F-03** Header Consistency | 🟡 Medium | 🟠 High | LOW | **P0** | v2.0 |
| **F-04** Carousel Polish | 🟡 Medium | 🟡 Medium | LOW | **P0** | v2.0 |
| **F-05** Wave Dividers | 🟡 Medium | 🟠 High | LOW | **P0** | v2.0 |
| **F-06** Cards 3-per-row | 🟠 High | 🟠 High | LOW | **P0** | v2.0 |
| **F-07a** Hover/Tap Feedback | 🔴 Very High | 🟡 Medium | LOW | **P0** | v2.0 |
| **F-07b** Star Drift + Float | 🔴 Very High | 🟡 Medium | MEDIUM | **P0** | v2.0 |
| **F-07c** Planet Pulse + Particles | 🟠 High | 🟢 Low | HIGH | **P1** | v2.x |
| **F-08** Background Hierarchy | 🟡 Medium | 🟠 High | MEDIUM | **P0** | v2.0 |
| **F-09** Index Spacing | 🟢 Low | 🟡 Medium | LOW | **P0** | v2.0 |
| **F-10** Explore Filter | 🟡 Medium | 🟡 Medium | LOW | **P0** | v2.0 |
| **F-11** Game Shell Research | 🟠 High | 🔴 Very High | HIGH | **P1** | v2.x |
| **F-12** Iframe Sandbox + Loading | 🟠 High | 🟠 High | HIGH | **P2** | v3 |

---

## MVP Definition

### v2.0 Launch (MVP — "The site feels alive")

The minimum set of features that transforms the v1 static layout into a visually immersive experience:

| Feature | Rationale for inclusion |
|---|---|
| F-01 3D Orbital Carousel | The centerpiece — this IS the v2.0 marquee feature. Without it, v2 is just a cleanup release. |
| F-02 Unified Hero | Can't ship a 3D carousel that's visually disconnected from the site branding. |
| F-03 Header Consistency | Quick win; must happen before the site is seen as "v2 quality." |
| F-04 Carousel Polish | Part of F-01 implementation — not a separate effort. |
| F-05 Wave Dividers | Low effort, high visual impact. Transforms section flow. |
| F-06 Cards 3-per-row + Coming Soon | Low effort, fills visual space, communicates platform growth. |
| F-07a Hover/Tap Feedback | Must-have for children; extends existing v1 hover states. |
| F-07b Star Drift + Planet Float | The "alive" factor. CSS-only, low risk, high reward. |
| F-08 Background Hierarchy | Ties everything together visually. |
| F-09 Index Spacing | Trivial fix bundled with F-08. |
| F-10 Explore Filter Redesign | Quick cleanup; prevents the explore page from feeling "left behind" by homepage improvements. |

**v2.0 success criteria:** A child visiting the site for the first time says "Uau!" (Wow!) within the first 3 seconds. The starfield drifts, the planets float, the carousel rotates in 3D, and the CTA button glows. The entire page feels like a single cohesive space journey from header to footer.

### v2.x (Post-launch iteration — "The site feels smart")

| Feature | Rationale for deferral |
|---|---|
| F-07c Planet Pulse + Particles | Requires a particle system (either CSS-heavy or JS-based). High effort for incremental visual gain. Ship after v2.0 is stable. |
| F-11 Game Shell (iframe prototype) | Research must be done during v2.0, but the full implementation (game-shell.html page with iframe, loading, back button) ships as v2.x. Needs testing with both Phaser and plain HTML games. |

### v3 (Platform maturity — "The site feels like a product")

| Feature | Rationale for v3 |
|---|---|
| F-12 Iframe Sandbox + Unified Loading | Depends on F-11 being fully implemented and stable. Requires game-side cooperation (`postMessage`). High complexity, stretch-goal quality. |
| Functional search on Explore page | Not in v2 scope; catalog too small to justify. Relevant when game count > 10. |
| LocalStorage progress tracking | Deferred from v1; cross-game progress requires a data model that should be designed holistically. |
| Achievement badges | Requires progress tracking + badge display system. v3 personality feature. |
| Auto-rotating carousel | Only after 3D carousel is rock-solid and tested for motion sickness tolerance in the age group. |

---

## Micro-Interaction Expectations

What polished kids' educational platforms deliver in terms of interactive feedback:

### Hover States (Desktop)

| Element | Expected Behavior | Timing |
|---|---|---|
| **Planet (carousel)** | Scale up 5-8%, subtle colored glow (box-shadow with planet color), name text brightens | 200-300ms ease-out |
| **Game card** | Lift 8-12px (translateY), shadow deepens + spreads, planet illustration within card pulses gently | 200ms ease-out |
| **Button (CTA)** | Rise 3-4px, shadow grows, background brightens slightly | 150ms ease-out |
| **Nav link** | Underline slides in from left (or center), text color shifts to accent | 200ms ease-in-out |
| **Filter pill** | Background fills with planet color, text goes white | 150ms ease |
| **Footer link** | Underline appears, slight opacity increase | 150ms |

### Active/Click States

| Element | Expected Behavior | Timing |
|---|---|---|
| **Button (CTA)** | Sink 2px (undo the hover rise), shadow compresses, brief color flash | 100ms |
| **Game card** | Sink 2px, brief flash of planet color overlay, then navigate | 100ms + 300ms transition |
| **Planet (carousel)** | Scale pulse (1.0 → 1.1 → 1.0), then carousel rotates to selection | 200ms pulse + 400ms rotation |
| **Filter pill** | Instant fill (already colored from hover), slight scale bounce | 100ms |

### Touch States (Mobile)

| Element | Expected Behavior | Note |
|---|---|---|
| All interactive elements | On `touchstart`: immediate visual feedback (scale or color). On `touchend`: action fires. | No hover equivalent — touch feedback must be instantaneous. |
| Carousel | Swipe gesture recognized within 50ms. Visual feedback: planets shift immediately on drag, snap on release. | Consider `touch-action: pan-x` to prevent vertical scroll interference. |
| Tap targets | Minimum 48×48px, ideally 56px for primary actions | Per WCAG 2.5.8 and v1 accessibility research. |

### Loading / Transition Feedback

| Scenario | Expected Behavior |
|---|---|
| Page navigation | Skeleton or fade-in of content areas. No blank white flash. |
| Component injection (nav/footer) | Placeholder height reserved; fade-in on load. No layout shift. |
| Game iframe load (F-11/F-12) | Branded loading screen with planet animation → fade out when game is ready. |
| Image loading | Placeholder color matching the planet → image fades in. Use `loading="lazy"` and `decoding="async"`. |

---

## Competitive Landscape

How polished kids' educational platforms handle the visual features targeted in v2:

| Feature | PBS Kids | National Geographic Kids | Escola Games | ABCmouse | Meu Planetinha v2 |
|---|---|---|---|---|---|
| **Hero experience** | Full-width character carousel with ambient animation | Video + illustration hero with layered parallax | Static illustrated banner | Character selection with animation | 3D orbital planet carousel + star drift |
| **Section transitions** | Colored block sections, no waves | Organic shapes, illustration-based | Hard edges, colored bars | Subtle curves between sections | SVG wave dividers |
| **Hover feedback** | Scale + glow on game cards | Subtle lift + shadow on articles | Card lift + color shift | Scale + bounce on activity tiles | Planet pulse + lift + glow + particles (v2.x) |
| **Background** | Solid color blocks per section | Photo-based with gradient overlays | Illustrated sky/nature scenes | Gradient with subtle patterns | Animated cosmic gradient + starfield drift |
| **Loading experience** | Character animation | Spinner | Static loading bar | Character animation + progress | Branded planet loading screen (v3) |
| **Game embedding** | Inline (no iframe) | Separate page | Separate page | Inline (proprietary player) | Iframe with site shell (v2.x) |

**Key insight:** Meu Planetinha's 3D orbital carousel and ambient starfield are genuinely unique in the kids' educational space. Most competitors use flat carousels or static grids. The space theme with depth perception is the platform's strongest visual differentiator.

---

## Minimum Viable Visual Polish

The absolute minimum to make the site feel "alive" (the "I can't launch without this" bar):

1. **Star drift** — CSS `@keyframes translateX` on pseudo-elements or small divs. 20-30 stars, slow horizontal drift, varying sizes and opacities. **~30 min to implement. Ship-blocking.**

2. **Planet float** — CSS `@keyframes translateY` on `.planet-sphere`. Each planet on a slightly different duration (4s, 4.5s, 5s, 5.5s, 6s) to avoid mechanical sync. **~15 min to implement. Ship-blocking.**

3. **Wave divider below hero** — Single inline SVG with a `<path>` element. Color-matched. **~20 min to implement. Ship-blocking.**

4. **Button hover refinement** — Extend existing `:hover` rules with `box-shadow` growth and `translateY`. **~10 min. Ship-blocking.**

5. **3D carousel (minimum version)** — Even if the full orbital ring isn't ready, a "2.5D" version with `perspective`, front/back `scale`, and `filter: blur` on back planets is the minimum ship target. **~2-3 hours. Ship-blocking.**

**Total minimum viable polish:** ~4-5 hours of focused implementation.

**Everything else** (particles, full orbital math, game shell, iframe loading) is post-launch enhancement.

---

## Summary

v2.0 is fundamentally about one transformation: **making the site feel like a living space world instead of a static document.** The 12 features serve this single goal at varying levels of investment and impact.

The 3D carousel (F-01) is the marquee feature. Star drift + planet float (F-07b) is the highest-value-per-hour investment. Wave dividers (F-05) and cards layout (F-06) are low-effort high-coherence wins. The game shell (F-11) is strategic platform prep that pays off in v2.x/v3.

The anti-feature risk is clear: **animation overload**. Two ambient layers maximum. Everything else is interaction-triggered. The site should feel like a gentle journey through space, not a Las Vegas casino floor.

---

*Research based on: WCAG 2.1/2.2 specification, Common Sense Media developmental guidelines, CSS `perspective` and 3D transforms documentation (MDN), competitive analysis of PBS Kids / National Geographic Kids / Escola Games / ABCmouse, Guia-Visual.md design system, and v1.0 implementation assessment.*
