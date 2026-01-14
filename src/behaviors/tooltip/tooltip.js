import { registerBehavior } from '@semantic-ui/query';
import { isString, noop, tokenize } from '@semantic-ui/utils';

import css from './tooltip.css?raw';

/*
  Tooltip behavior - attaches floating content to a trigger element
  with automatic positioning, transitions, and optional portaling.

  Uses: attach (positioning), transition (animations), portal (optional)

  Settings:
  ┌──────────────┬──────────────────┬─────────────────────────────────────────────────┐
  │ Setting      │ Default          │ Description                                     │
  ├──────────────┼──────────────────┼─────────────────────────────────────────────────┤
  │ content      │ ''               │ Tooltip text (or use data-tooltip on trigger)  │
  │ position     │ 'top'            │ Position relative to trigger                   │
  │ trigger      │ 'hover'          │ Event to show tooltip: 'hover', 'focus', 'click', 'manual' │
  │ animation    │ 'auto'           │ Transition animation (auto = based on position)│
  │ duration     │ 'auto'           │ Animation duration                             │
  │ delay        │ 1000             │ Delay before showing (ms)                      │
  │ hideDelay    │ 70               │ Delay before hiding (ms)                       │
  │ warmWindow   │ 1000             │ Skip delay if tooltip shown within this period │
  │ arrow        │ true             │ Whether to show pointing arrow                 │
  │ portal       │ false            │ Portal tooltip to body to escape stacking      │
  │ distance     │ 0                │ Distance from trigger element                  │
  │ offset       │ 0                │ Offset along the edge                          │
  │ preserve     │ true             │ Keep tooltip in DOM after hiding               │
  │ hoverable    │ false            │ Allow hovering over tooltip without closing    │
  └──────────────┴──────────────────┴─────────────────────────────────────────────────┘

  Usage:
  - `$('.trigger').tooltip()` - Uses data-tooltip attribute for content
  - `$('.trigger').tooltip({ content: 'Hello' })` - Explicit content
  - `$('.trigger').tooltip('show')` - Show programmatically
  - `$('.trigger').tooltip('hide')` - Hide programmatically
  - `$('.trigger').tooltip('toggle')` - Toggle visibility
  - `$('.trigger').tooltip('destroy')` - Clean up
*/

const defaultSettings = {
  // tooltip content options (can combine header + text)
  html: '', // raw HTML content
  text: '', // text wrapped in <div class="text">
  header: '', // header wrapped in <div class="header">

  // position relative to trigger
  position: 'top',

  // what triggers the tooltip: 'hover', 'focus', 'click', 'manual'
  trigger: 'hover',

  // transition animation (auto = based on position direction)
  animation: 'auto',

  // animation duration
  duration: 'auto',

  // delay before showing (ms) - prevents accidental triggering
  delay: 200,

  // delay before hiding (ms) - provides grace period for hoverable
  hideDelay: 70,

  // warm timer duration (ms) - skip delay if tooltip shown within this period
  warmWindow: 1500,

  // show pointing arrow
  arrow: true,

  // portal to body to escape overflow/stacking contexts
  portal: false,

  // distance away from trigger
  distance: 0,

  // offset along edge
  offset: 0,

  // keep tooltip in DOM after hiding (false = remove after hide)
  preserve: true,

  // allow hovering over tooltip without it closing
  hoverable: false,

  // callbacks
  onShow: noop,
  onHide: noop,
  onVisible: noop,
  onHidden: noop,
};

const classNames = {
  tooltip: 'ui-tooltip',
  visible: 'visible',
  hidden: 'hidden',
};

const templates = {
  tooltip: '<div class="ui-tooltip"><div class="content"></div></div>',
};

// Shared state across all tooltip instances
const setup = () => ({
  shared: {
    lastInteraction: 0, // timestamp of last tooltip interaction
  },
});

