# Architecture Research

**Domain:** Vanilla static site — multi-page with shared components
**Researched:** 2026-03-04
**Confidence:** HIGH

---

## Recommended Architecture

```
/
├── index.html
├── 404.html
├── components/
│   ├── nav.html
│   └── footer.html
├── estilos/
│   ├── base.css          ← reset + design tokens + typography
│   ├── layout.css        ← shared nav, footer, page-shell
│   └── utils.css         ← helper classes (spacing, colours)
├── explorar/
│   ├── explorar.html
│   └── estilos/
│       └── explorar.css  ← page-specific overrides only
├── sobre_nos/
│   ├── sobre_nos.html
│   └── estilos/
│       └── sobre_nos.css
├── jogos/                ← READ-ONLY, do not touch
│   ├── Contando_Estrelas/
│   └── Jogo_de_Silaba/
├── midia/
└── scripts/
    ├── components.js     ← fetch-include loader
    └── carousel.js
```

---

## 1. JS `fetch()`-Based HTML Includes

### The Core Problem

Pages live at different depths:
- `index.html` → depth 0 (root)
- `explorar/explorar.html` → depth 1
- `sobre_nos/sobre_nos.html` → depth 1

A `<nav>` partial stored at `/components/nav.html` must resolve to the correct URL regardless of which page loads it.

### Strategy: Root-Relative Paths via `<base>` Tag

The cleanest solution for GitHub Pages is to set a `<base href>` that always points to the repo root, then use root-relative paths everywhere.

**In `<head>` of every page:**
```html
<!-- Root page (index.html) -->
<base href="/Atividade-ExtencionistaIV/">

<!-- Subpage (explorar/explorar.html) -->
<base href="/Atividade-ExtencionistaIV/">
```

With `<base href>` set, ALL relative paths (CSS `href`, `<img src>`, `fetch()` URLs, anchor `href`) resolve from the repo root — depth no longer matters.

> **GitHub Pages note:** The repo is deployed at `https://<user>.github.io/Atividade-ExtencionistaIV/`.  
> The `<base href>` must include the subpath `/Atividade-ExtencionistaIV/`.  
> For local development with a static server at `localhost:5500`, use `<base href="/">` or configure the dev server to serve from a subpath.

### components.js — The Fetch Loader

