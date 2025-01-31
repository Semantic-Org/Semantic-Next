import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'hello-world',
  defaultSettings: { user: 'World' },
  state: { count: 0 },
  createComponent: ({ state }) => ({
    getMessage() {
      return 'Hello';
    }
  }),
  template,
  css
});
