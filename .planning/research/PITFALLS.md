# Pitfalls Research

**Domain:** Vanilla static site on GitHub Pages — kids educational platform  
**Researched:** 2026-03-04  
**Project:** Meu Planetinha — educational gaming hub for children aged 6–10  
**Stack:** Vanilla HTML/CSS/JS · GitHub Pages · No build tool · Phaser 3 mini-games

---

## Critical Pitfalls

---

### 1. Dark Background + Bright Text Contrast

**Problem**  
Dark space-themed backgrounds (deep blue `#0a0a2e`, indigo `#1a0050`, magenta-adjacent `#6b00b6`) paired with "fun" bright palette text — neon yellow, hot pink, lime green — frequently fail WCAG AA contrast requirements. Children with early-stage visual impairments or color vision deficiency are disproportionately affected. Designers assume vibrant = readable.

**Symptom**  
- Neon yellow (`#FFE600`) on dark blue (`#0d0d3b`) visually *feels* high-contrast but can score as low as 3.5:1 — below the 4.5:1 AA threshold for normal text.  
- Hot pink (`#FF2D78`) on indigo fails entirely (≈2.8:1).  
- Children's low-contrast tolerance is lower than adults — readability issues appear before a formal accessibility failure.  
- Score tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), Chrome DevTools Accessibility panel.

**Fix**  
- **Minimum ratios:** 4.5:1 for body text (< 18pt / < 14pt bold); 3:1 for large text (≥ 18pt or ≥ 14pt bold) and UI components.  
- **Kids extra margin:** Target 5:1+ for all text on this platform — children are the audience.  
- Safe bright-on-dark pairs (examples):
  | Foreground | Background | Ratio |
  |---|---|---|
  | `#FFFFFF` | `#0d0d3b` | 17.5:1 ✅ |
  | `#FFE600` | `#0d0d3b` | 12.4:1 ✅ |
  | `#7DFFB3` | `#0d0d3b` | 11.1:1 ✅ |
  | `#FF2D78` | `#0d0d3b` | 2.8:1 ❌ |
- Never rely only on color to convey meaning — add icons or underlines for interactive elements.
- Run automated checks with `axe-core` as a dev-time script (no build tool needed — use the bookmarklet).

---

### 2. Google Fonts Render-Blocking

**Problem**  
A naive `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka+One">` is a render-blocking request. The browser pauses page paint until the stylesheet — and then each font file — downloads. On slow school networks or mobile connections, this means children see a flash of invisible text (FOIT) or a jarring fallback swap.

**Symptom**  
- Blank or unstyled text for 1–3 seconds before the page renders.  
- No visual content at all on very slow connections until fonts resolve.  
- Lighthouse "Eliminate render-blocking resources" warning.  
- If Google Fonts CDN is blocked by a school network filter, the entire text may fall back to `serif` if no fallback is declared.

**Fix**  
1. **Add `preconnect` hints** before the font `<link>` — this pre-warms the DNS/TCP/TLS connection:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```
2. **Use `font-display: swap`** via the `&display=swap` query parameter (Google Fonts supports this natively):
   ```html
   <link rel="stylesheet"
     href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700&family=Press+Start+2P&display=swap">
   ```
   This causes the browser to show fallback text immediately (FOUT instead of FOIT) and swap once the font loads.
3. **Always declare a generic fallback** in every `font-family` rule:
   ```css
   font-family: 'Fredoka One', 'Arial Rounded MT Bold', Arial, sans-serif;
   font-family: 'Nunito', Arial, sans-serif;
   font-family: 'Press Start 2P', 'Courier New', monospace;
   ```
4. **Optional — self-host for offline/school use:** Download fonts via `google-webfonts-helper` and serve from `/midia/fonts/`. Eliminates the external dependency entirely.

---

### 3. JS `fetch()` for HTML Includes: CORS on `file://`

**Problem**  
The shared navigation bar is injected via `fetch('/components/nav.html')` + `innerHTML`. This works perfectly on any HTTP server. When a developer (or a teacher previewing the site) opens `index.html` directly in the browser via `file://`, the Fetch API throws a CORS error and the nav never loads.

**Symptom**  
- Console: `Access to fetch at 'file:///D:/…/nav.html' from origin 'null' has been blocked by CORS policy`  
- Navigation is missing entirely in local file:// previews.  
- The error is silent to the end user — they just see no nav.

