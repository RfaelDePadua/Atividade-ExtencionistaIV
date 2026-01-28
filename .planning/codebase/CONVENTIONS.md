# Code Conventions

## Language & Environment
- **Primary Language**: JavaScript (ES6+)
- **Runtime**: Node.js (backend), Browser (frontend)
- **Framework**: 
  - Phaser 3 (game engine)
  - Express.js (backend server)

## Code Style

### Variable Declarations
- **Preference**: `const` for immutable values, `let` for mutable values
- **No `var`**: Modern JavaScript practices are followed
- **Example**:
  ```javascript
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  let silabasColetadas = [];
  let pontuacao = 0;
  ```

### Naming Conventions

#### Variables & Functions
- **Style**: camelCase
- **Portuguese language**: Variable names use Portuguese
- **Examples**:
  - `jogador` (player)
  - `silabasColetadas` (collected syllables)
  - `desenharJogador()` (draw player)
  - `verificarColisao()` (check collision)
  - `atualizarSilabas()` (update syllables)

#### Classes
- **Style**: PascalCase
- **Phaser Scene naming**: Suffix with `Scene`
- **Examples**:
  - `GameScene`
  - `MenuScene`
  - `BootScene`
  - `PreloadScene`
  - `GameOverScene`

#### Constants
- **Style**: UPPER_CASE for configuration values, const camelCase for objects
- **Examples**:
  ```javascript
  const PORT = process.env.PORT || 3000;
  const backgroundImg = new Image();
  ```

### File Organization

#### Project Structure
```
/
├── server.js              # Express server entry point
├── app.js                 # Empty application file
├── index.html             # Main landing page
├── package.json           # Node dependencies
├── estilos/               # Global styles
│   ├── barra_superior.css
│   ├── geral.css
│   └── principal.css
├── jogos/                 # Game modules
│   ├── Contando_Estrelas/
│   │   ├── index.html
│   │   ├── main.js        # Game configuration
│   │   ├── phaser.min.js  # Game engine library
│   │   ├── scenes/        # Phaser scenes (game states)
│   │   │   ├── BootScene.js
│   │   │   ├── PreloadScene.js
│   │   │   ├── MenuScene.js
│   │   │   ├── GameScene.js
│   │   │   └── GameOverScene.js
│   │   ├── assets/        # Game assets
│   │   └── estilos/       # Game-specific styles
│   └── Jogo_de_Silaba/
│       ├── index.html
│       ├── script.js      # Main game logic
│       ├── phaser.min.js
│       ├── assets/
│       └── estilos/
```

#### Scene Organization (Phaser Games)
- Each scene in separate file
- Scene lifecycle methods in order:
  1. `constructor()`
  2. `preload()`
  3. `create()`
  4. `update()` (if needed)
- Export scenes as ES6 modules: `export default class SceneName extends Phaser.Scene`

### Code Organization Patterns

#### Function Organization
- **Declaration Order**:
  1. Configuration and constants
  2. DOM/Canvas setup
  3. Asset loading functions
  4. Game state initialization
  5. Drawing/rendering functions
  6. Update/logic functions
  7. Event handlers
  8. Utility functions

#### Class Structure (Phaser Scenes)
```javascript
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        // Initialize properties
        this.life = null;
        this.player = null;
        this.score = 0;
    }

    preload() {
        // Load assets
    }

    create() {
        // Setup game objects
        // Create animations
        // Setup event listeners
    }

    update() {
        // Game loop logic
    }

    // Helper methods
    helperMethod() {
        // ...
    }
}
```

### Comments

#### Style
- **Portuguese language**: Comments in Portuguese
- **Single-line**: `//` for brief explanations
- **Section headers**: Comment lines to separate major sections
- **Examples**:
  ```javascript
  // Configuração do jogador
  const jogador = { ... };

  // Função para desenhar o jogador
  function desenharJogador() { ... }

  // Porta do servidor
  const PORT = process.env.PORT || 3000;
  ```

#### Documentation
- **Minimal**: No JSDoc or extensive documentation
- **Inline comments**: Used for clarifications
- **TODOs**: Embedded directly as `//nelson` (developer name)

### Object Literals

