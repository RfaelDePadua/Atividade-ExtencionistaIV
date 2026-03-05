---
phase: 09-404-page
plan: "09-03"
subsystem: ui
tags: [css, 404, design-tokens, responsive]

requires:
  - phase: 01-design-system-foundation
    provides: CSS design tokens in base.css

provides:
  - estilos/pages/404.css — scoped 404 page styles using design system tokens
affects: [phase-10-accessibility]

tech-stack:
  added: []
  patterns:
    - .page-404 body class scoping (zero global side effects)
    - clamp() for fluid typography on .codigo-erro
    - Design tokens only — no hard-coded hex values (except text-shadow alpha)

key-files:
  created:
    - estilos/pages/404.css — complete 404 page styles
  modified: []
---

# Plan 09-03 Summary: 404 Page CSS

## What Was Done

Created `estilos/pages/404.css` — all visual styles for the 404 page, scoped to `.page-404`.

### Styles Implemented
- **`.page-wrapper`** override: `display:flex; align-items:center; justify-content:center; min-height:80vh` — full-viewport centering
- **`.pagina-404`**: flex column, centered, `gap: var(--espaco-md)`, max-width 600px
- **`.erro-ilustracao`**: decorative emoji row, `font-size:3rem`, responsive
- **`.codigo-erro`**: `clamp(5rem, 15vw, 10rem)`, `font-family: var(--fonte-titulo)`, `color: var(--cor-secundaria)` (Rosa Chiclete #FF6EB4), double text-shadow for glow effect
- **`.titulo-erro`**: `clamp(1.5rem, 4vw, 2.25rem)`, Fredoka One, white
- **`.descricao-erro`**: Nunito, `var(--texto-base)`, 85% opacity for hierarchy, max-width 480px
- **`.descricao-erro--dica`**: bold, full opacity — encouraging message
- **`.erro-cta`**: inline-flex with gap, `margin-top: var(--espaco-lg)` — uses `.btn-primario` from componentes.css
- **`.erro-nav-secundaria`** + `.erro-link-sec`: secondary link row with hover/focus transitions
- **Mobile** (≤640px): reduced emoji sizes, tighter gap
- **Reduced motion**: transitions disabled for all interactive elements

### Token Usage
All values use design tokens from `base.css`:
- Colors: `--cor-secundaria`, `--cor-texto`
- Fonts: `--fonte-titulo`, `--fonte-corpo`, `--texto-base`
- Spacing: `--espaco-sm/md/lg/xl/3xl`
- Transitions: `--duracao-rapida`, `--easing-padrao`

### Verification Against Must-Haves
- ✅ estilos/pages/404.css exists with all section styles
- ✅ 404 display number ≥6rem (uses clamp(5rem, 15vw, 10rem))
- ✅ Page vertically/horizontally centered (flex centering on page-wrapper)
- ✅ "Voltar para casa" uses .btn-primario (HTML class, styles from componentes.css)
- ✅ All styles scoped to .page-404
- ✅ Design tokens only (--espaco-*, --fonte-*, --cor-*, --duracao-*)
- ✅ Responsive at 320px (tested via clamp + flexible layout)

## Commit
`feat(09-01/02/03): rebuild 404.html and create estilos/pages/404.css`
Hash: 8661451