**Fix**  
**Short-term (dev workflow):** Never use `file://`. Options:
- VS Code Live Server extension — one-click local HTTP server.  
- `npx serve .` in the project root (already have Node from `package.json`).  
- `python -m http.server 8080` as a quick alternative.

**Long-term (resilient code):** Wrap the fetch with a try/catch and render a hardcoded fallback nav:
```js
async function loadNav() {
  try {
    const res = await fetch('/components/nav.html');
    if (!res.ok) throw new Error('nav fetch failed');
    document.getElementById('nav-placeholder').innerHTML = await res.text();
  } catch {
    // Hardcoded fallback so the page is never completely broken
    document.getElementById('nav-placeholder').innerHTML = `
      <nav class="nav-fallback">
        <a href="/index.html">Início</a>
        <a href="/explorar/explorar.html">Explorar</a>
        <a href="/sobre_nos/sobre_nos.html">Sobre Nós</a>
      </nav>`;
  }
}
```

**Note:** Even on GitHub Pages this pattern is fragile if the path is wrong (see Pitfall 4). Prefer `<link rel="preload">` + server-side includes or a simple JS template string for a no-network nav component at this project scale.

---

### 4. GitHub Pages Subpath: Project Repos Served at `/repo-name/`

**Problem**  
GitHub Pages for a project repository (not a user/org `username.github.io` repo) serves content at `https://username.github.io/repo-name/`, NOT at the root `/`. Every absolute path in HTML/CSS/JS that starts with `/` silently breaks — it resolves to `https://username.github.io/` (the user root), not the project root.

**Symptom**  
- `<img src="/midia/logo.png">` → 404 in production, works locally.  
- `fetch('/components/nav.html')` → 404 in production.  
- CSS `url('/estilos/bg.png')` → broken background in production.  
- The site looks fine on `localhost` and catastrophically broken on the real URL.

**Fix**  
**Option A — Use relative paths everywhere (recommended for this project):**  
Avoid all root-relative (`/`) paths. Use relative paths from the current file's location:
```html
<!-- In /jogos/Contando_Estrelas/index.html -->
<link rel="stylesheet" href="../../estilos/geral.css">   <!-- ✅ relative -->
<link rel="stylesheet" href="/estilos/geral.css">        <!-- ❌ breaks on Pages -->
```

**Option B — Set `<base href>` in each HTML file:**  
```html
<base href="/Atividade-ExtencionistaIV/">
```
This makes all relative paths resolve from the repo root. **Caveat:** This also affects anchor links (`href="#section"`) — they must become the full page path + fragment: `href="/Atividade-ExtencionistaIV/index.html#section"`.

**Option C — Use a custom domain:**  
Pointing a custom domain at GitHub Pages serves from `/`, eliminating the subpath problem. Not always feasible for school projects.

**Recommended:** Combine Option A (relative asset paths) with careful testing by running `npx serve .` locally and double-checking the production Pages URL after first deploy.

---

### 5. CSS Custom Properties on Dark Themes: Specificity & Inheritance Traps

**Problem**  
CSS custom properties (variables) behave differently from regular CSS properties in ways that surprise developers on dark-themed sites. Two common traps:

**Trap A — Variables are inherited, not overridden by specificity:**  
```css
/* geral.css */
:root { --text-color: #ffffff; }

/* page-specific override — WRONG approach */
.game-page { --text-color: #000000; }

/* If .game-page contains a deeply nested element that reads --text-color,
   it WILL get #000000 — even if a higher-specificity rule tries to "reset" it
   on a child without re-declaring the variable. */
```
Specificity does not control variable resolution — **the closest ancestor that declares the variable wins**.

**Trap B — Undefined variables fall back silently:**  
```css
color: var(--accent-collor);   /* typo: collor vs color */
```
No error is thrown. The property becomes its initial value (often `transparent` or `black`) — on a dark theme, black-on-dark = invisible text with no console warning.

**Trap C — `@media (prefers-color-scheme)` never fires on a forced dark site:**  
If the CSS hardcodes a dark background, the OS light/dark preference has no effect unless explicitly handled with a media query override. Users who require a light theme (certain visual conditions) have no recourse.

