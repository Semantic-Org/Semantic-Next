import { registerBehavior } from '@semantic-ui/query';
import {
  each,
  idleCallback,
  inArray,
  isArray,
  isNumber,
  isString,
  range,
  throttle,
  wrapFunction,
} from '@semantic-ui/utils';

import css from './attach.css?raw';

const defaultSettings = {
  // element should be placed relative to this
  to: '',

  // position to place element
  position: '',

  // strategy when choosing a fallback position
  // adjacent-  check adjacenct first
  // opposite - check opposite first
  // [`position1', 'position2'] - only use specific fallback positions
  fallbackStrategy: 'adjacent',

  // position element here as a last resort even if no positions fit ie. "center"
  lastResort: '',

  // whether to add a pointing arrow
  arrow: true,

  offset: 0, // distance offset from calculated position
  distance: 0, // distance away from pointing to
  applyOffsetToCenter: false, // whether to apply offset to center positions

  anchorName: 'anchor-{count}', // name of anchor

  moveElement: true, // whether to move element to same positioning context

  observeChanges: true, // whether to observe attribute changes
  containToScroll: true, // whether to contain element to its scroll container

  // throttle delays for performance optimization
  scrollThrottle: 15, // milliseconds to throttle scroll repositioning
  resizeThrottle: 300, // milliseconds to throttle resize repositioning
  throttleSettings: { leading: false, trailing: true },
};

