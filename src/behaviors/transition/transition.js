import { registerBehavior } from '@semantic-ui/query';
import { each } from '@semantic-ui/utils';

import css from './transition.css?raw';

const defaultSettings = {
  // css animation to use
  animation: 'fade',

  // duration to use 'auto' will default to the value set in css
  duration: 'auto',

  // callbacks
  onComplete: () => {},
  onStart: () => {},
  onShow: () => {},
  onHide: () => {},

  // whether directional animations can occur twice in same direction
  allowRepeats: false,

  // queue will queue directional transitions after previous transition on same element
  // i.e. .transition('fade').transition('fade')
  queue: true,

  // failsafe makes sure animation is cleaned up even if event doesnt fire
  useFailSafe: true,
  failSafeDelay: 100,

  // whether to use javascript to animate instead of class names
  useJavascript: true,
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

    const animation = self.findCSSAnimation(animateSettings.animation);
    console.log('animation is', animation);
  },

  // look in css defs for a valid animation matching name
  // determine if its a transition (in/out)
  findCSSAnimation(animationName) {
    // fast path
    const cachedAnimation = self.getCachedAnimation(animationName);
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
      .addClass(animationName)
      .addClass(classNames.transition)
      .addClass(classNames.animating)
      .insertAfter(el);

    // Check base state animations
    const baseKeyframes = self.extractAnimationKeyframes($clone);

    // Add directional class and check if CSS transitions start
    $clone.addClass(classNames.inward);
    const inKeyframes = self.extractAnimationKeyframes($clone, 'in');

    // Check outward animations
    $clone.removeClass(classNames.inward).addClass(classNames.outward);
    const outKeyframes = self.extractAnimationKeyframes($clone, 'out');

    const hasDirectionalAnimations = inKeyframes.length > 0 || outKeyframes.length > 0;
    const hasBaseAnimations = baseKeyframes.length > 0;

    const animation = {
      exists: hasBaseAnimations || hasDirectionalAnimations,
      directional: hasDirectionalAnimations,
      keyframes: {
        base: baseKeyframes,
        in: inKeyframes,
        out: outKeyframes,
      },
    };
    console.log(animation);

    // cleanup
    $clone.remove();

    // cache result
    self.setCachedAnimation(animationName, animation);

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

  // set cached keyframes and animation data
  setCachedAnimation(name, animation) {
    if (!cache.animationExists) {
      cache.animationExists = {};
    }
    cache.animationExists[name] = animation;
  },

  // retrieve cached keyframes and animation data
  getCachedAnimation(name) {
    return cache?.animationExists?.[name];
  },

  extractAnimationKeyframes($element, direction = null) {
    const animations = $element.el().getAnimations();

    // extract keyframe data (it might be an animation or transition)
    const keyframes = animations.map(anim => {
      if (anim instanceof CSSAnimation) {
        return {
          type: 'animation',
          direction,
          keyframes: anim.effect.getKeyframes(),
          timing: anim.effect.getTiming(),
          animationName: anim.animationName,
        };
      }
      else if (anim instanceof CSSTransition) {
        return {
          type: 'transition',
          direction,
          keyframes: anim.effect.getKeyframes(),
          timing: anim.effect.getTiming(),
          propertyName: anim.transitionProperty,
        };
      }
      return null;
    }).filter(Boolean);

    // Cancel animations for cleanup
    each(animations, (animation) => animation.cancel());

    return keyframes;
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
