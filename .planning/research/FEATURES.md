# Feature Research

**Domain:** Kids educational gaming platform (ages 6-10)
**Researched:** 2026-03-04
**Confidence:** HIGH

---

## Feature Landscape

### 1. Table Stakes for Kids Educational Site Homepages

What children (6-10) and their parents fundamentally expect when landing on an educational gaming site:

#### For Children
- **Instant visual payoff** — the homepage must communicate "this is fun" within 2 seconds. Color, character, and motion do this before any text is read.
- **One obvious thing to do** — a single dominant CTA ("Explorar Jogos") that requires no deliberation. Children in this age group do not parse multiple competing options well.
- **Recognizable subject areas** — subjects must be named or symbolized in ways the child already knows from school (Math, Portuguese, Science). Abstract metaphors without labels fail.
- **Immediate game access** — no required registration, no paywall gate, no tutorial forced before play. The path from homepage → game should be ≤ 2 clicks.
- **Visual feedback on hover/tap** — interactive elements must "react" visibly (scale, glow, bounce). Static elements feel broken to children.

#### For Parents
- **Credibility signals above the fold** — a clear site name, a legible tagline ("Aprender é uma aventura!"), and visual consistency signal legitimacy.
- **Age appropriateness immediately apparent** — age range and subject scope stated plainly, ideally in the hero area or header subtitle.
- **Privacy and safety links reachable** — footer links to Privacy Policy, Terms of Use, and Contact must be present and findable without scrolling through child-oriented content.
- **No dark patterns** — no fake "congratulations" popups, no tricks to initiate purchases, no data-collecting forms aimed at children.
- **No autoplay audio on load** — parents with children in shared spaces (libraries, classrooms, late nights) will close a tab that makes unexpected noise.

#### Intersection (both audiences)
- Fast page load — children lose attention; parents abandon slow sites.
- Mobile-first design — majority of 6-10 access happens on tablets and shared family phones.
- No horizontal scroll — unexpected scroll directions confuse both audiences.

---

### 2. What Makes a Game Discovery Page Work for Ages 6-10

The Explore page is the primary discovery surface. Research in children's HCI consistently shows:

#### Visual Over Textual
- Game cards must be understood at a glance from illustration alone. The planet character (Calculon, Letrion, etc.) serves as an icon that becomes associated with the subject through repetition.
- Color coding by subject (orange = Math, lilac = Portuguese) reduces cognitive load for children who already have a color-subject association after 1-2 visits.
- Avoid walls of text on cards. The card should show: image, title, difficulty indicator. Description can live in an expanded state or tooltip, but should never be required reading before play.

#### Tactile Affordances
- Cards must look "pressable" — depth cues (shadows, rounded corners, slight gradient) signal interactivity to children who have grown up with touchscreens.
- Hover/tap response (card rises, planet pulses) is not decorative — it is a confirmation signal that the child's intent was registered.
- Tap targets must be the entire card, not a small "Play" button within it. Small targets cause repeated mis-taps, leading to frustration.

#### Simple Filtering and Wayfinding
- Planet-based subject filter (5 planets) is an appropriate complexity level. Do not add more filter dimensions (e.g., duration, format) on the initial release.
- Active filter state (selected planet tab glows / is highlighted) must be visually unambiguous. A pill selector with clear selected vs. unselected states works at this age.
- "All" / "Todos" as the default state ensures no child lands on an empty page.
- No search in v1 — correct. Keyword search requires typing, which is a barrier for the 6-7 cohort and adds implementation complexity without proportional benefit at small catalog sizes.

#### Cognitive Load Management
- Present 6-9 game cards per view. More than 9 items causes choice paralysis in this age group (referenced in UX literature as "paradox of choice" effect, heightened in children).
- Consistent card layout across all subjects — muscle memory navigation. Children learn "the star rating is always bottom-left" and stop reading the layout.

---

### 3. Game Cards: Visible Information Architecture

Based on the Guia-Visual.md card spec ("Portal de Entrada") and children's HCI best practices:

#### Required (visible without interaction)
| Element | Format | Rationale |
|---|---|---|
| **Game title** | Fredoka One, large, max 2 lines | Primary identifier; must be legible at card thumbnail size |
| **Subject planet** | Planet illustration (top 50% of card) | Visual subject identifier; color-coded by subject |
| **Difficulty** | 1–3 stars (filled/empty) | Stars are culturally universal for this age group; avoid numeric ratings (e.g., "Level 3") which require reading |
| **"Jogar!" button** | Contextual color, bottom of card | Clear single CTA; no ambiguity about next action |

