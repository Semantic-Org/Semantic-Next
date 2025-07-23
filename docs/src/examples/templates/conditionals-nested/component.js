import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  age: 25,
  hasLicense: true,
  hasInsurance: false,
};

export default defineComponent({
  tagName: 'nested-conditions',
  template,
  css,
  defaultState,
});
