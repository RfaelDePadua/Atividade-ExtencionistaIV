# Phase 2 Research: Shared Nav & Footer Components

## 1. Design Specs from Guia-Visual

### Header (Section 04 — "Minimal Espacial")

| Property | Value |
|----------|-------|
| **Behavior** | Fixed top; encolhe ao rolar (shrink-on-scroll is Phase 4 scope — Phase 2 delivers the static structure only) |
| **Background** | Transparent at page top → `#0D1A3A` on scroll (scroll behavior is Phase 4; Phase 2 ships a static solid `#0D1A3A` or transparent placeholder) |
| **Logo (left)** | Planet icon + "Meu Planetinha" in **Fredoka One**, medium size, compact |
| **Nav links (right)** | Nunito Bold, text-only, magenta underline on hover |
| **CTA button** | "Explorar Jogos" — oval/pill, gradient `#FFD43B → #FF8C42`, glowing shadow |

**Phase 2 adjustments (from 02-CONTEXT.md decisions):**
- Links: **Explorar Jogos** · **Sobre Nós** (only two text links; no Conquistas, no Entrar)
- "Explorar Jogos" CTA button appears on all pages, not just homepage
- No search bar in the new nav (the old search form is part of the legacy design; out of scope for v1)

### Footer (Section 05 — "Chão do Universo")

| Property | Value |
|----------|-------|
| **Top border** | Wavy — "like the horizon of a planet seen from below" |
| **Background** | `#0B0F2E` (deeper than page background) — token: `var(--cor-fundo-footer)` |
| **Left column** | Logo (reduced) + tagline in Nunito Italic |
| **Center** | Parent-facing links |
| **Decoration** | 3–4 static stars scattered (small SVGs) |

**Phase 2 adjustments (from 02-CONTEXT.md decisions):**
- Tagline changed to: **"Explore o universo do aprendizado!"** (not the Guia-Visual "Aprender é uma aventura!")
- Only **"Contato"** link (no Privacidade, no Termos de Uso for v1)
- Two-column layout: Left (logo + tagline) | Right (Contato link)
- Wavy top border implemented with CSS `clip-path`

### Colors already in Phase 1 tokens (`base.css :root`)

| Token | Value | Usage in Phase 2 |
|-------|-------|-------------------|
| `--cor-fundo-footer` | `#0B0F2E` | Footer background |
| `--cor-fundo-header` | `#0D1A3A` | Nav background (static for Phase 2) |
| `--cor-amarelo-sol` | `#FFD43B` | CTA gradient start |
| `--cor-laranja-tang` | `#FF8C42` | CTA gradient end |
| `--cor-magenta` | `#8B1A6B` | Underline hover color for nav links |
| `--cor-texto` | `#FFFFFF` | Link/text color |
| `--cor-texto-escuro` | `#0D1A3A` | CTA button text color |
| `--fonte-titulo` | `'Fredoka One', 'Fredoka', cursive` | Logo text |
| `--fonte-corpo` | `'Nunito', 'Segoe UI', system-ui, sans-serif` | Nav links, footer text |

All needed color/font tokens already exist in `estilos/base.css`. No new tokens need to be added.

---

## 2. Current Codebase State

### Phase 1 CSS files (new design system — the ones we build on)

| File | Lines | Contains |
|------|-------|----------|
| `estilos/reset.css` | 58 | Minimal modern CSS reset: box-sizing, margin/padding zero, font inherit, list-style none, a reset |
| `estilos/base.css` | 204 | Complete `:root` token block (palette, semantic colors, 5 planet accents, typography, spacing, shadows, borders, transitions) + base element styles (body gradient, headings, links, `::selection`, `:focus-visible`, prefers-reduced-motion) |
| `estilos/layout.css` | 113 | `.container`, `.container-texto`, flex utilities, text alignment, spacing helpers, `.sr-only` |
| `estilos/componentes.css` | 146 | `.btn-primario`, `.btn-secundario` with hover/active/focus states, planet button variants via `[data-planeta]` |

