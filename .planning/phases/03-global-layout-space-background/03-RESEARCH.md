# Phase 3: Global Layout & Space Background — RESEARCH

**Researched:** 2026-03-04
**Researcher:** GSD Phase Researcher
**Purpose:** Answer "What do I need to know to PLAN Phase 3 well?"

---

## 1. Guia-Visual Findings

### 1.1 Space Gradient Background (Section 01)

| Property | Value |
|----------|-------|
| **Direction** | Top → Base → Horizon (vertical, context says ~170–190deg slight angle) |
| **Top color** | Azul-céu médio `#1A3A8F` |
| **Middle color** | Índigo vibrante `#2D1B8A` |
| **Bottom color** | Magenta suave `#8B1A6B` |
| **Distribution per 03-CONTEXT** | Blue dominates; indigo at ~65%; magenta only near bottom |

### 1.2 Stars (Section 01)

- "Coloridas (brancas, levemente azuis, amareladas), tamanhos variados, com drift lento"
- **v1 decision:** Static only (no drift). CSS-generated (box-shadow or pseudo-element). Multi-tinted: white, blue-ish, yellowish.

### 1.3 Nebulae (Section 01)

- "Laranja pastel, turquesa e rosa — difusas, como bolhas de tinta na água"
- **v1 decision:** Static pastel radial-gradient blobs. No animation.
- Colors map to palette: Laranja-tang `#FF8C42` (or pastel variant), turquesa ~`#00D4E8` area, Rosa-chiclete `#FF6EB4` (or pastel variant)

### 1.4 Palette (Section 02 — "Sorvete Galático")

| Name | Hex | Relevance to Phase 3 |
|------|-----|----------------------|
| Amarelo-sol | `#FFD43B` | Stars, highlights — must pass contrast on gradient |
| Rosa-chiclete | `#FF6EB4` | Nebulae (rosa) |
| Verde-menta | `#4DFFB4` | Action buttons — contrast check needed |
| Laranja-tang | `#FF8C42` | Nebulae (laranja pastel) |
| Lilás-algodão | `#C084FC` | Magical elements |
| Azul-céu | `#1A3A8F` | BG top |
| Índigo | `#2D1B8A` | BG middle |
| Magenta | `#8B1A6B` | BG bottom |

### 1.5 Typography (Section 03)

| Role | Font | Weight |
|------|------|--------|
| Títulos | Fredoka One | 400 |
| Subtítulos / Botões | Nunito | Bold 700 |
| Texto corrido | Nunito | Regular 400 |
| Conquistas / Placar | Press Start 2P | 400 |

Google Fonts URL: `https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700&family=Press+Start+2P&display=swap`

### 1.6 Header (Section 04) — layout implications

- Fixed/sticky at top
- Background: transparent at top → `#0D1A3A` on scroll
- Must compose well with gradient background beneath it

### 1.7 Footer (Section 05) — layout implications

- Background: `#0B0F2E` (darker than gradient)
- Wavy top border (already implemented in Phase 2 via clip-path)
- Must anchor at bottom of viewport on short pages

### 1.8 Container / Layout Guidance

Guia-Visual doesn't explicitly specify a container system. The project established:
- `--largura-max-conteudo: 1200px` in base.css
- `--largura-max-texto: 680px` in base.css
- 03-CONTEXT allows Claude's discretion for 960–1280px range

---

## 2. Current Codebase State

### 2.1 base.css — Already has the gradient

**IMPORTANT FINDING:** `base.css` already defines the space gradient on `body`:

```css
body {
  background: linear-gradient(180deg, var(--cor-fundo-topo) 0%, var(--cor-fundo-base) 50%, var(--cor-fundo-horizonte) 100%);
  background-attachment: fixed;
  min-height: 100vh;
}
```

**Current values:**
- `--cor-fundo-topo: var(--cor-azul-ceu)` → `#1A3A8F`
- `--cor-fundo-base: var(--cor-indigo)` → `#2D1B8A`
- `--cor-fundo-horizonte: var(--cor-magenta)` → `#8B1A6B`