const createBehavior = ({ $, $el, el, self, attachEvent, cache, settings, error, debug, warn }) => ({
  anchorName: null, // current anchor name

  // available positions to try
  positions: [
    'top left',
    'top',
    'top right', // TOP SIDE
    'right top',
    'right',
    'right bottom', // RIGHT SIDE
    'bottom right',
    'bottom',
    'bottom left', // BOTTOM SIDE
    'left bottom',
    'left',
    'left top', // LEFT SIDE
  ],

  // current position
  position: undefined,

  // map of starting position to fallbacks using index of 'positions'
  // to make this less confusing it is 1-indexed.

  /*      1 | 2 | 3
         -----------
     12 |           | 4
        |           |
     11 |           | 5
        |           |
     10 |           | 6
         -----------
          9 | 8 | 7
  */

  // strategy prefering adjacent side before others
  adjacentFallbacks: {
    'top left': [2, 3, 12, 4, 11, 5, 10, 6, 9, 8, 7],
    'top': [1, 3, 11, 5, 12, 4, 10, 6, 8, 9, 7],
    'top right': [2, 1, 4, 12, 5, 11, 6, 10, 7, 8, 9],
    'right top': [5, 6, 3, 7, 2, 8, 1, 9, 12, 11, 10],
    'right': [4, 6, 2, 8, 3, 7, 1, 9, 11, 12, 10],
    'right bottom': [5, 4, 7, 3, 8, 2, 9, 1, 10, 11, 12],
    'bottom right': [8, 9, 6, 10, 5, 11, 4, 12, 3, 2, 1],
    'bottom': [7, 9, 5, 11, 6, 10, 4, 12, 2, 3, 1],
    'bottom left': [8, 7, 10, 6, 11, 5, 12, 4, 1, 2, 3],
    'left bottom': [11, 12, 9, 1, 8, 2, 7, 3, 6, 5, 4],
    'left': [10, 12, 8, 2, 9, 1, 7, 3, 5, 4, 6],
    'left top': [11, 10, 1, 9, 2, 8, 3, 7, 4, 5, 6],
  },
  // strategy preferring mirrored opposite side before others
  oppositeFallbacks: {
    'top left': [9, 2, 8, 3, 7, 12, 4, 11, 5, 10, 6],
    'top': [8, 1, 9, 3, 7, 11, 5, 12, 4, 10, 6],
    'top right': [7, 2, 8, 1, 9, 4, 12, 5, 11, 6, 10],
    'right top': [12, 5, 11, 6, 10, 3, 7, 2, 8, 1, 9],
    'right': [11, 4, 12, 6, 10, 2, 8, 3, 7, 1, 9],
    'right bottom': [10, 5, 11, 4, 12, 7, 3, 8, 2, 9, 1],
    'bottom right': [3, 8, 2, 9, 1, 6, 10, 5, 11, 4, 12],
    'bottom': [2, 7, 3, 9, 1, 5, 11, 6, 10, 4, 12],
    'bottom left': [1, 8, 2, 7, 3, 10, 6, 11, 5, 12, 4],
    'left bottom': [6, 11, 5, 12, 4, 9, 1, 8, 2, 7, 3],
    'left': [5, 10, 6, 12, 4, 2, 8, 9, 1, 7, 3],
    'left top': [4, 11, 5, 10, 6, 1, 9, 2, 8, 3, 7],
  },

  // mapping of position name to css using shorthand to reduce min filesize
  // see <decodeCSSShorthand>
  positionMapping: {
    'top left': { ibe: 't', iis: 'l' },
    'top': { ibe: 't', iis: 'c', tr: 'ox' },
    'top right': { ibe: 't', iie: 'r' },
    'right top': { iis: 'r', ibs: 't' },
    'right': { iis: 'r', ibs: 'c', tr: 'oy' },
    'right bottom': { iis: 'r', ibe: 'b' },
    'bottom right': { ibs: 'b', iie: 'r' },
    'bottom': { ibs: 'b', iis: 'c', tr: 'ox' },
    'bottom left': { ibs: 'b', iis: 'l' },
    'left bottom': { iie: 'l', ibe: 'b' },
    'left': { iie: 'l', ibs: 'c', tr: 'oy' },
    'left top': { iie: 'l', ibs: 't' },
    'center': { ibs: 'c', iis: 'c', tr: 'o' },
  },

  // Throttled repositioning methods
  onScroll: (settings.scrollThrottle > 0)
    ? throttle(
      () => {
        idleCallback(self.reposition);
      },
      settings.scrollThrottle,
      settings.throttleSettings,
    )
    : idleCallback(self.reposition),

  onResize: (settings.resizeThrottle > 0)
    ? throttle(() => idleCallback(self.reposition), settings.resizeThrottle, settings.throttleSettings)
    : idleCallback(self.reposition),

  getNextAnchorName() {
    if (!cache.count) {
      cache.count = 0;
    }
    cache.count++;
    const anchorName = settings.anchorName.replace('{count}', cache.count);
    return `--${anchorName}`;
  },

  getAnchor() {
    return $(settings.to);
  },

  getPositioningCSS(position = settings.position) {
    const positionCSS = self.getDecodedPositionCSS(position);
    const positionReset = {
      'inset-block-start': null,
      'inset-block-end': null,
      'inset-inline-start': null,
      'inset-inline-end': null,
      'translate': null,
    };
    return {
      ...positionReset,
      ...positionCSS,
    };
  },

  // save some filesize on string literals
  getDecodedPositionCSS(position) {
    const shorthands = {
      ibs: 'inset-block-start',
      ibe: 'inset-block-end',
      iis: 'inset-inline-start',
      iie: 'inset-inline-end',
      t: 'anchor(top)',
      l: 'anchor(left)',
      b: 'anchor(bottom)',
      r: 'anchor(right)',
      c: 'anchor(center)',
      tr: 'translate',
      ox: '-50% 0', // offset x
      oy: '0 -50%', // offset y
      o: '-50% -50%', // offset
    };

    const css = self.positionMapping[position] || {};
    const outputCSS = {};

    // Skip distance/offset for center position
    const isCenter = position === 'center';

    // Determine primary axis from first word of position
    const firstWord = position.split(' ')[0];
    const verticalSide = inArray(firstWord, ['top', 'bottom']);
    const primaryAxisAnchors = verticalSide ? ['t', 'b'] : ['l', 'r'];
    const secondaryAxisAnchors = verticalSide ? ['l', 'r'] : ['t', 'b'];

    each(css, (thisValue, thisProp) => {
      const prop = shorthands[thisProp] || thisProp;
      let value = shorthands[thisValue] || thisValue;

      // Add distance/offset calc() when applicable
      if (!isCenter) {
        let distance = self.normalizeUnit(settings.distance);
        const offset = self.normalizeUnit(settings.offset);

        // Add arrow size to distance when arrow is enabled
        if (settings.arrow && distance !== null) {
          distance = `calc(${distance} + var(--arrow-size, 10px))`;
        }
        else if (settings.arrow && distance === null) {
          distance = 'var(--arrow-size, 10px)';
        }

        // Add distance to primary axis anchors, offset to secondary axis anchors
        if (inArray(thisValue, primaryAxisAnchors) && distance !== null) {
          value = `calc(${value} + ${distance})`;
        }
        else if (inArray(thisValue, secondaryAxisAnchors) && offset !== null) {
          value = `calc(${value} + ${offset})`;
        }
        // Handle center anchors for offset on secondary axis (if enabled)
        else if (thisValue === 'c' && offset !== null && settings.applyOffsetToCenter) {
          value = `calc(${value} + ${offset})`;
        }
      }

      outputCSS[prop] = value;
    });
    return outputCSS;
  },

  // Helper to normalize units (assume px for numbers)
  normalizeUnit(value) {
    if (!value || value === 0 || (isString(value) && value.startsWith('0'))) {
      return null;
    }
    if (isNumber(value)) {
      return `${value}px`;
    }
    return value;
  },

  setAnchorName() {
    const $anchor = self.getAnchor();
    if (!$anchor.exists()) {
      error('Cannot find anchor element', settings.to);
      return;
    }

    let anchorName = $anchor.css('anchor-name');
    if (!anchorName || anchorName === 'none') {
      anchorName = self.getNextAnchorName();
      $anchor.css('anchor-name', anchorName);
    }
    self.anchorName = anchorName;
  },

  isHidden() {
    return $el.computedStyle('display') === 'none';
  },

  setPositioningCSS(position = settings.position) {
    if (self.isHidden()) {
      return;
    }
    const positioningCSS = self.getPositioningCSS(position);
    $el.css(positioningCSS);
  },

  testPosition(position = settings.position) {
    if (self.isHidden()) {
      self.hidden = true;
      return;
    }
    else {
      self.hidden = false;
    }
    self.setPositioningCSS(position);
    self.maybeReposition(position);
  },

  isCurrentlyPositioning() {
    return self.fallbackPositions?.length;
  },

  reposition() {
    // current repositioning
    if (self.isCurrentlyPositioning()) {
      debug('Already searching');
      return;
    }
    if (self.currentPositionInView()) {
      return;
    }
    // but begin from current position if defined
    self.testPosition(settings.position);
  },

  currentPositionInView() {
    return self.position && self.maybeReposition(self.position) === false;
  },

  // check if position is in view
  maybeReposition(currentPosition = self.position) {
    const $viewport = (settings.containToScroll)
      ? $el.scrollParent()
      : $el.clippingParent();
    const view = $el.isInView({
      fully: true,
      returnDetails: true,
      viewport: $viewport,
    });
    if (!view.intersects) {
      debug('Position not in view', currentPosition, view);
      // try next fallback position unless none left (null)
      const nextPosition = self.getNextPosition(currentPosition);
      if (nextPosition !== null) {
        debug('Setting next position to', nextPosition);
        self.testPosition(nextPosition);
      }
      else {
        if (settings.lastResort) {
          self.setResolvedPosition(settings.lastResort);
        }
        else {
          warn('No positions fit viewport');
        }
        debug('no positions left to test');
        self.endFallbackSearch();
      }
      return true;
    }
    else if (self.position !== currentPosition) {
      self.setResolvedPosition(currentPosition);
      return true;
    }
    else {
      debug('Current position still in view', currentPosition, view);
      self.endFallbackSearch();
      return false;
    }
  },

  // set final position after finding one in view
  setResolvedPosition(resolvedPosition) {
    self.endFallbackSearch();
    $el.attr('data-position', resolvedPosition);
    if (settings.arrow) {
      $el.attr('data-arrow', '');
    }
    self.position = resolvedPosition;
    debug('Found position in view', resolvedPosition);
    self.setPositioningCSS(resolvedPosition);
  },

  // fallback order is implemented as a lookup table
  // as the algorithm can get fairly complex for 'adjacent' / 'opposite'
  getFallbackOrder(position) {
    const allPositions = range(1, self.positions.length + 1);
    if (isArray(settings.fallbackStrategy)) {
      return settings.fallbackStrategy;
    }
    if (settings.fallbackStrategy === 'adjacent') {
      return self.adjacentFallbacks[position] || allPositions;
    }
    if (settings.fallbackStrategy === 'opposite') {
      return self.oppositeFallbacks[position] || allPositions;
    }
    return allPositions;
  },

  // gets the next fallback position from a starting position
  getNextPosition(currentPosition = settings.position) {
    if (self.fallbacksTested === undefined) {
      debug('Starting search from', currentPosition);
      self.startFallbackSearch(currentPosition);
    }
    if (self.fallbacksTested > 15 || self.fallbackPositions?.length > 0) {
      const nextPosition = self.fallbackPositions.shift();
      self.fallbacksTested++;
      if (isNumber(nextPosition)) {
        const index = nextPosition - 1; // positions are 1-indexed
        debug('Next position is', self.positions[nextPosition]);
        return self.positions[index] || null;
      }
      // if its a string its just the position name (user specified)
      return nextPosition;
    }
    else {
      // failure conditions no fallback positions left
      self.endFallbackSearch();
      return null;
    }
  },

  startFallbackSearch(startingPosition, currentPosition) {
    const rotateToFront = (arr, value) => {
      const index = arr.indexOf(value);
      if (index === -1) {
        return arr;
      }
      return [...arr.slice(index), ...arr.slice(0, index)];
    };
    self.fallbacksTested = 0;
    let positions = self.getFallbackOrder(startingPosition);

    // if we specify current position we want to process array but starting with current position
    // this makes sure if its still in view we use the current position
    if (currentPosition) {
      const positionNumber = self.positions.indexOf(currentPosition);
      if (inArray(positionNumber, positions)) {
        positions = rotateToFront(positions, positionNumber);
      }
    }
    // clone array
    self.fallbackPositions = [
      ...positions,
    ];
  },

  endFallbackSearch() {
    delete self.fallbacksTested;
    delete self.fallbackPositions;
  },

  maybeMoveElement() {
    const $anchor = self.getAnchor();
    const anchorParent = $anchor.positioningParent().el();
    const elParent = $el.positioningParent().el();

    // same positioning context
    if (anchorParent === elParent) {
      return;
    }

    // Move element and warn
    const targetParent = anchorParent || document.body;
    warn(`Moving anchored element to compatible positioning context`, {
      from: elParent,
      to: targetParent,
    });
    $el.detach().appendTo(targetParent);
  },

  attach() {
    if (!self.anchorName) {
      self.setAnchorName();
    }
    const attachCSS = {
      'position': 'absolute',
      'position-anchor': self.anchorName,
    };
    $el.css(attachCSS);
    self.testPosition(settings.position);
  },

  bindScroll() {
    const $scrolls = $el.scrollParent({ all: true });
    attachEvent($scrolls, 'scroll', self.onScroll);
  },

  bindObservers() {
    const viewport = settings.containToScroll
      ? $el.scrollParent()
      : $el.clippingParent();

    self.observer = new IntersectionObserver(
      self.onIntersectionChange,
      {
        root: viewport.el(),
        threshold: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 1.0],
        rootMargin: '50px',
      },
    );
    el.offsetHeight;
    self.observer.observe(el);
  },
});

const onCreated = ({ self, settings }) => {
  if (!settings.to) {
    error('No element specified to attach to');
    return;
  }
  if (settings.moveElement) {
    self.maybeMoveElement();
  }
  self.attach();
  self.bindScroll();
};

const onDestroyed = ({ self }) => {
  // self.observer?.disconnect();
  wrapFunction(self.onScroll?.cancel)();
  wrapFunction(self.onResize?.cancel)();
};

const events = {
  'global resize window'({ self }) {
    self.onResize();
  },
  'transition:started'({ self }) {
    self.reposition();
  },
};

const mutations = {
  'attributes'({ attributeName, attributeValue, settings, self }) {
    if (!settings.observeChanges === true || !attributeName === 'style' || !attributeValue.includes('display')) {
      return;
    }
    self.reposition();
  },
};

export const Attach = registerBehavior({
  name: 'attach',
  namespace: 'attach',
  defaultSettings,
  events,
  css,
  mutations,
  createBehavior,
  onCreated,
  onDestroyed,
});
