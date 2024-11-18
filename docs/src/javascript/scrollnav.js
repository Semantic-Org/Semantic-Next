class ScrollNav {
  constructor(element, options = {}) {
    if (!(element instanceof Element)) {
      throw new Error('ScrollNav requires a DOM element');
    }

    // Store element reference
    this.element = element;

    // Configuration with defaults
    this.options = {
      hideThreshold: 5,
      showThreshold: 15,
      hideVelocity: 10,
      showVelocity: 20,
      hideClass: 'hidden',
      ...options
    };

    // State
    this.lastScrollY = window.scrollY;
    this.currentScrollY = window.scrollY;
    this.isVisible = true;
    this.ticking = false;

    // Bind methods
    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);

    // Initialize
    this.init();
  }

  init() {
    this.show();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll() {
    this.currentScrollY = window.scrollY;

    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  }

  update() {
    const delta = this.currentScrollY - this.lastScrollY;
    const velocity = Math.abs(delta);

    if (delta > 0) {  // Scrolling down
      if (velocity > this.options.hideVelocity &&
          Math.abs(delta) > this.options.hideThreshold) {
        this.hide();
      }
    } else {  // Scrolling up
      if (velocity > this.options.showVelocity &&
          Math.abs(delta) > this.options.showThreshold) {
        this.show();
      }
    }

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
  }
}
export { ScrollNav };
