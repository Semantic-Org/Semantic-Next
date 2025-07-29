import { registerPlugin } from '@semantic-ui/query';
import { getText } from '@semantic-ui/utils';
const css = await getText('./query-tooltip.css');

const defaultSettings = {
  title: '',
  content: 'Tooltip content',
  position: 'top'
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
  }
};

const createPlugin = ({ $, $el, el, settings, self }) => ({

  updateTooltip({ title, content } = settings) {
    self.$tooltip
      .find('.title').html(title).end()
      .find('.content').html(content)
    ;
  },

  getTooltipPosition() {
    const rect = el.getBoundingClientRect();
    const tooltipHeight = self.$tooltip.get(0).offsetHeight;
    return {
      top: rect.top - tooltipHeight - 8,
      left: rect.left + (rect.width / 2),
    };
  },

  updateTooltipPosition(position) {
    self.$tooltip.css({
      ...position,
      transform: 'translateX(-50%)'
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
    console.log('position is', position);
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
  'global click document': ({ self, event }) => {
    if (!$(event.target).closest('.ui.tooltip').exists()) {
      $('.ui.tooltip').removeClass('visible');
      setTimeout(() => $('.ui.tooltip').remove(), 200);
    }
  },
  'mouseenter': ({ self, data }) => {
    self.show();
  },
  'mouseleave': ({ self, data }) => {
    self.hide();
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