#### Configuration Objects
- **Multi-line formatting** for readability
- **Example**:
  ```javascript
  const jogador = {
    x: 50,
    y: canvas.height - 60,
    largura: 50,
    altura: 50,
    dy: 0,
    gravidade: 0.5,
    poderPulo: -15,
    pulando: false,
    velocidade: 5
  };
  ```

#### Phaser Config
- Centralized configuration objects
- **Example**:
  ```javascript
  const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene]
  };
  ```

### Arrays

#### Declaration
- `const` for arrays that won't be reassigned
- Empty array initialization: `const silabas = [];`
- Multi-line for long lists:
  ```javascript
  const listaSilabas = [
    "Ca",
    "Va",
    "Ba",
    // ... more items
  ];
  ```

## Error Handling

### Approach
- **Minimal try-catch usage**: No systematic error handling observed
- **Console logging**: Primary method for errors
- **Validation checks**: Inline conditional checks
- **Examples**:
  ```javascript
  if (!ctx) {
    console.error("Falha ao obter o contexto do canvas");
  }
  ```

### Debugging
- **Console methods**:
  - `console.log()` - General debugging
  - `console.error()` - Error messages
  - `console.warn()` - Warnings (in Phaser library)
- **Commented debug logs**: Some debug statements are commented out
  ```javascript
  //console.log("Loop do jogo rodando no timestamp:", timestamp);
  ```

## Module System

### Backend (Node.js)
- **CommonJS**: `require()` and `module.exports`
- **Example**:
  ```javascript
  const express = require('express');
  const path = require('path');
  ```

### Frontend (Browser)
- **ES6 Modules**: `import` and `export`
- **Example**:
  ```javascript
  import BootScene from './scenes/BootScene.js';
  import MenuScene from './scenes/MenuScene.js';
  
  export default class GameScene extends Phaser.Scene { ... }
  ```

## Dependencies

### Backend
- **express**: ^4.21.2 - Web server framework
- **nodemon**: ^3.1.9 (dev) - Development auto-reload

### Frontend
- **Phaser 3**: Bundled as `phaser.min.js` (minified library)
- No package manager for frontend dependencies

## Code Quality Practices

### Good Practices Observed
✓ ES6+ syntax (const, let, arrow functions)
✓ Modular scene architecture (Phaser)
✓ Separation of concerns (server, games, styles)
✓ Responsive design (dynamic canvas sizing)
✓ Asset preloading (Phaser scenes)

### Areas for Improvement
- No TypeScript or type checking
- No linting configuration
- No code formatting standards (Prettier/ESLint)
- Minimal error handling
- No input validation
- Mixed language (Portuguese names, English comments possible)
- No environment variable configuration (.env)
- Debug console.log statements left in production code

## Browser Compatibility
- **Target**: Modern browsers with ES6 support
- **Canvas API**: Required for games
- **No polyfills**: Assumes modern JavaScript support

## Performance Considerations
- **RequestAnimationFrame**: Used for game loops
- **Phaser optimization**: Physics system disabled where not needed
- **Asset management**: Proper preloading in BootScene/PreloadScene
- **Example**:
  ```javascript
  render: {
    pixelArt: false,
    antialias: true,
    willReadFrequently: true
  }
  ```

## Formatting
- **Indentation**: 2 spaces (standard JavaScript)
- **Semicolons**: Consistently used
- **Quotes**: Mixed single and double quotes
- **Line length**: No strict limit observed
- **Blank lines**: Used to separate logical sections

## Special Patterns

### Game Loop (Vanilla JS)
```javascript
function gameLoop(timestamp) {
  // Update game state
  atualizarJogador();
  atualizarSilabas();
  verificarColisao();
  
  // Render
  renderizar();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}
```

### Phaser Scene Lifecycle
```javascript
preload() {
  // Load assets
  this.load.image('key', 'path');
}

create() {
  // Create game objects
  this.add.image(x, y, 'key');
  // Setup physics
  // Add event listeners
}
```

### Responsive Sizing
```javascript
const aspectRatio = 9 / 16;
const maxWidth = window.innerWidth * 0.8;
const maxHeight = window.innerHeight * 0.8;
```

## Version Control
- No Git hooks or automation observed
- No commit message conventions documented
