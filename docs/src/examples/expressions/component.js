import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  value: 1,
  date: new Date(),
  timezone: 'PST'
};

const createComponent = ({ settings }) => ({
  initialize: () => setInterval(() => settings.date = new Date(), 1000),
  addOne(value = 0, value2 = 0) {
    return value + value2 + 1;
  },
  getValue(obj = {}, prop) {
    return obj[prop];
  }
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  defaultSettings,
  createComponent
});

