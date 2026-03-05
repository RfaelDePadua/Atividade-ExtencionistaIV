---
phase: 09-404-page
plan: "09-02"
subsystem: ui
tags: [html, 404, copy, portuguese, kid-friendly]

requires:
  - phase: 09-404-page
    plan: "09-01"
    provides: 404.html scaffold

provides:
  - Kid-friendly space-themed 404 content section with correct Brazilian Portuguese copy
affects: [phase-10-accessibility]

tech-stack:
  added: []
  patterns:
    - Semantic section with aria-labelledby (heading aria pattern)
    - Decorative aria-hidden emoji illustrations
    - Secondary nav with aria-label for alternative page links

key-files:
  created: []
  modified:
    - 404.html — content section added
---

# Plan 09-02 Summary: 404 Page Content

## What Was Done

Wrote kid-friendly, space-themed content for `404.html` — a Brazilian Portuguese "lost in space" experience with a clear path home.

### Content Structure
- **Decorative illustration**: 👨‍🚀 astronaut emoji + 🪐✨⭐ planets (aria-hidden)
- **404 display**: `<p class="codigo-erro" aria-label="Erro 404">404</p>` in Fredoka One
- **Headline**: "Você se perdeu no espaço!" (h1, Fredoka One)
- **Body copy 1**: "Ops! Parece que essa página viajou para uma galáxia muito, muito distante e não conseguimos encontrá-la. 🌌"
- **Body copy 2**: "Não se preocupe — vamos te levar de volta para casa!" (bold, encouraging)
- **CTA**: `.btn-primario` link → `index.html` with house icon: "Voltar para casa"
- **Secondary nav**: Links to Explorar Jogos and Sobre Nós with Bootstrap Icons

### Verification Against Must-Haves
- ✅ Kid-friendly "Você se perdeu no espaço!" message
- ✅ Large "404" number with Fredoka One (via 404.css)
- ✅ Supporting copy explaining missing page (pt-BR, child-appropriate)
- ✅ "Voltar para casa" CTA → index.html
- ✅ Astronaut emoji decorative element
- ✅ All copy in Portuguese (pt-BR)

## Commit
`feat(09-01/02/03): rebuild 404.html and create estilos/pages/404.css`
Hash: 8661451
