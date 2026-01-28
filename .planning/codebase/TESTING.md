# Testing Documentation

## Testing Status: ⚠️ NO TESTS IMPLEMENTED

**Current State**: This codebase has **no automated testing infrastructure** in place.

## Evidence

### Package.json Test Configuration
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

**Status**: Default npm test script - no testing framework configured.

### Test Files
- ✗ No `*.test.js` files found
- ✗ No `*.spec.js` files found
- ✗ No `__tests__/` directory
- ✗ No `test/` directory
- ✗ No test configuration files (jest.config.js, mocha.opts, etc.)

## Testing Frameworks
**Installed**: None

**Common options for this stack**:
- **Jest** - Popular for Node.js and frontend testing
- **Mocha + Chai** - Flexible testing framework
- **Jasmine** - Behavior-driven testing
- **Cypress** - End-to-end browser testing
- **Puppeteer** - Browser automation for E2E tests

## Current Quality Assurance Methods

### Manual Testing
The codebase relies entirely on manual testing:
- Browser console for debugging
- Visual inspection of game behavior
- Manual server testing

### Console Logging
Primary debugging approach:
```javascript
console.log("Pontuação:", pontuacao);
console.log("Gerando nova sílaba");
console.log("Tecla pressionada:", e.key);
console.error("Falha ao obter o contexto do canvas");
```

**Observed patterns**:
- Debugging with `console.log()` statements
- Error reporting with `console.error()`
- Some debug logs commented out: `//console.log("...")`

### Runtime Validation
Minimal inline checks:
```javascript
if (!ctx) {
  console.error("Falha ao obter o contexto do canvas");
}
```

## Recommended Testing Strategy

### Phase 1: Unit Testing Setup

#### Install Jest
```bash
npm install --save-dev jest @types/jest
```

#### Configure package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/", "/jogos/"]
  }
}
```

### Phase 2: Backend Testing

#### Server Tests (server.test.js)
```javascript
const request = require('supertest');
const express = require('express');

describe('Server', () => {
  test('should serve index.html on /', async () => {
    // Test Express routes
  });
  
  test('should serve static files', async () => {
    // Test static file serving
  });
});
```

**Coverage targets**:
- ✓ Route handlers
- ✓ Static file serving
- ✓ Server initialization

### Phase 3: Game Logic Testing

#### Syllable Game Tests
```javascript
describe('Jogo de Silaba', () => {
  describe('verificarPalavra', () => {
    test('should validate correct words', () => {
      // Test word validation
    });
    
    test('should reject invalid words', () => {
      // Test word rejection
    });
  });
  
  describe('Collision Detection', () => {
    test('should detect player-syllable collision', () => {
      // Test collision logic
    });
  });
});
```

#### Math Game Tests
```javascript
describe('Contando Estrelas', () => {
  describe('gerarContas', () => {
    test('should generate unique results', () => {
      // Test equation generation
    });
    
    test('should scale difficulty with wave', () => {
      // Test difficulty progression
    });
  });
});
```

**Testable components**:
- ✓ Word validation logic
- ✓ Collision detection algorithms
- ✓ Score calculation
- ✓ Equation generation
- ✓ Difficulty scaling

### Phase 4: Integration Testing

#### Phaser Scene Tests
```javascript
describe('GameScene', () => {
  let scene;
  
  beforeEach(() => {
    scene = new GameScene();
    scene.create();
  });
  
  test('should initialize player with correct properties', () => {
    expect(scene.player).toBeDefined();
    expect(scene.life).toBe(3);
  });
});
```

**Challenges**:
- Phaser requires browser environment
- Consider using **jest-canvas-mock** for Canvas API
- May need headless browser (Puppeteer)

### Phase 5: E2E Testing

#### Install Cypress or Puppeteer
```bash
npm install --save-dev cypress
# or
npm install --save-dev puppeteer
```

#### E2E Test Examples
```javascript
describe('Syllable Game E2E', () => {
  test('should load game canvas', async () => {
    // Navigate to game page
    // Check canvas renders
  });
  
  test('should collect syllables on spacebar', async () => {
    // Simulate gameplay
    // Verify syllable collection
  });
});
```

## Test Coverage Goals

### Minimum Coverage (Phase 1)
- **Backend**: 60% coverage
- **Game Logic**: 40% coverage
- **Overall**: 50% coverage

### Target Coverage (Phase 2)
- **Backend**: 80% coverage
- **Game Logic**: 70% coverage
- **Overall**: 75% coverage

### Files to Prioritize
1. `server.js` - Server configuration
2. Core game logic (collision, scoring, validation)
3. Scene initialization logic
4. Game state management

## Mocking Strategy

### External Dependencies
- **DOM APIs**: Use **jest-canvas-mock**
- **Phaser Engine**: Consider mocking or using test environment
- **Image Loading**: Mock `Image` objects
- **Audio**: Mock `Audio` API

### Example Mocks
```javascript
// Mock canvas context
global.document.getElementById = jest.fn().mockReturnValue({
  getContext: jest.fn().mockReturnValue({
    fillStyle: '',
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    drawImage: jest.fn()
  })
});

