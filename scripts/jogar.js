/**
 * jogar.js — Meu Planetinha Game Shell Controller
 * Phase 17 — Game Shell & Iframe Sandbox
 *
 * Handles URL routing (?game=<id>), iframe loading, loading overlay
 * lifecycle (postMessage + timeout), error state, and shell controls
 * (back, mute, fullscreen).
 *
 * Depends on: games.js (MeuPlanetinha.games.findGameById, GAME_DATA)
 * Load after: components.js, games.js
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Constants
     ------------------------------------------------ */

  var LOADING_TIMEOUT_MS = 5000;    // Fallback timeout to dismiss loading overlay
  var FADE_DURATION_MS = 400;        // Loading overlay fade-out duration
  var IDLE_TIMEOUT_MS = 3000;        // Controls auto-fade after inactivity

  /* ------------------------------------------------
     DOM References (cached on init)
     ------------------------------------------------ */

  var els = {};  // Populated in init()

  /* ------------------------------------------------
     Utility: Resolve base URL
     Derives the project root URL from this script's own src attribute.
     ------------------------------------------------ */

  function getBaseURL() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      var idx = src.indexOf('scripts/jogar.js');
      if (idx !== -1) {
        return src.substring(0, idx);
      }
    }
    // Fallback: use location-based root
    var path = location.pathname;
    var jogosIdx = path.lastIndexOf('jogos/');
    if (jogosIdx !== -1) {
      return location.origin + path.substring(0, jogosIdx);
    }
    return '';
  }

  /* ------------------------------------------------
     URL Routing — parse ?game= parameter
     ------------------------------------------------ */

  function getGameIdFromURL() {
    var params = new URLSearchParams(location.search);
    return params.get('game');
  }

  /* ------------------------------------------------
     Games API Access
     ------------------------------------------------ */

  function getGamesAPI() {
    return window.MeuPlanetinha && window.MeuPlanetinha.games;
  }

  /* ------------------------------------------------
     Loading Overlay
     ------------------------------------------------ */

  var loadingTimeout = null;

  /**
   * Customize loading overlay with game-specific info.
   * Sets planet color theme and game name on the overlay.
   */
  function personalizeLoading(game) {
    if (!els.loading) return;

    // Set planet theme for CSS color variants
    els.loading.setAttribute('data-planeta', game.planet);

    // Set game name in title
    if (els.loadingTitle) {
      els.loadingTitle.textContent = game.name;
    }
    if (els.loadingSubtitle) {
      els.loadingSubtitle.textContent = 'Preparando a aventura...';
    }
  }

  /**
   * Dismiss the loading overlay with a fade-out animation.
   * Removes the overlay from the DOM after the transition completes.
   */
  function dismissLoading() {
    if (!els.loading) return;
    if (els.loading.classList.contains('is-dismissing')) return; // Already dismissing

    // Clear the fallback timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      loadingTimeout = null;
    }

    // Start fade-out
    els.loading.classList.add('is-dismissing');

    // Remove from DOM after transition
    setTimeout(function () {
      if (els.loading && els.loading.parentNode) {
        els.loading.parentNode.removeChild(els.loading);
      }
    }, FADE_DURATION_MS + 50); // Small buffer past CSS transition
  }

  /**
   * Start the loading timeout fallback.
   * If postMessage('game-ready') isn't received within LOADING_TIMEOUT_MS,
   * the overlay is dismissed silently.
   */
  function startLoadingTimeout() {
    loadingTimeout = setTimeout(function () {
      dismissLoading();
    }, LOADING_TIMEOUT_MS);
  }

  /* ------------------------------------------------
     postMessage Listener
     ------------------------------------------------ */

  function setupPostMessageListener() {
    window.addEventListener('message', function (event) {
      if (event.data === 'game-ready') {
        dismissLoading();
      }
    });
  }

  /* ------------------------------------------------
     Error State
     ------------------------------------------------ */

  function showError() {
    // Hide loading overlay immediately (no fade)
    if (els.loading) {
      els.loading.style.display = 'none';
    }

    // Show error state
    if (els.error) {
      els.error.removeAttribute('hidden');
    }

    // Keep iframe and controls hidden
    // Update page title
    document.title = 'Jogo não encontrado — Meu Planetinha';
  }

  /* ------------------------------------------------
     Iframe Loading
     ------------------------------------------------ */

  function loadGame(game) {
    var baseURL = getBaseURL();
    var gameSrc = baseURL + game.path;

    // Show iframe
    if (els.iframe) {
      els.iframe.removeAttribute('hidden');
      els.iframe.src = gameSrc;
    }

    // Show controls
    if (els.controls) {
      els.controls.removeAttribute('hidden');
    }

    // Update page title with game name
    document.title = game.name + ' — Meu Planetinha';

    // Start the loading timeout
    startLoadingTimeout();
  }

  /* ------------------------------------------------
     Shell Controls
     ------------------------------------------------ */

  var isMuted = false;
  var idleTimer = null;

  /**
   * Set up back button — uses history.back().
   */
  function setupBackButton() {
    var btn = els.btnBack;
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (history.length > 1) {
        history.back();
      } else {
        // Fallback: go to explore page
        location.href = '../explorar/explorar.html';
      }
    });
  }

  /**
   * Set up mute toggle — sends postMessage to iframe.
   */
  function setupMuteButton() {
    var btn = els.btnMute;
    var icon = els.iconMute;
    if (!btn || !icon) return;

    btn.addEventListener('click', function () {
      isMuted = !isMuted;

      // Update icon
      icon.className = isMuted
        ? 'bi bi-volume-mute-fill'
        : 'bi bi-volume-up-fill';

      // Update aria-label
      btn.setAttribute('aria-label', isMuted ? 'Ativar áudio' : 'Silenciar áudio');
      btn.setAttribute('title', isMuted ? 'Ativar áudio' : 'Silenciar');

      // Send mute message to game iframe
      if (els.iframe && els.iframe.contentWindow) {
        els.iframe.contentWindow.postMessage(
          { type: 'mute', muted: isMuted },
          '*'
        );
      }
    });
  }

  /**
   * Set up fullscreen toggle for the iframe element.
   * Uses the Fullscreen API with vendor prefix fallback.
   */
  function setupFullscreenButton() {
    var btn = els.btnFullscreen;
    var icon = els.iconFullscreen;
    if (!btn) return;

    // Check if Fullscreen API is available
    var fsEnabled = document.fullscreenEnabled
      || document.webkitFullscreenEnabled
      || false;

    if (!fsEnabled) {
      // Hide the button if fullscreen is not supported
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', function () {
      // Fullscreen the viewport (not just the iframe) so shell controls stay visible
      // and the game's legacy nav/header isn't the only thing on screen.
      var target = els.viewport || els.iframe;
      if (!target) return;

      var isFullscreen = document.fullscreenElement
        || document.webkitFullscreenElement;

      if (isFullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        // Enter fullscreen
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        }
      }
    });

    // Listen for fullscreen change to toggle icon
    function onFullscreenChange() {
      var isFs = document.fullscreenElement || document.webkitFullscreenElement;
      if (icon) {
        icon.className = isFs ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
      }
      if (btn) {
        btn.setAttribute('aria-label', isFs ? 'Sair da tela cheia' : 'Tela cheia');
        btn.setAttribute('title', isFs ? 'Sair da tela cheia' : 'Tela cheia');
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  }

  /**
   * Auto-fade controls after period of inactivity.
   * Controls become semi-transparent (via .is-idle CSS class).
   * Any mouse movement or touch restores full opacity.
   */
  function setupControlsIdleFade() {
    if (!els.controls) return;

    function resetIdle() {
      els.controls.classList.remove('is-idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        els.controls.classList.add('is-idle');
      }, IDLE_TIMEOUT_MS);
    }

    // Start the idle timer
    resetIdle();

    // Reset on any interaction
    document.addEventListener('mousemove', resetIdle, { passive: true });
    document.addEventListener('touchstart', resetIdle, { passive: true });
    document.addEventListener('keydown', resetIdle, { passive: true });
  }

  /* ------------------------------------------------
     Initialization
     ------------------------------------------------ */

  function init() {
    // Cache DOM elements
    els.loading = document.getElementById('jogar-loading');
    els.loadingTitle = document.getElementById('jogar-loading-title');
    els.loadingSubtitle = document.getElementById('jogar-loading-subtitle');
    els.error = document.getElementById('jogar-erro');
    els.iframe = document.getElementById('game-iframe');
    els.controls = document.getElementById('jogar-controls');
    els.btnBack = document.getElementById('btn-back');
    els.btnMute = document.getElementById('btn-mute');
    els.iconMute = document.getElementById('icon-mute');
    els.btnFullscreen = document.getElementById('btn-fullscreen');
    els.iconFullscreen = document.getElementById('icon-fullscreen');
    els.viewport = document.getElementById('main-content');

    // Get game ID from URL
    var gameId = getGameIdFromURL();

    // No ?game= parameter — redirect to explore page
    if (!gameId) {
      location.replace('../explorar/explorar.html');
      return;
    }

    // Look up game in GAME_DATA
    var api = getGamesAPI();
    if (!api || !api.findGameById) {
      console.error('[jogar.js] games.js API not available');
      showError();
      return;
    }

    var game = api.findGameById(gameId);

    // Invalid game ID — show error state
    if (!game) {
      showError();
      return;
    }

    // Valid game — personalize loading overlay and load the game
    personalizeLoading(game);
    setupPostMessageListener();
    loadGame(game);

    // Set up shell controls
    setupBackButton();
    setupMuteButton();
    setupFullscreenButton();
    setupControlsIdleFade();
  }

  // Run on DOMContentLoaded (safety net — scripts load synchronously)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