**Gap vs. requirements:**
- Direction is `180deg` (pure vertical). 03-CONTEXT says ~170–190deg slight angle. Needs adjustment.
- Color stops at `0%`, `50%`, `100%`. Context says blue should dominate, indigo at ~65%, magenta near bottom. Stop distribution needs tuning.
- `background-attachment: fixed` already set (good — matches a discretion option in 03-CONTEXT).

### 2.2 base.css — Tokens already defined

All palette tokens, spacing tokens, layout tokens, typography tokens, shadow tokens, border tokens, and transition tokens already exist. Key layout tokens:
- `--largura-max-conteudo: 1200px`
- `--largura-max-texto: 680px`
- Spacing scale: 2px → 64px in 8px-based increments

### 2.3 reset.css

Minimal modern reset. Sets `body { min-height: 100vh }` and universal `box-sizing: border-box`. Clean foundation.

### 2.4 components.css — Page shell baseline

```css
body {
  display: flex;
  flex-direction: column;
}

[data-component="footer"] {
  flex-shrink: 0;
  margin-top: auto;  /* pushes footer to bottom */
}
```

Comment in code: "Phase 3 (page-shell.css) will add .page-wrapper" — this was explicitly anticipated.

### 2.5 layout.css — Container system already exists

```css
.container {
  width: 100%; max-width: var(--largura-max-conteudo);
  margin-inline: auto; padding-inline: var(--espaco-md);
}
.container-texto {
  width: 100%; max-width: var(--largura-max-texto);
  margin-inline: auto; padding-inline: var(--espaco-md);
}
```

Responsive padding already implemented:
- `≤480px`: `padding-inline: var(--espaco-sm)` (8px)
- Default: `var(--espaco-md)` (16px)
- `≥1024px`: `var(--espaco-lg)` (24px)

**Gap vs. requirements (DS-06):**
- 03-CONTEXT says 16px small, 24px tablet, 32px desktop. Current values: 8px/16px/24px — close but the small breakpoint and desktop values differ.
- Breakpoint for "small" is ≤480px, not ≤640px as 03-CONTEXT implies.
- Desktop padding is 24px, not 32px as 03-CONTEXT specifies.
- Need to reconcile or update.

Also has flex utilities, text alignment, spacing helpers, and `.sr-only`.

### 2.6 componentes.css — Buttons already exist

Primary and secondary buttons fully implemented with planet variants. No conflicts with Phase 3 work.

---

## 3. Game Page Isolation Status

### 3.1 Contando_Estrelas/index.html

**CSS loaded:**
1. `../../estilos/geral.css` — OLD legacy CSS (not the new design system)
2. `../../estilos/barra_superior.css` — OLD legacy nav CSS
3. `./estilos/principal.css` — game-local CSS
4. `assets/super-dario-advance-4.css` — game-specific font

**Does NOT load:** reset.css, base.css, layout.css, componentes.css, components.css — **SAFE from new design system contamination**.

**BUT loads:** `geral.css` which has its OWN `:root` tokens and body styles (old `#14213D` navy background, different fonts). This is the old legacy design — separate concern from Phase 3.

**HTML:** Has `lang="pt-br"` (lowercase variant), charset, viewport. Has old-style nav with `.barra-de-navegacao`.

### 3.2 Jogo_de_Silaba/index.html

**CSS loaded:**
1. `../../estilos/geral.css` — OLD legacy CSS
2. `../../estilos/barra_superior.css` — OLD legacy nav CSS
3. `./estilos/principal.css` — game-local CSS
4. Additionally, `style.css` loaded inline via `<link>` is NOT present in HTML but `script.js` is loaded separately

**Also has its own `style.css`** — standalone game styles (black bg, no connection to design system).

**Same isolation conclusion:** Game pages load `geral.css` (old legacy), NOT the new design system files. Phase 3 changes to `base.css`, `layout.css`, etc. will NOT affect game pages.