**Fix**  
- Namespace all custom properties by component: `--nav-bg`, `--card-text`, `--game-title` — avoids accidental inheritance leakage.  
- Use a CSS linter (Stylelint) or browser DevTools "Computed" tab to trace variable resolution.  
- Always provide a fallback value when reading a variable: `color: var(--accent-color, #ffffff);` — makes typos visible.  
- Consider a `[data-theme="light"]` toggle even on a space-themed site, for accessibility.

---

### 6. Asset Path Case Sensitivity: Windows Dev → Linux GitHub Pages

**Problem**  
Windows NTFS is case-**in**sensitive by default. Linux (the GitHub Pages server) is case-**sensitive**. A file saved as `Logo.PNG` and referenced as `<img src="logo.png">` works perfectly on Windows and produces a 404 on GitHub Pages — silently, if no error handling exists.

**Symptom**  
- Images, fonts, audio files, or JS modules load locally, 404 in production.  
- No warning during development on Windows.  
- Particularly common with Phaser game assets (`Assets/` vs `assets/`).

**Fix**  
- **Enforce lowercase naming for all files and folders:** establish a team convention — no uppercase in asset filenames or directories.  
- Audit existing assets now:
  ```powershell
  # Find any uppercase letters in asset paths
  Get-ChildItem -Recurse .\midia, .\jogos -File |
    Where-Object { $_.Name -cmatch '[A-Z]' } |
    Select-Object FullName
  ```
- In `jogos/Contando_Estrelas/` and `jogos/Jogo_de_Silaba/`, check every asset reference in `main.js`, `script.js`, and `PreloadScene.js` against actual filenames on disk.  
- Prefer `assets/` (lowercase) and reference it consistently.  
- When committing, Git on Windows may not detect a rename from `Assets/` to `assets/` as a change — use `git mv` with `-f` flag:
  ```bash
  git mv -f Assets assets
  ```

---

### 7. Phaser Game Pages: CSS Contamination from Shared Stylesheets

**Problem**  
Phaser renders into a `<canvas>` element and manages its own internal layout. However, any global CSS rules loaded via a shared stylesheet can still affect:
- The `<body>` background (Phaser canvas may show through gaps)  
- `box-sizing: border-box` applied globally can shift Phaser's scale manager calculations if it reads `offsetWidth`/`offsetHeight`  
- `margin: 0; padding: 0` resets are fine, but `overflow: hidden` on `<body>` may clip Phaser's fullscreen resize handler  
- CSS animations or transitions on `:root` or `*` selectors add GPU compositing layers that compete with Phaser's WebGL renderer  
- Custom `font-family` on `* {}` doesn't affect canvas text, but any DOM text (score overlays, loading text) rendered outside the canvas will inherit it unexpectedly

**Symptom**  
- Game canvas squished or misaligned after adding shared `geral.css`  
- Loading screen DOM text uses wrong font  
- Mobile device: scroll/bounce behavior breaks Phaser's touch input because `body` overflow was not set correctly  
- Star/sparkle CSS animations on `.page-bg` triggering constant repaints that drop Phaser frame rate

**Fix**  
- **Do NOT link shared site stylesheets in game `index.html` files.** Each `/jogos/*/index.html` should only load its own scoped stylesheet and Phaser.  
- If a shared "chrome" (nav bar) is needed on game pages, load it in an isolated `<div id="game-shell">` and scope all its CSS under `.game-shell { }` rather than global selectors.  
- Set on game `<body>`:
  ```css
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;       /* prevent scroll during gameplay */
    background: #000;       /* fallback before Phaser canvas renders */
    touch-action: none;     /* prevent browser scroll from stealing touch events */
  }
  ```
- Avoid CSS `*` selectors and global `transition`/`animation` rules in any stylesheet that might also be loaded on game pages.

---

### 8. Mobile Touch Targets: Minimum Size for Children

**Problem**  
WCAG 2.5.5 recommends a 44×44 CSS pixel minimum for touch targets. Research on children's touch interaction (ages 5–10) consistently shows significantly lower pointing accuracy than adults — children need larger targets. Standard WCAG minimums are insufficient for this audience.

**Symptom**  
- Children repeatedly mis-tap navigation buttons, game options, or interactive elements.  
- Frustration and perceived "broken" behavior — kids tap `X` but `Y` triggers.  
- Especially problematic on small 7–8" tablets used in classrooms.  
- Small icon-only buttons (hamburger menu, sound toggle) are the most common failure point.

