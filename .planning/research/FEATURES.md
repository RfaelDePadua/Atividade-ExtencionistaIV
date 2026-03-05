# Feature Research

**Domain:** Kids' educational gaming platform — visual polish & platform preparation
**Researched:** 2026-03-05
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| F-02: Unified hero section | Title/subtitle/CTA should flow naturally into carousel — feels disjointed otherwise | LOW | Merge HTML sections, reduce gap, add CTA line "Escolha seu planeta e comece a aventura!" |
| F-03: Header consistency | Duplicate "Explorar Jogos" text confuses users. Inconsistent bar across pages looks unfinished | LOW | Remove nav-cta duplicate text, drop page-shell colored bar |
| F-04: Carousel polish — side planet size | Side planets at ~40% feel too small, breaks depth illusion. ~65% creates convincing orbital feel | LOW | In v2 3D context, handled by perspective. If needed: adjust translateZ or scale |
| F-05: Wave dividers | Sections ending with invisible line feels flat. Kids' sites use playful separators | MEDIUM | Inline SVG Bézier curves between hero→cards and cards→footer |
| F-06: Cards 3-per-row + Coming Soon | 2 cards look empty. 3-per-row with placeholder creates anticipation and fills space | LOW | Add "Em Breve" card with blurred/locked style |
| F-06b: Card button layout | "Jogar!" button floats centered instead of anchored to bottom | LOW | flex + margin-top: auto on button to push to card footer |
| F-08: Background hierarchy | Excess empty space, no vertical rhythm. Sections float disconnected | MEDIUM | Subtle density changes in starfield, section-specific opacity shifts |
| F-09: Index spacing | Cards too close to footer. Needs breathing room | LOW | Add padding-bottom to cards section |
| F-10: Explore filter redesign | Blue strip behind filter feels out of place. Doesn't match cosmic theme | LOW | Remove opaque background, use transparent/glassmorphism |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| F-01: 3D orbital carousel | Transforms flat carousel into immersive "space station control" feel. Kids feel like choosing a destination in space | HIGH | CSS 3D transforms: preserve-3d, perspective, rotateY+translateZ. Tilted elliptical ring (rotateX) |
| F-07: Animations — starfield drift + planet float | Makes the space background feel alive. Static backgrounds feel "dead" for kids | MEDIUM | CSS @keyframes. Starfield via transform:translate() loop. Planets float with translateY oscillation |
| F-07b: Ambient particle accents | Subtle sparkle/glow effects near carousel add magic | MEDIUM | CSS-only sparkle via pseudo-elements or dedicated spans with @keyframes opacity/scale |
| F-11: Game shell iframe wrapper | Professional game-loading experience. Games feel integrated with platform | HIGH | New jogar.html template + iframe sandbox + postMessage loading protocol |
| F-12: Unified loading screen | Branded loading experience across all games. Creates platform identity | MEDIUM | CSS loading animation in parent frame, hidden on game "ready" postMessage |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Excessive particle effects | Looks cool in demos | Kills FPS on kids' tablets, distracts from content, causes motion sickness | Max 2 ambient animation layers. Particles as stretch goal only |
| Over-detailed 3D carousel | Want planets to look like real 3D spheres with textures | CSS gradients already look great. Three.js adds 100KB+ and complexity | Enhance existing radial-gradient spheres with subtle lighting changes during 3D rotation |
| Auto-playing carousel | Common on kids' sites | Violates WCAG, distracts, kids can't read subtitle in time | Keep manual navigation. Add subtle float animation to hint interactivity |

## Feature Dependencies

```
F-01 (3D Carousel) 
    └──requires──> New CSS tokens in base.css
    └──enhances──> F-04 (side planet sizing handled by perspective)

F-02 (Unified Hero) 
    └──requires──> F-01 (3D carousel must be stable before merging)

F-05 (Wave Dividers) 
    └──independent (can be built in parallel)

F-06 (Cards layout) 
    └──independent (can be built in parallel)

F-07 (Animations) 
    └──requires──> New CSS tokens + @keyframes file
    └──enhances──> F-01, F-08

F-08 (Background hierarchy) 
    └──requires──> F-07 (animations contribute to hierarchy)
    └──requires──> F-05 (waves create section separation)

F-11 (Game shell) 
    └──independent of visual features
    └──requires──> F-12 (loading screen) for full experience

F-12 (Loading screen) 
    └──requires──> F-11 (iframe shell exists first)
```

## MVP Definition

### Launch With (v2.0)

- [x] F-01: 3D orbital carousel — the headline feature
- [x] F-02: Unified hero section
- [x] F-03: Header consistency
- [x] F-04: Carousel polish (subsumed by F-01's perspective)
- [x] F-05: Wave dividers
- [x] F-06: Cards 3-per-row + Coming Soon
- [x] F-06b: Card button layout
- [x] F-07: Starfield drift + planet float
- [x] F-08: Background hierarchy
- [x] F-09: Index spacing
- [x] F-10: Explore filter redesign

### Add After Validation (v2.x)

- [ ] F-07b: Ambient particle accents
- [ ] F-11: Game shell iframe wrapper
- [ ] F-12: Unified loading screen

### Future Consideration (v3+)

- [ ] Contributor SDK and documentation
- [ ] Game submission workflow
- [ ] Progress tracking with LocalStorage
- [ ] Functional search + alphabet filter on Explore page

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| F-01: 3D carousel | HIGH | HIGH | P1 |
| F-02: Unified hero | HIGH | LOW | P1 |
| F-03: Header fix | HIGH | LOW | P1 |
| F-05: Wave dividers | MEDIUM | MEDIUM | P1 |
| F-06: Cards layout | MEDIUM | LOW | P1 |
| F-06b: Card button | MEDIUM | LOW | P1 |
| F-07: Starfield + float | HIGH | MEDIUM | P1 |
| F-08: Background hierarchy | MEDIUM | MEDIUM | P1 |
| F-09: Index spacing | LOW | LOW | P1 |
| F-10: Explore filter | MEDIUM | LOW | P1 |
| F-07b: Particles | LOW | MEDIUM | P2 |
| F-11: Game shell | HIGH | HIGH | P2 |
| F-12: Loading screen | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for v2.0 launch
- P2: Should have, add in v2.x
- P3: Nice to have, future consideration

---
*Feature research for: Meu Planetinha v2.0*
*Researched: 2026-03-05*
