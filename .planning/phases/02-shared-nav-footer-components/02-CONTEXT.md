# Phase 2: Shared Nav & Footer Components - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

A single source of truth for site navigation and footer, loaded via JS `fetch()` on all site pages. Game pages in `jogos/` are explicitly never touched. This phase creates `components/nav.html`, `components/footer.html`, and `components/components.js` — the fetch-based component loader with active-page detection.

</domain>

<decisions>
## Implementation Decisions

### Nav link set & ordering
- Only real, active pages appear — no disabled placeholders or "coming soon" badges
- Links: **Explorar Jogos** · **Sobre Nós** (in that order, left to right)
- "Sobre Nós" is the rightmost text link, positioned before the CTA button
- The "Explorar Jogos" CTA button (yellow-orange gradient per Guia-Visual) appears on **all pages**, not homepage-only
- "Conquistas" and "Entrar" are omitted entirely (out of scope — no backend/auth)

### Footer content & parent links
- Only **"Contato"** appears as a parent-facing link (could link to email or future form); "Privacidade" and "Termos de Uso" omitted for v1
- Tagline changed from Guia-Visual's "Aprender é uma aventura!" to **"Explore o universo do aprendizado!"**
- **Static star SVGs** included (3–4 small decorative stars scattered in the footer, per Guia-Visual)
- Layout: **two-column** — Left: logo + tagline | Center: Contato link
- Footer background: `#0B0F2E` per Guia-Visual
- Wavy top border via CSS `clip-path`

### Mobile hamburger behavior
- **Full-screen overlay** when hamburger is tapped (dark semi-transparent background)
- **Classic hamburger icon** (☰) — no animation, no themed icon
- Nav items shown as a **simple text list** (centered, large touch targets)
- "Explorar Jogos" CTA button appears **at the bottom of the mobile menu**
- Collapse breakpoint: **≤640px** (per roadmap)

### JS fallback strategy
- **No `<noscript>` fallback** — JS is required for nav/footer to render
- If fetch fails: **silent failure** — page content still works, no error banner
- No loading state — nav/footer area is empty until fetch completes, then **appears immediately** (no fade, no skeleton)
- Injection method: **`data-component` attribute** on placeholder `<div>` elements (e.g., `<div data-component="nav"></div>`)

### Claude's Discretion
- Internal folder structure for component CSS (e.g., single `components/nav.css` vs integrated into existing files)
- Exact `fetch()` path resolution strategy (`<base href>` vs relative `../` calculation vs `document.currentScript` detection)
- Mobile menu open/close transition timing and easing
- Focus trap behavior inside mobile overlay menu
- `aria-current="page"` detection logic (pathname matching strategy)

</decisions>

<specifics>
## Specific Ideas

- Guia-Visual Section 04 (Header): Logo is planet icon + "Meu Planetinha" in Fredoka One, left-aligned. Nav links in Nunito Bold with magenta underline on hover.
- Guia-Visual Section 05 (Footer): Wavy top border "like a planet horizon seen from below". Stars are static, just for atmosphere.
- The CTA button uses gradient `#FFD43B → #FF8C42` with a glowing shadow effect.
- Header behavior (transparent → `#0D1A3A` on scroll) is Phase 4 scope — Phase 2 just creates the static nav markup/styles.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-shared-nav-footer-components*
*Context gathered: 2026-03-04*