```js
// scripts/components.js

/**
 * Loads an HTML partial file and injects it into every matching
 * placeholder element on the current page.
 *
 * Usage in HTML:
 *   <div data-component="components/nav.html"></div>
 *
 * Paths are resolved relative to <base href>, so they are always
 * root-relative regardless of page depth.
 */
async function loadComponents() {
  const placeholders = document.querySelectorAll('[data-component]');

  await Promise.all(
    [...placeholders].map(async (el) => {
      const src = el.dataset.component; // e.g. "components/nav.html"
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${src}`);
        el.innerHTML = await res.text();

        // Re-run any <script> tags embedded in the partial
        el.querySelectorAll('script').forEach((oldScript) => {
          const s = document.createElement('script');
          [...oldScript.attributes].forEach((a) => s.setAttribute(a.name, a.value));
          s.textContent = oldScript.textContent;
          oldScript.replaceWith(s);
        });

        // Dispatch event so page-specific code can react
        el.dispatchEvent(new CustomEvent('component:loaded', { bubbles: true }));
      } catch (err) {
        console.error('[components]', err);
        el.innerHTML = '<!-- component failed to load -->';
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', loadComponents);
```

### nav.html Partial

Links inside the partial must also be root-relative (they piggyback on `<base href>`):

```html
<!-- components/nav.html -->
<nav class="nav-principal" aria-label="Navegação principal">
  <a class="nav-logo" href="index.html">
    <img src="midia/logo.svg" alt="Meu Planetinha" width="120" height="40">
  </a>
  <ul class="nav-links">
    <li><a href="index.html">Início</a></li>
    <li><a href="explorar/explorar.html">Explorar</a></li>
    <li><a href="sobre_nos/sobre_nos.html">Sobre Nós</a></li>
  </ul>
</nav>
```

> All `href` and `src` values here are **relative to `<base href>`**, so they resolve correctly when this fragment is injected into any page.

### Page HTML Skeleton

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- CHANGE THIS per page depth — always points to repo root on GH Pages -->
  <base href="/Atividade-ExtencionistaIV/">

  <!-- Shared styles first, page override last -->
  <link rel="stylesheet" href="estilos/base.css">
  <link rel="stylesheet" href="estilos/layout.css">
  <link rel="stylesheet" href="explorar/estilos/explorar.css"> <!-- page-specific -->

  <title>Explorar · Meu Planetinha</title>
</head>
<body>

  <!-- Shared nav placeholder -->
  <div data-component="components/nav.html"></div>

  <main id="conteudo-principal">
    <!-- page content -->
  </main>

  <!-- Shared footer placeholder -->
  <div data-component="components/footer.html"></div>

  <!-- Loader must come last so DOMContentLoaded fires after markup -->
  <script src="scripts/components.js" defer></script>
  <!-- Page-specific scripts -->
  <script src="explorar/scripts/explorar.js" type="module" defer></script>
</body>
</html>
```

### Marking the Active Nav Link

After the component loads, flag the current page's link:

```js
// In a page's own script, or appended to components.js
document.addEventListener('component:loaded', (e) => {
  if (!e.target.matches('[data-component="components/nav.html"]')) return;
  const links = e.target.querySelectorAll('a[href]');
  links.forEach((link) => {
    // Normalise both sides to their path portion
    const linkPath = new URL(link.href).pathname;
    const pagePath = location.pathname;
    if (pagePath.endsWith(linkPath) || linkPath === pagePath) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-active');
    }
  });
});
```

---

## 2. Path Resolution Strategy for Nested Pages

| Asset type | Rule |
|---|---|
| CSS `href` | Relative to `<base href>` — use from root: `estilos/base.css` |
| `<img src>` | Same — `midia/logo.svg` works everywhere |
| `<a href>` | Same — `explorar/explorar.html` from any page |
| CSS `url()` inside `.css` files | **NOT affected by `<base href>`** — use root-relative paths beginning with `/Atividade-ExtencionistaIV/midia/...` or keep images inside the same folder as the CSS file |
| `fetch()` in JS | Affected by `<base href>` ✓ |

### CSS `url()` Caveat

`<base href>` only affects HTML, not CSS files. For background images referenced from `estilos/base.css`:

```css
/* Option A — absolute path (works on GH Pages, breaks on localhost at /) */
.hero {
  background-image: url('/Atividade-ExtencionistaIV/midia/hero-bg.webp');
}

/* Option B — relative to the CSS file itself (safest, always works) */
/* Put background images in midia/ and reference relative to estilos/ */
.hero {
  background-image: url('../midia/hero-bg.webp');
}
```

**Recommendation:** Option B — co-locate images predictably under `midia/` and reference with `../midia/` from any CSS file in `estilos/`.

---

## 3. GitHub Pages `baseurl` and Path Considerations

GitHub Pages for a **project repo** (not a user/org site) serves content at:
```
https://<username>.github.io/<repo-name>/
```

### What this means in practice

1. **`<base href>`** must include the repo name: `<base href="/Atividade-ExtencionistaIV/">`
2. All HTML-level asset references are automatically correct when `<base href>` is set.
3. The **404 page** will be served by GitHub Pages for missing routes; no configuration needed.
4. There are **no server-side redirects** available — all routing is client-side or page-link based.

### Local development workaround

Using VS Code Live Server or `npx serve`:
```json
// .vscode/settings.json — Live Server config
{
  "liveServer.settings.root": "/",
  "liveServer.settings.port": 5500
}
```

Because Live Server serves from `/`, `<base href="/Atividade-ExtencionistaIV/">` will **not match** locally. Use a tiny helper to swap it at dev time:

```html
<!-- In every page <head>, before other tags -->
<script>
  // On GH Pages the origin ends with the repo name; locally it doesn't.
  const isProd = location.hostname.endsWith('github.io');
  const base = document.createElement('base');
  base.href = isProd ? '/Atividade-ExtencionistaIV/' : '/';
  document.head.prepend(base);
</script>
```

Or, simpler: run `npx serve . --base /Atividade-ExtencionistaIV` locally to mirror the GH Pages subpath exactly — then a hardcoded `<base href="/Atividade-ExtencionistaIV/">` works in both environments.

---

## 4. CSS File Organization

### Layer model (cascade order)

```
estilos/base.css        → 1. Design tokens, reset, typography, colour palette
estilos/layout.css      → 2. Nav, footer, page shell, grid skeleton
estilos/utils.css       → 3. Optional utility classes (.sr-only, .visually-hidden, etc.)
<page>/estilos/<page>.css → 4. Page-specific overrides — loaded last, highest priority
```

### base.css skeleton

```css
/* estilos/base.css */

/* --- Design tokens --- */
:root {
  --cor-primaria: #5b4fcf;
  --cor-secundaria: #f9c74f;
  --cor-fundo: #fef9ef;
  --cor-texto: #1a1a2e;
  --fonte-titulo: 'Fredoka One', sans-serif;
  --fonte-corpo: 'Nunito', sans-serif;
  --espacamento-base: 1rem;
  --raio-borda: 12px;
}

/* --- Reset --- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img, video { max-width: 100%; display: block; }
```

### layout.css skeleton

```css
/* estilos/layout.css */
.nav-principal { /* ... */ }
.nav-links { /* ... */ }
.nav-links a[aria-current="page"] { font-weight: 700; text-decoration: underline; }
footer { /* ... */ }

/* Page shell */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: var(--fonte-corpo);
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
}
#conteudo-principal { flex: 1; }
```

### Page stylesheet (example)

```css
/* explorar/estilos/explorar.css — only what's unique to this page */
.grade-jogos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--espacamento-base);
  padding: calc(var(--espacamento-base) * 2);
}
```

---

## 5. JS Module Loading Without a Bundler

### `type="module"` vs classic

| Feature | Classic `<script>` | `type="module"` |
|---|---|---|
| `import` / `export` | ✗ | ✓ |
| Deferred by default | ✗ | ✓ (always deferred) |
| Strict mode | opt-in | always |
| `this` at top level | `window` | `undefined` |
| CORS required for fetch | same-origin only | same-origin (modules need a server) |
| Works without a server | ✓ | ✗ (file:// blocked) |

**Recommendation for this project:** Use `type="module"` for page-specific scripts. Use classic `<script defer>` for `components.js` (the fetch loader) — it runs on every page and has no imports.

```html
<!-- Always defer; module is implicitly deferred -->
<script src="scripts/components.js" defer></script>
<script src="scripts/carousel.js" type="module"></script>
```

### Relative imports in modules

With `<base href>` set, modules loaded from HTML use base-relative paths. But **`import` inside a `.js` file is relative to the JS file itself**, not `<base href>`.

```js
// explorar/scripts/explorar.js
// This import is relative to THIS file's location — no <base href> effect
import { renderCard } from '../../scripts/utils.js';
```

Keep shared utilities in `scripts/` at the root and always import with relative paths from the JS file's own directory.

### No-bundler import map (progressive enhancement)

For larger growth, you can declare bare specifiers without a bundler:

```html
<script type="importmap">
{
  "imports": {
    "utils": "/Atividade-ExtencionistaIV/scripts/utils.js",
    "carousel": "/Atividade-ExtencionistaIV/scripts/carousel.js"
  }
}
</script>
```

Then in any module:
```js
import { renderCard } from 'utils';
```

Import maps work in all modern browsers (Chrome 89+, Firefox 108+, Safari 16.4+).

---

## 6. Final Directory Structure Recommendation

```
/
├── index.html                    ← <base href="/Atividade-ExtencionistaIV/">
├── 404.html
│
├── components/
│   ├── nav.html                  ← shared nav markup
│   └── footer.html               ← shared footer markup
│
├── estilos/
│   ├── base.css                  ← tokens + reset
│   ├── layout.css                ← nav, footer, body shell
│   └── utils.css                 ← optional utilities
│
├── scripts/
│   ├── components.js             ← fetch-include loader (classic, defer)
│   └── carousel.js               ← carousel (module)
│
├── midia/                        ← all shared images, icons, fonts
│
├── explorar/
│   ├── explorar.html
│   └── estilos/
│       └── explorar.css
│
├── sobre_nos/
│   ├── sobre_nos.html
│   └── estilos/
│       └── sobre_nos.css
│
└── jogos/                        ← ⛔ READ-ONLY
    ├── Contando_Estrelas/
    └── Jogo_de_Silaba/
```

### Migration checklist

- [ ] Add `<base href="/Atividade-ExtencionistaIV/">` (or the dynamic script variant) to every non-game page `<head>`
- [ ] Create `components/nav.html` and `components/footer.html` with root-relative internal links
- [ ] Add `<div data-component="components/nav.html">` and `<div data-component="components/footer.html">` to every non-game page body
- [ ] Add `<script src="scripts/components.js" defer></script>` to every non-game page
- [ ] Split CSS into `base.css` / `layout.css`, update `<link>` tags in each page
- [ ] Verify all CSS `url()` background references use `../midia/` (relative to CSS file, not base)
- [ ] Test locally with `npx serve . --base /Atividade-ExtencionistaIV` to match GH Pages subpath exactly

---

## References

- MDN — [`<base>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
- MDN — [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- MDN — [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- MDN — [Import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
- GitHub Docs — [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
