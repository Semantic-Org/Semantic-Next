import { registerBehavior } from '@semantic-ui/query';
import { isString, noop, tokenize } from '@semantic-ui/utils';

import { Attach } from '../attach/attach.js';
import { Escape } from '../escape/escape.js';
import { Transition } from '../transition/transition.js';

import css from './tooltip.css?raw';

/*
  Tooltip behavior - attaches floating content to a trigger element
  with automatic positioning, transitions, and top layer escape.

  Uses: attach (positioning), transition (animations), escape (top layer)

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
  warmWindow: 1200,

  // show pointing arrow
  arrow: true,

  // whether should render in top layer
  topLayer: false,

  // distance away from trigger
  distance: 0,

  // offset along edge
  offset: 0,

  // keep tooltip in DOM after hiding (false = remove after hide)
  preserve: true,

  // allow hovering over tooltip without it closing
  hoverable: false,

  // whether to contain tooltip to scroll container (passed to attach)
  containToScroll: true,

  // callbacks (onShow/onHide can return false or Promise<false> to cancel)
  onShow: noop,
  onHide: noop,
  onVisible: noop,
  onHidden: noop,
};

const classNames = {
  tooltip: 'tooltip',
  visible: 'visible',
  hidden: 'hidden',
};

const templates = {
  tooltip: '<div class="ui tooltip"><div class="content"></div></div>',
};

// Shared state across all tooltip instances
const setup = () => ({
  shared: {
    lastInteraction: 0, // timestamp of last tooltip interaction
  },
});

const createBehavior = ({ $, el, $el, self, settings, classNames, templates, dispatchEvent, log, warn }) => ({
  $tooltip: null,
  showTimer: null,
  hideTimer: null,
  isVisible: false,
  position: null,
  createdTooltip: false,

  initialize() {
    self.createTooltip();
    self.bindTriggerEvents();
  },

  createTooltip() {
    // Build content from settings
    const content = self.buildContent();
    if (!content) {
      warn('No tooltip content provided');
      return;
    }

    // Get position from settings
    self.position = settings.position;

    const $existingTooltip = $(el).next(`.${classNames.tooltip}`);
    if (settings.$tooltip) {
      self.tooltip = $tooltip;
    }
    else if ($existingTooltip.exists()) {
      self.$tooltip = $existingTooltip;
    }
    else {
      self.createdTooltip = true;
      // Create tooltip element and insert after trigger
      self.$tooltip = $(templates.tooltip)
        .addClass(classNames.hidden)
        .children('.content')
        .html(content)
        .end()
        .insertAfter(el);
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

  getTooltip() {
    return self.$tooltip;
  },
  setHeader(text) {
    self.$tooltip.children('.content').children('.header').text(text);
  },
  setText(text) {
    self.$tooltip.children('.content').children('.text').text(text);
  },
  setHTML(html) {
    self.$tooltip.html(html);
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

  async show() {
    if (self.isVisible) {
      return;
    }

    // Recreate tooltip if it was removed
    if (!self.$tooltip) {
      self.createTooltip();
    }

    // Allow onShow to cancel by returning false (supports async)
    if (await Promise.resolve(settings.onShow.call(el)) === false) {
      return;
    }

    self.$tooltip.removeClass(classNames.hidden);

    // Mark interaction for shared warm timer
    self.shared.lastInteraction = Date.now();

    self.isVisible = true;
    dispatchEvent('show');

    if (settings.topLayer) {
      self.$tooltip.escape('show');
    }

    // Promote to top layer (creates escape behavior on first call)
    self.$tooltip
      .attach({
        to: el,
        position: self.position,
        arrow: settings.arrow,
        distance: settings.distance,
        offset: settings.offset,
        containToScroll: settings.containToScroll,
      });

    // Animate in with direction-aware animation
    const animation = self.getAnimation();
    await self.$tooltip.transition(`${animation} in`, settings.duration);

    if (!self.isVisible) {
      return;
    }

    self.$tooltip.addClass(classNames.visible);
    settings.onVisible.call(el);
    dispatchEvent('visible');
  },

  async hide() {
    if (!self.$tooltip || !self.isVisible) {
      return;
    }

    // Allow onHide to cancel by returning false (supports async)
    if (await Promise.resolve(settings.onHide.call(el)) === false) {
      return;
    }

    self.$tooltip.removeClass(classNames.visible);
    self.isVisible = false;
    dispatchEvent('hide');

    // Animate out with direction-aware animation
    const animation = self.getAnimation();
    await self.$tooltip.transition(`${animation} out`, settings.duration);

    if (self.isVisible) {
      return;
    }

    // Remove from DOM if not preserving
    if (!settings.preserve && self.$tooltip) {
      self.$tooltip.remove();
      self.$tooltip = null;
    }
    else {
      if (settings.topLayer) {
        self.$tooltip.escape('hide');
      }
      self.$tooltip.addClass(classNames.hidden);
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
    self.$tooltip = null;
    if (self.createdTooltip) {
      self.$tooltip.remove();
    }
  }
};

const customInvocation = ({ self, methodName, methodArgs }) => {
  // Handle string content as shorthand: $el.tooltip('My content')
  if (isString(methodName) && !self[methodName]) {
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
