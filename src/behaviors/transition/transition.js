import { registerBehavior } from '@semantic-ui/query';
import { each } from '@semantic-ui/utils';

import css from './transition.css?raw';

const defaultSettings = {
  animation: 'fade',
  duration: 'auto',
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
  noAnimation: 'Could not find an animation with that name.',
  repeated: 'Animation is already occurring, cancelling repeated animation',
};

const createBehavior = ({ $, el, cache, $el, self, settings, classNames, errors }) => ({
  animate(overrideSettings) {
    // shadow global settings with override settings baked in
    const animateSettings = {
      ...settings,
      ...overrideSettings,
    };

    // handle case of already animating
    if (self.isAnimating()) {
      if (animateSettings.queue) {
        self.queue(settings);
      }
      if (!animateSettings.allowRepeats) {
        return;
      }
      return;
    }

    const animation = self.findCSSAnimation();
    console.log('animation is', animation);
  },

  // look in css defs for a valid animation matching name
  // determine if its a transition (in/out)
  findCSSAnimation(transitionName) {
    // fast path
    const cachedAnimation = self.getCachedAnimation(transitionName);
    if (cachedAnimation) {
      return cachedAnimation;
    }

    const current = {
      tag: $el.prop('tagName'),
      class: $el.attr('class'),
    };

    // add appropriate classes then check if computedStyle animationName
    // we can do this to determine if the animation exists
    const $clone = $('<' + current.tag + ' />').addClass(current.class);

    // add to DOM to probe rules
    $clone
      .addClass(transitionName)
      .addClass(classNames.transition)
      .addClass(classNames.animating)
      .insertAfter(el);

    // Check base state animations
    const baseAnimations = $clone.el().getAnimations();

    // Add directional class and check if CSS transitions start
    $clone.addClass(classNames.inward);
    const inAnimations = $clone.el().getAnimations();
    const activeTransitions = inAnimations.filter(anim => anim instanceof CSSTransition);

    const animation = {
      exists: baseAnimations.length > 0 || activeTransitions.length > 0,
      directional: activeTransitions.length > 0,
    };

    // cleanup
    $clone.remove();

    // cache result
    self.setCachedAnimation(transitionName, animation);

    return animation;
  },

  prepareAnimation() {
  },

  startAnimation() {
  },

  endAnimation() {
  },

  queue(settings) {
  },

  hide() {
  },
  removeAnimation() {
  },

  setCachedAnimation(name, exists) {
    if (!cache.animationExists) {
      cache.animationExists = {};
    }
    cache.animationExists[name] = name;
  },
  getCachedAnimation(name) {
    return cache?.animationExists[name];
  },

  isAnimating() {
    return $el.hasClass(classNames.animating);
  },
  isInward() {
    return $el.hasClass(classNames.inward);
  },
  isOutward() {
    return $el.hasClass(classNames.outward);
  },
  isLooping() {
    return $el.hasClass(classNames.looping);
  },
});

// Handle string invocations like .transition('fade in')
// transition is overloaded to handle a simpler invocation pattern

const customInvocation = ({ self, methodName, methodArgs }) => {
  const [durationOrCallback, callback] = methodArgs;
  let settings = { animation: methodName };

  // .transition(animationName, callback)
  if (typeof durationOrCallback === 'function') {
    settings.onComplete = durationOrCallback;
  }
  // .transition(animationName, duration, callback)
  else if (durationOrCallback !== undefined) {
    settings.duration = durationOrCallback;
    if (typeof callback === 'function') {
      settings.onComplete = callback;
    }
  }

  // call animate with constructed settings
  return self.animate(settings);
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
