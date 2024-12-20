import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const state = {
  time: new Date(), // the time to display
};

const settings = {
  city: '',
  timezone: 'local'
};

const createComponent = ({ state, settings }) => ({
  initialize() {
    setInterval(() => state.time.now(), 1000);
  },
  dateSettings: () => ({
    timezone: settings.timezone
  })
});


defineComponent({
  tagName: 'current-time',
  state,
  template,
  settings,
  createComponent,
  css,
});