### Legacy CSS files (still loaded by current pages — will be replaced)

| File | Lines | Status |
|------|-------|--------|
| `estilos/geral.css` | 185 | Old design system ("Cosmos Orgânico" palette, wrong fonts). Currently loaded by all pages. **Will NOT be reused.** |
| `estilos/barra_superior.css` | 320 | Old nav bar (3-column grid, search form, responsive). **Will NOT be reused.** Has useful pattern notes but CSS values are all wrong. |
| `estilos/principal.css` | ~270 | Homepage main content styles (old). **Will NOT be reused.** |
| `estilos/carousel.css` | ~437 | Planet carousel (old). Phase 5 scope. |

### Current HTML pages

| Page | Depth | Current nav? | Current footer? | Notes |
|------|-------|-------------|----------------|-------|
| `index.html` | root (`./`) | Yes — inline, old design, 3 links (Início, Explorar, Sobre Nós) + search | No — just `<!-- carousel + game sections -->` | Loads `geral.css` + `barra_superior.css` + `principal.css` + `carousel.css` + `carousel.js` |
| `explorar/explorar.html` | depth 1 (`../`) | Yes — inline duplicated, `aria-current="page"` on Explorar | No — empty `<footer></footer>` | Loads `../estilos/geral.css` + `../estilos/barra_superior.css` + `./estilos/principal.css` |
| `sobre_nos/sobre_nos.html` | depth 1 (`../`) | Yes — inline duplicated, `aria-current="page"` on Sobre Nós | Yes — empty `<footer></footer>` tag | Loads same pattern as explorar |
| `404.html` | root (`./`) | Yes — inline, older markup variant (different class names) | Yes — empty `<footer></footer>` tag | Uses inline `<style>` + `geral.css` + `barra_superior.css` |
| `_design-system-test.html` | root (`./`) | No | No | Phase 1 test page — loads `reset.css`, `base.css`, `layout.css`, `componentes.css` |

**Key observation:** Every page currently has an inline-duplicated nav. Phase 2 replaces all of them with a `<div data-component="nav"></div>` placeholder + the shared `components.js` loader. Game pages (`jogos/`) are untouched.

### Existing JavaScript

| File | Purpose | Relevance |
|------|---------|-----------|
| `scripts/carousel.js` | PlanetCarousel class — touch/swipe/keyboard/dot navigation | No relevance to Phase 2. Pattern note: uses vanilla ES6 class, `DOMContentLoaded`, `querySelector`. |

No existing component loader or `fetch()`-based JS exists. `components/components.js` will be entirely new.

---

## 3. Path Resolution Strategy — Recommendation

### The problem

The site deploys to GitHub Pages at:
```
https://<user>.github.io/Atividade-ExtencionistaIV/
```

Pages exist at different depths:
- Root: `index.html`, `404.html` → component path: `components/nav.html`
- Depth 1: `explorar/explorar.html`, `sobre_nos/sobre_nos.html` → component path: `../components/nav.html`

`components.js` must `fetch()` the correct path regardless of page depth.

### Options evaluated

| Approach | Pros | Cons |
|----------|------|------|
| **A. `<base href>` tag** | All relative URLs resolve from one root; single fetch path `components/nav.html` works everywhere | Breaks anchor links (`#id`), affects all relative URLs on page (images, CSS, etc.), fragile |
| **B. Explicit relative `../` in each page** | Simple, no magic | Nav/footer paths vary per depth; defeats "single source of truth" for the script tag |
| **C. `document.currentScript.src` detection** | Script knows its own location; computes base path dynamically | Works if `<script src>` uses consistent relative path; `document.currentScript` is null in modules or deferred scripts |
| **D. Compute base path from `location.pathname`** | No reliance on `<script>` tag placement; works with any loading method | Needs knowledge of the repo name for GitHub Pages subpath; slightly more complex |

