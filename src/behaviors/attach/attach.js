import { registerBehavior } from '@semantic-ui/query';
import { each, inArray, isArray, isNumber, keys } from '@semantic-ui/utils';

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

  // whether to add a pointing arrow
  arrow: true,

  offset: 0, // distance offset from calculated position
  distance: 14, // distance away from pointing to

  alwaysShow: false, // always show element regardless of whether it fits
  anchorName: 'anchor-{count}', // name of anchor

  moveElement: true, // whether to move element to same positioning context

  observeChanges: true, // whether to observe changes and move element if it no longer fits
  containToScroll: true, // whether to contain element to its scroll container
};

const createBehavior = ({ $, $el, el, self, cache, settings, classNames, error, debug, index, warn }) => ({
  anchorName: null,

  // X X X
  // X X X
  // X X X
  // list of positions permitted to try
  allPositions: [
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

  // map of starting position to fallbacks using index of 'allPositions'
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
    'left bottom': [11, 12, 9, 1, 8, 2, 7, 3, 6, 4, 4],
    'left': [10, 12, 8, 2, 9, 1, 7, 3, 5, 4, 6],
    'left top': [11, 10, 1, 9, 2, 8, 3, 7, 4, 5, 6],
  },
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

  // mapping of position name to css using shorthand
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

  initialize() {
    if (!settings.to) {
      error('No element specified to attach to');
      return;
    }
    if (settings.moveElement) {
      self.maybeMoveElement();
    }
    self.attach();
  },

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
    let css = self.positionMapping[position] || {};
    let outputCSS = {};
    each(css, (thisValue, thisProp) => {
      const prop = shorthands[thisProp] || thisProp;
      const value = shorthands[thisValue] || thisValue;
      outputCSS[prop] = value;
    });
    return outputCSS;
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

  setPosition(position = settings.position) {
    const positioningCSS = self.getPositioningCSS(position);
    $el.css(positioningCSS);
    if (!$el.isInView({ fully: true })) {
      console.log('out of view', self.getNextPosition(position), position);
    }
  },

  // fallback order is implemented as a lookup table
  // as the algorithm can get fairly complex for 'adjacent' / 'opposite'
  getFallbackOrder() {
    if (settings.fallbackStrategy) {
      return settings.fallbackStrategy;
    }
  },

  getNextPosition(position = settings.position) {
    // we make a copy of fallback order on self
    self.tryingPositions = true;
    self.availablePositions = self.getFallbackOrder();
    // we read from avaiable positions removing it if it doesnt fit

    // when we've reached the end of the array no positions are left
  },

  maybeMoveElement() {
    const $anchor = self.getAnchor();
    const $anchorParent = $anchor.positioningParent();
    const $elParent = $el.positioningParent();

    // same positioning context
    if ($anchorParent.is($elParent)) {
      return;
    }

    // Move element and warn
    const targetParent = anchorParent || document.body;
    warn(`Moving anchored element to compatible positioning context`, {
      from: elParent,
      to: targetParent,
    });
    $el.detach().appendTo(containingEl);
  },

  attach() {
    if (!self.anchorName) {
      self.setAnchorName();
    }
    let attachCSS = {
      'position': 'absolute',
      'position-anchor': self.anchorName,
    };
    $el.css(attachCSS);
    self.setPosition();
  },

  refresh() {
  },

  reposition() {
    self.setPosition();
  },
});

const onDestroyed = ({ self }) => {
};

const events = {
  'global resize window, global scroll window'({ self, data, settings }) {
    requestAnimationFrame(self.reposition);
  },
};

const mutations = {};

export const Attach = registerBehavior({
  name: 'attach',
  namespace: 'attach',
  defaultSettings,
  events,
  mutations,
  createBehavior,
  onDestroyed,
  css,
});
