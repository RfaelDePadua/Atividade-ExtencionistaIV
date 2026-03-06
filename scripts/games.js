/**
 * games.js — Game Card Data & Renderer
 * Phase 6 — Meu Planetinha
 *
 * Defines game data and renders card components into #game-grid.
 * Listens for planet-selected events from the carousel to filter cards.
 *
 * Depends on: carousel.js (planet-selected event), cards.css (styles)
 * Load after: carousel.js
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Game Data
     ------------------------------------------------ */

  var GAME_DATA = [
    {
      id: 'contando-estrelas',
      name: 'Contando Estrelas',
      planet: 'calculon',
      subject: 'Matemática',
      difficulty: 2,
      path: 'jogos/Contando_Estrelas/index.html'
    },
    {
      id: 'jogo-de-silaba',
      name: 'Jogo de Sílaba',
      planet: 'letrion',
      subject: 'Português',
      difficulty: 1,
      path: 'jogos/Jogo_de_Silaba/index.html'
    }
  ];

  /* ------------------------------------------------
     Card HTML Generators
     ------------------------------------------------ */

  /**
   * Build difficulty star icons (1–3 filled out of 3 total).
   * Uses Bootstrap Icons: bi-star-fill (filled) and bi-star (empty).
   */
  /* Difficulty level labels (context decision: named levels, not numeric) */
  var DIFFICULTY_LABELS = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };

  function createStars(difficulty) {
    var label = DIFFICULTY_LABELS[difficulty] || ('Dificuldade ' + difficulty + ' de 3');
    var html = '';
    for (var i = 1; i <= 3; i++) {
      if (i <= difficulty) {
        html += '<i class="bi bi-star-fill game-card-star game-card-star--filled" aria-hidden="true"></i>';
      } else {
        html += '<i class="bi bi-star game-card-star" aria-hidden="true"></i>';
      }
    }
    return '<span class="game-card-stars" role="img" aria-label="Dificuldade: ' + label + '">' + html + '</span>';
  }

  /**
   * Build a single game card <article> element as an HTML string.
   * data-planeta attribute enables planet-gradient CSS and button variants.
   * @param {Object} game - Game data object.
   * @param {string} [basePath] - Optional path prefix for game href (e.g. '../' from depth-1 pages).
   */
  function createCard(game, basePath) {
    basePath = basePath || '';
    return (
      '<article class="game-card" data-planeta="' + game.planet + '" data-game-id="' + game.id + '">' +
        '<div class="game-card-body">' +
          '<h3 class="game-card-name">' + game.name + '</h3>' +
          '<span class="game-card-subject">' + game.subject + '</span>' +
          createStars(game.difficulty) +
          '<a href="' + basePath + 'jogos/jogar.html?game=' + game.id + '" class="btn-primario game-card-btn" aria-label="Jogar ' + game.name + '">Jogar!</a>' +
        '</div>' +
      '</article>'
    );
  }

  /**
   * Build the "Em Breve" placeholder card HTML.
   * Shown after all real game cards to preview upcoming content.
   */
  function createPlaceholderCard() {
    return (
      '<article class="game-card game-card--placeholder" aria-label="Em Breve — novo jogo será adicionado">' +
        '<div class="game-card-body">' +
          '<span class="game-card-placeholder-icon" aria-hidden="true">🚀</span>' +
          '<h3 class="game-card-name">Em Breve</h3>' +
          '<span class="game-card-subject">Novo jogo a caminho!</span>' +
        '</div>' +
      '</article>'
    );
  }

  /* ------------------------------------------------
     Lookup Utility
     ------------------------------------------------ */

  /**
   * Find a game object by its unique id slug.
   * @param {string} id - Game id (e.g., 'contando-estrelas').
   * @returns {Object|null} Game data object, or null if not found.
   */
  function findGameById(id) {
    if (!id) return null;
    for (var i = 0; i < GAME_DATA.length; i++) {
      if (GAME_DATA[i].id === id) return GAME_DATA[i];
    }
    return null;
  }

  /**
   * Render all game cards into a target grid container.
   * @param {Object} [options] - Optional configuration.
   * @param {string} [options.gridId='game-grid'] - ID of the target grid element.
   * @param {string} [options.basePath=''] - Path prefix for game hrefs (e.g. '../' from depth-1 pages).
   */
  function renderCards(options) {
    options = options || {};
    var gridId = options.gridId || 'game-grid';
    var basePath = options.basePath || '';
    var grid = document.getElementById(gridId);
    if (!grid) return;

    var html = '';
    for (var i = 0; i < GAME_DATA.length; i++) {
      html += createCard(GAME_DATA[i], basePath);
    }
    /* Append "Em Breve" placeholder as the last card */
    html += createPlaceholderCard();
    grid.innerHTML = html;
  }

  /* ------------------------------------------------
     Filter Logic
     ------------------------------------------------ */

  var activePlanet = null;

  /**
   * Filter game cards by planet slug.
   * Hides cards that don't match. Shows cards that do.
   * @param {string|null} planet - Planet slug to filter by, or null to show all.
   */
  function filterCards(planet, gridId) {
    activePlanet = planet;
    var grid = document.getElementById(gridId || 'game-grid');
    if (!grid) return;

    var cards = grid.querySelectorAll('.game-card');
    var visibleCount = 0;

    for (var i = 0; i < cards.length; i++) {
      /* Skip placeholder card — it's always visible */
      if (cards[i].classList.contains('game-card--placeholder')) {
        visibleCount++;
        continue;
      }
      var cardPlanet = cards[i].getAttribute('data-planeta');
      if (!planet || cardPlanet === planet) {
        cards[i].removeAttribute('hidden');
        visibleCount++;
      } else {
        cards[i].setAttribute('hidden', '');
      }
    }

    /* Show or hide empty state */
    updateEmptyState(grid, visibleCount);

    /* Update toolbar button state */
    updateToolbarState(planet);
  }

  /**
   * Show all cards (clear filter).
   */
  function showAll() {
    filterCards(null);
  }

  /**
   * Update the "Mostrar todos" button active/disabled state.
   * @param {string|null} planet - Currently active planet, or null for all.
   */
  function updateToolbarState(planet) {
    var btn = document.getElementById('jogos-mostrar-todos');
    if (!btn) return;

    if (planet) {
      btn.removeAttribute('disabled');
      btn.classList.remove('btn-primario--ativo');
    } else {
      btn.setAttribute('disabled', '');
      btn.classList.add('btn-primario--ativo');
    }
  }

  /**
   * Show or hide the empty state message.
   * @param {HTMLElement} grid - The #game-grid element.
   * @param {number} visibleCount - Number of visible cards.
   */
  function updateEmptyState(grid, visibleCount) {
    var emptyEl = grid.querySelector('.game-grid-empty');

    if (visibleCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'game-grid-empty';
        emptyEl.setAttribute('role', 'status');
        emptyEl.innerHTML =
          '<span class="game-grid-empty-icon" aria-hidden="true">🪐</span>' +
          '<p class="game-grid-empty-text">Nenhum jogo disponível para este planeta.</p>';
        grid.appendChild(emptyEl);
      }
      emptyEl.removeAttribute('hidden');
    } else {
      if (emptyEl) {
        emptyEl.setAttribute('hidden', '');
      }
    }
  }

  /**
   * Render the filter toolbar with a "Mostrar todos" button.
   */
  function renderToolbar() {
    var toolbar = document.getElementById('jogos-toolbar');
    if (!toolbar) return;

    toolbar.innerHTML =
      '<button id="jogos-mostrar-todos" class="btn-primario jogos-filtro-btn btn-primario--ativo" type="button" disabled>' +
        'Mostrar todos' +
      '</button>';

    toolbar.addEventListener('click', function (e) {
      var btn = e.target.closest('#jogos-mostrar-todos');
      if (btn && !btn.disabled) {
        showAll();
      }
    });
  }

  /* ------------------------------------------------
     Public API — consumed by explore page
     ------------------------------------------------ */

  window.MeuPlanetinha = window.MeuPlanetinha || {};
  window.MeuPlanetinha.games = {
    GAME_DATA: GAME_DATA,
    findGameById: findGameById,
    createCard: createCard,
    createStars: createStars,
    renderCards: renderCards,
    filterCards: filterCards,
    showAll: showAll
  };

  /* ------------------------------------------------
     Initialization
     ------------------------------------------------ */

  function init() {
    renderCards();
    renderToolbar();

    /* Listen for planet selection from carousel */
    document.addEventListener('planet-selected', function (e) {
      if (e.detail && e.detail.planet) {
        filterCards(e.detail.planet);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
