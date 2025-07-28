import { registerPlugin } from '@semantic-ui/query';

const defaultSettings = {
  duration: 200,
  title: 'Default Title',
  content: 'Default Content'
};

const setup = () => {
  console.log('called once');
};

const createPlugin = ({ $el, settings }) => ({
  show() {
    console.log('showing', settings.title, settings.content);
  },
  hide() {
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
  defaultSettings,
  setup,
  events,
  createPlugin,
});
