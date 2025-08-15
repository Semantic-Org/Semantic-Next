import { registerBehavior } from '@semantic-ui/query';
import { each, noop } from '@semantic-ui/utils';

import css from './transition.css?raw';

const defaultSettings = {
  // css animation to use
  animation: 'fade',

  // duration to use 'auto' will default to the value set in css
  duration: 'auto',

  // delay between animations when animating a group of elements
  interval: 200,

  // direction of animation when animating groups (forward for in, reverse for out)
  groupDirection: 'auto',

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

const createBehavior = ({ $, el, cache, $el, self, settings, classNames, errors, index, total }) => ({
  // track currently running JavaScript animations
  currentAnimations: [],

  initialize() {
    this.animate();
  },

  // animate can override at runtime with different duration, animation or callback
  animate(runtimeSettings) {
    const animationSettings = {
      ...settings,
      ...runtimeSettings,
    };

    // handle case of already animating
    if (self.isAnimating()) {
      if (animationSettings.queue) {
        self.queue(settings);
      }
      if (!animationSettings.allowRepeats) {
        return;
      }
      return;
    }

    // determine canonical animations from css, this is cached between runs
    const cssAnimations = self.findCSSAnimation(animationSettings.animation);

    // determine which direction this animation is occuring if the animation is directional
    let direction;
    if (cssAnimations.directional) {
      direction = self.determineDirection(animationSettings.animation);
    }

    if (animationSettings.useJavascript) {
      if (total > 0) {
        self.playGroupAnimation(cssAnimations, direction, animationSettings);
      }
      else {
        self.performAnimation(cssAnimations, direction, animationSettings);
      }
    }
    else {
      // TODO: CSS class approach
    }
  },

  playGroupAnimation(cssAnimations, direction, animationSettings) {
    let groupDirection = (settings.groupDirection == 'auto')
      ? (direction == 'in')
        ? 'forward'
        : 'reverse'
      : settings.groupDirection;

    const delay = (groupDirection == 'forward')
      ? index * settings.interval
      : (total - index) * settings.interval;
    setTimeout(() => {
      self.performAnimation(cssAnimations, direction, animationSettings);
    }, delay);
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
      .insertAfter(el);

    // Check base state animations
    animations.standard = self.extractAnimations($clone);

    // Add directional class and check if CSS transitions start
    $clone.addClass(classNames.inward);
    animations.in = self.extractAnimations($clone, 'in');

    // Check outward animations
    $clone.removeClass(classNames.inward).addClass(classNames.outward);
    animations.out = self.extractAnimations($clone, 'out');
    const animation = {
      name: animationName,
      exists: !!(animations.in?.length || animations.out?.length || animations.standard?.length),
      directional: !!(animations.in?.length || animations.out?.length),
      animations,
    };

    // cleanup
    $clone.remove();

    // cache result
    self.setCachedAnimation(animationName, animation);

    return animation;
  },

  queue(settings) {
  },

  hide() {
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

  determineDirection(animationName) {
    // if user specifies a direction respect it i.e. "fade in"
    if (animationName.includes(` ${classNames.inward}`)) {
      return 'in';
    }
    if (animationName.includes(` ${classNames.outward}`)) {
      return 'out';
    }

    // if no direction is specified determine based off dom visibility
    const isCurrentlyVisible = $el.isVisible({
      includeOpacity: true,
    });
    return isCurrentlyVisible ? 'out' : 'in';
  },

  // takes a set of css animations and then performs them using web animation API
  async performAnimation(cssAnimations, direction, { duration, callback = noop } = {}) {
    // end other animations for this element
    self.cleanupAnimations();

    if (!cssAnimations || !cssAnimations.exists) {
      console.warn('No animation data available for', cssAnimations.name);
      return;
    }

    // find animations for this particular direction (array of animations)
    const animationsToPlay = cssAnimations.animations[direction] ?? cssAnimations.animations.standard;

    if (!animationsToPlay || animationsToPlay.length === 0) {
      return;
    }

    // make element visible
    self.setInitialDisplayState(direction);

    settings.onStart.call(el);

    // Create and start multiple animations (one per CSS property)
    const activeAnimations = animationsToPlay.map(animData => {
      const options = {
        ...animData.timing,
        fill: 'none',
      };

      // Allow specific duration to be specified in js
      // If not specified it will use one from css
      if (duration !== 'auto') {
        options.duration = duration;
      }

      const activeAnimation = el.animate(animData.keyframes, options);
      self.currentAnimations.push(activeAnimation);
      return activeAnimation;
    });

    // Wait for all animations to complete (handle cancellation gracefully)
    try {
      await Promise.all(activeAnimations.map(anim => anim.finished));
    }
    catch (error) {
      // Animation was cancelled
      if (error.name !== 'AbortError') {
        throw error; // Re-throw unexpected errors
      }
      return; // Exit early if animations were cancelled
    }

    // Set final display state based on direction
    self.setFinalDisplayState(direction);

    // Handle show/hide callbacks based on direction
    if (direction === 'in') {
      settings.onShow.call(el);
    }
    else if (direction === 'out') {
      settings.onHide.call(el);
    }
    // can use callback or await this function
    callback.call(el);
  },

  setInitialDisplayState(direction) {
    if (direction === 'in') {
      const displayType = $el.naturalDisplay();
      $el
        .removeClass(classNames.hidden)
        .addClass(classNames.visible)
        .css('display', displayType);
    }
  },

  setFinalDisplayState(direction) {
    if (direction === 'out') {
      $el
        .removeClass(classNames.visible)
        .css('display', 'none')
        .addClass(classNames.hidden);
    }
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
