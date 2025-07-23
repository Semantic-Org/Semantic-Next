import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  userName: 'Alice',
};

const defaultState = {
  counter: 42,
  currentTime: new Date(),
};

const createComponent = () => ({
  version: '1.0.0',

  getGreeting(name) {
    return `Welcome, ${name}!`;
  },
});

export default defineComponent({
  tagName: 'data-context-demo',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
});