const createBehavior = ({ $, el, $el, self, settings, classNames, templates, dispatchEvent, log }) => ({
  $tooltip: null,
  showTimer: null,
  hideTimer: null,
  isVisible: false,
  position: null,

  initialize() {
    self.createTooltip();
    self.bindTriggerEvents();
  },

  createTooltip() {
    // Build content from settings
    const content = self.buildContent();
    if (!content) {
      log.warn('No tooltip content provided');
      return;
    }

    // Get position from settings
    self.position = settings.position;

    // Create tooltip element and insert after trigger
    self.$tooltip = $(templates.tooltip)
      .addClass(classNames.hidden)
      .children('.content')
      .html(content)
      .end()
      .insertAfter(el);

    // Portal if requested
    if (settings.portal) {
      self.$tooltip.portal();
    }

    // Bind events to tooltip
    self.bindTooltipEvents();
  },

  bindTooltipEvents() {
    if (!self.$tooltip) {
      return;
    }
    // When hoverable, allow cursor to move to tooltip without closing
    if (settings.hoverable && settings.trigger === 'hover') {
      self.$tooltip
        .on('mouseenter', self.handleMouseEnter)
        .on('mouseleave', self.handleMouseLeave);
    }
  },

  buildContent() {
    // Raw HTML takes precedence
    if (settings.html) {
      return settings.html;
    }

    // Build structured content from header/text
    let content = '';
    if (settings.header) {
      content += `<div class="header">${settings.header}</div>`;
    }
    if (settings.text) {
      content += `<div class="text">${settings.text}</div>`;
    }

    return content;
  },

  bindTriggerEvents() {
    const trigger = settings.trigger;

    if (trigger === 'hover') {
      $el.on('mouseenter', self.handleMouseEnter)
        .on('mouseleave', self.handleMouseLeave);
    }
    else if (trigger === 'focus') {
      $el.on('focusin', self.handleShow)
        .on('focusout', self.handleHide);
    }
    else if (trigger === 'click') {
      $el.on('click', self.handleToggle);
    }
    // 'manual' trigger requires programmatic control
  },

  isWarm() {
    return Date.now() - self.shared.lastInteraction < settings.warmWindow;
  },

  handleMouseEnter() {
    self.clearTimers();

    const delay = self.isWarm() ? 0 : settings.delay;

    if (delay > 0) {
      self.showTimer = setTimeout(() => self.show(), delay);
    }
    else {
      self.show();
    }
  },

  handleMouseLeave() {
    self.clearTimers();
    if (settings.hideDelay > 0) {
      self.hideTimer = setTimeout(() => self.hide(), settings.hideDelay);
    }
    else {
      self.hide();
    }
  },

  handleShow() {
    self.clearTimers();
    if (settings.delay > 0) {
      self.showTimer = setTimeout(() => self.show(), settings.delay);
    }
    else {
      self.show();
    }
  },

  handleHide() {
    self.clearTimers();
    if (settings.hideDelay > 0) {
      self.hideTimer = setTimeout(() => self.hide(), settings.hideDelay);
    }
    else {
      self.hide();
    }
  },

  handleToggle() {
    if (self.isVisible) {
      self.hide();
    }
    else {
      self.show();
    }
  },

  clearTimers() {
    if (self.showTimer) {
      clearTimeout(self.showTimer);
      self.showTimer = null;
    }
    if (self.hideTimer) {
      clearTimeout(self.hideTimer);
      self.hideTimer = null;
    }
  },

  // Get animation based on position (matches attach position names)
  getAnimation() {
    if (settings.animation !== 'auto') {
      return settings.animation;
    }
    const position = self.position || 'top';
    return `pop-${tokenize(position)}`;
  },

  async show() {
    if (self.isVisible) {
      return;
    }

    // Recreate tooltip if it was removed
    if (!self.$tooltip) {
      self.createTooltip();
    }

    // Mark interaction for shared warm timer
    self.shared.lastInteraction = Date.now();

    self.isVisible = true;
    settings.onShow.call(el);
    dispatchEvent('show');

    // Attach to trigger for positioning
    self.$tooltip.attach({
      to: el,
      position: self.position,
      arrow: settings.arrow,
      distance: settings.distance,
      offset: settings.offset,
    });

    // Animate in with direction-aware animation
    const animation = self.getAnimation();
    await self.$tooltip.transition(`${animation} in`, settings.duration);
    settings.onVisible.call(el);
    dispatchEvent('visible');
  },

  async hide() {
    if (!self.$tooltip || !self.isVisible) {
      return;
    }

    self.isVisible = false;
    settings.onHide.call(el);
    dispatchEvent('hide');

    // Animate out with direction-aware animation
    const animation = self.getAnimation();
    await self.$tooltip.transition(`${animation} out`, settings.duration);

    // Remove from DOM if not preserving
    if (!settings.preserve && self.$tooltip) {
      self.$tooltip.remove();
      self.$tooltip = null;
    }

    settings.onHidden.call(el);
    dispatchEvent('hidden');
  },

  toggle() {
    if (self.isVisible) {
      self.hide();
    }
    else {
      self.show();
    }
  },

  setContent({ html, text, header } = {}) {
    if (!self.$tooltip) {
      return;
    }
    if (html) {
      self.$tooltip.html(html);
    }
    else {
      let content = '';
      if (header) {
        content += `<div class="header">${header}</div>`;
      }
      if (text) {
        content += `<div class="text">${text}</div>`;
      }
      if (content) {
        self.$tooltip.html(content);
      }
    }
  },

  setPosition(position) {
    if (self.$tooltip && self.isVisible) {
      self.$tooltip.attach({
        to: el,
        position: position,
        arrow: settings.arrow,
        distance: settings.distance,
        offset: settings.offset,
      });
    }
  },

  isShown() {
    return self.isVisible;
  },
});

const onDestroyed = ({ self }) => {
  self.clearTimers();
  if (self.$tooltip) {
    self.$tooltip.remove();
    self.$tooltip = null;
  }
};

const customInvocation = ({ self, methodName, methodArgs }) => {
  // Handle string content as shorthand: $el.tooltip('My content')
  if (isString(methodName) && !!self[methodName]) {
    // Treat as content
    self.setContent(methodName);
    return;
  }
};

export const Tooltip = registerBehavior({
  name: 'tooltip',
  namespace: 'tooltip',
  defaultSettings,
  classNames,
  templates,
  css,
  setup,
  createBehavior,
  onDestroyed,
  customInvocation,
});
