import { registerPlugin } from '@semantic-ui/query';
import { getText } from '@semantic-ui/utils';
const css = await getText('./query-tooltip.css');

const defaultSettings = {
  duration: 200,
  title: 'Default Title',
  content: 'Default Content'
};

const setup = () => {
  console.log('called once');
};

const createPlugin = ({ $, $el, settings, self }) => ({
  createTooltip() {
    return $('<div></div>')
      .addClass('ui tooltip')
  },
  show() {
    const $tooltip = self.createTooltip();
    console.log($tooltip);
    //$el.insertAfter($tooltip);
  },
  hide() {
    //$el.next('.tooltip').remove();
    console.log('hiding');
  }
});

const events = {
  'mouseenter': ({ self, data }) => {
    self.show({});
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
  createPlugin,
});
