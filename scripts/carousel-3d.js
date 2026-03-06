/**
 * carousel-3d.js — 3D Orbital Planet Carousel
 * Phase 14 — Meu Planetinha v2.0
 *
 * Animation driver: Sets --orbit-angle CSS custom property on .carousel-orbit.
 * CSS transition handles smooth interpolation; all positioning is CSS 3D transforms.
 * JS manages: navigation state, zone attributes, ARIA, events.
 *
 * REPLACES: carousel.js (v1)
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Constants
     ------------------------------------------------ */

  var PLANET_COUNT = 5;
  var STEP_DEG = 72;          // 360 / 5
  var TRANSITION_MS = 600;    // matches --orbita-rotacao-duracao in base.css
  var SWIPE_THRESHOLD = 50;   // minimum px for horizontal swipe

  var PLANETS = [
    { slug: 'calculon',  name: 'Calculon',  subject: 'Matemática' },
    { slug: 'letrion',   name: 'Letrion',   subject: 'Português'  },
    { slug: 'naturox',   name: 'Naturox',   subject: 'Ciências'   },
    { slug: 'terramund', name: 'Terramund', subject: 'Geografia'  },
    { slug: 'globish',   name: 'Globish',   subject: 'Inglês'     }
  ];

  /* ------------------------------------------------
     OrbitalCarousel Class
     ------------------------------------------------ */

  function OrbitalCarousel() {
    this.section   = document.getElementById('carousel');
    if (!this.section) return;

    this.orbit     = this.section.querySelector('.carousel-orbit');
    this.scene     = this.section.querySelector('.carousel-scene');
    this.cards     = Array.prototype.slice.call(
      this.section.querySelectorAll('.planet-card')
    );
    this.dots      = Array.prototype.slice.call(
      this.section.querySelectorAll('.carousel-dot')
    );
    this.prevBtn   = this.section.querySelector('.carousel-arrow--prev');
    this.nextBtn   = this.section.querySelector('.carousel-arrow--next');
    this.announcer = this.section.querySelector('.carousel-announcer');

    this.currentIndex = 0;
    this.currentAngle = 0;  // cumulative rotation in degrees (not clamped)
    this.isAnimating  = false;
    this.touchStartX  = 0;
    this.touchStartY  = 0;

    if (!this.orbit || this.cards.length !== PLANET_COUNT) return;

    this._bindEvents();
    this._update(false); // initial state, no announcement
  }

  /* ------------------------------------------------
     navigate(direction)
     direction: +1 = next, -1 = prev
     ------------------------------------------------ */

  OrbitalCarousel.prototype.navigate = function (direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Update index (wraps 0-4)
    this.currentIndex = (this.currentIndex + direction + PLANET_COUNT) % PLANET_COUNT;

    // Update cumulative angle:
    //   direction +1 (next) → subtract STEP_DEG (rotate ring clockwise, next planet comes to front)
    //   direction -1 (prev) → add STEP_DEG (rotate ring counter-clockwise)
    this.currentAngle -= direction * STEP_DEG;

    this._update(true);

    var self = this;
    setTimeout(function () {
      self.isAnimating = false;
    }, TRANSITION_MS);
  };

  /* ------------------------------------------------
     goTo(index) — jump directly to a specific planet
     ------------------------------------------------ */

  OrbitalCarousel.prototype.goTo = function (index) {
    if (this.isAnimating) return;
    if (index < 0 || index >= PLANET_COUNT) return;
    if (index === this.currentIndex) return;

    this.isAnimating = true;

    // Calculate shortest rotation path
    var diff = index - this.currentIndex;
    // Normalize to -2..+2 range for shortest path around 5-point ring
    if (diff > 2)  diff -= PLANET_COUNT;
    if (diff < -2) diff += PLANET_COUNT;

    this.currentIndex = index;
    this.currentAngle -= diff * STEP_DEG;

    this._update(true);

    var self = this;
    setTimeout(function () {
      self.isAnimating = false;
    }, TRANSITION_MS);
  };

  /* ------------------------------------------------
     _update(announce) — THE CORE
     1. Sets --orbit-angle → CSS transition rotates the ring
     2. Sets data-orbit-zone per card → CSS handles all visual styling
     3. Updates ARIA attributes + announcer + dots
     ------------------------------------------------ */

  OrbitalCarousel.prototype._update = function (announce) {
    var ci = this.currentIndex;

    // 1. Position each card individually via --card-angle
    //    Counter-rotation in CSS keeps each card facing the viewer (billboard effect)
    // 2. Assign zones per planet and update ARIA
    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];

      // Set per-card orbital angle — CSS transition interpolates smoothly
      var cardAngle = i * STEP_DEG + this.currentAngle;
      card.style.setProperty('--card-angle', cardAngle + 'deg');

      // Calculate offset from center
      // offset 0 = center, 1 = side-right, 2 = back-right, 3 = back-left, 4 = side-left
      var offset = (i - ci + PLANET_COUNT) % PLANET_COUNT;
      var zone;
      if (offset === 0) {
        zone = 'center';
      } else if (offset === 1 || offset === PLANET_COUNT - 1) {
        zone = 'side';
      } else {
        zone = 'back';
      }

      card.setAttribute('data-orbit-zone', zone);

      // ARIA: center card focusable and visible; others hidden from AT
      if (zone === 'center') {
        card.removeAttribute('aria-hidden');
        card.setAttribute('tabindex', '0');
      } else {
        card.setAttribute('aria-hidden', 'true');
        card.setAttribute('tabindex', '-1');
      }
    }

    // 3. Update data-active-planet on section
    var activePlanet = PLANETS[ci];
    this.section.dataset.activePlanet = activePlanet.slug;

    // 4. Update dot states
    var accentVar = 'var(--planeta-' + activePlanet.slug + '-acento)';
    for (var d = 0; d < this.dots.length; d++) {
      var dot = this.dots[d];
      if (d === ci) {
        dot.classList.add('carousel-dot--active');
        dot.style.setProperty('--dot-color', accentVar);
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('carousel-dot--active');
        dot.style.removeProperty('--dot-color');
        dot.removeAttribute('aria-current');
      }
    }

    // 5. Announce to screen readers
    if (announce && this.announcer) {
      this.announcer.textContent =
        'Planeta ' + activePlanet.name + ', ' + activePlanet.subject +
        '. ' + (ci + 1) + ' de ' + PLANET_COUNT + '.';
    }
  };

  /* ------------------------------------------------
     _bindEvents() — all event handlers
     ------------------------------------------------ */

  OrbitalCarousel.prototype._bindEvents = function () {
    var self = this;

    // --- Arrow buttons ---
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function () {
        self.navigate(-1);
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function () {
        self.navigate(1);
      });
    }

    // --- Keyboard (scoped to #carousel section) ---
    this.section.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          self.navigate(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          self.navigate(1);
          break;
        case 'Home':
          e.preventDefault();
          self.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          self.goTo(PLANET_COUNT - 1);
          break;
        case 'Enter':
        case ' ':
          // Only trigger selection if focus is on the center planet card
          var focusedCard = document.activeElement;
          if (
            focusedCard &&
            focusedCard.classList.contains('planet-card') &&
            focusedCard.getAttribute('data-orbit-zone') === 'center'
          ) {
            e.preventDefault();
            self._selectPlanet(self.currentIndex);
          }
          break;
      }
    });

    // --- Touch swipe (scoped to .carousel-scene) ---
    var swipeTarget = this.scene || this.section;

    swipeTarget.addEventListener('touchstart', function (e) {
      self.touchStartX = e.changedTouches[0].clientX;
      self.touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    swipeTarget.addEventListener('touchend', function (e) {
      var deltaX = e.changedTouches[0].clientX - self.touchStartX;
      var deltaY = e.changedTouches[0].clientY - self.touchStartY;

      // Only register as horizontal swipe if horizontal dominates vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          self.navigate(1);   // swipe left → next
        } else {
          self.navigate(-1);  // swipe right → prev
        }
      }
    }, { passive: true });

    // --- Dot clicks ---
    for (var d = 0; d < this.dots.length; d++) {
      (function (dotIndex) {
        self.dots[dotIndex].addEventListener('click', function () {
          self.goTo(dotIndex);
        });
      })(d);
    }

    // --- Planet card clicks (center = select, side = navigate) ---
    for (var c = 0; c < this.cards.length; c++) {
      (function (cardIndex) {
        self.cards[cardIndex].addEventListener('click', function () {
          var zone = self.cards[cardIndex].getAttribute('data-orbit-zone');

          if (zone === 'center') {
            self._selectPlanet(self.currentIndex);
          } else if (zone === 'side') {
            // Determine direction: is this planet the next (+1) or prev (-1) side?
            var offset = (cardIndex - self.currentIndex + PLANET_COUNT) % PLANET_COUNT;
            if (offset === 1) {
              self.navigate(1);
            } else if (offset === PLANET_COUNT - 1) {
              self.navigate(-1);
            }
          }
        });
      })(c);
    }
  };

  /* ------------------------------------------------
     _selectPlanet(index) — dispatch planet-selected event + focus jogos
     ------------------------------------------------ */

  OrbitalCarousel.prototype._selectPlanet = function (index) {
    var planet = PLANETS[index];
    if (!planet) return;

    // Dispatch custom event (games.js listens for this)
    var event = new CustomEvent('planet-selected', {
      bubbles: true,
      detail: { planet: planet.slug }
    });
    this.section.dispatchEvent(event);

    // Move focus to game grid heading
    var jogosTitle = document.querySelector('#jogos .jogos-titulo');
    if (jogosTitle) {
      jogosTitle.focus();
    }
  };

  /* ------------------------------------------------
     Initialization
     ------------------------------------------------ */

  function init() {
    new OrbitalCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
