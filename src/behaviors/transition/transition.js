import { registerBehavior } from '@semantic-ui/query';
import { each } from '@semantic-ui/utils';

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
  noAnimation: 'Could not find an animation with that name.',
  repeated: 'Animation is already occurring, cancelling repeated animation',
};

const createBehavior = ({ $, el, cache, $el, self, settings, classNames, errors }) => ({
  animate(overrideSettings) {
    // shadow global settings with override settings baked in
    const settings = {
      ...settings,
      ...overrideSettings,
    };

    // handle case of already animating
    if (self.isAnimating()) {
      if (settings.queue) {
        self.queue(settings);
      }
      if (!settings.allowRepeats) {
        return;
      }
      return;
    }

    const animation = self.findCSSAnimation();
  },

  // look in css defs for a valid animation matching name
  // determine if its a transition (in/out)
  findCSSAnimation(transitionName) {
    // fast path
    const cachedAnimation = self.getCachedAnimation();
    if (cachedAnimation) {
      return cachedAnimation;
    }
    const current = {
      tag: $el.prop('tagName'),
      class: $el.attr('class'),
    };
    // add appropriate classes then check if computedStyle animationName
    // we can do this to determine if the animation exists
    const $clone = $('<' + current.tag + ' />').addClass(current.class).insertAfter(el);
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
    if (!cache.exists) {
      cache.exists = {};
    }
    cache.animationExists[name] = name;
  },
  getCachedAnimation(name) {
    return cache.animationExists[name];
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
const customInvocation = ({ self, methodName, methodArgs }) => {
  // handle
  // .transition(name, duration, callback)
  // .transition(name, callback)
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
