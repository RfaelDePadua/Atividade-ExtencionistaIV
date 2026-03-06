---
phase: 15-unified-hero-section-transitions
plan: "03"
status: complete
started: 2026-03-06T00:00:00Z
completed: 2026-03-06T00:00:00Z
---

# Plan 15-03 Summary: Visual Polish & Human Verification

## What Was Built

### Task 1 (auto): Frosted glass hero-header, hero sparkles, CTA glow
- Frosted glass panel on `.hero-header` via `backdrop-filter: blur(12px)` with semi-transparent navy background and subtle border
- Experiment B fallback preserved as commented CSS
- 4 hero-level sparkle elements (`.sparkle--hero`) added outside `.carousel-scene`, inside `.hero` — 11 total sparkles in hero area
- `.sparkle--hero` positioning CSS added to homepage.css
- Mobile padding adjustment: `.hero-header { padding: var(--espaco-md) var(--espaco-lg) }` at 640px breakpoint

### Checkpoint: Human Visual Verification + Corrections (5 fix commits)

User-reported issues during checkpoint:
1. **Skip-link**: Changed `.skip-link:focus` → `.skip-link:focus-visible` — no longer appears on click
2. **Wave divider removed**: User removed the hero→cards SVG wave (found it visually unappealing). HTML and CSS cleaned up.
3. **Solid cards background**: `#jogos` now has `background: linear-gradient(transparent 0%, #111842 80px, #111842 100%)` — distinct from footer (#0B0F2E) with soft entry transition
4. **Nebula bloom enhanced**: Enlarged (150% wide, 85% tall), opacity increased, gradient transparency at 75% for softer fade
5. **Mobile overflow**: `overflow-x: clip` moved from `html` to `body` — prevents 3D/sparkle overflow without pushing fixed nav off-screen
6. **CTA/dots spacing**: Negative top margins on `.hero-cta` and `.carousel-dots` to pull them closer to the carousel
7. **Jogos title**: Added `margin-top: var(--espaco-xl)` to `.jogos-titulo` for better breathing room
8. **Dots margin refinement**: Reduced from `-var(--espaco-md)` to `-var(--espaco-sm)` to prevent overlap

## Commits
| # | Hash | Message |
|---|------|---------|
| 1 | `b885d92` | feat(15-03): frosted glass hero-header, hero sparkles, and CTA glow |
| 2 | `70ecaad` | fix(15-03): skip-link only visible on keyboard focus-visible |
| 3 | `e6d3716` | fix(15-03): solid cards background, enhanced nebula bloom, wave fill match |
| 4 | `a254b0f` | fix(15-03): prevent mobile horizontal overflow with overflow-x clip on html |
| 5 | `6530690` | fix(15-03): soften nebula edge with gradient jogos bg, extend wave overlap |
| 6 | `582c713` | fix(15-03): remove hero wave, tighten CTA/dots spacing, lower jogos title |
| 7 | `7152193` | fix(15-03): move overflow-x clip to body, reduce dots margin to prevent CTA overlap |

## Files Modified
- index.html
- estilos/pages/homepage.css
- estilos/cards.css
- estilos/base.css
- components/components.css

## Decisions
- Hero→cards wave divider: removed per user preference. `#jogos` gradient-top provides soft visual transition instead.
- Frosted glass (Experiment A) confirmed working — 3D carousel unaffected because `.hero-header` is a sibling of `.carousel-scene`, not a parent
- Footer wave (Plan 02) retained — user only removed the hero wave
- `overflow-x: clip` on `body` (not `html`) — fixed elements use viewport, not body, for positioning

## Phase 15 Human-Verified Requirements
- ✅ CAROUSEL-03: Hero title, subtitle, CTA, and carousel render as single cohesive block
- ✅ TRANS-01: Footer wave divider visible (hero wave removed per user preference, gradient transition used instead)
- ✅ TRANS-02: No subpixel gaps; section hierarchy via gradient/solid backgrounds
- ✅ POLISH-07: Mobile layout correct at 320px–768px; no horizontal overflow