**Fix**  
- **Minimum 48×48 CSS px for all interactive elements** on this platform; prefer **56×56 px or larger** for primary game controls.  
- Use padding rather than fixed height/width so text elements naturally grow:
  ```css
  .btn-primary {
    min-height: 56px;
    min-width: 56px;
    padding: 12px 24px;
    font-size: 1.2rem;    /* larger text = faster reading for kids */
  }
  ```
- Ensure adequate **spacing between targets** — at least 8px gap between adjacent buttons. A child tapping one button should not accidentally activate its neighbor.  
- Test on real touch devices with children if possible; alternatively, use Chrome DevTools mobile simulation with "slow 3G" to approximate a classroom tablet experience.  
- Icon-only buttons **must** have a visible label or `aria-label` — children cannot reliably decode abstract icons.

---

### 9. CSS `@import` vs `<link>`: Import Blocks Render

**Problem**  
CSS `@import` inside a stylesheet creates a sequential waterfall: the browser downloads stylesheet A, parses it, discovers `@import url('B.css')`, then starts downloading B — blocking render the entire time. Multiple `@import` chains dramatically increase time-to-first-paint on slow connections. This is especially problematic in a school or library network environment.

**Symptom**  
- Lighthouse "Eliminate render-blocking resources" flag on CSS files.  
- Noticeable flash of unstyled content (FOUC) or even blank white page on first load.  
- `@import` inside a file loaded via a `<link>` is not parallelized by the browser — it strictly sequential.  
- In Chrome DevTools Network waterfall: stylesheet B doesn't start downloading until A is fully received and parsed.

**Fix**  
- **Never use `@import` in production stylesheets.** Replace with multiple `<link>` tags in `<head>` — the browser fetches them in parallel:
  ```html
  <!-- ❌ WRONG — sequential blocking -->
  <!-- geral.css contains: @import url('barra_superior.css'); @import url('carousel.css'); -->
  <link rel="stylesheet" href="estilos/geral.css">

  <!-- ✅ CORRECT — parallel fetch -->
  <link rel="stylesheet" href="estilos/geral.css">
  <link rel="stylesheet" href="estilos/barra_superior.css">
  <link rel="stylesheet" href="estilos/carousel.css">
  ```
- If `@import` is used for Google Fonts inside a local CSS file (a common pattern), move the Google Fonts `<link>` directly to `<head>` in HTML.  
- The only acceptable use of `@import` at this stack level is inside a CSS file that is **not** on the critical render path — e.g., a print stylesheet loaded with `media="print"`.

---

## Quick Reference Checklist

| # | Pitfall | Severity | Quick Test |
|---|---|---|---|
| 1 | Dark bg + bright text contrast | 🔴 Critical | WebAIM contrast checker on every text color |
| 2 | Google Fonts render-blocking | 🟠 High | Lighthouse Performance audit |
| 3 | `fetch()` CORS on `file://` | 🟠 High | Open index.html directly, check console |
| 4 | GitHub Pages subpath `/repo-name/` | 🔴 Critical | Check all paths after first Pages deploy |
| 5 | CSS custom property inheritance traps | 🟡 Medium | DevTools Computed tab for variable resolution |
| 6 | Asset path case sensitivity | 🔴 Critical | Run PowerShell audit script above |
| 7 | Phaser CSS contamination | 🟠 High | Load game page with shared CSS, check canvas |
| 8 | Touch targets too small for kids | 🟠 High | Mobile sim + manual touch test on tablet |
| 9 | CSS `@import` blocks render | 🟡 Medium | DevTools Network waterfall for CSS files |

---

## References

- WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum): https://www.w3.org/TR/WCAG21/#contrast-minimum  
- WCAG 2.5.5 (Target Size): https://www.w3.org/TR/WCAG21/#target-size  
- Google Fonts + `font-display`: https://developers.google.com/fonts/docs/getting_started#use_font-display  
- GitHub Pages custom domain docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site  
- CSS Custom Properties spec (inheritance model): https://www.w3.org/TR/css-variables-1/#using-variables  
- Phaser 3 Scale Manager docs: https://newdocs.phaser.io/docs/3.60.0/Phaser.Scale.ScaleManager  
- `@import` performance: https://developer.mozilla.org/en-US/docs/Web/CSS/@import (see "Formal definition" — note render-blocking behavior)  
- Child touch target research: Hourcade, J.P. (2008). "Interaction Design and Children." Foundations and Trends in Human-Computer Interaction.
