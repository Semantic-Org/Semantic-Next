import { registerBehavior } from '@semantic-ui/query';
import { each, inArray, isNumber, keys } from '@semantic-ui/utils';

import css from './anchor.css?raw';

const defaultSettings = {
  to: '',
  position: '',
  offset: 0,
  distance: 14,
  allowOverlap: true, // allow element to be placed inside bounds of anchored element as last resort
  alwaysShow: false, // always show element regardless of whether it fits
  anchorName: 'anchor-{count}',
  prefer: 'auto',
  detectPosition: true,
  moveElement: true,
  arrow: true,
  containToScroll: true, // make clipping containers act as boundaries for position-try
};

const classNames = {
  anchored: 'anchored',
};

const createBehavior = ({ $, $el, self, cache, settings, classNames, error, debug, warn }) => ({
  anchorName: null,
  lastPosition: null,
  resizeObserver: null,
  $clippingParent: null,

  // when specifying anchor positioning values preserving RTL
  positionConfig: {
    'top': 'block-start',
    'top left': 'block-start inline-start',
    'top right': 'block-start inline-end',
    'top center': 'block-start center',
    'bottom': 'block-end',
    'bottom left': 'block-end inline-start',
    'bottom right': 'block-end inline-end',
    'bottom center': 'block-end center',
    'left': 'inline-start',
    'left top': 'inline-start block-start',
    'left bottom': 'inline-start block-end',
    'left center': 'inline-start block-center',
    'right': 'inline-end',
    'right top': 'inline-end block-start',
    'right bottom': 'inline-end block-end',
    'right center': 'inline-end block-center',
    'center': 'center',
  },

  initialize() {
    self.setAnchor();
    if (settings.containToScroll) {
      self.setupClippingBoundary();
    }
    self.attach();
    if (settings.arrow || settings.detectPosition) {
      self.setupPositionMonitoring();
    }
    if (settings.arrow) {
      $el.attr('data-arrow', '');
    }
    if (settings.moveElement) {
      self.maybeMoveElement();
    }
  },

  refresh() {
    self.updatePositionAttribute();
  },

  setupClippingBoundary() {
    const $anchor = self.getAnchor();
    const $clippingParent = $anchor.clippingParent();
    const $offsetParent = $anchor.offsetParent();
    const clippingEl = $clippingParent.el();
    const containingEl = $offsetParent.el();

    // anchor spec does not include all things that can clip as relevent to anchor positioning
    // the most common oversight is overflow: auto not causing clipping.
    if (containingEl !== clippingEl) {
      // no need to update positioning context
      if ($clippingParent.is('body, html')) {
        return;
      }

      self.$clippingParent = $clippingParent;

      // multiple anchors might be modifying same clipping parent
      let refCount = parseInt($clippingParent.data('anchorRefCount') || 0, 10);
      if (refCount === 0) {
        // First one - store original and modify
        $clippingParent.data('originalPosition', $clippingParent.css('position'));
        $clippingParent.css('position', 'relative');
        debug('Made clipping parent a containing block', $clippingParent.el());
      }

      $clippingParent.data('anchorRefCount', refCount + 1);
    }
  },

  maybeMoveElement() {
    const $anchor = self.getAnchor();
    const anchorParent = $anchor.offsetParent().el();
    const elParent = $el.offsetParent().el();

    // if we are already in a good position do nothing
    if (!elParent) {
      return;
    }
    if (anchorParent === elParent || $anchor.closest(elParent).exists()) {
      return;
    }

    // Move element and warn
    const targetParent = anchorParent || document.body;
    warn(`Moving anchored element to compatible positioning context`, {
      from: elParent,
      to: targetParent,
    });
    self.moveElement(targetParent);
  },

  /* not implemented currently, conceptually relevent for position: 'auto' */
  getBestPosition() {
    const anchorEl = self.getAnchor().el();
    const anchorRect = anchorEl.getBoundingClientRect();
    const $clip = self.getAnchor().clippingParent();
    const clipRect = $clip.el().getBoundingClientRect();

    const space = {
      top: anchorRect.top - clipRect.top,
      bottom: clipRect.bottom - anchorRect.bottom,
      left: anchorRect.left - clipRect.left,
      right: clipRect.right - anchorRect.right,
    };

    const max = Math.max(...Object.values(space));
    return Object.keys(space).find(key => space[key] === max);
  },

  moveElement(containingEl) {
    $el.detach().appendTo(containingEl);
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

  getPositions() {
    return keys(self.positionConfig);
  },

  getPositionConfig(position = settings.position) {
    return self.positionConfig[position];
  },

  parsePositionLogical(position = settings.position) {
    const cssLogical = self.getPositionConfig(position);
    if (!cssLogical) { return null; }

    const parts = cssLogical.split(' ');
    const majorAxis = parts[0]; // 'block-start', 'block-end', 'inline-start', 'inline-end', 'center'
    const minorAxis = parts[1]; // 'inline-start', 'inline-end', 'block-start', 'block-end', undefined

    return {
      majorAxis: majorAxis.startsWith('block') ? 'block' : majorAxis.startsWith('inline') ? 'inline' : null,
      majorAlign: majorAxis.split('-')[1], // 'start', 'end', 'center'
      minorAxis: minorAxis ? (minorAxis.startsWith('block') ? 'block' : 'inline') : null,
      minorAlign: minorAxis ? minorAxis.split('-')[1] : 'center', // 'start', 'end', 'center'
      cssLogical: cssLogical,
    };
  },

  getPositionArea() {
    const cssLogical = self.getPositionConfig();
    if (cssLogical) {
      return cssLogical;
    }
    // Fallback to original mapping logic if not in config
    const words = settings.position.split(' ');
    const positionMap = {
      top: 'block-start',
      bottom: 'block-end',
      left: 'inline-start',
      right: 'inline-end',
    };
    const mapped = words.map(word => positionMap[word] || word);
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

  getDistance() {
    if (isNumber(settings.distance)) {
      return `${settings.distance}px`;
    }
    return settings.distance;
  },
  getOffset() {
    let offset = settings.offset;
    if (settings.arrow) {
      const arrowDistance = self.getArrowDistance();
      offset -= arrowDistance;
    }
    if (isNumber(offset)) {
      return `${offset}px`;
    }
    return offset || '0px';
  },

  getArrowDistance() {
    if (!settings.arrow) { return 0; }

    const parsed = self.parsePositionLogical();
    if (!parsed) { return 0; }

    const isCentered = parsed.minorAlign === 'center';

    if (isCentered) {
      // Centered arrows (top, bottom, left, right) - no offset
      return 0;
    }

    // Corner arrows - get base distance and apply directional adjustment
    const baseDistance = parseFloat($el.cssVar('arrow-distance-corner')) || 26; // 1em + 10px fallback

    // Apply directional adjustment based on minor axis alignment
    if (parsed.minorAlign === 'start') {
      // For 'start' alignments - arrow is on start side, offset negatively
      return -baseDistance;
    }
    else if (parsed.minorAlign === 'end') {
      // For 'end' alignments - arrow is on end side, offset positively
      return baseDistance;
    }

    return 0; // Fallback
  },

  getDistancePx() {
    // Convert distance setting to pixels for calculations
    if (isNumber(settings.distance)) {
      return settings.distance;
    }
    // For now, assume non-numeric distances are 14px (could enhance later)
    return 14;
  },

  getOffsetPx() {
    // Convert offset setting to pixels for calculations
    let offset = settings.offset;
    if (settings.arrow) {
      offset -= 14; // Same adjustment as getOffset()
    }
    return isNumber(offset) ? offset : 0;
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

    // Popup corners
    const popupCorners = [
      [rect.left, rect.top], // top-left
      [rect.right, rect.top], // top-right
      [rect.left, rect.bottom], // bottom-left
      [rect.right, rect.bottom], // bottom-right
    ];

    // Anchor reference points (excluding center - handle as special case)
    const anchorPoints = {
      'top': [anchorRect.left + anchorRect.width / 2, anchorRect.top],
      'top left': [anchorRect.left, anchorRect.top],
      'top center': [anchorRect.left + anchorRect.width / 2, anchorRect.top],
      'top right': [anchorRect.right, anchorRect.top],
      'bottom': [anchorRect.left + anchorRect.width / 2, anchorRect.bottom],
      'bottom left': [anchorRect.left, anchorRect.bottom],
      'bottom center': [anchorRect.left + anchorRect.width / 2, anchorRect.bottom],
      'bottom right': [anchorRect.right, anchorRect.bottom],
      'left': [anchorRect.left, anchorRect.top + anchorRect.height / 2],
      'left top': [anchorRect.left, anchorRect.top],
      'left center': [anchorRect.left, anchorRect.top + anchorRect.height / 2],
      'left bottom': [anchorRect.left, anchorRect.bottom],
      'right': [anchorRect.right, anchorRect.top + anchorRect.height / 2],
      'right top': [anchorRect.right, anchorRect.top],
      'right center': [anchorRect.right, anchorRect.top + anchorRect.height / 2],
      'right bottom': [anchorRect.right, anchorRect.bottom],
    };

    // Check for center first - when popup is fully contained within anchor
    const allCornersInside = popupCorners.every(([x, y]) =>
      x >= anchorRect.left && x <= anchorRect.right
      && y >= anchorRect.top && y <= anchorRect.bottom
    );

    if (allCornersInside) {
      return 'center';
    }

    let minDistance = Infinity;
    let closestPosition = null;

    for (const [position, anchorPoint] of Object.entries(anchorPoints)) {
      // Find closest popup corner to this anchor point
      const distanceToAnchorPoint = Math.min(
        ...popupCorners.map(corner => Math.hypot(corner[0] - anchorPoint[0], corner[1] - anchorPoint[1])),
      );

      if (distanceToAnchorPoint < minDistance) {
        minDistance = distanceToAnchorPoint;
        closestPosition = position;
      }
    }

    return closestPosition;
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
    if (!window.ResizeObserver) {
      return;
    }
    self.resizeObserver = new ResizeObserver(self.checkPositionChange);
    const el = $el.el();
    const anchorEl = self.getAnchor().el();
    self.resizeObserver.observe(el);
    if (anchorEl) {
      self.resizeObserver.observe(anchorEl);
    }
    // Initial check after render
    requestAnimationFrame(self.updatePositionAttribute);
  },

  getPositionTry() {
    if (settings.prefer === 'auto') {
      const sizePreference = inArray(settings.position, ['left', 'right'])
        ? 'most-height'
        : 'most-width';
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
      'margin-block-start': '',
      'margin-inline-start': '',
    };

    const distance = self.getDistance();
    const offset = self.getOffset();

    // Apply distance away on primary axis
    if (settings.position.includes('top') || settings.position.includes('bottom')) {
      if (distance !== '0px') {
        cssProps['margin-block'] = distance;
      }
      // Apply offset on minor axis using margin
      if (offset !== '0px') {
        cssProps['margin-inline-start'] = offset;
      }
    }
    else if (settings.position.includes('left') || settings.position.includes('right')) {
      if (distance !== '0px') {
        cssProps['margin-inline'] = distance;
      }
      // Apply offset on minor axis using margin
      if (offset !== '0px') {
        cssProps['margin-block-start'] = offset;
      }
    }

    if (settings.prefer) {
      cssProps['position-try'] = self.getPositionTry();
    }

    $el
      .css(cssProps)
      .addClass(classNames.anchored);

    self.updatePositionAttribute();
  },

  detach() {
    $el
      .css({
        'position-anchor': null,
        'position-area': null,
        'position-try': null,
        'position-visibility': null,
        'margin-block': null,
        'margin-inline': null,
        'margin-block-start': null,
        'margin-inline-start': null,
      })
      .removeClass(classNames.anchored)
      .removeAttr('data-position');
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

  // Restore original position if we modified clipping parent
  if (self.$clippingParent) {
    let refCount = self.$clippingParent.data('anchorRefCount', 10) || 0;
    refCount--;

    if (refCount === 0) {
      // Last one - restore and clean up
      const originalPosition = self.$clippingParent.data('originalPosition');
      self.$clippingParent.css('position', originalPosition || null);
      self.$clippingParent.removeData(['originalPosition', 'anchorRefCount']);
    }
    else {
      self.$clippingParent.data('anchorRefCount', refCount);
    }
  }

  self.detach();
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
