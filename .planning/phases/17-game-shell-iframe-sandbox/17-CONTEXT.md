# Phase 17: Game Shell & Iframe Sandbox - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a reusable game wrapper page (`jogos/jogar.html`) that loads any game inside a sandboxed iframe with the site's nav/footer, providing a consistent play experience. URL routing via `?game=<id>`, loading overlay with postMessage handshake, and updated game card links. Lays the foundation for future contributor-submitted games.

</domain>

<decisions>
## Implementation Decisions

### Loading Overlay Experience
- Space-themed visual style — animated stars/planet spinning that matches the site's space adventure aesthetic
- Show the specific game name and planet from `GAME_DATA` lookup (game-specific branding, not generic)
- Dismiss via smooth fade (opacity → 0 over ~400ms, then remove from DOM) when game sends `postMessage('game-ready')`
- 5-second timeout fallback: silent dismiss (no toast or warning — just fade out and assume game loaded)

### Error State Presentation
- Invalid `?game=` parameter: show an in-page error reusing the existing 404.html aesthetic/layout within the shell page
- Playful space-themed tone (e.g., "Esse planeta não foi descoberto ainda!")
- Provide a link/button back to the explore page
- Missing `?game=` parameter (no param at all): redirect immediately to the explore page

### Game Viewport Layout
- Desktop: iframe fills full remaining viewport height (100vh minus nav height) — no page scroll
- Footer is below the fold — only visible if user scrolls past the game area
- Mobile: minimal chrome mode — hide/collapse nav, game iframe takes the entire (or near-entire) screen, swipe or tap to access nav
- Page does not scroll during gameplay — game is the only content between nav (if visible) and fold

### Navigation & In-Game Controls
- Shell-level fullscreen toggle button visible in the UI
- Shell-level mute/unmute toggle that controls iframe audio via postMessage
- "Back" action uses `history.back()` (browser-style back navigation)
- Nav behavior during gameplay: Claude's Discretion (auto-hide, collapse, or static — pick what works best with the minimal-chrome mobile approach)

### Claude's Discretion
- Desktop nav behavior during gameplay (static, auto-hide, or collapsed — whatever fits best with the fullscreen/mute controls placement)
- Loading overlay animation specifics (star drift, planet spin, etc. — as long as it's space-themed)
- Exact placement and styling of fullscreen/mute control buttons
- Transition details for mobile chrome hide/reveal

</decisions>

<specifics>
## Specific Ideas

- On mobile, the game should take up most/all of the screen — the user explicitly wants an immersive full-screen-like experience on mobile devices
- The mute button communicates with the game iframe via `postMessage` — games need to listen for a mute message
- Error state reuses the same visual language as the existing `404.html` page but rendered within the shell layout

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-game-shell-iframe-sandbox*
*Context gathered: 2026-03-06*
