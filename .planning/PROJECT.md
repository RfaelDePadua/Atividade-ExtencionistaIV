# Meu Planetinha — Website Redesign

## What This Is

Meu Planetinha is a browser-based educational gaming platform for children aged 6–10, hosted on GitHub Pages. The platform acts as a hub that hosts multiple mini-games, each tied to a school subject (Mathematics, Portuguese, Science, Geography, English). This project is a full redesign of the website shell — the homepage, explore page, about page, and 404 — to match the Guia-Visual.md design system while leaving the games themselves untouched.

## Core Value

A child lands on the homepage and immediately feels like they're on a space adventure — the planet carousel draws them in and makes picking a game feel like choosing a destination in the universe.

## Requirements

### Validated

- ✓ Planet carousel on homepage — existing (rough implementation)
- ✓ Explore page listing games — existing (incomplete)
- ✓ About Us page — existing (rough)
- ✓ Custom 404 page — existing
- ✓ Two playable games (Contando Estrelas, Jogo de Sílaba) — existing, untouched

### Active

- [ ] Homepage rebuilt from scratch — cosmic space background (gradient #1A3A8F → #2D1B8A → #8B1A6B), header, planet carousel (5 planets: Calculon, Letrion, Naturox, Terramund, Globish), footer
- [ ] Planet carousel — Órbita Central layout: center planet prominent, side planets smaller; keyboard + touch navigation; each planet visually themed
- [ ] Explore page rebuilt — game card grid with Portal de Entrada card style per Guia-Visual
- [ ] About Us page rebuilt — consistent visual design with site shell
- [ ] 404 page rebuilt — on-brand design
- [ ] Shared navigation loaded via JS fetch/include — eliminates copy-paste duplication
- [ ] Full Guia-Visual design system implemented — Fredoka One (titles), Nunito (body), Press Start 2P (scores/badges), color palette, button styles, CSS variables
- [ ] Games linked correctly from new site — game pages (`jogos/`) continue to work unmodified

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
| Shared nav via JS fetch + innerHTML | No build step needed, eliminates copy-paste duplication, works on GitHub Pages | — Pending |
| Rebuild from scratch (not refactor) | Existing HTML/CSS is inconsistent, two nav styles coexist, easier to start clean | — Pending |
| No animations in v1 | Ship clean, correct layout first; motion adds complexity and risk | — Pending |
| Keep games unmodified | Games are out of scope; redesign risk is website shell only | — Pending |
| Fredoka One + Nunito + Press Start 2P | Specified by Guia-Visual.md design system | — Pending |

---
*Last updated: 2026-03-04 after initialization*
