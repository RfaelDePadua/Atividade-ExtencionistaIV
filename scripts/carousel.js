/**
 * Space Carousel - Planet Navigation for Meu Planetinha
 * Handles subject selection via interactive planet carousel
 */

class PlanetCarousel {
  constructor() {
    this.currentIndex = 0;
    this.planets = [];
    this.track = null;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.track = document.querySelector('.carousel-track');
    if (!this.track) return;

    this.planets = Array.from(document.querySelectorAll('.planet-card'));
    if (this.planets.length === 0) return;

    this.setupEventListeners();
    this.updatePlanetStates();
    this.updateDots();
  }

  setupEventListeners() {
    // Navigation arrows
    const leftArrow = document.querySelector('.carousel-nav.left');
    const rightArrow = document.querySelector('.carousel-nav.right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', () => this.navigate(-1));
    }
    
    if (rightArrow) {
      rightArrow.addEventListener('click', () => this.navigate(1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigate(1);
      }
    });

    // Planet clicks
    this.planets.forEach((planet, index) => {
      planet.addEventListener('click', () => {
        if (index === this.currentIndex) {
          // Clicked center planet - select/filter games
          this.selectPlanet(planet);
        } else {
          // Navigate to this planet
          const direction = index > this.currentIndex ? 1 : -1;
          const steps = Math.abs(index - this.currentIndex);
          for (let i = 0; i < steps; i++) {
            setTimeout(() => this.navigate(direction), i * 200);
          }
        }
      });
    });

    // Navigation dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (index !== this.currentIndex) {
          const direction = index > this.currentIndex ? 1 : -1;
          const steps = Math.abs(index - this.currentIndex);
          for (let i = 0; i < steps; i++) {
            setTimeout(() => this.navigate(direction), i * 200);
          }
        }
      });
    });

    // Touch/swipe support
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  navigate(direction) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    
    // Update index with wrapping
    this.currentIndex += direction;
    
    if (this.currentIndex < 0) {
      this.currentIndex = this.planets.length - 1;
    } else if (this.currentIndex >= this.planets.length) {
      this.currentIndex = 0;
    }

    this.updatePlanetStates();
    this.updateDots();
    
    // Clear any previous selection when navigating
    this.planets.forEach(p => p.classList.remove('selected'));
    this.filterGames(null); // Show all games

    setTimeout(() => {
      this.isAnimating = false;
    }, 600); // Match CSS transition duration
  }

  updatePlanetStates() {
    const totalPlanets = this.planets.length;
    
    this.planets.forEach((planet, index) => {
      // Remove all position classes
      planet.classList.remove('center', 'left', 'right', 'hidden');
      
      if (index === this.currentIndex) {
        // Center planet
        planet.classList.add('center');
      } else if (index === (this.currentIndex - 1 + totalPlanets) % totalPlanets) {
        // Left planet (wraps around)
        planet.classList.add('left');
      } else if (index === (this.currentIndex + 1) % totalPlanets) {
        // Right planet (wraps around)
        planet.classList.add('right');
      } else {
        // Hidden planets
        planet.classList.add('hidden');
      }
    });
  }

  updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  selectPlanet(planetCard) {
    const subject = planetCard.dataset.subject;
    
    // Toggle selection
    const wasSelected = planetCard.classList.contains('selected');
    
    // Remove selection from all planets
    this.planets.forEach(p => p.classList.remove('selected'));
    
    if (wasSelected) {
      // Deselect - show all games
      this.filterGames(null);
    } else {
      // Select this planet - filter games
      planetCard.classList.add('selected');
      this.filterGames(subject);
    }
  }

  filterGames(subject) {
    const gameSections = document.querySelectorAll('.secao-de-jogos');
    
    if (!subject) {
      // Show all sections
      gameSections.forEach(section => {
        section.style.display = 'block';
        // Fade in animation
        section.style.opacity = '0';
        setTimeout(() => {
          section.style.transition = 'opacity 0.4s ease';
          section.style.opacity = '1';
        }, 10);
      });
      return;
    }

    // Filter sections by subject
    gameSections.forEach(section => {
      const categoryTitle = section.querySelector('.categoria-jgs');
      if (!categoryTitle) return;

      const category = categoryTitle.textContent.toLowerCase().trim();
      const shouldShow = this.matchesSubject(category, subject);

      if (shouldShow) {
        section.style.display = 'block';
        section.style.opacity = '0';
        setTimeout(() => {
          section.style.transition = 'opacity 0.4s ease';
          section.style.opacity = '1';
        }, 10);
      } else {
        section.style.transition = 'opacity 0.3s ease';
        section.style.opacity = '0';
        setTimeout(() => {
          section.style.display = 'none';
        }, 300);
      }
    });
  }

  matchesSubject(category, subject) {
    const subjectMap = {
      'matematica': ['matemática', 'math'],
      'portugues': ['português', 'portuguese', 'portugues'],
      'geometria': ['geometria', 'geometry'],
      'ciencias': ['ciências', 'ciencias', 'science']
    };

    const keywords = subjectMap[subject] || [subject];
    return keywords.some(keyword => category.includes(keyword));
  }

  handleSwipe() {
    const swipeThreshold = 50; // minimum distance for swipe
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go right
        this.navigate(1);
      } else {
        // Swiped right - go left
        this.navigate(-1);
      }
    }
  }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PlanetCarousel();
  });
} else {
  new PlanetCarousel();
}
