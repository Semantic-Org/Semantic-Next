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

  // X X X
  // X X X
  // X X X
  // list of positions permitted to try
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
    'center', // INSIDE
  ],

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

  positionMapping: {
    'top left': {
      'inset-block-end': 'anchor(top)',
      'inset-inline-start': 'anchor(left)',
    },
    'top': {
      'inset-block-end': 'anchor(top)',
      'inset-inline-start': 'anchor(center)',
      'translate': '-50% 0',
    },
    'top right': {
      'inset-block-end': 'anchor(top)',
      'inset-inline-end': 'anchor(right)',
    },
    'right bottom': {
      'inset-inline-start': 'anchor(right)',
      'inset-block-end': 'anchor(bottom)',
    },
    'right': {
      'inset-inline-start': 'anchor(right)',
      'inset-block-start': 'anchor(center)',
      'translate': '0 -50%',
    },
    'right top': {
      'inset-inline-start': 'anchor(right)',
      'inset-block-start': 'anchor(top)',
    },
    'bottom right': {
      'inset-block-start': 'anchor(bottom)',
      'inset-inline-end': 'anchor(right)',
    },
    'bottom': {
      'inset-block-start': 'anchor(bottom)',
      'inset-inline-start': 'anchor(center)',
      'translate': '-50% 0',
    },
    'bottom left': {
      'inset-block-start': 'anchor(bottom)',
      'inset-inline-start': 'anchor(left)',
    },
    'left bottom': {
      'inset-inline-end': 'anchor(left)',
      'inset-block-end': 'anchor(bottom)',
    },
    'left': {
      'inset-inline-end': 'anchor(left)',
      'inset-block-start': 'anchor(center)',
      'translate': '0 -50%',
    },
    'left top': {
      'inset-inline-end': 'anchor(left)',
      'inset-block-start': 'anchor(top)',
    },
    'center': {
      'inset-block-start': 'anchor(center)',
      'inset-inline-start': 'anchor(center)',
      'translate': '-50% -50%',
    },
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
    const positionCSS = self.positionMapping[position] || {};
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

  getFallbackOrder() {
    if (settings.fallbackStrategy) {
      return settings.fallbackStrategy;
    }
    const positions = position.split(' ');
    const verticalPosition = positions[0];
    const horizontalPosition = positions[1] || 'center';
    const opposite = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const adjacent = {
      left: 'center',
      center: 'right',
      right: 'left',
    };
    // get positions sorted by respected strategy
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
