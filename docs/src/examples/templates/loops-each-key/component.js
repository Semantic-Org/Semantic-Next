import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  person: {
    name: 'John Hellinger',
    age: 32,
    job: 'Hacker',
  },
};

defineComponent({
  tagName: 'each-key',
  template,
  css,
  defaultState,
});
