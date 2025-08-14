import { registerBehavior } from '@semantic-ui/query';
import { each, isEmpty } from '@semantic-ui/utils';

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
  // track currently running JavaScript animations
  currentAnimations: [],

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

    if (animateSettings.useJavascript) {
      const direction = self.determineAnimationType(animateSettings.animation, animation);
      console.log('doing animation', direction, animation);
      self.playAnimation(animation, direction, animateSettings);
    }
    else {
      // TODO: CSS class approach
    }
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
    const animations = {};

    // add to DOM to probe rules
    $clone
      .addClass(animationName)
      .addClass(classNames.transition)
      .addClass(classNames.animating)
      .insertAfter(el);

    // Check base state animations
    animations.standard = self.extractAnimations($clone)[0];

    // Add directional class and check if CSS transitions start
    $clone.addClass(classNames.inward);
    animations.in = self.extractAnimations($clone, 'in')[0];

    // Check outward animations
    $clone.removeClass(classNames.inward).addClass(classNames.outward);
    animations.out = self.extractAnimations($clone, 'out')[0];

    const animation = {
      name: animationName,
      exists: !isEmpty(animations),
      directional: (animations.in || animations.out),
      animations,
    };

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

  extractAnimations($element, direction = null) {
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

  determineAnimationType(animationName, animation) {
    // Check if animation name explicitly contains direction
    if (animationName.includes(` ${classNames.inward}`)) {
      return 'in';
    }
    if (animationName.includes(` ${classNames.outward}`)) {
      return 'out';
    }

    // Determine based on current visibility using Query.js isVisible()
    const isCurrentlyVisible = $el.isVisible({
      includeOpacity: true,
    });
    return isCurrentlyVisible ? classNames.outward : classNames.inward;
  },

  async playAnimation(animation, direction, settings) {
    // Clean up any existing animations first
    self.cleanupAnimations();

    if (!animation || !animation.exists) {
      console.warn('No animation data available for', settings.animation);
      return;
    }

    // find animation for this particular direction
    animation = animation.animations[direction] ?? animation.animations.standard;

    if (!animation) {
      return;
    }

    // Set display state BEFORE animation starts so it's visible
    self.setInitialDisplayState(direction);

    settings.onStart.call(el);

    // Create and start animations
    const options = {
      ...animation.timing,
      fill: 'both', // Maintain final state
    };

    // Override duration if specified in settings
    if (settings.duration !== 'auto') {
      options.duration = settings.duration;
    }

    const activeAnimation = el.animate(animation.keyframes, options);
    self.currentAnimations.push(activeAnimation);

    // Handle completion
    await activeAnimation.finished;

    // Set final display state based on direction
    self.setFinalDisplayState(direction);

    // Handle show/hide callbacks based on direction
    if (direction === 'in') {
      settings.onShow.call(el);
    }
    else if (direction === 'out') {
      settings.onHide.call(el);
    }
    settings.onComplete.call(el);
  },

  setInitialDisplayState(direction) {
    if (direction === 'in') {
      // Show: remove hidden class, add visible class, set natural display type BEFORE animation
      $el.removeClass(classNames.hidden);
      $el.addClass(classNames.visible);
      const displayType = $el.naturalDisplay();
      $el.css('display', displayType);
    }
    // For 'out' direction, element should already be visible, no change needed
  },

  setFinalDisplayState(direction) {
    if (direction === 'out') {
      // Hide: remove visible class, set display none inline, add hidden class AFTER animation
      $el.removeClass(classNames.visible);
      $el.css('display', 'none'); // Force display none inline since we're not using CSS classes for styling
      $el.addClass(classNames.hidden);
    }
    // For 'in' direction, element should stay visible, no change needed
  },

  cleanupAnimations() {
    self.currentAnimations.forEach(animation => {
      if (animation.playState !== 'finished') {
        animation.cancel();
      }
    });
    self.currentAnimations = [];
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
