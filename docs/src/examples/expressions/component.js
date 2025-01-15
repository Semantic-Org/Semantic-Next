import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  value: 1,
  now: new Date(),
  timezone: 'PST'
};

const createComponent = ({self, data, settings}) => ({
  addOne(value, value2 = 0) {
    return value + value2 + 1;
  },
  getValue(obj, prop) {
    return obj[prop];
  }
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  settings,
  createComponent
});
