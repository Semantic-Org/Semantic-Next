import { registerBehavior } from '@semantic-ui/query';
import { any, each, inArray, noop } from '@semantic-ui/utils';

import css from './transition.css?raw';

const defaultSettings = {
  // css animation to use
  animation: '',

  // duration to use 'auto' will default to the value set in css
  duration: 'auto',

  // delay between animations when animating a group of elements
  interval: 200,

  // direction of animation when animating groups (forward for in, reverse for out)
  groupOrder: 'auto',

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

const createBehavior = (
  {
    $,
    dispatchEvent,
    dispatchGroupEvent,
    el,
    cache,
    $el,
    self,
    data,
    settings,
    classNames,
    errors,
    index,
    isFirst,
    isLast,
    total,
  },
) => ({
  // track currently running JavaScript animations
  currentAnimations: [],

  initialize() {
    if (settings.animation) {
      this.animate();
    }
  },

  // animate can override at runtime with different duration, animation or callback
  async animate(runtimeSettings) {
    const animationSettings = {
      ...settings,
      ...runtimeSettings,
    };

    // handle case of already animating
    // handle animation queuing
    if (self.isAnimating()) {
      if (settings.queue) {
        const eventName = (el.animatingGroup)
          ? 'transition:groupEnd'
          : 'transition:end';
        await $(el).onNext(eventName);
      }
      else {
        self.stop();
      }
    }

    // determine canonical animations from css, this is cached between runs
    const cssAnimations = self.findCSSAnimation(animationSettings.animation);

    // determine which direction this animation is occuring if the animation is directional
    let direction;
    if (cssAnimations.directional) {
      direction = self.determineDirection(animationSettings.animation);
    }
    if (total > 0) {
      await self.performGroupAnimation(cssAnimations, direction, animationSettings);
    }
    else {
      await self.performAnimation(cssAnimations, direction, animationSettings);
    }
  },

  async performGroupAnimation(cssAnimations, direction, animationSettings) {
    let groupOrder = self.getGroupOrder(direction);

    self.startGroupAnimation(direction, groupOrder);

    const delay = (groupOrder == 'forward')
      ? index * settings.interval
      : (total - index) * settings.interval;
    animationSettings.delay = delay;
    await self.performAnimation(cssAnimations, direction, animationSettings);

    self.endGroupAnimation(direction, groupOrder);
  },

  startGroupAnimation(direction, groupOrder) {
    el.animatingGroup = true;
    if (self.isFirstInGroup(direction)) {
      dispatchGroupEvent('groupStart', {
        groupOrder,
      });
    }
  },

  endGroupAnimation(direction, groupOrder) {
    if (self.isLastInGroup(direction)) {
      dispatchGroupEvent('groupEnd', {
        groupOrder,
      });
    }
    el.animatingGroup = false;
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
  async performAnimation(cssAnimations, direction, { duration, callback = noop, delay } = {}) {
    if (!cssAnimations || !cssAnimations.exists) {
      console.warn('No animation data available for', cssAnimations.name);
      return;
    }

    // find animations for this particular direction (array of animations)
    const animationsToPlay = cssAnimations.animations[direction] ?? cssAnimations.animations.standard;

    if (!animationsToPlay || animationsToPlay.length === 0) {
      return;
    }

    // pass through animation id for easier debugging / inspection of animations
    // i.e. "fade in" , "fade out", "bounce"
    const animationID = (direction)
      ? `${cssAnimations.name} ${direction}`
      : `${cssAnimation}`;

    // Create and start multiple animations (one per CSS property)
    const activeAnimations = animationsToPlay.map(animData => {
      const options = {
        ...animData.timing,
        id: animationID,
        fill: 'none',
      };

      if (delay >= 0) {
        options.delay = delay;
      }

      // Allow specific duration to be specified in js
      // If not specified it will use one from css
      if (duration !== 'auto') {
        options.duration = duration;
      }
      return el.animate(animData.keyframes, options);
    });

    dispatchEvent('scheduled', { cssAnimations: cssAnimations, animations: activeAnimations });

    // wait for animation to actually begin (if there is a delay this might not be immediate)
    await self.animationsStarted(activeAnimations);
    dispatchEvent('started', { cssAnimations: cssAnimations, animations: activeAnimations });

    // make element visible
    self.setInitialDisplayState(direction);

    settings.onStart.call(el);

    // Wait for all animations to complete (handle cancellation gracefully)
    await self.animationsFinished(activeAnimations);
    // Set final display state based on direction
    self.setFinalDisplayState(direction);

    // Handle show/hide callbacks based on direction
    if (direction === 'in') {
      dispatchEvent('visible', { cssAnimations: cssAnimations, animations: activeAnimations });
      settings.onShow.call(el);
    }
    else if (direction === 'out') {
      dispatchEvent('hidden', { cssAnimations: cssAnimations, animations: activeAnimations });
      settings.onHide.call(el);
    }

    // can use callback, event or await this function
    dispatchEvent('end', { cssAnimations: cssAnimations, animations: activeAnimations });
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

  stop() {
    each(self.currentAnimations(), (animation) => {
      animation.cancel();
    });
  },

  async animationsReady(animations = el.getAnimations()) {
    try {
      await Promise.all(animations.map(animation => animation.ready));
    }
    catch (error) {
      // Animation was cancelled
      if (error.name !== 'AbortError') {
        throw error; // Re-throw unexpected errors
      }
      return; // Exit early if animations were cancelled
    }
  },
  async animationsStarted(animations = el.getAnimations()) {
    try {
      await Promise.all(animations.map(animation => self.animationStarted(animation)));
    }
    catch (error) {
      if (error.name !== 'AbortError') {
        throw error; // Re-throw unexpected errors
      }
      return; // Exit early if animations were cancelled
    }
  },

  // There are many idiosyncracies about how to determine actual animation start
  // when using the delay option. The only solve that seems to be stable
  // is using getTiming() and polling in a RaF
  async animationStarted(animation) {
    await animation.ready;

    const timing = animation.effect.getTiming();
    const delay = timing.delay || 0;

    if (delay === 0) {
      return;
    }
    return new Promise((resolve) => {
      const startTime = animation.startTime;

      function check() {
        // Use timeline.currentTime for a cheaper check
        const elapsed = animation.timeline.currentTime - startTime;
        if (elapsed >= delay) {
          resolve();
        }
        else {
          requestAnimationFrame(check);
        }
      }
      requestAnimationFrame(check);
    });
  },
  async animationsFinished(animations = el.getAnimations()) {
    try {
      await Promise.all(animations.map(animation => animation.finished));
    }
    catch (error) {
      // Animation was cancelled
      if (error.name !== 'AbortError') {
        throw error; // Re-throw unexpected errors
      }
      return; // Exit early if animations were cancelled
    }
  },
  currentAnimations() {
    return el.getAnimations().filter((animation) => inArray(animation.playState, ['running', 'playing']));
  },

  getGroupOrder(direction) {
    return (settings.groupOrder == 'auto')
      ? (direction == 'in')
        ? 'forward'
        : 'reverse'
      : settings.groupOrder;
  },

  isAnimating() {
    return self.currentAnimations().length > 0;
  },
  isInward() {
    return any(self.currentAnimations(), (animation) => animation?.id.includes('in'));
  },
  isOutward() {
    return any(self.currentAnimations(), (animation) => animation?.id.includes('out'));
  },
  isLooping() {
    return any(self.currentAnimations(), (animation) => animation?.id.includes('loop'));
  },
  isFirstInGroup(direction) {
    const order = self.getGroupOrder(direction);
    if (order == 'forward' && isFirst) {
      return true;
    }
    if (order == 'reverse' && isLast) {
      return true;
    }
    return false;
  },
  isLastInGroup(direction) {
    const order = self.getGroupOrder(direction);
    if (order == 'forward' && isLast) {
      return true;
    }
    if (order == 'reverse' && isFirst) {
      return true;
    }
    return false;
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
