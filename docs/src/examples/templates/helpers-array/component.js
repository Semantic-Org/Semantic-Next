import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  colors: ['red', 'green', 'blue'],
  categories: ['Electronics', 'Books', 'Clothing'],
  emptyList: [],
  userData: { name: 'Alice', level: 5, active: true },

  formatKeyValue(item) {
    return `${item.key}: ${item.value}`;
  },
};

defineComponent({
  tagName: 'helpers-array',
  template,
  css,
  defaultState,
});
