import { registerBehavior } from '@semantic-ui/query';
import { inArray, isNumber } from '@semantic-ui/utils';

import css from './anchor.css?raw';

const defaultSettings = {
  to: '',
  width: 'natural',
  position: 'bottom',
  offset: 0, // offset on primary axis
  distanceAway: '1em', // distance offset
  allowOverlap: true, // whether to allow positioning overlapping if no room outside element
  alwaysShow: true, // whether to show anchor even if it cant fit
  anchorName: 'anchor-{count}',
  prefer: 'auto',
};

const classNames = {
  'attached': 'attached',
};

const errors = {};

const createBehavior = ({ $, $el, self, cache, settings }) => ({
  anchorName: null,

  positionMap: {
    top: 'block-start',
    bottom: 'block-end',
    left: 'inline-start',
    right: 'inlind-end',
  },

  initialize() {
    self.setAnchor();
    self.attach();
  },

  // add an anchor name if not currently set
  setAnchor() {
    const $anchor = self.getAnchor();
    let anchorName = $anchor.css('anchor-name');
    if (!anchorName) {
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
    return words.map(word => {
      return self.positionMap[word] || word;
    });
  },

  getPositionVisibility() {
    if (settings.alwaysShow) {
      return 'visible';
    }
    else {
      return 'no-overflow';
    }
  },

  getAnchorName({ allowSet = true } = {}) {
    let anchorName = self.anchorName;
    // we need to set one
    if (!self.anchorName && allowSet) {
      self.setAnchor();
      anchorName = self.anchorName;
    }
    return anchorName;
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
      return `${settings.distanceAway} px`;
    }
    return settings.distanceAway;
  },

  getDistanceAwayProperty() {
    if (settings.position.search(/top|bottom/) >= 0) {
      return 'insetBlockStart';
    }
    else {
      return 'insetInlineStart';
    }
  },

  getPositionTry() {
    if (settings.prefer == 'auto') {
      const sizePreference = inArray(settings.position, ['left', 'right'])
        ? 'most-width'
        : 'most-height';
      const directionPreference = settings.position.search(/left|right/) >= 0
        ? ' flip-inline, flip-block, flip-inline flip-block, flip-block flip-inline'
        : ' flip-block, flip-inline, flip-block flip-inline, flip-inline flip-block';
      const overlapPreference = (settings.allowOverlap)
        ? ', center'
        : '';
      return `${sizePreference}${directionPreference}${overlapPreference}`.trim();
    }
    return settings.prefer;
  },

  attach() {
    console.log(self.getPositionTry());
    const awayProp = self.getDistanceAwayProperty();
    $el.css({
      position: 'absolute',
      positionAnchor: self.getAnchorName(),
      positionArea: self.getPositionArea(),
      positionTry: self.getPositionTry(),
      positionVisibility: self.getPositionVisibility(),
      [awayProp]: self.getDistanceAway(),
    });
  },

  detach() {
    $el.css('position-anchor', null);
  },
});

export const Anchor = registerBehavior({
  name: 'anchor',
  namespace: 'anchor',
  defaultSettings,
  classNames,
  errors,
  createBehavior,
  css,
});