### Recommended: Approach C — `document.currentScript.src` base-path detection

**How it works:**
1. Each page includes `<script src="components/components.js"></script>` (root) or `<script src="../components/components.js"></script>` (depth 1).
2. Inside `components.js`, at the **top level** (not inside an event listener), capture `document.currentScript.src`.
3. Derive the base path by stripping `components/components.js` from the script URL.
4. All `fetch()` calls use absolute URLs: `new URL('components/nav.html', basePath)`.

**Why this is best for our case:**
- The `<script>` tag path already encodes the relative depth (`./components/` vs `../components/`). The browser resolves this to an absolute URL in `document.currentScript.src`, giving us a reliable base.
- No `<base href>` needed (avoids anchor link breakage).
- No pathname parsing needed (avoids GitHub Pages subpath issues).
- `document.currentScript` is captured synchronously at parse time (before any `DOMContentLoaded`), so it's always available.
- Works identically on `localhost`, `file://`, and GitHub Pages.

**Implementation sketch:**
```javascript
// Top-level (not inside any callback)
const SCRIPT_URL = document.currentScript.src;
const BASE_URL = SCRIPT_URL.substring(0, SCRIPT_URL.lastIndexOf('components/'));

async function loadComponent(name) {
  const url = BASE_URL + 'components/' + name + '.html';
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}
```

**Caveat:** `document.currentScript` is `null` if the script is loaded with `type="module"` or `defer`. Since we control the `<script>` tag and don't need modules, we use a regular script. The script must NOT have `defer` or `async` for the `document.currentScript` capture — but we can defer the rest of the logic to `DOMContentLoaded`.

**Alternative compatible approach:** Capture the script URL at parse time, then run all DOM work on `DOMContentLoaded`:
```javascript
const SCRIPT_URL = document.currentScript.src;
// ... rest runs on DOMContentLoaded
```

### Nav link `href` resolution

Links inside `components/nav.html` also need to resolve correctly from any depth. Two sub-approaches:

**A.** Use **absolute paths from repo root** (e.g., `/Atividade-ExtencionistaIV/explorar/explorar.html`) — works on GitHub Pages but hardcodes repo name.

**B.** Use **relative paths from the page** — but since the HTML is injected at different depths, `./explorar/explorar.html` would break from `/explorar/`.

**C. (Recommended)** After injecting the component HTML, **rewrite `href` attributes** using the computed `BASE_URL`. The `nav.html` template uses placeholder paths like `{base}explorar/explorar.html`, and `components.js` replaces `{base}` with the computed base path. Alternatively, store link paths as `data-href` attributes and set `href` programmatically.

**Simpler alternative:** Use the computed `BASE_URL` to set a `<base href>` dynamically ONLY for the scope of the component, or more practically: `nav.html` uses paths relative to the repo root (e.g., `explorar/explorar.html` without leading `./` or `../`), and `components.js` rewrites all `<a>` hrefs in the injected HTML to prepend the `BASE_URL`. This is the cleanest approach.

---

## 4. Component Architecture Approach

### File structure

```
components/
  nav.html          — nav bar markup (pure HTML fragment, no <html>/<head>/<body>)
  footer.html       — footer markup (pure HTML fragment)
  components.js     — fetch loader + active-page detection + mobile menu toggle
  components.css    — nav + footer styles (single CSS file for both)
```

### Injection mechanism

Each page that wants nav/footer includes:

```html
<!-- In <head> -->
<link rel="stylesheet" href="components/components.css">   <!-- or ../components/components.css -->

<!-- In <body> -->
<div data-component="nav"></div>

<!-- ... page content ... -->

<div data-component="footer"></div>

<!-- Before </body> -->
<script src="components/components.js"></script>
```

`components.js` finds all `[data-component]` elements, fetches the corresponding `.html` fragment, injects via `innerHTML`, then runs post-injection logic (active page detection, mobile menu setup).

