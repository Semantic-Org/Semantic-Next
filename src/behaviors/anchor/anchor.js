import { registerBehavior } from '@semantic-ui/query';
import { inArray, isNumber } from '@semantic-ui/utils';

import css from './anchor.css?raw';

const defaultSettings = {
  to: '',
  position: '',
  offset: 0,
  distance: '1em',
  allowOverlap: true, // allow element to be placed inside bounds of anchored element as last resort
  alwaysShow: false, // always show element regardless of whether it fits
  anchorName: 'anchor-{count}',
  prefer: 'auto',
  detectPosition: true,
  moveElement: true,
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

  positionMap: {
    top: 'block-start',
    bottom: 'block-end',
    left: 'inline-start',
    right: 'inline-end',
  },

  initialize() {
    self.setAnchor();
    if (settings.containToScroll) {
      self.setupClippingBoundary();
    }
    self.attach();
    if (settings.detectPosition) {
      self.setupPositionMonitoring();
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
    const $containingParent = $anchor.containingParent();

    // anchor spec does not include all things that can clip as relevent to anchor positioning
    // the most common oversight is overflow: auto not causing clipping.
    if ($clippingParent.el() !== $containingParent.el()) {
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
    const anchorParent = $anchor.containingParent().el();
    const elParent = $el.containingParent().el();

    // if we are already in a good position do nothing
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

  getDistance() {
    if (isNumber(settings.distance)) {
      return `${settings.distance}px`;
    }
    return settings.distance;
  },
  getOffset() {
    if (isNumber(settings.offset)) {
      return `${settings.offset}px`;
    }
    return settings.offset || '0px';
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
    let refCount = parseInt(self.$clippingParent.data('anchorRefCount') || 0);
    refCount--;

    if (refCount === 0) {
      // Last one - restore and clean up
      const originalPosition = self.$clippingParent.data('originalPosition');
      self.$clippingParent.css('position', originalPosition || null);
      self.$clippingParent.removeAttr('data-original-position data-anchor-ref-count');
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