### 3.3 Isolation Summary

| File | Loads new DS CSS? | Risk |
|------|-------------------|------|
| jogos/Contando_Estrelas/index.html | NO — loads geral.css (legacy) | ✅ Safe |
| jogos/Jogo_de_Silaba/index.html | NO — loads geral.css (legacy) | ✅ Safe |

**No shared new-DS CSS is linked from any game page.** Game pages only reference the OLD `geral.css` and `barra_superior.css`. Phase 3 work on `base.css`, `layout.css`, or a new `page-shell.css` cannot contaminate games.

---

## 4. HTML Head Boilerplate Currently in Use

### 4.1 New Design System pages (test pages)

From `_nav-footer-test.html` and `_design-system-test.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] — Meu Planetinha</title>

  <!-- Preconnects -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700&family=Press+Start+2P&display=swap" rel="stylesheet">

  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

  <!-- CSS load order -->
  <link rel="stylesheet" href="estilos/reset.css">
  <link rel="stylesheet" href="estilos/base.css">
  <link rel="stylesheet" href="estilos/layout.css">
  <link rel="stylesheet" href="estilos/componentes.css">
  <link rel="stylesheet" href="components/components.css">
</head>
```

**Note:** `_design-system-test.html` does NOT load `components/components.css` (only the 4 DS files). `_nav-footer-test.html` loads all 5. The test pages have slightly different CSS sets — `_template.html` should establish THE canonical order.

### 4.2 OLD live pages (index.html, explorar.html, sobre_nos.html, 404.html)

```html
<!DOCTYPE html>
<html>  <!-- MISSING lang attribute!! -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="./estilos/geral.css" rel="stylesheet" />
  <link href="./estilos/barra_superior.css" rel="stylesheet" />
  <link href="./estilos/principal.css" rel="stylesheet" />
  <title>Meu Planetinha</title>
</head>
```

**Problems to fix when migrating:**
- `<html>` missing `lang="pt-BR"`
- No preconnect links
- Loads old CSS (geral.css, barra_superior.css) instead of new DS
- No Bootstrap Icons CDN link (loaded via @import in geral.css instead)
- No page-specific title (all say "Meu Planetinha" except 404)

**404.html** has `lang="pt-BR"` ✓ but still loads old CSS.

---

## 5. CSS Load Order Pattern

### 5.1 Established order (from test pages)

1. `estilos/reset.css` — resets
2. `estilos/base.css` — tokens + base element styles (including gradient)
3. `estilos/layout.css` — container, flex utilities, spacing
4. `estilos/componentes.css` — buttons, planet variants
5. `components/components.css` — nav, footer, page shell baseline

### 5.2 Where does page-shell.css fit?

The planned `estilos/pages/page-shell.css` needs a slot. Logical position:
- AFTER `layout.css` (it uses layout tokens)
- BEFORE `componentes.css` (component styles should override if needed)
- OR AFTER `componentes.css` but BEFORE `components/components.css`

**Recommendation:** Insert at position 3.5 or 4.5:
```
reset.css → base.css → layout.css → page-shell.css → componentes.css → components.css
```
This way page-shell establishes the wrapper, then components sit inside it.

### 5.3 Depth-relative paths