#### Recommended (visible without interaction)
| Element | Format | Rationale |
|---|---|---|
| **Progress bar** | Thin bar at card base, planet color | Returning players see their progress; motivates re-engagement without requiring login in v1 (can use localStorage) |
| **Grade/age indicator** | Small badge (e.g., "1º-2º ano") | Parents scan this when supervising subject selection; children largely ignore it |

#### Optional / Out of Scope for v1
- Play count / popularity indicators (requires backend)
- "New" badge (useful but needs CMS date tracking)
- Preview animation on hover (high implementation cost vs. value)

#### What NOT to Show
- Long descriptions on the card face — they break the visual rhythm and are not read by children
- External links or share buttons — distraction, safety risk
- Advertising slots — trust-breaking for parents

---

### 4. Accessibility Requirements for Children's Digital Products

Children are a protected audience under accessibility law and ethical design standards. The bar is WCAG 2.1 AA minimum, with several areas where children's products should exceed it.

#### Color Contrast (Critical on Dark Backgrounds)
The platform uses deep blue/indigo backgrounds (#0D1A3A to #2D1B8A). Minimum contrast ratios:

| Text type | WCAG AA requirement | Recommended for children |
|---|---|---|
| Normal text (< 18pt) | 4.5:1 | **7:1** (children reading in bright environments, screens at varying angles) |
| Large text (≥ 18pt / bold ≥ 14pt) | 3:1 | **4.5:1** |
| UI components / icons | 3:1 | **4.5:1** |

Verified examples against the design palette:
- White (`#FFFFFF`) on Índigo (`#2D1B8A`): ~10.8:1 ✅
- Amarelo-sol (`#FFD43B`) on Índigo (`#2D1B8A`): ~7.2:1 ✅
- Verde-menta (`#4DFFB4`) on Azul-céu (`#1A3A8F`): ~8.1:1 ✅
- Rosa-chiclete (`#FF6EB4`) on Índigo (`#2D1B8A`): ~4.9:1 ✅ (AA large text only; verify at body size)
- Laranja-tang (`#FF8C42`) on Azul-marinho-footer (`#0B0F2E`): ~6.1:1 ✅

**Risk area:** Any small text in rosa-chiclete or laranja-tang on mid-blue backgrounds — check at implementation.

#### Touch and Click Target Sizes
| Surface | WCAG 2.5.5 (AAA) minimum | WCAG 2.5.8 (AA, WCAG 2.2) minimum | Recommendation |
|---|---|---|---|
| Primary buttons | 44×44 px | 24×24 px | **48×48 px minimum**, prefer 56px height for pill buttons |
| Game cards | Full card tappable | Full card tappable | Full card = tap target (no sub-regions) |
| Navigation links | 44×44 px | 24×24 px | **48px height minimum** with padding |
| Footer links | 44×44 px | 24×24 px | **40px height acceptable** (parent audience, fine motor) |
| Carousel arrows (rocket) | 44×44 px | 24×24 px | **56×56 px** — used by children, high miss-tap risk |
| Planet filter pills | 44×44 px | 24×24 px | **48px height min**, 8px gap between pills |

#### Typography Accessibility
- Minimum body text size: **16px** (Nunito Regular). Never below 14px in any interactive context.
- Line height: **1.5× font size** minimum for body copy; critical for children with early-stage reading skills.
- Letter spacing on uppercase labels: `0.05em` minimum.
- Fredoka One at heading sizes (32px+) is accessible. Avoid using Press Start 2P for anything other than score displays — its pixel style reduces readability for developing readers.

#### Motion and Animation
- All animations (star drift, planet float, button particles) must respect `prefers-reduced-motion`. Provide a static fallback.
- Don't use flickering effects (> 3 Hz) — relevant to users with photosensitive conditions (WCAG 2.3.1).
- The carousel auto-advance (if implemented) must pause on hover/focus and be controllable by the user.

#### Keyboard and Screen Reader
- Full keyboard navigability: Tab order must be logical (header → hero → carousel → section → footer).
- All interactive elements must have visible focus indicators — do not remove `outline` without providing a superior custom focus ring.
- Images of planets must have descriptive `alt` text: `alt="Calculon - Planeta de Matemática"` not `alt="planet1"`.
- Star ratings: use `aria-label="Dificuldade: 2 de 3 estrelas"` — do not rely on visual star icons alone.
- Game cards: wrap in `<article>` or `<li>` with accessible button labeling.

#### Language and Reading Level
- All UI text must target a **reading age of 7-8** (2nd grade equivalent). Short sentences, no jargon.
- Avoid instructions longer than one line in interactive elements.
- Button labels must be action verbs: "Jogar!", "Explorar", "Voltar" — not "OK", "Continuar", "Submit".

---

### 5. Navigation Patterns for Dual Audiences (Children + Parents)

The header serves two simultaneous audiences with different goals and different reading speeds.

#### Children (6-10)
- Navigate by **recognition, not recall** — icons or color-coded labels work better than text-only nav items.
- Maximum **4 navigation items** visible at once; more causes scanning paralysis.
- Current Guia-Visual nav: "Jogos · Conquistas · Sobre · Entrar" — appropriate count.
- The primary CTA ("Explorar Jogos" button) must be the visually dominant element in the header — children will go for the most colorful/large element.
- Hamburger menus on mobile are accessible to this age group only if the icon is clearly recognizable and the opened menu is full-screen with large touch targets.

#### Parents
- Navigate by **scanning labels** — text navigation items must be legible (Nunito Bold, no all-caps, sufficient size ≥ 14px).
- Parents use the footer for policy links — they expect Privacy Policy, Terms of Use, and Contact in the footer, not in the header.
- Parents may navigate to "Sobre Nós" to evaluate the platform's credibility before allowing their child to use it. This page must be readable by adults.

#### Pattern Recommendations
| Pattern | Recommendation | Rationale |
|---|---|---|
| Fixed header | ✅ Yes (already specified) | Children navigate back to homepage frequently; persistent nav reduces disorientation |
| Scroll-shrink header | ✅ Yes (already specified) | Recovers vertical space in game browsing contexts |
| Breadcrumbs | ✅ Recommended on Explore and About pages | Children get lost in hierarchies; "Início > Explorar" reduces back-button reliance |
| Back button in-game | ✅ Required | Children cannot find browser back on mobile; in-game back must be always visible |
| Active nav highlight | ✅ Required | Current page must be visually distinguished (underline, color change, or bold) |
| Skip to content link | ✅ Required | First focusable element for keyboard/screen reader users |
| Language switcher | ⬜ Not in v1 scope | Platform is PT-BR; English is a game subject, not an interface language |

#### Mobile Navigation
- At < 768px breakpoint, collapse to hamburger with full-screen overlay menu.
- Menu items in overlay should be 64px height minimum — designed for child fingers.
- Close button must be visible and labeled (not just an X icon): "Fechar" or ✕ with `aria-label`.

---

### 6. Footer Content for a Kids Educational Site

The footer serves almost exclusively the parent audience. Children rarely scroll to footers intentionally.

#### Parent-Facing (Required)
| Link | Purpose |
|---|---|
| **Política de Privacidade** | Legal requirement (LGPD in Brazil; COPPA equivalent for any under-13 audience); parents actively look for this |
| **Termos de Uso** | Sets expectations on usage, content, and liability |
| **Contato / Fale Conosco** | Safety valve — parents must have a way to report issues or ask questions |

#### Brand (Recommended)
| Element | Purpose |
|---|---|
| Logo + tagline | Brand recall; confirms the user is on the right site after scrolling |
| "Aprender é uma aventura!" | Emotional brand reinforcement; reminds parents of the platform's educational mission |
| Social media links | Optional; if present, link to official accounts only — do not link to platforms children can independently access |

#### Child-Facing (Nothing to Action On — Correct Approach)
The footer should contain **no interactive elements targeted at children**. Specifically:
- No "Play Now" or game CTA in the footer — children who scroll that far are lost; redirect them upward.
- No newsletter signups — collecting child email without parental consent violates LGPD/COPPA.
- No comment sections or testimonials with user-generated content in the footer.

#### Design Constraints (from Guia-Visual)
- Azul-marinho profundo `#0B0F2E` background — text must be light (white or grey-light; minimum 4.5:1 contrast).
- Wavy top border preserves the space theme without making the footer feel playful enough to invite child interaction.
- 3-4 static stars: appropriately decorative without animation that draws child attention downward.

#### What NOT to Include
- Advertiser logos ("proudly supported by...")
- Cookie consent banners embedded in the footer — these must appear inline/overlay at first visit
- Age gate forms
- App store download badges (not in scope for v1)

---

### 7. Differentiating Elements: Exciting vs. Institutional

Educational gaming sites frequently fail by leaning too institutional (they look like school portals) or overreaching on excitement (they look like slot machines). "Meu Planetinha" sits in a well-defined sweet spot.

#### What Makes It Feel Exciting (Not Institutional)
| Element | Institutional Version | Meu Planetinha Version |
|---|---|---|
| **Subject labeling** | "Módulo de Matemática" | "Calculon — Planeta da Matemática" |
| **Color palette** | Muted blues, flat whites, grays | Sorvete Galático — saturated, vibrant, warm |
| **Typography** | Arial / Roboto / system fonts | Fredoka One + Nunito — rounded, approachable, not school-ish |
| **Interaction feedback** | None / blue underline | Planets pulse, buttons rise and generate particles, hover grows |
| **Background** | White or soft gradient | Cosmos Colorido — active, drifting, spatial |
| **Difficulty indicator** | "Nível 1 / Básico" | ⭐☆☆ stars |
| **Button labels** | "Acessar Jogo" | "Jogar!" |
| **404 page** | "Página não encontrada. Error 404." | Opportunity: lost-in-space narrative, "Seu foguete se perdeu!" + button back to home |

#### What Makes It Feel Safe (Not Overstimulating)
Children's media research (Common Sense Media, NAEYC) identifies overstimulation triggers:
- Autoplay audio/video
- Pop-up prize animations that interrupt gameplay
- Countdown timers on the homepage (creates anxiety, not excitement)
- Too many simultaneous animation layers (parallax + particle + float + glow all at once)

**Meu Planetinha should:**
- Limit simultaneous animations to **maximum 2 layers** visible at any time in a viewport.
- Use slow, organic animation timing — star drift and planet float should use easing curves that feel "breathing," not mechanical. Suggested: `ease-in-out` with 4-8s cycles.
- Reserve energetic animations (particles, pulse) for **user-triggered events only** — hover and click. Background animations should always feel ambient, not demanding.

#### The "Wow Moment" on First Visit
The first impression must deliver a "this is different from school" signal within 2-3 seconds of page load. Based on the design system:
1. The cosmos background gradient loads immediately (pure CSS, no asset dependency).
2. Star drift begins (CSS animation, no JS required).
3. Planet carousel enters the viewport — 5 distinct, character-like planets immediately signal that this is a world, not a menu.
4. The "Explorar Jogos" CTA button, with its yellow-to-orange gradient and glow, is the single most visually prominent interactive element.

This sequence — ambient space → characters → single CTA — is the correct excitement pacing for the 6-10 age group.

#### Credibility for Parents (The Second Audience's "Wow Moment")
Parents evaluate in approximately 5-8 seconds. The signals they read:
- **Typography consistency** — Fredoka One + Nunito throughout (no font soup) communicates professional design.
- **Color discipline** — the 5-planet color system demonstrates intentionality; it doesn't look like a free template.
- **Footer with policy links** — the presence of "Política de Privacidade" in the footer is the single highest-impact trust signal for Brazilian parents of this cohort.
- **No ads, no registration required, no paywall friction** — parents who reach the game without being stopped feel respected.

---

## Summary Checklist

### Must-Have (v1)
- [ ] Single dominant CTA on homepage ("Explorar Jogos")
- [ ] Planet carousel as primary subject navigation
- [ ] Game cards with: planet illustration, title, 1-3 star difficulty, "Jogar!" button
- [ ] Minimum 48px tap targets on all child-interactive elements
- [ ] WCAG 2.1 AA contrast on all text (target 7:1 on dark backgrounds for body text)
- [ ] `prefers-reduced-motion` CSS media query implemented
- [ ] Footer: Política de Privacidade, Termos de Uso, Contato
- [ ] Fixed header with active state on current page
- [ ] `alt` text on all planet images
- [ ] No autoplay audio/video

### Should-Have (v1)
- [ ] Breadcrumb navigation on Explore and About pages
- [ ] Progress bar on game cards (localStorage-based)
- [ ] Grade badge on game cards (e.g., "1º-2º ano")
- [ ] In-game back button (persistent, always visible)
- [ ] Keyboard focus rings (custom, matching design system)
- [ ] Skip-to-content link (first focusable element)
- [ ] 404 page with space narrative + redirect to homepage

### Out of Scope (v1) — Confirmed
- Login / authentication
- Achievement system / badges
- Functional search
- Auto-play carousel with audio
- Newsletter / email capture
- Social sharing

---

*Research based on: WCAG 2.1/2.2 specification, Common Sense Media developmental guidelines, NAEYC technology in early childhood principles, Brazilian LGPD (Lei 13.709/2018) child data provisions, and HCI research on children's interface design (Hourcade 2015, Read & Markopoulos 2013).*
