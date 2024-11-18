class ScrollNav {
  constructor(element, options = {}) {
    if (!(element instanceof Element)) {
      throw new Error('ScrollNav requires a DOM element');
    }

    // Store element reference
    this.element = element;

    // Configuration with defaults
    this.options = {
      deltaThreshold: 5,
      velocityThreshold: 15,
      hideClass: 'hidden',
      ...options
    };

    // State
    this.lastScrollY = window.scrollY;
    this.currentScrollY = window.scrollY;
    this.isVisible = true;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.ticking = false;

    // Bind methods
    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);

    // Initialize
    this.init();
  }

  init() {
    // Initial state
    this.show();

    // Attach scroll listener using passive event for performance
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll() {
    this.currentScrollY = window.scrollY;

    // Only request animation frame if we're not already processing one
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }

    // Reset scroll end timer
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  }

  update() {
    // Calculate delta and velocity
    const delta = this.currentScrollY - this.lastScrollY;
    const velocity = Math.abs(delta);

    // Only trigger if we've crossed our thresholds
    if (velocity > this.options.velocityThreshold &&
        Math.abs(delta) > this.options.deltaThreshold) {
      if (delta > 0) {  // Scrolling down
        this.hide();
      } else {  // Scrolling up
        this.show();
      }
    }

    // Update state for next frame
    this.lastScrollY = this.currentScrollY;
    this.ticking = false;
  }

  show() {
    if (!this.isVisible) {
      this.element.classList.remove(this.options.hideClass);
      this.isVisible = true;
    }
  }

  hide() {
    if (this.isVisible) {
      this.element.classList.add(this.options.hideClass);
      this.isVisible = false;
    }
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    clearTimeout(this.scrollTimeout);
  }
}

export { ScrollNav };
