import { registerBehavior } from '@semantic-ui/query';

import css from './transition.css?raw';

const defaultSettings = {
  animation: 'fade',
  duration: 300,
  onComplete: () => {},
  onStart: () => {},
  onShow: () => {},
  onHide: () => {},
  allowRepeats: false,
  queue: true,
  useFailSafe: true,
  failSafeDelay: 100,
};

const classNames = {
  animating: 'animating',
  disabled: 'disabled',
  hidden: 'hidden',
  inward: 'in',
  outward: 'out',
  transition: 'transition',
  visible: 'visible',
};

const errors = {
  noAnimation: 'Element is no longer attached to DOM. Unable to animate.',
  repeated: 'Animation is already occurring, cancelling repeated animation',
  method: 'The method you called is not defined',
  unsupported: 'This animation is not yet supported',
};

const createBehavior = ({ $, el, $el, self, settings, classNames, errors }) => ({
  // Semantic helpers
  isVisible() {
    // Check multiple indicators of visibility
    const hasHiddenClass = $el.hasClass(classNames.hidden);
    const hasVisibleClass = $el.hasClass(classNames.visible);
    const computedStyles = $el.computedStyle();
    const isDisplayNone = computedStyles.display === 'none';
    const computedOpacity = parseFloat(computedStyles.opacity);
    const isVisibilityHidden = computedStyles.visibility === 'hidden';

    // Element is hidden if it has hidden class, display none, or visibility hidden
    if (hasHiddenClass || isDisplayNone || isVisibilityHidden) {
      return false;
    }

    // Element is visible if it has visible class or opacity > 0
    if (hasVisibleClass || computedOpacity > 0) {
      return true;
    }

    // Check if element has dimensions (like jQuery :visible)
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  isHidden() {
    return !self.isVisible();
  },

  isAnimating() {
    return $el.hasClass(classNames.animating);
  },

  isInward(direction) {
    return direction === classNames.inward;
  },

  isOutward(direction) {
    return direction === classNames.outward;
  },

  shouldUseAnimation(animation) {
    return animation.includes('fade up') || animation.includes('fade down');
  },

  getAnimationEvent(animation) {
    return self.shouldUseAnimation(animation) ? 'animationend' : 'transitionend';
  },

  parseAnimation(animationString) {
    const parts = animationString.split(' ');
    const animation = [];
    let direction = null;

    parts.forEach(part => {
      if (part === classNames.inward || part === classNames.outward) {
        direction = part;
      }
      else {
        animation.push(part);
      }
    });

    // Auto-detect direction based on current visibility if not specified
    if (!direction) {
      direction = self.isVisible() ? classNames.outward : classNames.inward;
    }

    return {
      animation: animation.join(' '),
      direction,
      isInward: self.isInward(direction),
      isOutward: self.isOutward(direction),
    };
  },

  getAnimationEventType() {
    return self.getAnimationEvent(settings.animation);
  },

  animate(animationString) {
    // Parse animation string
    const { animation, direction, isInward, isOutward } = self.parseAnimation(animationString || settings.animation);

    // Check if already animating
    if (self.isAnimating() && !settings.allowRepeats) {
      console.error(errors.repeated);
      return;
    }

    // Clear any existing animation classes
    self.reset();

    // Add base transition class
    $el.addClass(classNames.transition);

    // Force reflow to ensure starting styles are applied
    el.offsetHeight;

    // Set up animation end handler
    const animationEvent = self.getAnimationEventType();
    const handleComplete = () => {
      self.complete(isInward);
    };

    // Add fail-safe timer
    let failSafeTimer;
    if (settings.useFailSafe) {
      failSafeTimer = setTimeout(() => {
        handleComplete();
      }, settings.duration + settings.failSafeDelay);
    }

    // Set up event handler with cleanup
    const abortController = new AbortController();
    $el.one(animationEvent, () => {
      clearTimeout(failSafeTimer);
      handleComplete();
    }, { signal: abortController.signal });

    // Store abort controller for cleanup
    self.abortController = abortController;

    // Add animation classes
    requestAnimationFrame(() => {
      $el.addClass(classNames.animating);
      $el.addClass(animation);
      $el.addClass(direction);

      // Call start callback
      settings.onStart.call(el);

      // Remove hidden class if showing
      if (isInward) {
        $el.removeClass(classNames.hidden);
        $el.addClass(classNames.visible);
      }
    });
  },

  complete(wasInward) {
    // Remove animating class
    $el.removeClass(classNames.animating);

    // Handle visibility
    if (wasInward) {
      $el.addClass(classNames.visible);
      $el.removeClass(classNames.hidden);
      settings.onShow.call(el);
    }
    else {
      $el.addClass(classNames.hidden);
      $el.removeClass(classNames.visible);
      settings.onHide.call(el);
    }

    // Call complete callback
    settings.onComplete.call(el);

    // Clean up abort controller
    if (self.abortController) {
      self.abortController.abort();
      self.abortController = null;
    }
  },

  reset() {
    // Remove all animation classes
    $el.removeClass(classNames.animating);
    $el.removeClass(classNames.inward);
    $el.removeClass(classNames.outward);

    // Remove specific animation classes
    const animationClasses = ['fade', 'up', 'down'];
    animationClasses.forEach(cls => $el.removeClass(cls));

    // Abort any pending animations
    if (self.abortController) {
      self.abortController.abort();
      self.abortController = null;
    }
  },

  show() {
    self.animate(`${settings.animation} ${classNames.inward}`);
  },

  hide() {
    self.animate(`${settings.animation} ${classNames.outward}`);
  },

  toggle() {
    if (self.isVisible()) {
      self.hide();
    }
    else {
      self.show();
    }
  },

  stop() {
    self.reset();
    $el.removeClass(classNames.transition);
  },

  // Method not found, but they passed a string - assume it's an animation
  handleCustomInvocation(methodName) {
    // This allows $('.element').transition('fade in') syntax
    // Only update settings.animation if it's actually an animation, not a method name
    const knownMethods = ['show', 'hide', 'toggle', 'stop', 'reset'];

    if (!knownMethods.includes(methodName)) {
      // It's an animation string, update settings and animate
      settings.animation = methodName;
      self.animate(methodName);
    }
    else {
      // This shouldn't happen since registerBehavior should have found the method
      console.warn(`Method ${methodName} exists but wasn't called properly`);
    }
  },
});

// Handle string invocations like .transition('fade in')
const customInvocation = ({ $el, methodName, methodArgs }) => {
  const instance = $el.el()?.transition;
  if (instance && instance.handleCustomInvocation) {
    return instance.handleCustomInvocation(methodName, ...methodArgs);
  }
};

export const Transition = registerBehavior({
  name: 'transition',
  namespace: 'transition',
  defaultSettings,
  classNames,
  errors,
  createBehavior,
  customInvocation,
  css,
});
