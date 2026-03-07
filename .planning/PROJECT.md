# Meu Planetinha — Website Redesign

## What This Is

Meu Planetinha is a browser-based educational gaming platform for children aged 6–10, hosted on GitHub Pages. The platform acts as a hub that hosts multiple mini-games, each tied to a school subject (Mathematics, Portuguese, Science, Geography, English). This project is a full redesign of the website shell — the homepage, explore page, about page, and 404 — to match the Guia-Visual.md design system while leaving the games themselves untouched.

## Core Value

A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.

## Requirements

### Validated (v1.0 — Shipped 2026-03-05)

- ✓ Planet carousel on homepage — existing (rough implementation)
- ✓ Explore page listing games — existing (incomplete)
- ✓ About Us page — existing (rough)
- ✓ Custom 404 page — existing
- ✓ Two playable games (Contando Estrelas, Jogo de Sílaba) — existing, untouched
- ✓ Homepage rebuilt from scratch — cosmic space background, header, planet carousel (5 planets: Calculon, Letrion, Naturox, Terramund, Globish), footer — v1.0
- ✓ Planet carousel — Órbita Central layout, keyboard + touch navigation, each planet visually themed — v1.0
- ✓ Explore page rebuilt — game card grid with Portal de Entrada card style per Guia-Visual — v1.0
- ✓ About Us page rebuilt — consistent visual design with site shell — v1.0
- ✓ 404 page rebuilt — on-brand design — v1.0
- ✓ Shared navigation loaded via JS fetch/include — eliminates copy-paste duplication — v1.0
- ✓ Full Guia-Visual design system implemented — Fredoka One, Nunito, Press Start 2P, color palette, button styles, CSS variables — v1.0
- ✓ Games linked correctly from new site — game pages (`jogos/`) continue to work unmodified — v1.0

### What's Shipped

- ✅ **v1.0 MVP** — 11 phases, 46 plans, shipped 2026-03-05. Site live at https://rfaeldePadua.github.io/Atividade-ExtencionistaIV/. Homepage, explore page, about us, 404, shared nav/footer, design system, two playable games.

- ✅ **v2.0 Visual Polish & 3D Carousel** — 6 phases, 21 plans, shipped 2026-03-06. 24 requirements verified (POLISH-01–07, CAROUSEL-01–07, ANIM-01–05, TRANS-01–02, SHELL-01–03). Features: animation system, 3D orbital carousel, unified hero section, wave dividers, cross-browser verified, game shell infrastructure with sandboxed iframes. Safari preserve-3d remains unverified (known risk).

### Out of Scope

- Game redesign — explicitly excluded; games stay as-is
- Animations (star drift, floating planets, particle bursts) — deferred; ship clean layout first, add motion later
- User accounts / login ("Entrar") — deferred; no backend, no auth
- Achievements / progress tracking — deferred; requires persistence layer
- Functional search bar — deferred; UI placeholder only
- Alphabet filter in Explore — deferred; UI placeholder only
- Backend or server-side code — static site only, GitHub Pages deployment

## Context

- **Existing codebase:** Site was built but left rough and unfinished. Nav is copy-pasted across all pages (5 pages). Two different nav markup styles exist (old game pages vs newer main pages). No shared templating.
- **Design system:** Fully specified in `Referencias/Guia-Visual.md` — covers background, palette, typography, header, footer, carousel, buttons, cards, game screen HUD.
- **Games stay untouched:** `jogos/Contando_Estrelas/` and `jogos/Jogo_de_Silaba/` are not part of this redesign. Their HTML pages use an older nav style — that's acceptable for now.
- **Deployment:** GitHub Pages, static files only, no build step.
- **Shared nav approach:** A single `components/nav.html` file loaded via `fetch()` + `innerHTML` injection — one source of truth, no bundler needed.
- **Existing CSS variables:** `estilos/geral.css` already has a `:root` block with design tokens — this will be replaced/updated to match Guia-Visual exactly.

## Constraints

- **Tech stack:** Vanilla HTML/CSS/JS, no build tool, no framework — deploys to GitHub Pages as-is
- **Browser target:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge) — no IE
- **Games untouched:** `jogos/` directory — read-only; no modifications whatsoever
- **No animations in v1:** Ship static layout first; animations (star drift, float, particles) added in a later phase
- **Design authority:** `Referencias/Guia-Visual.md` is the canonical design reference for all visual decisions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Shared nav via JS fetch + innerHTML | No build step needed, eliminates copy-paste duplication, works on GitHub Pages | ✓ Good — resolved depth-1 path issue via `document.currentScript.src` base detection |
| Rebuild from scratch (not refactor) | Existing HTML/CSS is inconsistent, two nav styles coexist, easier to start clean | ✓ Good — clean codebase, zero legacy cruft |
| No animations in v1 | Ship clean, correct layout first; motion adds complexity and risk | ✓ Good — site feels complete without it |
| Keep games unmodified | Games are out of scope; redesign risk is website shell only | ✓ Good — both games work identically post-redesign |
| Fredoka One + Nunito + Press Start 2P | Specified by Guia-Visual.md design system | ✓ Good — consistent, kid-appropriate typography |

---
*Last updated: 2026-03-07 after v2.0 milestone completion*