// Mock Phaser
jest.mock('phaser', () => ({
  Scene: class Scene {},
  AUTO: 'auto',
  Math: {
    Between: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  }
}));
```

## Testing Best Practices for This Codebase

### 1. Isolate Game Logic
Extract testable functions from canvas-dependent code:
```javascript
// Before (hard to test)
function verificarColisao() {
  silabas.forEach((silaba, indice) => {
    if (checkCollision(jogador, silaba)) {
      silabasColetadas.push(silaba.texto);
      silabas.splice(indice, 1);
    }
  });
}

// After (testable)
export function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}
```

### 2. Parameterize Functions
Make functions pure and testable:
```javascript
// Before (uses globals)
function verificarPalavra() {
  const palavra = silabasColetadas.join("");
  if (palavrasValidas.includes(palavra)) {
    pontuacao += 10;
  }
}

// After (testable)
export function isValidWord(syllables, validWords) {
  const word = syllables.join("");
  return validWords.includes(word);
}
```

### 3. Separate Configuration
Move constants to separate files:
```javascript
// config/palavras.js
export const palavrasValidas = ["Cara", "Cama", ...];
export const listaSilabas = ["Ca", "Va", "Ba", ...];
```

### 4. Test File Organization
```
jogos/
├── Jogo_de_Silaba/
│   ├── script.js
│   ├── __tests__/
│   │   ├── collision.test.js
│   │   ├── wordValidation.test.js
│   │   └── scoring.test.js
│   └── lib/
│       ├── collision.js     (extracted logic)
│       ├── validation.js    (extracted logic)
│       └── scoring.js       (extracted logic)
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Debugging Tests

### Common Issues
1. **Canvas not available**: Use jest-canvas-mock
2. **DOM not available**: Use jsdom environment
3. **Phaser initialization fails**: Mock Phaser or use headless mode
4. **Timing issues**: Use jest fake timers

### Debug Configuration
```json
{
  "jest": {
    "verbose": true,
    "testEnvironment": "jsdom",
    "setupFiles": ["jest-canvas-mock"]
  }
}
```

## Performance Testing

### Load Testing (Server)
```bash
npm install --save-dev autocannon
```

```javascript
// server.perf.test.js
const autocannon = require('autocannon');

test('should handle 100 concurrent requests', async () => {
  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 100,
    duration: 10
  });
  expect(result.errors).toBe(0);
});
```

### Browser Performance
- Use Chrome DevTools Performance tab
- Monitor frame rate during gameplay
- Check memory usage for leaks

## Test Data Management

### Fixtures
Create test data files:
```javascript
// __fixtures__/words.js
export const testWords = [
  { syllables: ["Ca", "sa"], valid: true },
  { syllables: ["Xa", "za"], valid: false }
];
```

### Factories
```javascript
// __factories__/player.js
export function createPlayer(overrides = {}) {
  return {
    x: 50,
    y: 300,
    largura: 50,
    altura: 50,
    ...overrides
  };
}
```

## Accessibility Testing

### Tools to Consider
- **axe-core**: Automated accessibility testing
- **pa11y**: Accessibility testing tool
- **WAVE**: Browser extension for manual testing

### Test Example
```javascript
const { axe } = require('jest-axe');

test('game page should be accessible', async () => {
  const html = await loadGamePage();
  const results = await axe(html);
  expect(results).toHaveNoViolations();
});
```

## Summary

### Current State
- ❌ No test framework
- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests
- ❌ No CI/CD testing
- ⚠️ Manual testing only
- ⚠️ Console.log debugging

### Immediate Next Steps
1. Install Jest testing framework
2. Extract testable logic from canvas code
3. Write basic unit tests for game logic
4. Add test script to CI/CD pipeline
5. Target 50% code coverage initially

### Long-term Goals
1. 75%+ code coverage
2. Integration tests for Phaser scenes
3. E2E tests for critical user paths
4. Performance benchmarking
5. Accessibility compliance testing

### Resources Needed
- Testing framework installation
- Developer training on testing practices
- Time allocation for writing tests
- CI/CD pipeline setup
- Test data creation
