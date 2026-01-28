# Directory Structure

## Overview

This codebase follows a **page-based organization** where each section of the website has its own directory containing HTML, styles, and assets. Games are modular and self-contained.

## Root Directory Layout

```
Atividade-ExtencionistaIV/
├── server.js              # Express server entry point
├── app.js                 # (Empty - unused file)
├── index.html             # Main landing page
├── package.json           # Node.js dependencies
├── estilos/               # Global stylesheets
├── midia/                 # Shared media assets
├── jogos/                 # Game modules
├── explorar/              # Browse/explore page
├── sobre_nos/             # About page
└── node_modules/          # NPM dependencies (excluded)
```

## Key Directory Purposes

### `/` (Root)
**Purpose**: Application entry points and server configuration

**Key Files**:
- `server.js` - Express server that serves static files
- `index.html` - Landing page with game gallery
- `package.json` - Dependencies (express, nodemon)
- `app.js` - Empty file (no current usage)

### `/estilos/`
**Purpose**: Global CSS stylesheets shared across all pages

**Structure**:
```
estilos/
├── geral.css              # Base styles, resets, typography
├── barra_superior.css     # Navigation header styles
└── principal.css          # Main content area styles (root)
```

**Usage Pattern**: Pages import global styles first, then local overrides

### `/midia/`
**Purpose**: Shared media assets (images, logos, team photos)

**Contents**:
```
midia/
├── meu_planetinha.gif     # Site logo (animated)
├── Contando_Estrelas.png  # Game thumbnail
├── Jogo_de_silaba.png     # Game thumbnail
├── rafael.jpg             # Team member photo
├── robson.jpg             # Team member photo
└── stanley.jpg            # Team member photo
```

### `/jogos/`
**Purpose**: Self-contained game modules

**Structure**:
```
jogos/
├── Contando_Estrelas/     # Math game (Phaser.js)
│   ├── index.html
│   ├── main.js            # Game configuration & initialization
│   ├── phaser.min.js      # Phaser framework library
│   ├── assets/            # Game-specific assets
│   │   └── super-dario-advance-4.css
│   ├── estilos/
│   │   └── principal.css  # Game-specific styles
│   └── scenes/            # Phaser game scenes
│       ├── BootScene.js
│       ├── PreloadScene.js
│       ├── MenuScene.js
│       ├── GameScene.js
│       └── GameOverScene.js
│
└── Jogo_de_Silaba/        # Syllable game (Canvas API)
    ├── index.html
    ├── script.js          # Game logic
    ├── phaser.min.js      # (Unused - leftover file)
    ├── style.css          # Game-specific styles
    ├── assets/            # Game sprites & backgrounds
    └── estilos/
        └── principal.css  # Additional game styles
```

**Pattern**: Each game is a mini-application with all dependencies included

### `/explorar/`
**Purpose**: Browse/explore games by category (alphabet navigation)

**Structure**:
```
explorar/
├── explorar.html          # Browse page
└── estilos/
    └── principal.css      # Page-specific styles
```

### `/sobre_nos/`
**Purpose**: About page with team information

**Structure**:
```
sobre_nos/
├── sobre_nos.html         # About page
└── estilos/
    └── principal.css      # Page-specific styles
```

## Naming Conventions

### Files
- **HTML**: Lowercase with underscores: `sobre_nos.html`, `explorar.html`
- **JavaScript**: camelCase: `main.js`, `script.js`
- **CSS**: Lowercase with underscores: `barra_superior.css`, `geral.css`
- **Images**: Snake_case or Proper_Case: `Contando_Estrelas.png`, `meu_planetinha.gif`

### Directories
- **Games**: Proper_Case with underscores: `Contando_Estrelas/`, `Jogo_de_Silaba/`
- **Sections**: Lowercase with underscores: `sobre_nos/`, `explorar/`
- **Assets**: Lowercase singular: `estilos/`, `midia/`
- **Game subdirectories**: Lowercase plural: `scenes/`, `assets/`

