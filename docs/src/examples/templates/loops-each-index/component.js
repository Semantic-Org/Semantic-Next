import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  fruits: [
    { taste: 'Good', name: 'Apple' },
    { taste: 'Amazing', name: 'Banana' },
    { taste: 'Good', name: 'Orange' },
  ],
};

defineComponent({
  tagName: 'each-index',
  template,
  css,
  defaultState,
});
