/**
 * homepage.js — Meu Planetinha Homepage Behaviors
 *
 * 1. Scroll-triggered header: toggles .site-nav--scrolled after 80px scroll.
 * 2. CTA intercept: .nav-cta clicks smooth-scroll to #carousel on homepage.
 *
 * Loaded only on index.html, after components.js.
 */

(function () {
  'use strict';

  var SCROLL_THRESHOLD = 80;
  var SCROLLED_CLASS = 'site-nav--scrolled';

  /**
   * Initialize once the nav element is available in the DOM.
   * components.js injects synchronously, so the nav should exist
   * by the time this script runs. We use DOMContentLoaded as a
   * safety net.
   */
  function init() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    // --- 1. Scroll-triggered header background ---
    var isScrolled = false;

    function onScroll() {
      var shouldBeScrolled = window.scrollY > SCROLL_THRESHOLD;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        if (isScrolled) {
          nav.classList.add(SCROLLED_CLASS);
        } else {
          nav.classList.remove(SCROLLED_CLASS);
        }
      }
    }

    // Check initial scroll position (e.g., page reload mid-scroll)
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- 2. CTA intercept: smooth-scroll to #carousel ---
    var carouselSection = document.getElementById('carousel');
    if (!carouselSection) return;

    // Use event delegation on the nav to catch all .nav-cta clicks
    // (both desktop and mobile overlay CTAs)
    var navWrapper = document.querySelector('[data-component="nav"]');
    if (!navWrapper) return;

    navWrapper.addEventListener('click', function (e) {
      var ctaLink = e.target.closest('.nav-cta');
      if (!ctaLink) return;

      e.preventDefault();
      carouselSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile overlay if open
      var overlay = document.querySelector('.nav-overlay');
      if (overlay && overlay.classList.contains('is-open')) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        var hamburger = document.querySelector('.nav-hamburger');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Run init on DOMContentLoaded (safety net for component injection timing)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