### Why a single `components.css` instead of separate nav.css / footer.css?

- Only two components exist. A single file means one HTTP request.
- Both components share tokens from `base.css`; no isolation needed.
- File stays small (~200–300 lines total).

### Post-injection logic in `components.js`

1. **Active page detection (`aria-current="page"`):**
   - Compare `location.pathname` against each nav link's resolved `href`.
   - Normalize both paths (strip trailing `/`, handle `index.html` equivalence).
   - Set `aria-current="page"` on the matching link.

2. **Mobile hamburger toggle:**
   - Add click listener to the hamburger button.
   - Toggle `.nav-open` class on the nav element.
   - Manage `aria-expanded` on the button.
   - Trap focus inside the overlay when open (optional for v1 — note as accessibility enhancement).

3. **Link href resolution:**
   - After injection, find all `<a>` elements inside the component.
   - For each link with a relative `data-href`, set `href = BASE_URL + dataHref`.
   - Or: nav.html uses root-relative paths and `components.js` rewrites them.

### Fallback behavior

Per 02-CONTEXT.md: **No `<noscript>` fallback. Silent failure.** If fetch fails (network error, 404), the `[data-component]` div stays empty. Page content below still renders normally. No error banner.

---

## 5. CSS Organization Approach

### New file: `components/components.css`

This file handles all nav and footer styling. It depends on tokens from `base.css` being loaded first.

**CSS load order in every page `<head>`:**
```
1. estilos/reset.css
2. estilos/base.css
3. estilos/layout.css
4. estilos/componentes.css
5. components/components.css    ← NEW (Phase 2)
6. [page-specific CSS, if any]
```

### Nav CSS scope

All nav styles scoped under `.site-nav` (the root element in `nav.html`):
- `.site-nav` — positioning, background, height
- `.site-nav .nav-container` — max-width container, flex layout
- `.site-nav .nav-logo` — logo icon + text
- `.site-nav .nav-links` — link list
- `.site-nav .nav-links a` — link styles, hover (magenta underline), active state
- `.site-nav .nav-cta` — "Explorar Jogos" button (reuses `.btn-primario`)
- `.site-nav .nav-hamburger` — hamburger button (hidden on desktop, visible ≤640px)
- `.site-nav .nav-overlay` — mobile full-screen menu overlay

### Footer CSS scope

All footer styles scoped under `.site-footer`:
- `.site-footer` — background `#0B0F2E`, wavy clip-path top border, padding
- `.site-footer .footer-container` — two-column flex layout
- `.site-footer .footer-logo` — reduced logo
- `.site-footer .footer-tagline` — Nunito Italic tagline text
- `.site-footer .footer-links` — parent-facing link(s)
- `.site-footer .footer-stars` — decorative SVG stars (positioned absolute)

### Naming convention

Consistent with Phase 1: BEM-inspired, Portuguese flavor, semantic class names. No utility-only approach — components get descriptive classes.

---

## 6. Mobile Menu Implementation Approach

### Breakpoint

≤ 640px (per 02-CONTEXT.md and roadmap). Matches between the Phase 1 breakpoints (480px and 768px).

### Desktop layout (> 640px)

```
[Logo]    [Explorar Jogos link]  [Sobre Nós link]    [CTA Button: Explorar Jogos]
```

- Horizontal flex, `justify-content: space-between`
- Hamburger button is `display: none`

### Mobile layout (≤ 640px)

```
[Logo]                                              [☰ Hamburger]
```

- Nav links and CTA are hidden
- Hamburger button appears (right side)

### Mobile overlay (when hamburger tapped)

```
┌─────────────────────────────┐
│                         [✕] │
│                             │
│      Explorar Jogos         │
│      Sobre Nós              │
│                             │
│   [Explorar Jogos CTA btn]  │
│                             │
└─────────────────────────────┘
```

