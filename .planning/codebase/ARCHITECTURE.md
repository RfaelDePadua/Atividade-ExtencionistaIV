# Architecture Overview

## System Pattern

**Multi-Page Application (MPA) with Static File Server**

The application follows a traditional multi-page architecture where each section is a separate HTML page with its own styles and scripts. It uses a Node.js/Express backend as a simple static file server.

## Architectural Layers

### 1. Server Layer (Backend)
- **Technology**: Node.js + Express
- **Entry Point**: `server.js`
- **Responsibilities**:
  - Serve static files (HTML, CSS, JS, images)
  - Handle HTTP requests on port 3000
  - Route root path to `index.html`
- **Pattern**: Simple static file server with no business logic

### 2. Presentation Layer (Frontend)
- **Technology**: Vanilla HTML, CSS, JavaScript
- **Entry Point**: `index.html`
- **Responsibilities**:
  - Render UI components
  - Navigate between pages
  - Host embedded games
- **Structure**: Page-based navigation with shared header/navigation component

### 3. Game Layer
- **Technologies**: 
  - Phaser.js (game framework) for "Contando Estrelas"
  - Vanilla Canvas API for "Jogo de Sílaba"
- **Architecture**: Self-contained game modules with scene-based patterns
- **Entry Points**:
  - `jogos/Contando_Estrelas/main.js`
  - `jogos/Jogo_de_Silaba/script.js`

## Key Design Patterns

### 1. Static Asset Pattern
All content is served as static files with relative path references. No dynamic content generation or API calls.

### 2. Component Reuse via Templates
- Shared navigation header duplicated across pages
- Common CSS imports (`geral.css`, `barra_superior.css`)
- Consistent page structure template

### 3. Scene-Based Game Architecture (Contando Estrelas)
Uses Phaser.js scene pattern:
- **BootScene**: Initial setup
- **PreloadScene**: Asset loading
- **MenuScene**: Game menu
- **GameScene**: Main gameplay
- **GameOverScene**: End game state

### 4. Module-Based Organization
Each game is completely self-contained in its own directory with:
- HTML entry point
- JavaScript logic
- Local styles (inheriting from global styles)
- Assets folder

## Data Flow

### Page Navigation Flow
```
index.html (home)
├── explorar/explorar.html (browse games by category)
├── sobre_nos/sobre_nos.html (about page)
└── jogos/
    ├── Contando_Estrelas/index.html (math game)
    └── Jogo_de_Silaba/index.html (syllable game)
```

### Request Flow
1. Browser requests page → Express server
2. Server serves static HTML file
3. Browser loads CSS stylesheets
4. Browser loads JavaScript (if game page)
5. Game initializes and runs client-side

### Style Cascade
1. `estilos/geral.css` - Global base styles
2. `estilos/barra_superior.css` - Navigation bar styles
3. `[page]/estilos/principal.css` - Page-specific styles

## Core Abstractions

### 1. Navigation Component
- Shared header with logo, menu links, and search bar
- Implemented via HTML duplication (no templating system)
- Links: Home, Explorar (browse), Sobre Nós (about)

### 2. Game Container
- Each game is an independent module
- Games inherit site header/navigation
- Game content rendered in `<main>` section

### 3. Game Card
- Visual representation of game on home page
- Components: thumbnail image, game name, link to game page
- Organized by categories (Popular, Matemática, Português)

## Application Entry Points

### Server Entry
- **File**: `server.js`
- **Purpose**: Start Express server and serve static files
- **Command**: `npm start` or `npm run dev`

### Client Entry
- **File**: `index.html`
- **URL**: `http://localhost:3000/`
- **Purpose**: Landing page with game gallery

### Game Entry Points
1. **Contando Estrelas** (Math Game)
   - **File**: `jogos/Contando_Estrelas/main.js`
   - **Framework**: Phaser.js
   - **Type**: Scene-based game with sprite physics

2. **Jogo de Sílaba** (Syllable Game)
   - **File**: `jogos/Jogo_de_Silaba/script.js`
   - **Framework**: Canvas API
   - **Type**: Side-scrolling platformer with syllable collection

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.21.2
- **Dev Tools**: Nodemon 3.1.9

### Frontend
- **Base**: HTML5, CSS3, Vanilla JavaScript
- **Game Engines**: 
  - Phaser.js (Contando Estrelas)
  - Canvas API (Jogo de Sílaba)

### Assets
- Images: PNG, GIF, JPG
- Fonts: Custom CSS font faces
- No database or external APIs

## Deployment Architecture

- Single server instance serves all content
- No build process or bundling
- All files served directly from filesystem
- Port: 3000 (configurable via PORT environment variable)

## Key Architectural Decisions

1. **Static-Only Approach**: No dynamic backend logic, database, or APIs
2. **Self-Contained Games**: Each game is independent with its own dependencies
3. **Flat Routing**: Direct file path mapping (no URL rewriting)
4. **Client-Side Only Games**: All game logic runs in browser
5. **Template Duplication**: Navigation component copied across pages (no SSR or templating)

## Scalability Considerations

- **Current State**: Suitable for small-scale educational project
- **Limitations**: 
  - No user authentication or session management
  - No database for scores or user progress
  - Manual duplication of navigation component
- **Growth Path**: Would benefit from templating system, build process, and API layer for dynamic features