### Classes & IDs (CSS)
- **Pattern**: Kebab-case
- **Examples**: `.barra-de-navegacao`, `.secao-de-jogos`, `#logotipo`

## File Organization Patterns

### Standard Page Structure
Every main page follows this pattern:
```
[page_name]/
├── [page_name].html       # Page HTML
└── estilos/
    └── principal.css      # Page-specific styles
```

### Game Module Structure
```
[Game_Name]/
├── index.html             # Game entry page
├── [main/script].js       # Game logic
├── [framework].min.js     # Game engine (if used)
├── estilos/               # Styles
│   └── principal.css
├── assets/                # Game assets
│   └── [sprites, images, fonts]
└── scenes/                # Scene files (Phaser only)
    └── [SceneName].js
```

## Key File Locations

### Entry Points
- **Server**: `/server.js` (line 1)
- **Client**: `/index.html` (line 1)
- **Contando Estrelas**: `/jogos/Contando_Estrelas/main.js` (line 1)
- **Jogo de Sílaba**: `/jogos/Jogo_de_Silaba/script.js` (line 1)

### Configuration
- **Dependencies**: `/package.json`
- **Git**: `/.gitignore`

### Global Assets
- **Styles**: `/estilos/`
- **Media**: `/midia/`

### Page Sections
- **Home**: `/index.html`
- **Explore**: `/explorar/explorar.html`
- **About**: `/sobre_nos/sobre_nos.html`

### Games
- **Math Game**: `/jogos/Contando_Estrelas/`
- **Syllable Game**: `/jogos/Jogo_de_Silaba/`

## Path Reference Patterns

### From Root Level (`index.html`)
```html
<link href="./estilos/geral.css" />
<img src="./midia/meu_planetinha.gif" />
<a href="./explorar/explorar.html">Explorar</a>
```

### From Section Pages (`explorar/`, `sobre_nos/`)
```html
<link href="../estilos/geral.css" />
<img src="../midia/meu_planetinha.gif" />
<a href="../index.html">Início</a>
```

### From Game Pages (`jogos/[Game]/`)
```html
<link href="../../estilos/geral.css" />
<img src="../../midia/meu_planetinha.gif" />
<a href="../../index.html">Início</a>
```

## Module Dependencies

### Server Dependencies (`package.json`)
```json
{
  "dependencies": {
    "express": "^4.21.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

### Game Dependencies
- **Contando Estrelas**: Phaser.js (bundled in `/jogos/Contando_Estrelas/phaser.min.js`)
- **Jogo de Sílaba**: Native Canvas API (no external dependencies)

## Special Directories (Excluded from Analysis)

- `.git/` - Git version control
- `.github/` - GitHub configuration & workflows
- `.planning/` - Planning documents
- `node_modules/` - NPM dependencies
- `.DS_Store` - macOS system files

## Growth Recommendations

### Current Limitations
1. **Navigation Duplication**: Header HTML copied to every page
2. **No Build System**: Assets served directly without optimization
3. **Flat CSS Architecture**: No CSS preprocessing or modules

### Suggested Structure Improvements
1. Add `/src/` and `/dist/` for build process
2. Create `/components/` for reusable UI elements
3. Add `/public/` for truly static assets
4. Implement `/api/` directory for future backend logic
5. Add `/config/` for environment configuration

### Scalability Path
```
Future Structure:
├── src/                   # Source files
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page templates
│   ├── styles/            # SCSS/LESS source
│   └── games/             # Game source code
├── public/                # Static assets
├── dist/                  # Built/bundled output
├── api/                   # Backend API routes
└── config/                # Configuration files
```

## Documentation

Current documentation location:
- `.planning/codebase/ARCHITECTURE.md` - This file
- `.planning/codebase/STRUCTURE.md` - Architecture patterns
