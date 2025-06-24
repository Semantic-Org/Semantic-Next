import { registerPlugin } from '@semantic-ui/query';

const defaultSettings =  {
  // delay between animations in group
  interval: 0,

  // whether group animations should be reversed
  reverse: 'auto',

  // whether timeout should be used to ensure callback fires in cases animationend does not
  useFailSafe: true,

  // delay in ms for fail safe
  failSafeDelay: 100,

  // whether EXACT animation can occur twice in a row
  allowRepeats: false,


  // Override final display type on visible
  displayType: false,

  // animation duration
  animation: 'fade',

  duration: false,

  // new animations will occur after previous ones
  queue : true,
};

const createPlugin = ({ $el, settings, self, className, debug, verbose, metadata }) => ({

  forceRepaint() {
    verbose('Forcing element repaint');
    let
      $parentElement = $el.parent(),
      $nextElement = $el.next()
    ;
    if($nextElement.length === 0) {
      $el.detach().appendTo($parentElement);
    }
    else {
      $el.detach().insertBefore($nextElement);
    }
  },

  repaint() {
    verbose('Repainting element');
    let
      fakeAssignment = element.offsetWidth
    ;
  },

  delay(interval) {
    let
      direction = self.get.animationDirection(),
      shouldReverse,
      delay
    ;
    if(!direction) {
      direction = self.can.transition()
        ? self.get.direction()
        : 'static'
      ;
    }
    interval = (interval !== undefined)
      ? interval
      : settings.interval
    ;
    shouldReverse = (settings.reverse == 'auto' && direction == className.outward);
    delay = (shouldReverse || settings.reverse == true)
      ? ($allModules.length - index) * settings.interval
      : index * settings.interval
    ;
    debug('Delaying animation by', delay);
    setTimeout(self.animate, delay);
  },

  animate(overrideSettings) {
    settings = overrideSettings || settings;
    debug('Preparing animation', settings.animation);
    if(self.is.animating()) {
      if(settings.queue) {
        if(!settings.allowRepeats && self.has.direction() && self.is.occurring() && self.queuing !== true) {
          debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
        }
        else {
          self.queue(settings.animation);
        }
        return false;
      }
      else if(!settings.allowRepeats && self.is.occurring()) {
        debug('Animation is already occurring, will not execute repeated animation', settings.animation);
        return false;
      }
      else {
        debug('New animation started, completing previous early', settings.animation);
        instance.complete();
      }
    }
    if( self.can.animate() ) {
      self.set.animating(settings.animation);
    }
    else {
      self.error(error.noAnimation, settings.animation, element);
    }
  },

  reset() {
    debug('Resetting animation to beginning conditions');
    self.remove.animationCallbacks();
    self.restore.conditions();
    self.remove.animating();
  },

  queue(animation) {
    debug('Queueing animation of', animation);
    self.queuing = true;
    $el
      .one('animationend' + '.queue' + eventNamespace, function() {
        self.queuing = false;
        self.repaint();
        self.animate.apply(this, settings);
      })
    ;
  },

  complete(event) {
    debug('Animation complete', settings.animation);
    self.remove.completeCallback();
    self.remove.failSafe();
    if(!self.is.looping()) {
      if( self.is.outward() ) {
        verbose('Animation is outward, hiding element');
        self.restore.conditions();
        self.hide();
      }
      else if( self.is.inward() ) {
        verbose('Animation is outward, showing element');
        self.restore.conditions();
        self.show();
      }
      else {
        verbose('Static animation completed');
        self.restore.conditions();
        settings.onComplete.call(element);
      }
    }
  },

  force: {
    visible() {
      let
        style          = $el.attr('style'),
        userStyle      = self.get.userStyle(),
        displayType    = self.get.displayType(),
        overrideStyle  = userStyle + 'display: ' + displayType + ' !important;',
        currentDisplay = $el.css('display'),
        emptyStyle     = (style === undefined || style === '')
      ;
      if(currentDisplay !== displayType) {
        verbose('Overriding default display to show element', displayType);
        $el
          .attr('style', overrideStyle)
        ;
      }
      else if(emptyStyle) {
        $el.removeAttr('style');
      }
    },
    hidden() {
      let
        style          = $el.attr('style'),
        currentDisplay = $el.css('display'),
        emptyStyle     = (style === undefined || style === '')
      ;
      if(currentDisplay !== 'none' && !self.is.hidden()) {
        verbose('Overriding default display to hide element');
        $el
          .css('display', 'none')
        ;
      }
      else if(emptyStyle) {
        $el
          .removeAttr('style')
        ;
      }
    }
  },

  has: {
    direction(animation) {
      let
        hasDirection = false
      ;
      animation = animation || settings.animation;
      if(typeof animation === 'string') {
        animation = animation.split(' ');
        $.each(animation, function(index, word){
          if(word === className.inward || word === className.outward) {
            hasDirection = true;
          }
        });
      }
      return hasDirection;
    },
    inlineDisplay() {
      let
        style = $el.attr('style') || ''
      ;
      return $.isArray(style.match(/display.*?;/, ''));
    }
  },

  set: {
    animating(animation) {
      let
        animationClass,
        direction
      ;
      // remove previous callbacks
      self.remove.completeCallback();

      // determine exact animation
      animation      = animation || settings.animation;
      animationClass = self.get.animationClass(animation);

      // save animation class in cache to restore class names
      self.save.animation(animationClass);

      // override display if necessary so animation appears visibly
      self.force.visible();

      self.remove.hidden();
      self.remove.direction();

      self.start.animation(animationClass);

    },
    duration(animationName, duration) {
      duration = duration || settings.duration;
      duration = (typeof duration == 'number')
        ? duration + 'ms'
        : duration
      ;
      if(duration || duration === 0) {
        verbose('Setting animation duration', duration);
        $el
          .css({
            'animation-duration':  duration
          })
        ;
      }
    },
    direction(direction) {
      direction = direction || self.get.direction();
      if(direction == className.inward) {
        self.set.inward();
      }
      else {
        self.set.outward();
      }
    },
    looping() {
      debug('Transition set to loop');
      $el
        .addClass(className.looping)
      ;
    },
    hidden() {
      $el
        .addClass(className.transition)
        .addClass(className.hidden)
      ;
    },
    inward() {
      debug('Setting direction to inward');
      $el
        .removeClass(className.outward)
        .addClass(className.inward)
      ;
    },
    outward() {
      debug('Setting direction to outward');
      $el
        .removeClass(className.inward)
        .addClass(className.outward)
      ;
    },
    visible() {
      $el
        .addClass(className.transition)
        .addClass(className.visible)
      ;
    }
  },

  start: {
    animation(animationClass) {
      animationClass = animationClass || self.get.animationClass();
      debug('Starting tween', animationClass);
      $el
        .addClass(animationClass)
        .one('animationend' + '.complete' + eventNamespace, self.complete)
      ;
      if(settings.useFailSafe) {
        self.add.failSafe();
      }
      self.set.duration(settings.duration);
      settings.onStart.call(element);
    }
  },

  save: {
    animation(animation) {
      if(!self.cache) {
        self.cache = {};
      }
      self.cache.animation = animation;
    },
    displayType(displayType) {
      if(displayType !== 'none') {
        $el.data(metadata.displayType, displayType);
      }
    },
    transitionExists(animation, exists) {
      $.fn.transition.exists[animation] = exists;
      verbose('Saving existence of transition', animation, exists);
    }
  },

  restore: {
    conditions() {
      let
        animation = self.get.currentAnimation()
      ;
      if(animation) {
        $el
          .removeClass(animation)
        ;
        verbose('Removing animation class', self.cache);
      }
      self.remove.duration();
    }
  },

  add: {
    failSafe() {
      let
        duration = self.get.duration()
      ;
      self.timer = setTimeout(function() {
        $el.triggerHandler(animationEnd);
      }, duration + settings.failSafeDelay);
      verbose('Adding fail safe timer', self.timer);
    }
  },

  remove: {
    animating() {
      $el.removeClass(className.animating);
    },
    animationCallbacks() {
      self.remove.queueCallback();
      self.remove.completeCallback();
    },
    queueCallback() {
      $el.off('.queue' + eventNamespace);
    },
    completeCallback() {
      $el.off('.complete' + eventNamespace);
    },
    display() {
      $el.css('display', '');
    },
    direction() {
      $el
        .removeClass(className.inward)
        .removeClass(className.outward)
      ;
    },
    duration() {
      $el
        .css('animation-duration', '')
      ;
    },
    failSafe() {
      verbose('Removing fail safe timer', self.timer);
      if(self.timer) {
        clearTimeout(self.timer);
      }
    },
    hidden() {
      $el.removeClass(className.hidden);
    },
    visible() {
      $el.removeClass(className.visible);
    },
    looping() {
      debug('Transitions are no longer looping');
      if( self.is.looping() ) {
        self.reset();
        $el
          .removeClass(className.looping)
        ;
      }
    },
    transition() {
      $el
        .removeClass(className.visible)
        .removeClass(className.hidden)
      ;
    }
  },
  get: {
    animationClass(animation) {
      let
        animationClass = animation || settings.animation,
        directionClass = (self.can.transition() && !self.has.direction())
          ? self.get.direction() + ' '
          : ''
      ;
      return className.animating + ' '
        + className.transition + ' '
        + directionClass
        + animationClass
      ;
    },
    currentAnimation() {
      return (self.cache && self.cache.animation !== undefined)
        ? self.cache.animation
        : false
      ;
    },
    currentDirection() {
      return self.is.inward()
        ? className.inward
        : className.outward
      ;
    },
    direction() {
      return self.is.hidden() || !self.is.visible()
        ? className.inward
        : className.outward
      ;
    },
    animationDirection(animation) {
      let
        direction
      ;
      animation = animation || settings.animation;
      if(typeof animation === 'string') {
        animation = animation.split(' ');
        // search animation name for out/in class
        $.each(animation, function(index, word){
          if(word === className.inward) {
            direction = className.inward;
          }
          else if(word === className.outward) {
            direction = className.outward;
          }
        });
      }
      // return found direction
      if(direction) {
        return direction;
      }
      return false;
    },
    duration(duration) {
      duration = duration || settings.duration;
      if(duration === false) {
        duration = $el.css('animation-duration') || 0;
      }
      return (typeof duration === 'string')
        ? (duration.indexOf('ms') > -1)
          ? parseFloat(duration)
          : parseFloat(duration) * 1000
        : duration
      ;
    },
    displayType(shouldDetermine) {
      shouldDetermine = (shouldDetermine !== undefined)
        ? shouldDetermine
        : true
      ;
      if(settings.displayType) {
        return settings.displayType;
      }
      if(shouldDetermine && $el.data(metadata.displayType) === undefined) {
        // create fake element to determine display state
        self.can.transition(true);
      }
      return $el.data(metadata.displayType);
    },
    userStyle(style) {
      style = style || $el.attr('style') || '';
      return style.replace(/display.*?;/, '');
    },
    transitionExists(animation) {
      return $.fn.transition.exists[animation];
    },
    animationStartEvent() {
      let
        element     = document.createElement('div'),
        animations  = {
          'animation'       :'animationstart',
          'OAnimation'      :'oAnimationStart',
          'MozAnimation'    :'mozAnimationStart',
          'WebkitAnimation' :'webkitAnimationStart'
        },
        animation
      ;
      for(animation in animations){
        if( element.style[animation] !== undefined ){
          return animations[animation];
        }
      }
      return false;
    },
    animationEndEvent() {
      let
        element     = document.createElement('div'),
        animations  = {
          'animation'       :'animationend',
          'OAnimation'      :'oAnimationEnd',
          'MozAnimation'    :'mozAnimationEnd',
          'WebkitAnimation' :'webkitAnimationEnd'
        },
        animation
      ;
      for(animation in animations){
        if( element.style[animation] !== undefined ){
          return animations[animation];
        }
      }
      return false;
    }

  },

  can: {
    transition(forced) {
      let
        animation         = settings.animation,
        transitionExists  = self.get.transitionExists(animation),
        displayType       = self.get.displayType(false),
        elementClass,
        tagName,
        $clone,
        currentAnimation,
        inAnimation,
        directionExists
      ;
      if( transitionExists === undefined || forced) {
        verbose('Determining whether animation exists');
        elementClass = $el.attr('class');
        tagName      = $el.prop('tagName');

        $clone = $('<' + tagName + ' />').addClass( elementClass ).insertAfter($el);
        currentAnimation = $clone
          .addClass(animation)
          .removeClass(className.inward)
          .removeClass(className.outward)
          .addClass(className.animating)
          .addClass(className.transition)
          .css('animationName')
        ;
        inAnimation = $clone
          .addClass(className.inward)
          .css('animationName')
        ;
        if(!displayType) {
          displayType = $clone
            .attr('class', elementClass)
            .removeAttr('style')
            .removeClass(className.hidden)
            .removeClass(className.visible)
            .show()
            .css('display')
          ;
          verbose('Determining final display state', displayType);
          self.save.displayType(displayType);
        }

        $clone.remove();
        if(currentAnimation != inAnimation) {
          debug('Direction exists for animation', animation);
          directionExists = true;
        }
        else if(currentAnimation == 'none' || !currentAnimation) {
          debug('No animation defined in css', animation);
          return;
        }
        else {
          debug('Static animation found', animation, displayType);
          directionExists = false;
        }
        self.save.transitionExists(animation, directionExists);
      }
      return (transitionExists !== undefined)
        ? transitionExists
        : directionExists
      ;
    },
    animate() {
      // can transition does not return a value if animation does not exist
      return (self.can.transition() !== undefined);
    }
  },

  is: {
    animating() {
      return $el.hasClass(className.animating);
    },
    inward() {
      return $el.hasClass(className.inward);
    },
    outward() {
      return $el.hasClass(className.outward);
    },
    looping() {
      return $el.hasClass(className.looping);
    },
    occurring(animation) {
      animation = animation || settings.animation;
      animation = '.' + animation.replace(' ', '.');
      return ( $el.filter(animation).length > 0 );
    },
    visible() {
      return $el.is(':visible');
    },
    hidden() {
      return $el.css('visibility') === 'hidden';
    },
  },

  hide() {
    verbose('Hiding element');
    if( self.is.animating() ) {
      self.reset();
    }
    element.blur(); // IE will trigger focus change if element is not blurred before hiding
    self.remove.display();
    self.remove.visible();
    self.set.hidden();
    self.force.hidden();
    settings.onHide.call(element);
    settings.onComplete.call(element);
    // self.repaint();
  },

  show(display) {
    verbose('Showing element', display);
    self.remove.hidden();
    self.set.visible();
    self.force.visible();
    settings.onShow.call(element);
    settings.onComplete.call(element);
    // self.repaint();
  },

  toggle() {
    if( self.is.visible() ) {
      self.hide();
    }
    else {
      self.show();
    }
  },

  stop() {
    debug('Stopping current animation');
    $el.triggerHandler(animationEnd);
  },

  stopAll() {
    debug('Stopping all animation');
    self.remove.queueCallback();
    $el.triggerHandler(animationEnd);
  },

  clear: {
    queue() {
      debug('Clearing animation queue');
      self.remove.queueCallback();
    }
  },

  enable() {
    verbose('Starting animation');
    $el.removeClass(className.disabled);
  },

  disable() {
    debug('Stopping animation');
    $el.addClass(className.disabled);
  },

});

registerPlugin({
  name: 'transition',
  createPlugin,
  defaultSettings,
  metadata : {
    displayType: 'display'
  },
  className   : {
    animating: 'animating',
    disabled: 'disabled',
    hidden: 'hidden',
    inward: 'in',
    loading: 'loading',
    looping: 'looping',
    outward: 'out',
    transition: 'transition',
    visible: 'visible'
  },
  callbacks: {
    onStart() {},
    onComplete() {},
    onShow() {},
    onHide() {},
  },
  error: {
    noAnimation: 'Element is no longer attached to DOM. Unable to animate. Use silent setting to surpress this warning in production.',
    repeated: 'That animation is already occurring, cancelling repeated animation',
  }
});