Pages at different depths need different relative paths:
- Root (`/`): `estilos/reset.css`
- Depth 1 (`/explorar/`): `../estilos/reset.css`
- Depth 2 (`/jogos/Contando_Estrelas/`): `../../estilos/reset.css` (but game pages won't use this)

`_template.html` should document this with comments showing depth variants.

---

## 6. Container System Status

### 6.1 What exists

| Class | Max-width | Padding (small) | Padding (default) | Padding (desktop) |
|-------|-----------|------------------|--------------------|---------------------|
| `.container` | 1200px | 8px (≤480px) | 16px | 24px (≥1024px) |
| `.container-texto` | 680px | 8px (≤480px) | 16px | 24px (≥1024px) |

### 6.2 What DS-06 requires

"Responsive container: max-width centered layout, 320px to 1440px+"

03-CONTEXT specifies:
- 16px small, 24px tablet, 32px desktop
- Same max-width across all pages
- Claude's discretion: max-width in 960–1280px range

### 6.3 Gap analysis

| Property | Current | Required | Action |
|----------|---------|----------|--------|
| Max-width | 1200px | 960–1280px (discretion) | 1200px is within range ✅ — keep |
| Padding ≤480px | 8px | 16px (small) | ⚠️ Update breakpoint and value |
| Padding default | 16px | 16px–24px | Needs review per breakpoint |
| Padding ≥1024px | 24px | 32px (desktop) | ⚠️ Update to 32px |
| Small breakpoint | 480px | 640px (implied) | ⚠️ Align to 640px |

---

## 7. Conflicts and Concerns

### 7.1 body styles split across two files

- `base.css` sets: font, color, background, min-height
- `components.css` sets: `display: flex; flex-direction: column`
- A new `page-shell.css` would potentially add more body rules or a `.page-wrapper`

**Concern:** Three files touching `body` styles. Plan 03-03 must be very clear about what goes where and avoid duplication.

### 7.2 Gradient already exists in base.css

The gradient is already defined in `base.css` (180deg, 0%/50%/100%). Plan 03-01 says "define and verify the space gradient CSS in base.css" — this is really an **update** to existing gradient values (angle, stops), not a creation.

### 7.3 Stars and nebulae placement

Stars and nebulae are decorative elements that need a DOM container. Options:
- Pseudo-elements on `body::before`/`body::after` — limited (only 2 pseudo-elements)
- A dedicated `.space-bg` wrapper element — needs to be in every page's HTML or injected by JS
- Using `box-shadow` on a fixed pseudo-element for stars — can work without extra DOM

**Recommendation:** Use `body::before` for stars (box-shadow technique) and `body::after` for nebulae (radial-gradient blobs), both `position: fixed; pointer-events: none`. This avoids extra DOM elements and works on every page that loads base.css/page-shell.css.

### 7.4 Live pages still on old CSS

`index.html`, `explorar.html`, `sobre_nos.html`, and `404.html` still load old `geral.css`/`barra_superior.css`. Phase 3's `_template.html` documents the correct boilerplate, but actual page migration happens in a future phase. The gradient and page shell CSS will exist and be correct, but live pages won't show them until they're switched to the new CSS stack.

### 7.5 `estilos/pages/` directory doesn't exist yet

`page-shell.css` target path is `estilos/pages/page-shell.css`. The `estilos/pages/` directory needs to be created.

### 7.6 Container padding adjustments

Updating container padding values in `layout.css` could affect existing test pages. Changes should be verified against `_design-system-test.html` and `_nav-footer-test.html`.

---

## 8. Recommended Approach for Each Plan

### Plan 03-01: Define and verify space gradient CSS in base.css

**What exists:** Gradient already defined with 180deg, stops at 0%/50%/100%.
**What to do:**
1. Update gradient angle from `180deg` to ~`170deg` or `190deg` (slight angle per context)
2. Adjust color stop distribution: keep 0% for blue, move indigo to ~65%, keep magenta at 100%
3. Verify exact hex values match Guia-Visual Section 01: `#1A3A8F`, `#2D1B8A`, `#8B1A6B` — they already do via token indirection
4. Keep `background-attachment: fixed`
5. Consider if stars/nebulae pseudo-elements should be defined here or in page-shell.css
**Scope:** Small edit to existing `base.css` body rule. ~5 lines changed.

### Plan 03-02: Create _template.html

**What to do:**
1. Create `_template.html` at project root — a documented HTML template (not a live page)
2. Include: `<!DOCTYPE html>`, `<html lang="pt-BR">`, all meta tags, preconnect links, Google Fonts link, Bootstrap Icons CDN, CSS load order with comments
3. Include `<body>` structure: `[data-component="nav"]` → `<main id="main-content">` → `[data-component="footer"]`
4. Include `<script src="components/components.js"></script>` at bottom
5. Document depth-relative path variants in comments (root, depth-1, depth-2)
6. Include the new `page-shell.css` in the CSS load order
**Scope:** New file creation. ~60–80 lines.

### Plan 03-03: Create estilos/pages/page-shell.css

**What to do:**
1. Create `estilos/pages/` directory and `page-shell.css`
2. Define `.page-wrapper` (or decide that body itself IS the wrapper since components.css already sets flex-column on body)
3. Add stars decoration: `body::before` with box-shadow star scatter, `position: fixed`, `pointer-events: none`, `z-index: 0`
4. Add nebulae decoration: `body::after` with radial-gradient blobs, `position: fixed`, `pointer-events: none`, `z-index: 0`
5. Ensure `main` content has `position: relative; z-index: 1` so it sits above decorations
6. Set `main { flex: 1 0 auto }` to ensure it grows and pushes footer down
**Key decision:** Whether `.page-wrapper` is needed at all, given body already has `display: flex; flex-direction: column`. Could just style body/main directly. A wrapper adds another DOM element to every page. Simpler = better for v1.
**Scope:** New file, ~80–120 lines including stars and nebulae.

### Plan 03-04: Contrast check on color pairings

**What to do:**
1. Calculate WCAG contrast ratios for white text (`#FFFFFF`) against each gradient stop color
2. Calculate contrast for all Guia-Visual light colors against gradient colors
3. Verify 5:1+ (AAA for normal text) or at minimum 4.5:1 (AA) for all text-on-gradient pairings
4. Document results in plan output
5. Flag any failing combinations and propose adjustments

**Key pairings to check:**
- `#FFFFFF` on `#1A3A8F` (top)
- `#FFFFFF` on `#2D1B8A` (middle)
- `#FFFFFF` on `#8B1A6B` (bottom)
- `#FFD43B` (amarelo-sol) on each gradient stop
- `#4DFFB4` (verde-menta) on each gradient stop

**Scope:** Analysis task, output is documentation. May require updating token values if failures found.

### Plan 03-05: Confirm no shared CSS linked from game pages

**What to do:**
1. Verify `jogos/Contando_Estrelas/index.html` does NOT load any new DS files (reset.css, base.css, layout.css, componentes.css, components.css, page-shell.css)
2. Verify `jogos/Jogo_de_Silaba/index.html` same check
3. Verify no CSS `@import` in game-local CSS files pulls in new DS files
4. Document the finding

**Current status:** Already confirmed in this research — both game pages only load `geral.css`, `barra_superior.css`, and their local `principal.css`. No contamination risk exists today.
**Scope:** Verification task. Quick check and documentation. May be a 1-minute plan.

---

## 9. Quick-Reference Summary

| Area | Status | Action Needed |
|------|--------|---------------|
| Gradient colors | ✅ Correct hex values in base.css tokens | Update angle + stop distribution |
| Gradient on body | ✅ Already in base.css | Tweak angle from 180deg → ~170deg, stops from 0/50/100 → 0/65/100 |
| background-attachment: fixed | ✅ Already set | None |
| body flex column | ✅ In components.css | page-shell.css must complement |
| Footer margin-top: auto | ✅ In components.css | None |
| Container system | ⚠️ Exists but padding values differ | Update breakpoints + padding per DS-06 |
| Stars / nebulae | ❌ Not implemented | New in page-shell.css |
| _template.html | ❌ Does not exist | Create in Plan 03-02 |
| page-shell.css | ❌ Does not exist (`estilos/pages/` dir missing) | Create in Plan 03-03 |
| Game isolation | ✅ Games don't load new DS CSS | Document in Plan 03-05 |
| HTML lang attr | ⚠️ Missing on live pages (index, explorar, sobre_nos) | _template.html documents correct usage; migration later |
| Contrast check | ❌ Not yet done | Plan 03-04 |

---

## RESEARCH COMPLETE
