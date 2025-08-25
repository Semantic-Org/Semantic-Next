import { registerBehavior } from '@semantic-ui/query';
import { inArray, isNumber } from '@semantic-ui/utils';

import css from './anchor.css?raw';

const defaultSettings = {
  to: '',
  position: 'bottom',
  offset: 0,
  distanceAway: '1em',
  allowOverlap: true,
  alwaysShow: true,
  anchorName: 'anchor-{count}',
  prefer: 'auto',
  detectPosition: true,
};

const classNames = {
  anchored: 'anchored',
};

const events = {
  'global resize window': function({ self }) {
    self.checkPositionChange();
  },
  'global scroll window': function({ self }) {
    self.checkPositionChange();
  },
};

const mutations = {
  'attributes': function({ self, attributeName }) {
    if (attributeName === 'style' && self.settings.detectPosition) {
      self.checkPositionChange();
    }
  },
};

const createBehavior = ({ $, $el, self, cache, settings, classNames, error, debug }) => ({
  anchorName: null,
  lastPosition: null,
  resizeObserver: null,
  positionCheckTimeout: null,

  positionMap: {
    top: 'block-start',
    bottom: 'block-end',
    left: 'inline-start',
    right: 'inline-end',
  },

  initialize() {
    self.setAnchor();
    self.attach();
    if (settings.detectPosition) {
      self.setupPositionMonitoring();
    }
  },

  setAnchor() {
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

  getAnchor() {
    return $(settings.to);
  },

  getPositionArea() {
    const words = settings.position.split(' ');
    const mapped = words.map(word => self.positionMap[word] || word);
    return mapped.join(' ');
  },

  getPositionVisibility() {
    return settings.alwaysShow ? 'always' : 'no-overflow';
  },

  getNextAnchorName() {
    if (!cache.count) {
      cache.count = 0;
    }
    cache.count++;
    const anchorName = settings.anchorName.replace('{count}', cache.count);
    return `--${anchorName}`;
  },

  getDistanceAway() {
    if (isNumber(settings.distanceAway)) {
      return `${settings.distanceAway}px`;
    }
    return settings.distanceAway;
  },

  detectAppliedPosition() {
    const el = $el.el();
    const $anchor = self.getAnchor();
    if (!$anchor.exists()) { return null; }

    const anchorEl = $anchor.el();
    const rect = el.getBoundingClientRect();
    const anchorRect = anchorEl.getBoundingClientRect();

    // Check if element or anchor is hidden
    if (
      (rect.width === 0 && rect.height === 0)
      || (anchorRect.width === 0 && anchorRect.height === 0)
    ) {
      return 'hidden';
    }

    const tolerance = 2;

    // Determine vertical position
    let vertical = null;
    const centerY = rect.top + rect.height / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;

    if (rect.bottom <= anchorRect.top + tolerance) {
      vertical = 'top';
    }
    else if (rect.top >= anchorRect.bottom - tolerance) {
      vertical = 'bottom';
    }
    else if (Math.abs(centerY - anchorCenterY) < tolerance) {
      vertical = 'center';
    }

    // Determine horizontal position
    let horizontal = null;
    const centerX = rect.left + rect.width / 2;
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;

    if (rect.right <= anchorRect.left + tolerance) {
      horizontal = 'left';
    }
    else if (rect.left >= anchorRect.right - tolerance) {
      horizontal = 'right';
    }
    else if (Math.abs(centerX - anchorCenterX) < tolerance) {
      horizontal = 'center';
    }

    // Format position string
    if (vertical === 'center' && horizontal === 'center') {
      return 'center';
    }
    else if (vertical === 'center') {
      return horizontal;
    }
    else if (horizontal === 'center') {
      return vertical;
    }
    else if (vertical && horizontal) {
      return `${vertical} ${horizontal}`;
    }

    return null;
  },

  updatePositionAttribute() {
    const position = self.detectAppliedPosition();

    if (position === self.lastPosition) {
      return;
    }

    if (position) {
      $el.attr('data-position', position);
    }

    const previousPosition = self.lastPosition;
    self.lastPosition = position;

    self.dispatchEvent('positionChanged', {
      position,
      previousPosition,
    });

    debug('Position changed to:', position);
  },

  setupPositionMonitoring() {
    if (window.ResizeObserver) {
      self.resizeObserver = new ResizeObserver(() => {
        self.checkPositionChange();
      });

      const el = $el.el();
      const anchorEl = self.getAnchor().el();

      self.resizeObserver.observe(el);
      if (anchorEl) {
        self.resizeObserver.observe(anchorEl);
      }
    }

    // Initial check after render
    requestAnimationFrame(() => {
      self.updatePositionAttribute();
    });
  },

  getPositionTry() {
    if (settings.prefer === 'auto') {
      const sizePreference = inArray(settings.position, ['left', 'right'])
        ? 'most-width'
        : 'most-height';
      const flips = 'flip-block, flip-inline, flip-block flip-inline';
      const overlap = settings.allowOverlap ? ', center' : '';
      return `${sizePreference} ${flips}${overlap}`;
    }
    return settings.prefer;
  },

  attach() {
    const cssProps = {
      position: 'absolute',
      'position-anchor': self.anchorName,
      'position-area': self.getPositionArea(),
      'position-visibility': self.getPositionVisibility(),
    };

    const distanceAway = self.getDistanceAway();
    if (settings.position.includes('top') || settings.position.includes('bottom')) {
      cssProps['margin-block'] = distanceAway;
    }
    else {
      cssProps['margin-inline'] = distanceAway;
    }

    if (settings.prefer) {
      cssProps['position-try'] = self.getPositionTry();
    }

    $el.css(cssProps);
    $el.addClass(classNames.anchored);
  },

  detach() {
    $el.css({
      'position-anchor': null,
      'position-area': null,
      'position-try': null,
      'position-visibility': null,
      'margin-block': null,
      'margin-inline': null,
    });
    $el.removeClass(classNames.anchored);
    $el.removeAttr('data-position');
  },
  checkPositionChange() {
    if (self.frameRequest) {
      cancelAnimationFrame(self.frameRequest);
    }
    self.frameRequest = requestAnimationFrame(() => {
      self.updatePositionAttribute();
      self.frameRequest = null;
    });
  },
});

const onDestroyed = ({ self }) => {
  if (self.resizeObserver) {
    self.resizeObserver.disconnect();
  }
  if (self.positionCheckTimeout) {
    clearTimeout(self.positionCheckTimeout);
  }
  self.detach();
};

export const Anchor = registerBehavior({
  name: 'anchor',
  namespace: 'anchor',
  defaultSettings,
  classNames,
  events,
  mutations,
  createBehavior,
  onDestroyed,
  css,
});
