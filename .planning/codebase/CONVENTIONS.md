# Coding Conventions

**Analysis Date:** 2026-02-19

## Naming Patterns (observed)
- Files that define Phaser scene classes use `PascalCase.js` (e.g., `BootScene.js`, `GameScene.js`).
- Small scripts use `kebab-case` or `lowerCamel` (`carousel.js`, `script.js`).
- CSS files use `kebab-case` (`principal.css`, `carousel.css`).
- HTML files and directories use lowercase with underscores for multi-word folders (`sobre_nos/`).

## Code Style (current state)
- ES modules are used for Phaser scenes (`export default class ...`).
- Predominantly vanilla JavaScript (no TypeScript or React). 
- No project-level formatter or linter config detected (`.eslintrc`, `.prettierrc` not present).

**Recommendation (apply when adding code):** follow existing styles — PascalCase for scene classes, camelCase for variables/functions, kebab-case for filenames where appropriate, and introduce a linter/formatter as a next step.

## Function & Module Design (observed)
- Game logic organized inside Phaser Scene classes (single responsibility per scene).
- Modules: prefer `export default` for scene classes; other utilities are plain JS functions.

## Comments & TODOs
- TODOs exist in game source (e.g., `// TODO: Review and expand valid words list` in `Jogo_de_Silaba/script.js`).
- Comments explain game logic in key places — follow the "explain why, not what" guideline when adding comments.

## Error Handling
- No standardized error-handling pattern; client-side code relies on local checks and console output.

---
*Update this file when style rules or tooling are added to the repo.*