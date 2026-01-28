# Technology Stack

## Overview
Meu Planetinha is an educational web platform featuring interactive games for children, built with a simple Node.js backend serving static HTML/CSS/JavaScript content.

---

## Languages & Runtime

### Backend
- **JavaScript (Node.js)**
  - Runtime: Node.js (no specific version specified)
  - Primary language for server-side logic
  - Entry point: `server.js`

### Frontend
- **HTML5**
  - Semantic markup
  - Canvas API for game rendering
- **CSS3**
  - Custom stylesheets organized by component
  - Responsive design patterns
- **JavaScript (ES6+)**
  - ES6 Modules (`type="module"`)
  - Canvas 2D API
  - DOM manipulation

---

## Frameworks & Libraries

### Backend Framework
- **Express.js ^4.21.2**
  - Minimal web server framework
  - Static file serving
  - Single route configuration
  - Serves entire repository root as static content

### Frontend Game Engine
- **Phaser 3**
  - HTML5 game framework
  - Used in "Contando Estrelas" game
  - Physics engine (Arcade Physics)
  - Scene management system
  - Sprite and asset management
  - Version: Minified local copy (`phaser.min.js`)

### Frontend Game Development
- **Custom Canvas 2D**
  - Used in "Jogo de Sílaba" game
  - Direct Canvas API manipulation
  - Custom physics and collision detection
  - No external game framework

---

## Dependencies

### Production Dependencies
```json
{
  "express": "^4.21.2"
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.1.9"
}
```

**Purpose:**
- `express`: Web server framework for serving static content
- `nodemon`: Development tool for auto-restarting server on file changes

---

## Configuration Files

### package.json
- **Location:** Root directory
- **Purpose:** Node.js project configuration and dependency management
- **Scripts:**
  - `start`: Production server (`node server.js`)
  - `dev`: Development server with hot reload (`nodemon server.js`)
  - `test`: Placeholder (not implemented)

### package-lock.json
- **Location:** Root directory
- **Purpose:** Lock file for dependency versions

---

## Project Structure

### Application Architecture
```
Backend (Node.js/Express)
  ↓
Static File Server
  ↓
Frontend (HTML/CSS/JS)
  ├── Main Site (Vanilla JS)
  └── Games
      ├── Contando Estrelas (Phaser 3)
      └── Jogo de Sílaba (Canvas 2D)
```

### Directory Organization
```
/
├── server.js              # Express server entry point
├── app.js                 # Empty (unused)
├── index.html             # Main landing page
├── estilos/               # Global CSS styles
│   ├── geral.css          # General styles
│   ├── barra_superior.css # Navigation bar styles
│   └── principal.css      # Main page styles
├── jogos/                 # Games directory
│   ├── Contando_Estrelas/ # Math game (Phaser 3)
│   │   ├── main.js        # Game entry point
│   │   ├── phaser.min.js  # Phaser 3 library
│   │   ├── scenes/        # Phaser game scenes
│   │   └── assets/        # Game assets
│   └── Jogo_de_Silaba/    # Portuguese game (Canvas)
│       ├── script.js      # Game logic
│       ├── phaser.min.js  # Unused Phaser library
│       └── assets/        # Game assets
├── explorar/              # Explore section
├── sobre_nos/             # About us section
└── midia/                 # Shared media assets
```

---

## Build & Development

### Development Setup
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Server runs on `http://localhost:3000`

### Production
- **Build:** No build step required (static files)
- **Deployment:** Run `npm start` to start Express server
- **Port:** 3000 (configurable via `PORT` environment variable)

### Development Tools
- **nodemon**: Auto-restart on file changes during development
- **No bundler**: Direct file serving without webpack/vite/parcel
- **No transpilation**: Modern ES6+ features used directly

---

## Browser Compatibility

### Target Browsers
- Modern browsers with ES6+ support
- HTML5 Canvas support required
- WebGL support recommended (for Phaser 3)

### Required Browser Features
- ES6 Modules
- Canvas 2D Context
- Local Storage (not currently used)
- Arcade Physics support (Phaser 3)
- Audio API (for game sounds)

---

## Runtime Environment

### Server Requirements
- Node.js runtime
- No specific version constraint
- Single-threaded event loop
- No database required
- No external API dependencies

### Client Requirements
- Modern web browser
- JavaScript enabled
- Canvas support
- No authentication required
- No cookies/session storage used

---

## Technology Decisions

### Why Express?
- Lightweight and minimal
- Perfect for static file serving
- Simple configuration
- Industry standard for Node.js web servers

### Why Phaser 3?
- Popular HTML5 game framework
- Built-in physics engine
- Scene management
- Cross-platform support
- Active community

### Why Custom Canvas?
- Full control over rendering
- Lightweight (no framework overhead)
- Educational value
- Simple game mechanics don't require full framework

### Why Static Architecture?
- Simple deployment
- No database complexity
- Fast loading times
- Easy to maintain
- Suitable for educational content

---

## Future Considerations

### Potential Upgrades
- Add TypeScript for type safety
- Implement build process (webpack/vite)
- Add CSS preprocessor (SASS/LESS)
- Implement testing framework (Jest)
- Add linting (ESLint/Prettier)
- Consider framework migration (React/Vue) for main site
- Add state management for games
- Implement code splitting and lazy loading

### Scalability Notes
- Current architecture suitable for low-to-medium traffic
- Static asset CDN could improve performance
- Consider microservices if backend features needed
- Database would be required for user accounts/progress tracking
