import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  getName: () => 'World',
};

const createComponent = ({ settings }) => ({
  greetPerson() {
    const name = settings.getName();
    return `Hello, ${name}!`;
  },
});

defineComponent({
  tagName: 'ui-greeting',
  template,
  css,
  defaultSettings,
  createComponent,
});

