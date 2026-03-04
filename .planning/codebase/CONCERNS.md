# Codebase Concerns

**Analysis Date:** 2026-03-04

## Tech Debt

**Duplicated navigation HTML:**
- Issue: The `<header><nav>` block is copy-pasted across all 5 pages — not a shared component
- Why: No server-side includes or JS templating in use; pure static HTML
- Impact: Any nav change (new link, style fix, accessibility improvement) must be made in 5 places
- Fix approach: Introduce a JS-based nav include (e.g., load via `fetch` + `innerHTML`) or adopt a static site generator (Eleventy, Astro)

**Phaser.min.js vendored twice:**
- Issue: `phaser.min.js` copied into both `jogos/Contando_Estrelas/` and `jogos/Jogo_de_Silaba/`
- Why: Each game was developed in isolation; no shared `vendor/` directory
- Impact: ~6–7MB duplication; updating Phaser requires changing both files
- Fix approach: Move to `/vendor/phaser.min.js` (shared) or load from CDN with integrity hash

**Jogo_de_Silaba has phaser.min.js but doesn't use it:**
- Issue: `phaser.min.js` present in `jogos/Jogo_de_Silaba/` but `script.js` uses Vanilla Canvas 2D (not Phaser)
- Why: Likely copied from Contando_Estrelas when setting up the folder
- Impact: ~3–4MB of dead weight loaded (or bundled), misleads future developers
- Fix approach: Delete `jogos/Jogo_de_Silaba/phaser.min.js` if confirmed unused

**CSS inconsistency between pages:**
- Issue: Older pages (e.g., `jogos/Contando_Estrelas/index.html`) use a different nav markup (`#logotipo`, `.paginas`) vs newer design (`.logo-container`, `.nav-links`)
- Why: Main pages were refactored but game page headers were not updated
- Impact: Visual inconsistency; different CSS selectors target different pages
- Fix approach: Standardize all pages to use the current nav markup from `index.html`

## Known Bugs / Incomplete Features

**Search bar — UI only, not functional:**
- Symptoms: Search input and button are visible but submitting the form does nothing
- Trigger: Typing in the search box and pressing Enter or clicking the button
- Workaround: None — search is not implemented
- Root cause: HTML `<form>` with no JS handler and no backend; form submission just refreshes the page

**Alphabet filter in Explorar — links are `href="#"` (dead):**
- Symptoms: Clicking alphabet letters on `explorar.html` does nothing
- Trigger: Any letter click in the `.alfabeto-inicial` list
- Workaround: None
- Root cause: Placeholder `<a href="#">` with no filtering logic implemented

**Word validation TODO in Jogo_de_Silaba:**
- Symptoms: `palavrasValidas` list starts with ~100 words; may produce false negatives/positives
- Trigger: Combining syllables that form valid Portuguese words not in the list
- Workaround: None for players; dev can add words to `palavrasValidas` array
- Root cause: Hardcoded list marked as TODO: `// TODO: Review and expand valid words list for educational value`

## Security Considerations

**No user data collected — low risk overall.**

**CDN dependency:**
- Risk: Google Fonts or jsDelivr CDN outage breaks font/icon loading
- Current mitigation: CSS fallback fonts defined in custom properties
- Recommendations: Add `font-display: swap` and test with CDN blocked; consider self-hosting critical assets

**No CSP headers:**
- Risk: XSS via injected scripts (low risk for static site with no user input)
- Current mitigation: None
- Recommendations: Add Content-Security-Policy meta tag for defense in depth

## Performance Bottlenecks

**Large vendored Phaser files:**
- Problem: `phaser.min.js` (~3–4MB) loaded per game page; blocks render until downloaded
- Cause: Vendored local copy; no lazy loading or code splitting
- Improvement: Load from CDN with caching headers, or use `defer` attribute on script tags (already done)

**Google Fonts blocking render:**
- Problem: `@import url(...)` in CSS blocks initial paint
- Measurement: Depends on user connection; fonts are render-blocking
- Cause: Synchronous CSS import at top of `geral.css`
- Improvement: Add `font-display: swap`; use `<link rel="preconnect">` in HTML `<head>`

## Fragile Areas

**Phaser asset loading in PreloadScene:**
- Why fragile: All assets hardcoded with relative paths (e.g., `'assets/Fundo.png'`); any asset rename/move breaks the game silently
- Common failures: Wrong filename casing (Linux servers are case-sensitive; Windows is not)
- Safe modification: Keep asset filenames exactly as referenced; test on a case-sensitive server
- Test coverage: None

**Jogo_de_Silaba single-file architecture:**
- Why fragile: All game state, rendering, and logic in one 376-line file; no separation of concerns
- Common failures: Changing one thing (e.g., canvas size) breaks others (collision, spawn positions)
- Safe modification: Make changes in small increments and test in browser; be aware canvas dimensions are hardcoded (800×400)
- Test coverage: None

---

*Concerns analysis: 2026-03-04*
