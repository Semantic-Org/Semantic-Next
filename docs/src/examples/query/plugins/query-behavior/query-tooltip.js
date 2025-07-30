import { registerPlugin } from '@semantic-ui/query';
import { getText } from '@semantic-ui/utils';
const css = await getText('./query-tooltip.css');

const defaultSettings = {
  title: 'Default Title',
  content: 'Default Content',
  showDelay: 50,
  hideDelay: 500,
};

const templates = {
  tooltip: `
  <div class="ui tooltip">
    <div class="title"></div>
    <div class="content"></div>
  </div>`
};

// Create shared tooltip across all three boxes
const setup = ({ $, templates }) => {
  return {
    $tooltip: $(templates.tooltip).appendTo('body')
  };
};

const createPlugin = ({ $, el, settings, self }) => ({

  updateTooltip() {
    self.$tooltip
      .find('.title').html(settings.title).end()
      .find('.content').html(settings.content)
    ;
  },

  getTooltipPosition() {
    const rect = el.getBoundingClientRect();
    const tooltipHeight = self.$tooltip.get(0).offsetHeight;
    return {
      top: rect.top - tooltipHeight - 8,
      left: rect.left,
    };
  },

  updateTooltipPosition(position) {
    self.$tooltip.css({
      ...position
    });
  },

  isVisible() {
    return self.$tooltip.hasClass('visible');
  },

  show() {
    // Hide any existing tooltip
    self.hide();
    self.updateTooltip();

    const position = self.getTooltipPosition();
    self.updateTooltipPosition(position);
    self.doShow();
  },

  doShow() {
    requestAnimationFrame(() => {
      self.$tooltip.addClass('visible');
    });
  },

  hide() {
    if (self.$tooltip) {
      self.$tooltip.removeClass('visible');
    }
  },

  toggle() {
    if (self.isVisible()) {
      self.hide();
    }
    else {
      self.show();
    }
  },
});


const events = {
  'global click body': ({ self }) => {
    self.hide();
  },
  'mouseenter': ({ self, settings }) => {
    clearTimeout(window.hideTimer);
    window.showTimer = setTimeout(self.show, settings.showDelay);
  },
  'mouseleave': ({ self, settings }) => {
    clearTimeout(window.showTimer);
    window.hideTimer = setTimeout(self.hide, settings.hideDelay);
  },
};

registerPlugin({
  name: 'tooltip',
  css,
  defaultSettings,
  setup,
  events,
  templates,
  createPlugin,
});