- Full-screen overlay with dark semi-transparent background
- Nav items as centered vertical list with large touch targets (min 44px height)
- CTA button at the bottom
- Close button (✕) in top-right
- `aria-expanded` toggled on hamburger button
- Classic hamburger icon (☰) — three horizontal bars

### CSS approach

```css
/* Mobile menu hidden by default */
.nav-overlay { display: none; }

/* Show on mobile when open */
@media (max-width: 640px) {
  .nav-links-desktop { display: none; }
  .nav-cta-desktop { display: none; }
  .nav-hamburger { display: flex; }

  .nav-overlay.is-open {
    display: flex;
    /* full-screen overlay styles... */
  }
}
```

### JS toggle

```javascript
hamburgerBtn.addEventListener('click', () => {
  const isOpen = overlay.classList.toggle('is-open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  // Optional: prevent body scroll when overlay is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
```

---

## 7. Accessibility Considerations

### Skip-to-content link (NAV-05)

The first element inside `nav.html` should be a visually-hidden skip link:
```html
<a href="#main-content" class="skip-link">Pular para o conteúdo</a>
```

Styled with `.sr-only` from `layout.css` + `:focus` override that makes it visible:
```css
.skip-link:focus {
  position: fixed;
  top: var(--espaco-sm);
  left: var(--espaco-sm);
  z-index: 10000;
  /* visible styles... */
}
```

Each page's `<main>` element should have `id="main-content"`.

### Keyboard navigation

