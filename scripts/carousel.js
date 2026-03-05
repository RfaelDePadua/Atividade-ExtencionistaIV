/**
 * carousel.js — Planet Carousel (Órbita Central)
 * Phase 5 — Meu Planetinha
 *
 * Interactive carousel with 5 themed planets.
 * Navigation: arrow buttons, keyboard ?/? (scoped), touch swipe, dot clicks.
 * Selection: center planet slug written to #carousel[data-active-planet].
 *
 * Depends on: carousel HTML in index.html (Plan 05-01)
 * Load after: homepage.js
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Constants
     ------------------------------------------------ */

  var PLANET_COUNT = 5;
  var TRANSITION_MS = 300; // matches --duracao-media in base.css
  var SWIPE_THRESHOLD = 50; // minimum px for a horizontal swipe

  var POSITION_CLASSES = [
    'planet-card--center',
    'planet-card--left',
    'planet-card--right',
    'planet-card--hidden-left',
    'planet-card--hidden-right'
  ];

  /* Planet data — order must match DOM order */
  var PLANETS = [
    { slug: 'calculon',  name: 'Calculon',  subject: 'Matemática' },
    { slug: 'letrion',   name: 'Letrion',   subject: 'Português'  },
    { slug: 'naturox',   name: 'Naturox',   subject: 'Ciências'   },
    { slug: 'terramund', name: 'Terramund', subject: 'Geografia'  },
    { slug: 'globish',   name: 'Globish',   subject: 'Inglês'     }
  ];

  /* ------------------------------------------------
     PlanetCarousel Class
     ------------------------------------------------ */

  function PlanetCarousel() {
    this.section = document.getElementById('carousel');
    if (!this.section) return;

    this.track = this.section.querySelector('.carousel-track');
    this.cards = Array.prototype.slice.call(
      this.section.querySelectorAll('.planet-card')
    );
    this.dots = Array.prototype.slice.call(
      this.section.querySelectorAll('.carousel-dot')
    );
    this.prevBtn = this.section.querySelector('.carousel-arrow--prev');
    this.nextBtn = this.section.querySelector('.carousel-arrow--next');
    this.announcer = this.section.querySelector('.carousel-announcer');

    this.currentIndex = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchStartY = 0;

    if (this.cards.length !== PLANET_COUNT) return;

    this._bindEvents();
    this._update(false); // initial state, no announcement
  }

  /* ------------------------------------------------
     Navigation
     ------------------------------------------------ */

  PlanetCarousel.prototype.navigate = function (direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex =
      (this.currentIndex + direction + PLANET_COUNT) % PLANET_COUNT;

    this._update(true);

    var self = this;
    setTimeout(function () {
      self.isAnimating = false;
    }, TRANSITION_MS);
  };

  PlanetCarousel.prototype.goTo = function (index) {
    if (this.isAnimating) return;
    if (index < 0 || index >= PLANET_COUNT) return;
    if (index === this.currentIndex) return;

    this.isAnimating = true;
    this.currentIndex = index;
    this._update(true);

    var self = this;
    setTimeout(function () {
      self.isAnimating = false;
    }, TRANSITION_MS);
  };

  /* ------------------------------------------------
     State Update
     ------------------------------------------------ */

  PlanetCarousel.prototype._update = function (announce) {
    var ci = this.currentIndex;

    /* Map each card to a position */
    var positionMap = {};
    positionMap[(ci + 0) % PLANET_COUNT] = 'planet-card--center';
    positionMap[(ci - 1 + PLANET_COUNT) % PLANET_COUNT] = 'planet-card--left';
    positionMap[(ci + 1) % PLANET_COUNT] = 'planet-card--right';
    positionMap[(ci - 2 + PLANET_COUNT) % PLANET_COUNT] = 'planet-card--hidden-left';
    positionMap[(ci + 2) % PLANET_COUNT] = 'planet-card--hidden-right';

    /* Apply position classes */
    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];

      // Remove all position classes
      for (var j = 0; j < POSITION_CLASSES.length; j++) {
        card.classList.remove(POSITION_CLASSES[j]);
      }

      // Add the correct position class
      var posClass = positionMap[i];
      if (posClass) {
        card.classList.add(posClass);
      }

      // ARIA: mark center card visible, others hidden
      if (posClass === 'planet-card--center') {
        card.removeAttribute('aria-hidden');
        card.setAttribute('tabindex', '0');
      } else {
        card.setAttribute('aria-hidden', 'true');
        card.setAttribute('tabindex', '-1');
      }
    }

    /* Update data-active-planet on section */
    var activePlanet = PLANETS[ci];
    this.section.dataset.activePlanet = activePlanet.slug;

    /* Update dots */
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

    /* Announce to screen readers */
    if (announce && this.announcer) {
      this.announcer.textContent =
        'Planeta ' + activePlanet.name + ', ' + activePlanet.subject +
        '. ' + (ci + 1) + ' de ' + PLANET_COUNT + '.';
    }
  };

  /* ------------------------------------------------
     Event Binding
     ------------------------------------------------ */

  PlanetCarousel.prototype._bindEvents = function () {
    var self = this;

    /* Arrow buttons */
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

    /* Keyboard — scoped to #carousel section */
    this.section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        self.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        self.navigate(1);
      }
    });

    /* Enter/Space on center planet = click */
    this.section.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var target = e.target;
        if (target && target.classList && target.classList.contains('planet-card') &&
            target.classList.contains('planet-card--center')) {
          e.preventDefault();
          target.click(); // triggers the click handler that dispatches planet-selected
        }
      }
    });

    /* Touch swipe — scoped to carousel track */
    if (this.track) {
      this.track.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          self.touchStartX = e.touches[0].clientX;
          self.touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      this.track.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 1) {
          var deltaX = e.changedTouches[0].clientX - self.touchStartX;
          var deltaY = e.changedTouches[0].clientY - self.touchStartY;

          // Only register horizontal swipe (X delta > Y delta)
          if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              self.navigate(1);  // swipe left ? next planet
            } else {
              self.navigate(-1); // swipe right ? prev planet
            }
          }
        }
      }, { passive: true });
    }

    /* Dot clicks */
    for (var i = 0; i < this.dots.length; i++) {
      (function (index) {
        self.dots[index].addEventListener('click', function () {
          self.goTo(index);
        });
      })(i);
    }

    /* Center planet click — set as selection (already centered, dispatch event for Phase 6) */
    for (var c = 0; c < this.cards.length; c++) {
      (function (cardIndex) {
        self.cards[cardIndex].addEventListener('click', function () {
          if (self.cards[cardIndex].classList.contains('planet-card--center')) {
            // Planet is already the active selection; dispatch custom event for Phase 6 listeners
            var event;
            try {
              event = new CustomEvent('planet-selected', {
                detail: { planet: PLANETS[cardIndex].slug },
                bubbles: true
              });
            } catch (e) {
              // IE11 fallback (unlikely but safe)
              event = document.createEvent('CustomEvent');
              event.initCustomEvent('planet-selected', true, false, {
                planet: PLANETS[cardIndex].slug
              });
            }
            self.section.dispatchEvent(event);
          }
        });
      })(c);
    }
  };

  /* ------------------------------------------------
     Initialization
     ------------------------------------------------ */

  function init() {
    new PlanetCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