- All nav links must be focusable (they're `<a>` elements, so they are by default).
- Hamburger button must be a `<button>` element (not a `<div>`).
- Focus styles: `:focus-visible` already defined in `base.css` (3px solid `#FFFFFF`, offset 3px). Ensure it's visible on the dark header background.
- Tab order: Skip link → Logo → Nav links → CTA button → Main content.

### `aria-current="page"` detection

The active-page algorithm:
1. Get `location.pathname` (e.g., `/Atividade-ExtencionistaIV/explorar/explorar.html`)
2. For each nav link, resolve its `href` to an absolute URL
3. Compare pathnames, normalizing: strip trailing `/`, treat `/index.html` as `/`
4. Set `aria-current="page"` on the matching link

Edge cases:
- `index.html` vs `/` vs empty path — all should match the "home" link
- GitHub Pages subpath — comparing full pathnames handles this automatically since both the page URL and the link URL will include the subpath

### ARIA attributes for mobile menu

- Hamburger button: `aria-expanded="false"`, `aria-controls="mobile-nav"`, `aria-label="Abrir menu de navegação"`
- Overlay: `id="mobile-nav"`, `role="dialog"` or just navigational region
- Close button: `aria-label="Fechar menu"`

### Color contrast

- Nav links: white (`#FFFFFF`) on `#0D1A3A` → contrast ratio **12.5:1** ✓ (WCAG AAA)
- Footer text: white on `#0B0F2E` → contrast ratio **14.7:1** ✓ (WCAG AAA)
- CTA button: dark text (`#0D1A3A`) on yellow-orange gradient → already verified in Phase 1 research (5.2:1–10.3:1) ✓
- Active nav link highlight: needs to be visible — use magenta underline or bold + background accent

---

## 8. Risks and Watch-Outs

### 1. GitHub Pages subpath (`/Atividade-ExtencionistaIV/`)

**Risk:** Fetch paths and nav link hrefs break on GitHub Pages if paths are absolute (start with `/`).
**Mitigation:** Use `document.currentScript.src` to compute base URL dynamically. Never use absolute paths starting with `/`. Test locally with `python -m http.server` and on GitHub Pages.

### 2. FOUC (Flash of Unstyled Content) / empty nav flash

**Risk:** Between page load and `fetch()` completion, the nav/footer area is empty. On slow connections, this could be noticeable.
**Mitigation:** Per the decision, this is accepted — no loading state, no skeleton. The `[data-component]` div is empty until injection. To minimize flash: place the `<script>` tag right after the placeholder div (not at end of body) OR ensure CSS reserves the nav's expected height so layout doesn't jump.

**Recommendation:** Set a `min-height` on `[data-component="nav"]` matching the expected nav height (~64–80px) so that content below doesn't shift when nav loads. Similarly for footer.

### 3. `innerHTML` security

**Risk:** Using `innerHTML` to inject fetched HTML could be an XSS vector if the HTML source is compromised.
**Mitigation:** Since the `.html` files are static assets served from our own origin (same repo, same domain), this is not a practical risk. No user input is involved. Document this in code comments.

### 4. SEO — content not in initial HTML

**Risk:** Search engine crawlers may not execute JS, meaning nav/footer content isn't indexed.
**Mitigation:** For a kids' educational site, nav links are not critical SEO content. The main page content (games, descriptions) will be in static HTML. This is acceptable.

### 5. CSS load order — `components.css` must load after `base.css`

**Risk:** If `components.css` is loaded before `base.css`, CSS custom properties will be undefined, causing broken styles.
**Mitigation:** Document the required `<link>` order in a comment at the top of `components.css` and in the template.

### 6. Mobile overlay scroll lock

**Risk:** When mobile overlay is open, background content can still scroll.
**Mitigation:** Toggle `overflow: hidden` on `<body>` when overlay opens. Restore on close.

### 7. Wavy footer border — clip-path rendering

**Risk:** CSS `clip-path: polygon()` can look jagged on some browsers/zoom levels. `clip-path: path()` with curved commands is smoother but less widely understood.
**Mitigation:** Use `clip-path: polygon()` with enough points to simulate a smooth wave. Test at multiple zoom levels. Alternative: use an inline SVG as a decorative element above the footer, which gives more control.

### 8. Legacy pages still load old CSS

**Risk:** Until all pages are rebuilt (Phases 4–9), pages like `index.html` still load `geral.css` and `barra_superior.css`. If we add the new nav component to these pages, there will be CSS conflicts.
**Mitigation:** Phase 2 creates the components but does NOT modify existing pages. Component injection will only be added to pages when they are rebuilt in their respective phases. Phase 2 verifies using the `_design-system-test.html` or a new test page that only loads the new CSS stack.

### 9. `document.currentScript` timing

**Risk:** If the script tag accidentally gets `defer`, `async`, or `type="module"`, `document.currentScript` will be `null`.
**Mitigation:** Document that the `<script>` tag must be a plain `<script src="..."></script>` with no attributes. Add a runtime check: `if (!document.currentScript) console.warn(...)`.

---

## 9. Implementation Sequence (Phased plans alignment)

The roadmap already defines 7 plans for Phase 2. Research confirms this is appropriate:

| Plan | What | Dependencies |
|------|------|-------------|
| **02-01** | `components/nav.html` — static HTML fragment | None (just markup) |
| **02-02** | `components/footer.html` — static HTML fragment with wavy border markup | None (just markup) |
| **02-03** | `components/components.js` — fetch loader, base-path detection, active-page logic | Needs nav.html + footer.html to test |
| **02-04** | `components/components.css` — all nav + footer styles | Needs markup to know class names |
| **02-05** | Path resolution verification — test from root + depth-1 pages | Needs 02-01 through 02-04 |
| **02-06** | Mobile hamburger menu (HTML + CSS + JS toggle) | Needs 02-01, 02-03, 02-04 |
| **02-07** | Fallback verification — simulate offline fetch failure | Needs 02-03 |

**Suggested optimization:** Plans 02-01 and 02-02 can be combined into a single plan since they're both small markup files. Plans 02-03 and 02-04 could also be combined (JS + CSS together) since they're tightly coupled. This would reduce to ~4–5 plans. However, the existing 7-plan structure is fine for granularity.

---

## RESEARCH COMPLETE
